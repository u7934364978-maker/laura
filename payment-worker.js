/**
 * Cloudflare Worker para procesar pagos con Stripe
 * Wild Fitness - Payment Gateway
 * 
 * Este worker maneja:
 * - Creación de Payment Intents
 * - Webhooks de Stripe
 * - Validación de pagos
 * - Envío de confirmaciones
 */

// Configuración
const STRIPE_API_URL = 'https://api.stripe.com/v1';
const ALLOWED_ORIGINS = [
    'https://wild-fitness.com',
    'https://www.wild-fitness.com',
    'https://wildbreathing.com',
    'https://www.wildbreathing.com',
    'https://laura-morada.pages.dev',
    'http://localhost:3000',
    'http://localhost:8080',
];

// Headers CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Manejador principal con acceso a variables de entorno
 */
export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env);
    }
};

/**
 * Procesar solicitudes
 */
async function handleRequest(request, env) {
    // Obtener la clave secreta de Stripe desde las variables de entorno
    const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
    const url = new URL(request.url);
    const path = url.pathname;

    // Manejar preflight CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // Validar origen
    const origin = request.headers.get('Origin');
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
        return jsonResponse({ error: 'Origin not allowed' }, 403);
    }

    try {
        // Rutas
        switch (path) {
            case '/create-payment-intent':
                return await createPaymentIntent(request, STRIPE_SECRET_KEY, env);
            
            case '/webhook':
                return await handleWebhook(request, env);
            
            case '/health':
                return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
            
            default:
                return jsonResponse({ error: 'Not found' }, 404);
        }
    } catch (error) {
        console.error('Error:', error);
        return jsonResponse({ 
            error: 'Internal server error',
            message: error.message 
        }, 500);
    }
}

/**
 * Crear Payment Intent en Stripe
 */
async function createPaymentIntent(request, STRIPE_SECRET_KEY, env) {
    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    // Obtener datos del request
    const data = await request.json();
    
    // Validar datos requeridos
    const validation = validatePaymentData(data);
    if (!validation.valid) {
        return jsonResponse({ error: validation.error }, 400);
    }

    const { amount, currency, paymentMethod, activityId, customerName, customerEmail, customerPhone, customerNotes, programName } = data;

    try {
        // Crear Payment Intent en Stripe
        const paymentIntent = await createStripePaymentIntent(STRIPE_SECRET_KEY, {
            amount,
            currency: currency || 'eur',
            paymentMethodTypes: paymentMethod === 'bizum' ? ['card', 'bizum'] : ['card'],
            metadata: {
                activityId,
                customerName,
                customerEmail,
                customerPhone,
                customerNotes,
                programName,
                source: 'wild-fitness',
            },
        });

        // Guardar en base de datos (opcional)
        const SUPABASE_URL = env.SUPABASE_URL;
        const SUPABASE_KEY = env.SUPABASE_KEY;
        if (SUPABASE_URL && SUPABASE_KEY) {
            await savePaymentToDatabase({
                payment_intent_id: paymentIntent.id,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                program_name: programName,
                amount: amount / 100, // Convertir de centavos a euros
                currency: currency || 'eur',
                status: 'pending',
                created_at: new Date().toISOString(),
            });
        }

        // Retornar client secret
        return jsonResponse({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        return jsonResponse({ 
            error: 'Failed to create payment intent',
            message: error.message 
        }, 500);
    }
}

/**
 * Manejar webhooks de Stripe
 */
async function handleWebhook(request, env) {
    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return jsonResponse({ error: 'No signature provided' }, 400);
    }

    try {
        // Verificar firma del webhook
        const event = await verifyWebhookSignature(body, signature, env);

        // Procesar eventos
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object, env);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object, env);
                break;

            case 'charge.refunded':
                await handleRefund(event.data.object, env);
                break;

            case 'charge.dispute.created':
                await handleDispute(event.data.object, env);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return jsonResponse({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return jsonResponse({ error: 'Webhook processing failed' }, 400);
    }
}

/**
 * Crear Payment Intent en Stripe API
 */
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

    // Añadir payment method types
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

/**
 * Verificar firma del webhook
 */
async function verifyWebhookSignature(body, signature, env) {
    const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
    
    // Si no hay secreto configurado, solo parseamos (no recomendado para producción)
    if (!endpointSecret) {
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET no configurada. Saltando verificación de firma.');
        try {
            return JSON.parse(body);
        } catch (error) {
            throw new Error('Invalid webhook payload');
        }
    }

    try {
        // La firma de Stripe tiene el formato t=timestamp,v1=signature
        const parts = signature.split(',');
        const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
        const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];

        if (!timestamp || !v1) {
            throw new Error('Invalid Stripe signature format');
        }

        // Verificar que el timestamp no sea muy antiguo (5 minutos)
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - parseInt(timestamp)) > 300) {
            throw new Error('Webhook timestamp too old');
        }

        // Crear la cadena para firmar: timestamp + "." + body
        const signedPayload = `${timestamp}.${body}`;
        
        // Verificar firma usando HMAC-SHA256
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
    } catch (error) {
        console.error('Signature verification error:', error);
        throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
}

/**
 * Helper para convertir hex a Uint8Array
 */
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}


/**
 * Manejar pago exitoso
 */
