/**
 * Cloudflare Worker para procesar pagos con Stripe
 * 
 * Este worker maneja:
 * - Creación de Payment Intents
 * - Webhooks de Stripe
 * - Validación de pagos
 * - Envío de confirmaciones
 * 
 * Variables de entorno necesarias:
 * - STRIPE_SECRET_KEY: Tu clave secreta de Stripe (sk_test_... o sk_live_...)
 * - STRIPE_WEBHOOK_SECRET: Secret del webhook de Stripe (whsec_...)
 * - SUPABASE_URL: URL de tu proyecto Supabase (opcional)
 * - SUPABASE_KEY: API Key de Supabase (opcional)
 */

// Configuración
const STRIPE_API_URL = 'https://api.stripe.com/v1';
const ALLOWED_ORIGINS = [
    'https://wildbreathing.com',
    'https://www.wildbreathing.com',
    'http://localhost:3000', // Para desarrollo local
];

// Headers CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Manejador principal
 */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

/**
 * Procesar solicitudes
 */
async function handleRequest(request) {
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
                return await createPaymentIntent(request);
            
            case '/webhook':
                return await handleWebhook(request);
            
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
async function createPaymentIntent(request) {
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

    const { amount, currency, paymentMethod, customerName, customerEmail, customerPhone, programName } = data;

    try {
        // Crear Payment Intent en Stripe
        const paymentIntent = await createStripePaymentIntent({
            amount,
            currency: currency || 'eur',
            paymentMethodTypes: paymentMethod === 'bizum' ? ['card', 'bizum'] : ['card'],
            metadata: {
                customerName,
                customerEmail,
                customerPhone,
                programName,
                source: 'wild-fitness',
            },
        });

        // Guardar en base de datos (opcional)
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
async function handleWebhook(request) {
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
        const event = await verifyWebhookSignature(body, signature);

        // Procesar eventos
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            case 'charge.refunded':
                await handleRefund(event.data.object);
                break;

            case 'charge.dispute.created':
                await handleDispute(event.data.object);
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
async function createStripePaymentIntent(params) {
    const { amount, currency, paymentMethodTypes, metadata } = params;

    const stripeParams = new URLSearchParams({
        amount: amount.toString(),
        currency: currency,
        'metadata[customerName]': metadata.customerName,
        'metadata[customerEmail]': metadata.customerEmail,
        'metadata[customerPhone]': metadata.customerPhone,
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
async function verifyWebhookSignature(body, signature) {
    // Nota: Para una verificación completa, necesitarías implementar
    // la verificación de firma de Stripe. Por ahora, parseamos el evento.
    
    // En producción, usa la librería de Stripe o implementa la verificación HMAC
    
    try {
        return JSON.parse(body);
    } catch (error) {
        throw new Error('Invalid webhook payload');
    }
}

/**
 * Manejar pago exitoso
 */
async function handlePaymentSuccess(paymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id);

    // Actualizar base de datos
    if (SUPABASE_URL && SUPABASE_KEY) {
        await updatePaymentStatus(paymentIntent.id, 'succeeded');
    }

    // Enviar email de confirmación al cliente
    await sendConfirmationEmail({
        to: paymentIntent.metadata.customerEmail,
        name: paymentIntent.metadata.customerName,
        programName: paymentIntent.metadata.programName,
        amount: paymentIntent.amount / 100,
        paymentId: paymentIntent.id,
    });

    // Enviar notificación al administrador
    await sendAdminNotification({
        type: 'payment_success',
        customerName: paymentIntent.metadata.customerName,
        programName: paymentIntent.metadata.programName,
        amount: paymentIntent.amount / 100,
        paymentId: paymentIntent.id,
    });
}

/**
 * Manejar pago fallido
 */
async function handlePaymentFailed(paymentIntent) {
    console.log('Payment failed:', paymentIntent.id);

    // Actualizar base de datos
    if (SUPABASE_URL && SUPABASE_KEY) {
        await updatePaymentStatus(paymentIntent.id, 'failed');
    }

    // Notificar al administrador
    await sendAdminNotification({
        type: 'payment_failed',
        customerName: paymentIntent.metadata.customerName,
        programName: paymentIntent.metadata.programName,
        amount: paymentIntent.amount / 100,
        paymentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
    });
}

/**
 * Manejar reembolso
 */
async function handleRefund(charge) {
    console.log('Refund processed:', charge.id);

    // Actualizar base de datos
    if (SUPABASE_URL && SUPABASE_KEY) {
        await updatePaymentStatus(charge.payment_intent, 'refunded');
    }
}

/**
 * Manejar disputa
 */
async function handleDispute(dispute) {
    console.log('Dispute created:', dispute.id);

    // Notificar urgentemente al administrador
    await sendAdminNotification({
        type: 'dispute',
        disputeId: dispute.id,
        amount: dispute.amount / 100,
        reason: dispute.reason,
    });
}

/**
 * Guardar pago en base de datos
 */
async function savePaymentToDatabase(data) {
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
async function updatePaymentStatus(paymentIntentId, status) {
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
async function sendConfirmationEmail(data) {
    // Implementar envío de email
    // Puedes usar SendGrid, Mailgun, o el worker de email existente
    console.log('Sending confirmation email to:', data.to);
    
    // TODO: Integrar con tu sistema de emails actual
}

/**
 * Enviar notificación al administrador
 */
async function sendAdminNotification(data) {
    // Implementar notificación al admin
    console.log('Sending admin notification:', data.type);
    
    // TODO: Integrar con tu sistema de notificaciones
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
