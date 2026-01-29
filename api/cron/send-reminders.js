
export const config = {
  runtime: 'edge',
};

const CONFIG = {
  fromEmail: process.env.FROM_EMAIL || 'Wild Fitness <noreply@updates.wild-fitness.com>',
  adminEmail: process.env.ADMIN_EMAIL || 'info@wild-fitness.com',
  resendApiUrl: 'https://api.resend.com/emails'
};

export default async function handler(req) {
  // Solo permitir ejecuciones desde Vercel Cron o manual con secret
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('⏰ Cron job started:', new Date().toISOString());

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_API_KEY) {
    return new Response('Configuration missing', { status: 500 });
  }

  try {
    const result = await processReminders({ SUPABASE_URL, SUPABASE_KEY, RESEND_API_KEY });
    
    // Enviar resumen al admin
    if (result.sent > 0) {
      await sendAdminSummary(result, RESEND_API_KEY);
    }

    return new Response(JSON.stringify({
      success: true,
      sent: result.sent,
      activities: result.activities
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in cron job:', error);
    await sendAdminError(error, RESEND_API_KEY);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

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
      const result = await sendReminderEmail(participant, activity, env.RESEND_API_KEY);
      if (result.success) {
        totalSent++;
      }
      // Pequeño delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  return { sent: totalSent, activities: activities.length };
}

async function getTomorrowActivities(env) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/activities?date=eq.${tomorrowStr}`, {
    headers: {
      'apikey': env.SUPABASE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.statusText}`);
  }

  return await response.json();
}

async function sendReminderEmail(participant, activity, apiKey) {
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
    .cta-button { display: inline-block; background: #2d7d7d; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
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
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONFIG.fromEmail,
        to: participant.email,
        subject: `⏰ Recordatori: ${activity.title} és demà!`,
        html: emailHtml
      })
    });
    
    if (!response.ok) throw new Error(await response.text());
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error sending reminder:', error);
    return { success: false, error: error.message };
  }
}

async function sendAdminSummary(result, apiKey) {
  await fetch(CONFIG.resendApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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

async function sendAdminError(error, apiKey) {
  await fetch(CONFIG.resendApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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
        <p>Por favor, revisa los logs en Vercel.</p>
      `
    })
  });
}