async function handlePaymentSuccess(paymentIntent, env) {
    console.log('Payment succeeded:', paymentIntent.id);
    const { SUPABASE_URL, SUPABASE_KEY } = env;

    // 1. Actualizar estado del pago en la tabla 'payments'
    if (SUPABASE_URL && SUPABASE_KEY) {
        await updatePaymentStatus(paymentIntent.id, 'succeeded', env);
        
        // 2. Registrar al participante en la actividad
        if (paymentIntent.metadata.activityId) {
            await registerParticipantInActivity(paymentIntent, env);
        }
    }

    // 3. Enviar email de confirmación al cliente
    await sendConfirmationEmail({
        to: paymentIntent.metadata.customerEmail,
        name: paymentIntent.metadata.customerName,
        phone: paymentIntent.metadata.customerPhone,
        programName: paymentIntent.metadata.programName,
        activityId: paymentIntent.metadata.activityId,
        amount: paymentIntent.amount / 100,
        paymentId: paymentIntent.id,
    }, env);

    // 4. Enviar notificación al administrador
    await sendAdminNotification({
        type: 'payment_success',
        customerName: paymentIntent.metadata.customerName,
        programName: paymentIntent.metadata.programName,
        amount: paymentIntent.amount / 100,
        paymentId: paymentIntent.id,
    }, env);
}

/**
 * Registrar participante en la actividad correspondiente
 */
async function registerParticipantInActivity(paymentIntent, env) {
    const { SUPABASE_URL, SUPABASE_KEY } = env;
    const activityId = paymentIntent.metadata.activityId;
    
    try {
        // 1. Obtener la actividad actual
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
        
        // 2. Verificar si ya existe (evitar duplicados por reintentos de webhook)
        const alreadyRegistered = participants.some(p => p.paymentId === paymentIntent.id);
        if (alreadyRegistered) {
            console.log('Participant already registered for this payment');
            return;
        }
        
        // 3. Añadir nuevo participante
        const newParticipant = {
            id: Date.now(),
            name: paymentIntent.metadata.customerName,
            email: paymentIntent.metadata.customerEmail,
            phone: paymentIntent.metadata.customerPhone,
            notes: paymentIntent.metadata.customerNotes || '',
            bookedAt: new Date().toISOString(),
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            status: 'paid'
        };
        
        participants.push(newParticipant);
        
        // 4. Actualizar la actividad en Supabase
        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/activities?id=eq.${activityId}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                participants: participants,
                enrolled: participants.length
            })
        });
        
        if (!updateResponse.ok) throw new Error('Failed to update activity participants');
        
        console.log(`✅ Participant registered in activity ${activityId}`);
        
    } catch (error) {
        console.error('Error registering participant in activity:', error);
    }
}


/**
 * Manejar pago fallido
 */
async function handlePaymentFailed(paymentIntent, env) {
    console.log('Payment failed:', paymentIntent.id);
    const { SUPABASE_URL, SUPABASE_KEY } = env;

    // Actualizar base de datos
    if (SUPABASE_URL && SUPABASE_KEY) {
        await updatePaymentStatus(paymentIntent.id, 'failed', env);
    }

    // Notificar al administrador
    await sendAdminNotification({
        type: 'payment_failed',
        customerName: paymentIntent.metadata.customerName,
        programName: paymentIntent.metadata.programName,
        amount: paymentIntent.amount / 100,
        paymentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
    }, env);
}

/**
 * Manejar reembolso
 */
async function handleRefund(charge, env) {
    console.log('Refund processed:', charge.id);
    const { SUPABASE_URL, SUPABASE_KEY } = env;

    // Actualizar base de datos
    if (SUPABASE_URL && SUPABASE_KEY) {
        await updatePaymentStatus(charge.payment_intent, 'refunded', env);
    }
}

/**
 * Manejar disputa
 */
async function handleDispute(dispute, env) {
    console.log('Dispute created:', dispute.id);

    // Notificar urgentemente al administrador
    await sendAdminNotification({
        type: 'dispute',
        disputeId: dispute.id,
        amount: dispute.amount / 100,
        reason: dispute.reason,
    }, env);
}

/**
 * Guardar pago en base de datos
 */
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

/**
 * Actualizar estado del pago
 */
async function updatePaymentStatus(paymentIntentId, status, env) {
    const { SUPABASE_URL, SUPABASE_KEY } = env;
    const response = await fetch(
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

    if (!response.ok) {
        console.error('Failed to update payment status');
    }
}


/**
 * Enviar email de confirmación
 */
async function sendConfirmationEmail(data, env) {
    console.log('Sending confirmation email to:', data.to);
    
    // Llamar al worker principal para enviar el email
    // El worker principal tiene la lógica de plantillas y Resend
    try {
        const response = await fetch('https://wild-fitness.com/api/send-booking-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                booking: {
                    id: Date.now(),
                    name: data.name,
                    email: data.to,
                    phone: data.phone || '',
                    paymentId: data.paymentId,
                    amount: data.amount
                },
                activity: {
                    title: data.programName,
                    id: data.activityId
                }
            })
        });
        
        if (!response.ok) {
            console.error('Failed to send confirmation email via main worker');
        }
    } catch (error) {
        console.error('Error calling main worker for email:', error);
    }
}

/**
 * Enviar notificación al administrador
 */
async function sendAdminNotification(data, env) {
    console.log('Sending admin notification:', data.type);
    
    // Similar al anterior, podemos usar el worker principal
}

/**
 * Validar datos de pago
 */
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

/**
 * Validar email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Respuesta JSON con CORS
 */
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}
