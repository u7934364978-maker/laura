
export const config = {
  runtime: 'edge',
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return jsonResponse({ error: 'No signature provided' }, 400);
  }

  try {
    // Verificar firma del webhook
    const event = await verifyWebhookSignature(body, signature, STRIPE_WEBHOOK_SECRET);

    // Procesar eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return jsonResponse({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return jsonResponse({ error: 'Webhook processing failed', message: error.message }, 400);
  }
}

async function verifyWebhookSignature(body, signature, endpointSecret) {
  if (!endpointSecret) {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET no configurada. Saltando verificación de firma.');
    return JSON.parse(body);
  }

  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
  const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !v1) {
    throw new Error('Invalid Stripe signature format');
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    throw new Error('Webhook timestamp too old');
  }

  const signedPayload = `${timestamp}.${body}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(endpointSecret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signatureData = hexToBytes(v1);
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureData,
    encoder.encode(signedPayload)
  );

  if (!isValid) {
    throw new Error('Invalid Stripe signature');
  }

  return JSON.parse(body);
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function handlePaymentSuccess(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  if (SUPABASE_URL && SUPABASE_KEY) {
    await updatePaymentStatus(paymentIntent.id, 'succeeded');
    
    if (paymentIntent.metadata.activityId) {
      const result = await registerParticipantInActivity(paymentIntent);
      
      if (result && result.activity && result.isNew) {
        await sendConfirmationEmail({
          to: paymentIntent.metadata.customerEmail,
          name: paymentIntent.metadata.customerName,
          phone: paymentIntent.metadata.customerPhone,
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
        }, result.activity);
      }
    }
  }
}

async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  if (SUPABASE_URL && SUPABASE_KEY) {
    await updatePaymentStatus(paymentIntent.id, 'failed');
  }
}

async function registerParticipantInActivity(paymentIntent) {
  const activityId = paymentIntent.metadata.activityId;
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/activities?id=eq.${activityId}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch activity');
    const activities = await response.json();
    if (activities.length === 0) throw new Error('Activity not found');
    
    const activity = activities[0];
    let participants = activity.participants || [];
    
    const alreadyRegistered = participants.some(p => p.paymentId === paymentIntent.id);
    if (alreadyRegistered) return { activity, isNew: false };
    
    const newParticipant = {
      id: Date.now(),
      name: paymentIntent.metadata.customerName,
      email: paymentIntent.metadata.customerEmail,
      phone: paymentIntent.metadata.customerPhone,
      notes: paymentIntent.metadata.customerNotes || '',
      bookedAt: new Date().toISOString(),
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: 'paid',
      emailSent: true
    };
    
    participants.push(newParticipant);
    
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/activities?id=eq.${activityId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        participants: participants,
        enrolled: participants.length
      })
    });
    
    if (!updateResponse.ok) throw new Error('Failed to update activity participants');
    const updatedActivities = await updateResponse.json();
    return { activity: updatedActivities[0] || activity, isNew: true };
    
  } catch (error) {
    console.error('Error registering participant:', error);
    return null;
  }
}

async function updatePaymentStatus(paymentIntentId, status) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/payments?payment_intent_id=eq.${paymentIntentId}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    }
  );
}

async function sendConfirmationEmail(bookingData, activity) {
  const protocol = process.env.VERCEL_URL ? 'https' : 'http';
  const host = process.env.VERCEL_URL || 'localhost:3000';
  const url = `${protocol}://${host}/api/send-booking-confirmation`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking: {
          name: bookingData.name,
          email: bookingData.to,
          phone: bookingData.phone,
          paymentId: bookingData.paymentId,
          amount: bookingData.amount
        },
        activity: activity
      })
    });
  } catch (error) {
    console.error('Error calling send-booking-confirmation:', error);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}
