// ============================================
// WILD FITNESS - SCHEDULED EMAIL WORKER
// Cloudflare Worker con Cron Triggers
// ============================================

/**
 * Este Worker se ejecuta automáticamente cada día
 * para enviar emails programados:
 * 
 * - Recordatorios de actividades (24h antes)
 * - Seguimiento post-actividad
 * - Newsletters programados
 * - Emails de cumpleaños
 */

// Configuración
const CONFIG = {
  fromEmail: 'Wild Fitness <noreply@wild-fitness.com>',
  adminEmail: 'info@wild-fitness.com',
  resendApiUrl: 'https://api.resend.com/emails'
};

// ============================================
// Función para obtener actividades del día siguiente
// ============================================
async function getTomorrowActivities(env) {
  try {
    // Obtener actividades desde KV Storage
    const activitiesData = await env.ACTIVITIES_KV.get('wild_fitness_activities');
    if (!activitiesData) return [];
    
    const activities = JSON.parse(activitiesData);
    
    // Calcular fecha de mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Filtrar actividades de mañana
    return activities.filter(activity => activity.date === tomorrowStr);
    
  } catch (error) {
    console.error('Error obteniendo actividades:', error);
    return [];
  }
}

// ============================================
// Enviar email de recordatorio
// ============================================
async function sendReminderEmail(env, participant, activity) {
  try {
    const activityDate = new Date(activity.date + 'T00:00:00');
    const formattedDate = activityDate.toLocaleDateString('ca-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2d7d7d 0%, #3fb5b5 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 40px 30px; }
    .reminder-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .activity-card { background: #f0f9f9; border: 2px solid #2d7d7d; border-radius: 10px; padding: 25px; margin: 20px 0; }
    .detail-row { margin: 12px 0; font-size: 16px; }
    .cta-button { display: inline-block; background: #2d7d7d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 32px;">⏰ Recordatori!</h1>
      <p style="margin: 10px 0 0;">La teva activitat és DEMÀ</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #2d7d7d; font-weight: 600;">Hola ${participant.name}! 👋</p>
      
      <div class="reminder-box">
        <strong>🔔 Recordatori important:</strong>
        <p style="margin: 10px 0 0;">La teva activitat és <strong>demà ${formattedDate}</strong>!</p>
      </div>
      
      <div class="activity-card">
        <h3 style="color: #2d7d7d; margin: 0 0 15px;">${activity.title}</h3>
        
        <div class="detail-row">
          <span style="margin-right: 8px;">📅</span><strong>Data:</strong> ${formattedDate}
        </div>
        
        <div class="detail-row">
          <span style="margin-right: 8px;">⏰</span><strong>Hora:</strong> ${activity.time}
        </div>
        
        <div class="detail-row">
          <span style="margin-right: 8px;">📍</span><strong>Lloc:</strong> ${activity.location}
        </div>
      </div>
      
      <div style="background: #e0f2f2; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <strong>✅ Què portar:</strong>
        <ul style="margin: 10px 0;">
          <li>💧 Aigua (mínim 1L)</li>
          <li>👟 Calçat adequat</li>
          <li>☀️ Protecció solar</li>
          <li>🍎 Esmorzar lleuger</li>
          <li>📱 Mòbil amb bateria</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        ${activity.latitude && activity.longitude ? `
        <a href="https://www.google.com/maps?q=${activity.latitude},${activity.longitude}" class="cta-button">
          🗺️ Com Arribar
        </a>
        ` : ''}
        <a href="https://wa.me/34640915772" class="cta-button">
          💬 Contactar Laura
        </a>
      </div>
      
      <p><strong>Important:</strong> Si us plau, arriba 10 minuts abans de l'hora d'inici.</p>
      
      <p>Estic molt emocionada de veure't demà! 💪🏔️</p>
    </div>
    
    <div class="footer">
      <p><strong>Laura Ramírez</strong><br>Wild Fitness<br>+34 640 915 772</p>
      <p style="margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} Wild Fitness. Tots els drets reservats.
      </p>
    </div>
  </div>
</body>
</html>
    `;
    
    const response = await fetch(CONFIG.resendApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONFIG.fromEmail,
        to: participant.email,
        subject: `⏰ Recordatori: ${activity.title} és demà!`,
        html: emailHtml
      })
    });
    
    if (!response.ok) {
      throw new Error(`Resend API error: ${await response.text()}`);
    }
    
    const result = await response.json();
    console.log(`✅ Recordatorio enviado a ${participant.email}`);
    return { success: true, id: result.id };
    
  } catch (error) {
    console.error('❌ Error enviando recordatorio:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Procesar recordatorios del día
// ============================================
async function processReminders(env) {
  const activities = await getTomorrowActivities(env);
  
  if (activities.length === 0) {
    console.log('ℹ️ No hay actividades para mañana');
    return { sent: 0, activities: 0 };
  }
  
  console.log(`📅 Procesando ${activities.length} actividades para mañana`);
  
  let totalSent = 0;
  
  for (const activity of activities) {
    if (!activity.participants || activity.participants.length === 0) {
      continue;
    }
    
    console.log(`📧 Enviando recordatorios para: ${activity.title}`);
    
    for (const participant of activity.participants) {
      const result = await sendReminderEmail(env, participant, activity);
      if (result.success) {
        totalSent++;
      }
      
      // Pequeño delay para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return { sent: totalSent, activities: activities.length };
}

// ============================================
// Handler Principal con Cron Trigger
// ============================================
export default {
  // Este método se ejecuta automáticamente según el cron schedule
  async scheduled(event, env, ctx) {
    console.log('⏰ Cron trigger ejecutado:', new Date().toISOString());
    
    try {
      const result = await processReminders(env);
      
      console.log(`✅ Proceso completado: ${result.sent} emails enviados para ${result.activities} actividades`);
      
      // Enviar resumen al admin
      if (result.sent > 0) {
        await fetch(CONFIG.resendApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: CONFIG.fromEmail,
            to: CONFIG.adminEmail,
            subject: `📊 Resumen: ${result.sent} recordatorios enviados`,
            html: `
              <h2>Resumen de Recordatorios</h2>
              <p>Se han enviado <strong>${result.sent} emails</strong> de recordatorio para <strong>${result.activities} actividades</strong> de mañana.</p>
              <p>Fecha: ${new Date().toLocaleString('ca-ES')}</p>
            `
          })
        });
      }
      
    } catch (error) {
      console.error('❌ Error en proceso scheduled:', error);
      
      // Notificar error al admin
      await fetch(CONFIG.resendApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: CONFIG.fromEmail,
          to: CONFIG.adminEmail,
          subject: '⚠️ Error en envío de recordatorios',
          html: `
            <h2>Error en proceso automático</h2>
            <p>Ha ocurrido un error al enviar los recordatorios:</p>
            <pre>${error.message}</pre>
            <p>Por favor, revisa los logs en Cloudflare.</p>
          `
        })
      });
    }
  },
  
  // También mantener el handler HTTP para testing manual
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Endpoint para probar manualmente
    if (url.pathname === '/test-reminders' && request.method === 'POST') {
      try {
        const result = await processReminders(env);
        
        return new Response(JSON.stringify({
          success: true,
          message: `${result.sent} recordatorios enviados para ${result.activities} actividades`,
          result
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response('Scheduled Email Worker - Use cron trigger', {
      status: 200
    });
  }
};
