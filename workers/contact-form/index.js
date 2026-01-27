/**
 * Cloudflare Worker - Contact Form Handler
 * Wild Fitness - Laura Ramírez
 * 
 * Este Worker maneja el formulario de contacto:
 * 1. Guarda los datos en Supabase
 * 2. Envía email de bienvenida al usuario vía Resend
 * 3. Envía email de notificación al admin
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const FROM_EMAIL = 'Wild Fitness <noreply@wild-fitness.com>';
const ADMIN_EMAIL = 'info@wild-fitness.com';

// ============================================
// PLANTILLAS DE EMAIL
// ============================================

const EmailTemplates = {
  welcome: (data) => ({
    subject: '¡Benvingut/da a Wild Fitness! 🏔️',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2d7d7d 0%, #3fb5b5 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 40px 30px; }
    .greeting { font-size: 18px; font-weight: 600; color: #2d7d7d; margin-bottom: 20px; }
    .info-box { background: #f0f9f9; border-left: 4px solid #2d7d7d; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .cta-button { display: inline-block; background: #2d7d7d; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🏔️ Wild Fitness</h1>
      <p style="margin: 10px 0 0;">Laura Ramírez - Entrenadora Personal</p>
    </div>
    <div class="content">
      <div class="greeting">Hola ${data.name}! 👋</div>
      <p>Gràcies per contactar amb <strong>Wild Fitness</strong>! He rebut el teu missatge i em posaré en contacte amb tu el més aviat possible.</p>
      <div class="info-box">
        <strong>📝 El teu missatge:</strong>
        <p style="margin: 10px 0 0; font-style: italic;">"${data.message || 'Sense missatge'}"</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wild-fitness.com/calendari.html" class="cta-button">📅 Veure Calendari d'Activitats</a>
      </div>
      <p>Estic emocionada de poder ajudar-te a assolir els teus objectius!</p>
    </div>
    <div class="footer">
      <p><strong>Laura Ramírez</strong><br>Wild Fitness<br>+34 640 915 772</p>
      <p style="margin-top: 20px; font-size: 12px;">© ${new Date().getFullYear()} Wild Fitness. Tots els drets reservats.</p>
    </div>
  </div>
</body>
</html>
    `
  }),

  adminNotification: (data) => ({
    subject: `🔔 Nou contacte: ${data.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d7d7d; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #2d7d7d; }
    .value { margin-left: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🔔 Nou contacte rebut</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">👤 Nom:</span>
        <span class="value">${data.name}</span>
      </div>
      <div class="field">
        <span class="label">📧 Email:</span>
        <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
      </div>
      <div class="field">
        <span class="label">📱 Telèfon:</span>
        <span class="value">${data.phone || 'No proporcionat'}</span>
      </div>
      <div class="field">
        <span class="label">📍 Ubicació:</span>
        <span class="value">${data.location || 'No proporcionada'}</span>
      </div>
      <div class="field">
        <span class="label">📊 Servei d'interès:</span>
        <span class="value">${data.level || 'No proporcionat'}</span>
      </div>
      <div class="field">
        <span class="label">💬 Missatge:</span>
        <div style="background: white; padding: 15px; margin-top: 10px; border-radius: 5px; border-left: 3px solid #2d7d7d;">
          ${data.message || 'Sense missatge'}
        </div>
      </div>
      <div class="field">
        <span class="label">⏰ Rebut:</span>
        <span class="value">${new Date().toLocaleString('ca-ES', { 
          timeZone: 'Europe/Madrid',
          dateStyle: 'full',
          timeStyle: 'short'
        })}</span>
      </div>
    </div>
  </div>
</body>
</html>
    `
  })
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Guardar contacto en Supabase
 */
async function saveToSupabase(data, env) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase no configurado, saltando guardado en BD');
    return null;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        location: data.location || null,
        service: data.level || null,
        message: data.message,
        status: 'new'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error Supabase:', error);
      return null;
    }

    const result = await response.json();
    console.log('✅ Guardado en Supabase:', result[0]?.id);
    return result[0];
  } catch (error) {
    console.error('❌ Error al guardar en Supabase:', error.message);
    return null;
  }
}

/**
 * Enviar email vía Resend
 */
async function sendEmail(to, subject, html, env) {
  const resendApiKey = env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY no configurado');
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: to,
        subject: subject,
        html: html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error Resend:', result);
      throw new Error(`Resend error: ${result.message || 'Unknown error'}`);
    }

    console.log('✅ Email enviado a:', to, '| ID:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    throw error;
  }
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

export default {
  async fetch(request, env, ctx) {
    // Manejar CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: CORS_HEADERS
      });
    }

    // Solo permitir POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    try {
      // Parsear datos del formulario
      const data = await request.json();
      console.log('📝 Datos recibidos:', { name: data.name, email: data.email });

      // Validar datos requeridos
      if (!data.name || !data.email || !data.message) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Nom, email i missatge són obligatoris' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Email no vàlid' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }

      // 1. Guardar en Supabase (no bloqueante)
      let supabaseResult = null;
      try {
        supabaseResult = await saveToSupabase(data, env);
      } catch (error) {
        console.warn('⚠️ Error guardando en Supabase, pero continuando:', error.message);
      }

      // 2. Enviar email al usuario
      const welcomeTemplate = EmailTemplates.welcome(data);
      let clientEmailResult;
      try {
        clientEmailResult = await sendEmail(
          data.email,
          welcomeTemplate.subject,
          welcomeTemplate.html,
          env
        );
      } catch (error) {
        console.error('❌ Error enviando email al cliente:', error.message);
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Error enviant l\'email de confirmació',
          details: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }

      // 3. Enviar email al admin (no bloqueante)
      const adminTemplate = EmailTemplates.adminNotification(data);
      try {
        await sendEmail(
          ADMIN_EMAIL,
          adminTemplate.subject,
          adminTemplate.html,
          env
        );
      } catch (error) {
        console.warn('⚠️ Error enviando notificación al admin:', error.message);
        // No fallar si el email al admin falla
      }

      // Respuesta exitosa
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Missatge enviat correctament',
        clientEmailId: clientEmailResult.id,
        supabaseId: supabaseResult?.id
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });

    } catch (error) {
      console.error('❌ Error general:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Error intern del servidor',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  }
};
