
export const config = {
  runtime: 'edge',
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Wild Fitness <hola@wild-fitness.com>';

const EmailTemplates = {
  bookingConfirmation: (booking, activity) => {
    const qrData = encodeURIComponent(`WF-VERIFY:${activity.id}:${booking.id}:${booking.paymentId || 'PAID'}`);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
    
    return {
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
    .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px dashed #cbd5e1; }
    .qr-code { background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
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
      <div class="qr-section">
        <h4 style="margin-top: 0; color: #1e293b;">🎟️ El teu Codi de Verificació</h4>
        <img src="${qrCodeUrl}" alt="QR Verification Code" class="qr-code">
        <p style="font-size: 12px; color: #64748b; margin-top: 10px;">Mostra aquest codi a la teva arribada per verificar la teva reserva.</p>
      </div>
      <div class="activity-card">
        <div class="activity-title">${activity.title}</div>
        <div class="detail-row"><span class="icon">🏃</span><strong>Tipus:</strong> ${activity.type}</div>
        <div class="detail-row"><span class="icon">📅</span><strong>Data:</strong> ${new Date(activity.date).toLocaleDateString('ca-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div class="detail-row"><span class="icon">⏰</span><strong>Hora:</strong> ${activity.time}</div>
        <div class="detail-row"><span class="icon">📍</span><strong>Lloc:</strong> ${activity.location}</div>
        ${activity.description ? `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #b8e0e0;">
          <strong>📝 Detalls:</strong>
          <p style="margin: 10px 0;">${activity.description}</p>
        </div>` : ''}
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
        <a href="https://wa.me/34640915772" class="cta-button">💬 Contactar per WhatsApp</a>
      </div>
      <p>Ens veiem aviat! 🏔️</p>
    </div>
    <div class="footer">
      <p><strong>Laura Ramírez</strong><br>Wild Fitness<br>+34 640 915 772</p>
      <p style="margin-top: 20px; font-size: 12px;">© ${new Date().getFullYear()} Wild Fitness. Tots els drets reservats.</p>
    </div>
  </div>
</body>
</html>
      `
    }
  }
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { booking, activity } = await req.json();
    
    if (!booking || !activity) {
      return new Response(JSON.stringify({ error: 'Dades incompletes' }), { status: 400 });
    }

    const template = EmailTemplates.bookingConfirmation(booking, activity);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: booking.email,
        subject: template.subject,
        html: template.html,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend error: ${error}`);
    }

    const result = await response.json();
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
