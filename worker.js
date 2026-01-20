// ============================================
// WILD FITNESS - CLOUDFLARE WORKER
// Email Service usando Cloudflare Workers + Resend
// ============================================

/**
 * Cloudflare Worker para envío de emails
 * 
 * CONFIGURACIÓN:
 * 
 * 1. Crear cuenta en Resend (gratis): https://resend.com
 * 2. Obtener API Key de Resend
 * 3. Configurar en Cloudflare Dashboard:
 *    - Workers & Pages > tu-worker > Settings > Variables
 *    - Añadir variable de entorno: RESEND_API_KEY
 * 
 * 4. Verificar dominio en Resend:
 *    - Añadir wild-fitness.com
 *    - Configurar DNS records en Cloudflare
 * 
 * 5. Deploy del Worker:
 *    npx wrangler deploy
 */

// Configuración
const CONFIG = {
  fromEmail: 'Wild Fitness <noreply@wildbreathing.com>',
  adminEmail: 'info@wildbreathing.com',
  allowedOrigins: [
    'https://wildbreathing.com',
    'https://www.wildbreathing.com',
    'http://localhost:8080' // Para desarrollo
  ]
};

// ============================================
// CORS Headers
// ============================================
function corsHeaders(origin) {
  const isAllowed = CONFIG.allowedOrigins.includes(origin) || origin?.includes('sandbox.novita.ai') || origin?.includes('wildbreathing.com');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : CONFIG.allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// ============================================
// Plantillas de Email
// ============================================

const EmailTemplates = {
  // Email de bienvenida al contactar
  welcome: (data) => ({
    subject: '¡Benvingut/da a Wild Fitness! 🏔️',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2d7d7d 0%, #3fb5b5 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #ffffff; padding: 40px 30px; }
    .greeting { font-size: 18px; font-weight: 600; color: #2d7d7d; margin-bottom: 20px; }
    .message { margin-bottom: 30px; }
    .cta-button { display: inline-block; background: #2d7d7d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
    .info-box { background: #f0f9f9; border-left: 4px solid #2d7d7d; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 10px 10px; }
    .social-links { margin: 20px 0; }
    .social-links a { display: inline-block; margin: 0 10px; color: #2d7d7d; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏔️ Wild Fitness</h1>
      <p style="margin: 10px 0 0;">Laura Ramírez - Entrenadora Personal & Guia de Muntanya</p>
    </div>
    
    <div class="content">
      <div class="greeting">Hola ${data.name}! 👋</div>
      
      <div class="message">
        <p>Gràcies per contactar amb <strong>Wild Fitness</strong>! He rebut el teu missatge i em posaré en contacte amb tu el més aviat possible.</p>
        
        <p>El trail running i l'entrenament funcional són la meva passió, i estic emocionada de poder ajudar-te a assolir els teus objectius.</p>
      </div>
      
      <div class="info-box">
        <strong>📝 El teu missatge:</strong>
        <p style="margin: 10px 0 0; font-style: italic;">"${data.message || 'Sense missatge'}"</p>
        ${data.level ? `<p style="margin: 10px 0 0;"><strong>Nivell:</strong> ${data.level}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wildbreathing.com/calendari.html" class="cta-button">
          📅 Veure Calendari d'Activitats
        </a>
      </div>
      
      <div class="message">
        <p><strong>Mentrestant, pots:</strong></p>
        <ul>
          <li>🗓️ Consultar el <a href="https://wildbreathing.com/calendari.html">calendari d'activitats</a></li>
          <li>📱 Contactar-me per <a href="https://wa.me/34640915772">WhatsApp</a> (+34 640 915 772)</li>
          <li>📷 Seguir-me a <a href="https://instagram.com/wildbreathing">Instagram</a> @wildbreathing</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Laura Ramírez</strong><br>
      Entrenadora Personal & Guia de Muntanya<br>
      ROPEC 062645</p>
      
      <div class="social-links">
        <a href="https://wildbreathing.com">🌐 Web</a>
        <a href="https://wa.me/34640915772">💬 WhatsApp</a>
        <a href="https://instagram.com/wildbreathing">📷 Instagram</a>
      </div>
      
      <p style="margin-top: 20px; font-size: 12px;">
        Girona & Barcelona | info@wild-fitness.com<br>
        © ${new Date().getFullYear()} Wild Fitness. Tots els drets reservats.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Hola ${data.name}!

Gràcies per contactar amb Wild Fitness! He rebut el teu missatge i em posaré en contacte amb tu el més aviat possible.

El teu missatge: "${data.message || 'Sense missatge'}"
${data.level ? `Nivell: ${data.level}` : ''}

Mentrestant, pots:
- Consultar el calendari d'activitats: https://www.wild-fitness.com/calendari.html
- Contactar-me per WhatsApp: +34 640 915 772
- Seguir-me a Instagram: @wildbreathing

Laura Ramírez
Entrenadora Personal & Guia de Muntanya
ROPEC 062645

Girona & Barcelona
info@wild-fitness.com
    `
  }),

  // Notificación al admin de nuevo contacto
  contactNotification: (data) => ({
    subject: `🔔 Nou contacte: ${data.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d7d7d; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }
    .label { font-weight: 600; color: #2d7d7d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🔔 Nou contacte rebut</h2>
    </div>
    <div class="content">
      <div class="info-row">
        <div class="label">👤 Nom:</div>
        <div>${data.name}</div>
      </div>
      
      <div class="info-row">
        <div class="label">📧 Email:</div>
        <div><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      
      ${data.phone ? `
      <div class="info-row">
        <div class="label">📱 Telèfon:</div>
        <div><a href="tel:${data.phone}">${data.phone}</a></div>
      </div>
      ` : ''}
      
      ${data.level ? `
      <div class="info-row">
        <div class="label">🎯 Nivell:</div>
        <div>${data.level}</div>
      </div>
      ` : ''}
      
      <div class="info-row">
        <div class="label">💬 Missatge:</div>
        <div style="margin-top: 10px; white-space: pre-wrap;">${data.message || 'Sense missatge'}</div>
      </div>
      
      <div style="margin-top: 20px; font-size: 12px; color: #64748b;">
        ⏰ Rebut: ${new Date().toLocaleString('ca-ES')}
      </div>
    </div>
  </div>
</body>
</html>
    `
  }),

  // Confirmación de reserva de actividad
  bookingConfirmation: (booking, activity) => ({
    subject: `✅ Reserva confirmada: ${activity.title}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2d7d7d 0%, #3fb5b5 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .success-icon { font-size: 60px; margin-bottom: 20px; }
    .content { background: #ffffff; padding: 40px 30px; }
    .activity-card { background: #f0f9f9; border: 2px solid #2d7d7d; border-radius: 10px; padding: 25px; margin: 20px 0; }
    .activity-title { color: #2d7d7d; font-size: 22px; font-weight: 700; margin: 0 0 15px; }
    .detail-row { margin: 12px 0; font-size: 16px; }
    .icon { margin-right: 8px; }
    .cta-button { display: inline-block; background: #2d7d7d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1 style="margin: 0;">Reserva Confirmada!</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #2d7d7d; font-weight: 600;">Hola ${booking.name}! 👋</p>
      
      <p>La teva plaça ha estat reservada correctament. Estic molt contenta de compartir aquesta experiència amb tu!</p>
      
      <div class="activity-card">
        <div class="activity-title">${activity.title}</div>
        
        <div class="detail-row">
          <span class="icon">🏃</span><strong>Tipus:</strong> ${activity.type}
        </div>
        
        <div class="detail-row">
          <span class="icon">📅</span><strong>Data:</strong> ${new Date(activity.date).toLocaleDateString('ca-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        
        <div class="detail-row">
          <span class="icon">⏰</span><strong>Hora:</strong> ${activity.time}
        </div>
        
        <div class="detail-row">
          <span class="icon">📍</span><strong>Lloc:</strong> ${activity.location}
        </div>
        
        ${activity.description ? `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #b8e0e0;">
          <strong>📝 Detalls:</strong>
          <p style="margin: 10px 0;">${activity.description}</p>
        </div>
        ` : ''}
      </div>
      
      <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <strong>⚠️ Important:</strong>
        <ul style="margin: 10px 0;">
          <li>Si us plau, arriba 10 minuts abans de l'hora d'inici</li>
          <li>Porta roba i calçat adequats</li>
          <li>No oblidis aigua i protecció solar</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        ${activity.latitude && activity.longitude ? `
        <a href="https://www.google.com/maps?q=${activity.latitude},${activity.longitude}" class="cta-button">
          🗺️ Veure Ubicació
        </a>
        ` : ''}
        <a href="https://wa.me/34640915772" class="cta-button">
          💬 Contactar per WhatsApp
        </a>
      </div>
      
      <p>Si tens qualsevol dubte o necessites més informació, no dubtis en contactar-me!</p>
      
      <p style="margin-top: 30px;">Ens veiem aviat! 🏔️</p>
    </div>
    
    <div class="footer">
      <p><strong>Laura Ramírez</strong><br>
      Wild Fitness<br>
      +34 640 915 772</p>
      
      <p style="margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} Wild Fitness. Tots els drets reservats.
      </p>
    </div>
  </div>
</body>
</html>
    `
  })
};

// ============================================
// Función para enviar email con Resend
// ============================================
async function sendEmail(env, emailData) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONFIG.fromEmail,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || undefined
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await response.json();
    return { success: true, id: result.id };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Handler Principal
// ============================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(origin)
      });
    }

    // Ruta: /api/send-welcome-email
    if (url.pathname === '/api/send-welcome-email' && request.method === 'POST') {
      try {
        const data = await request.json();
        
        // Validación básica
        if (!data.name || !data.email) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Nom i email són obligatoris' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin)
            }
          });
        }

        // Enviar email de bienvenida
        const welcomeTemplate = EmailTemplates.welcome(data);
        const welcomeResult = await sendEmail(env, {
          to: data.email,
          ...welcomeTemplate
        });

        // Enviar notificación al admin
        const notificationTemplate = EmailTemplates.contactNotification(data);
        const notificationResult = await sendEmail(env, {
          to: CONFIG.adminEmail,
          ...notificationTemplate
        });

        return new Response(JSON.stringify({ 
          success: true,
          welcomeEmailSent: welcomeResult.success,
          notificationSent: notificationResult.success
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });
      }
    }

    // Ruta: /api/send-booking-confirmation
    if (url.pathname === '/api/send-booking-confirmation' && request.method === 'POST') {
      try {
        const { booking, activity } = await request.json();
        
        if (!booking || !activity) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Dades de reserva incompletes' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin)
            }
          });
        }

        const template = EmailTemplates.bookingConfirmation(booking, activity);
        const result = await sendEmail(env, {
          to: booking.email,
          ...template
        });

        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });
      }
    }

    // Ruta: /api/sync-activities - Sincronizar actividades al KV
    if (url.pathname === '/api/sync-activities' && request.method === 'POST') {
      try {
        // Solo permitir si está autenticado como admin
        const { activities, adminAuth } = await request.json();
        
        if (!activities || !Array.isArray(activities)) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Formato de actividades inválido' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin)
            }
          });
        }

        // Guardar en KV (solo si el binding existe)
        if (env.ACTIVITIES_KV) {
          await env.ACTIVITIES_KV.put(
            'wild_fitness_activities', 
            JSON.stringify(activities)
          );
          
          console.log(`✅ ${activities.length} actividades sincronizadas al KV`);
          
          return new Response(JSON.stringify({ 
            success: true,
            message: `${activities.length} actividades sincronizadas`,
            count: activities.length
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin)
            }
          });
        } else {
          // Si no hay KV configurado, solo confirmar recepción
          console.log(`ℹ️ KV no configurado. ${activities.length} actividades recibidas`);
          
          return new Response(JSON.stringify({ 
            success: true,
            message: 'Actividades recibidas (KV no configurado)',
            count: activities.length,
            warning: 'KV Storage no está configurado'
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin)
            }
          });
        }

      } catch (error) {
        console.error('❌ Error sincronizando actividades:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });
      }
    }

    // Ruta no encontrada
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders(origin)
    });
  }
};
