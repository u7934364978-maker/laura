
export const config = {
  runtime: 'edge',
};

const STRIPE_API_URL = 'https://api.stripe.com/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req) {
  console.log('💳 Create Payment Intent Request received');
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const data = await req.json();
    console.log('📝 Payment Data:', data);
    
    // Validar datos
    const validation = validatePaymentData(data);
    if (!validation.valid) {
      console.error('❌ Validation error:', validation.error);
      return jsonResponse({ error: validation.error }, 400);
    }

    const { amount, currency, paymentMethod, activityId, customerName, customerEmail, customerPhone, customerNotes, programName } = data;
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not defined');
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    console.log('🏦 Creating Stripe Payment Intent for:', customerName);
    // Crear Payment Intent
    const paymentIntent = await createStripePaymentIntent(STRIPE_SECRET_KEY, {
      amount,
      currency: currency || 'eur',
      paymentMethodTypes: paymentMethod === 'bizum' ? ['card', 'bizum'] : ['card'],
      metadata: {
        activityId: activityId?.toString(),
        customerName,
        customerEmail,
        customerPhone,
        customerNotes: customerNotes || '',
        programName,
        source: 'wild-fitness',
      },
    });
    console.log('✅ Stripe Payment Intent created:', paymentIntent.id);

    // Guardar en Supabase (opcional)
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;
    if (SUPABASE_URL && SUPABASE_KEY) {
      console.log('📊 Saving payment record to Supabase');
      try {
        await savePaymentToDatabase({
          payment_intent_id: paymentIntent.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          program_name: programName,
          amount: amount / 100,
          currency: currency || 'eur',
          status: 'pending',
          created_at: new Date().toISOString(),
        }, { SUPABASE_URL, SUPABASE_KEY });
        console.log('✅ Payment saved to Supabase');
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        // Continuamos aunque falle el guardado inicial
      }
    } else {
      console.warn('⚠️ SUPABASE_URL or SUPABASE_KEY not defined, skipping DB save');
    }

    return jsonResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('❌ Full Error:', error);
    console.error('❌ Error Stack:', error.stack);
    console.error('❌ Error Name:', error.name);
    console.error('❌ Error Message:', error.message);
    return jsonResponse({ 
      error: 'Internal server error',
      message: error.message,
      errorType: error.name,
      details: error.toString()
    }, 500);
  }
}

async function createStripePaymentIntent(STRIPE_SECRET_KEY, params) {
  const { amount, currency, paymentMethodTypes, metadata } = params;

  const stripeParams = new URLSearchParams({
    amount: amount.toString(),
    currency: currency,
    'metadata[customerName]': metadata.customerName,
    'metadata[customerEmail]': metadata.customerEmail,
    'metadata[customerPhone]': metadata.customerPhone,
    'metadata[customerNotes]': metadata.customerNotes || '',
    'metadata[activityId]': metadata.activityId || '',
    'metadata[programName]': metadata.programName,
    'metadata[source]': metadata.source,
  });

  paymentMethodTypes.forEach(type => {
    stripeParams.append('payment_method_types[]', type);
  });

  const response = await fetch(`${STRIPE_API_URL}/payment_intents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: stripeParams.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create payment intent');
  }

  return await response.json();
}

async function savePaymentToDatabase(data, env) {
  const { SUPABASE_URL, SUPABASE_KEY } = env;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error('Failed to save payment to database');
  }
}

function validatePaymentData(data) {
  if (!data.amount || data.amount < 50) {
    return { valid: false, error: 'Amount must be at least 50 cents (0.50 EUR)' };
  }
  if (!data.customerName || data.customerName.trim().length < 2) {
    return { valid: false, error: 'Customer name is required' };
  }
  if (!data.customerEmail || !isValidEmail(data.customerEmail)) {
    return { valid: false, error: 'Valid email is required' };
  }
  if (!data.customerPhone || data.customerPhone.trim().length < 9) {
    return { valid: false, error: 'Valid phone number is required' };
  }
  if (!data.programName) {
    return { valid: false, error: 'Program name is required' };
  }
  return { valid: true };
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
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
