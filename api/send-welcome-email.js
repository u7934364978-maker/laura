
export const config = {
  runtime: 'edge',
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// ⚠️ CONFIGURACIÓN DE DOMINIO
// Para usar Resend correctamente, necesitas:
// 1. Verificar el dominio wild-fitness.com en https://resend.com/domains
// 2. O usar un dominio alternativo verificado (ej: noreply@resend.dev para pruebas)
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';  // ✅ Dominio por defecto verificado
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@wild-fitness.com';

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
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 14px; }
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
      ${FROM_EMAIL === 'onboarding@resend.dev' ? `
      <div class="warning">
        ⚠️ <strong>Nota:</strong> Aquest email s'ha enviat des d'un dominio temporal de prova. 
        Per rebre emails des de @wild-fitness.com, cal verificar el domini a Resend.
      </div>
      ` : ''}
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wild-fitness.com/calendari" class="cta-button">📅 Veure Calendari d'Activitats</a>
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
  contactNotification: (data) => ({
    subject: `🔔 Nou contacte: ${data.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2d7d7d 0%, #3fb5b5 100%); color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 30px; }
    .info-row { margin: 15px 0; padding: 15px; background: #f0f9f9; border-radius: 8px; }
    .label { font-weight: 600; color: #2d7d7d; display: inline-block; min-width: 120px; }
    .value { color: #1e293b; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🔔 Nou Contacte Rebut</h2>
      <p style="margin: 5px 0 0; opacity: 0.9;">Wild Fitness Admin Notification</p>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="label">👤 Nom:</span>
        <span class="value">${data.name}</span>
      </div>
      <div class="info-row">
        <span class="label">📧 Email:</span>
        <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
      </div>
      <div class="info-row">
        <span class="label">📱 Telèfon:</span>
        <span class="value">${data.phone ? `<a href="tel:${data.phone}">${data.phone}</a>` : 'No proporcionat'}</span>
      </div>
      <div class="info-row">
        <span class="label">📍 Ubicació:</span>
        <span class="value">${data.location || 'No proporcionada'}</span>
      </div>
      <div class="info-row">
        <span class="label">📊 Interès:</span>
        <span class="value">${data.level || 'No proporcionat'}</span>
      </div>
      <div class="info-row">
        <span class="label">💬 Missatge:</span>
        <div class="value" style="margin-top: 10px; padding: 15px; background: white; border-left: 3px solid #2d7d7d; font-style: italic;">
          ${data.message || 'Sense missatge'}
        </div>
      </div>
      <div class="info-row" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
        <span class="label">⏰ Rebut:</span>
        <span class="value">${new Date().toLocaleString('ca-ES', { 
          dateStyle: 'full', 
          timeStyle: 'short',
          timeZone: 'Europe/Madrid'
        })}</span>
      </div>
    </div>
    <div class="footer">
      <p>🏔️ <strong>Wild Fitness</strong> | Sistema de Notificacions Automàtiques</p>
      <p style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
        Aquest email s'ha generat automàticament quan un usuari ha emplenat el formulari de contacte.
      </p>
    </div>
  </div>
</body>
</html>
    `
  })
};

export default async function handler(req) {
  console.log('📨 Welcome Email Request received');
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await req.json();
    console.log('📝 Form data received:', { name: data.name, email: data.email });
    
    // Validación de datos
    if (!data.name || !data.email) {
      console.error('❌ Missing name or email');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Nom i email són obligatoris' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validación de API key
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not defined in environment variables');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Configuració del servidor incompleta. Contacta amb l\'administrador.' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log de configuración
    console.log('📤 Email configuration:', {
      from: FROM_EMAIL,
      to: data.email,
      adminEmail: ADMIN_EMAIL,
      apiKeyPresent: !!RESEND_API_KEY
    });

    // ============================================
    // 1. ENVIAR EMAIL AL CLIENTE (Usuario)
    // ============================================
    console.log('📤 Sending welcome email to:', data.email);
    const welcomeTemplate = EmailTemplates.welcome(data);
    let clientResult;
    
    try {
      const clientRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: data.email,
          subject: welcomeTemplate.subject,
          html: welcomeTemplate.html,
        })
      });
      
      clientResult = await clientRes.json();
      console.log('📊 Client email API response:', {
        status: clientRes.status,
        ok: clientRes.ok,
        result: clientResult
      });

      // Si el email al cliente falla, devolver el error
      if (!clientRes.ok) {
        console.error('❌ Resend Client Email Error:', clientResult);
        
        // Proporcionar mensaje más claro según el error
        let errorMessage = 'Error enviant email de confirmació';
        if (clientResult.message?.includes('domain')) {
          errorMessage = `Domini ${FROM_EMAIL.split('@')[1]} no verificat a Resend. Verifica'l a https://resend.com/domains`;
        }
        
        return new Response(JSON.stringify({ 
          success: false, 
          error: errorMessage,
          details: {
            statusCode: clientRes.status,
            message: clientResult.message,
            name: clientResult.name
          },
          suggestion: FROM_EMAIL.includes('wild-fitness.com') 
            ? 'Verifica el domini wild-fitness.com a Resend o canvia FROM_EMAIL a onboarding@resend.dev per a proves'
            : 'Revisa la configuració de Resend'
        }), {
          status: clientRes.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      console.log('✅ Welcome email sent successfully:', clientResult.id);
    } catch (fetchError) {
      console.error('❌ Network error sending client email:', fetchError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Error de xarxa: ${fetchError.message}`,
        details: fetchError
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ============================================
    // 2. ENVIAR NOTIFICACIÓN AL ADMIN
    // ============================================
    console.log('📤 Sending notification to admin:', ADMIN_EMAIL);
    const adminTemplate = EmailTemplates.contactNotification(data);
    let adminResult = null;
    
    try {
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
          // Usar reply-to para facilitar respuestas
          reply_to: data.email
        })
      });
      
      adminResult = await adminRes.json();
      console.log('📊 Admin email API response:', {
        status: adminRes.status,
        ok: adminRes.ok,
        result: adminResult
      });

      if (!adminRes.ok) {
        console.warn('⚠️ Admin notification failed (non-critical):', adminResult);
        // No retornamos error porque el email al cliente ya se envió
      } else {
        console.log('✅ Admin notification sent successfully:', adminResult.id);
      }
    } catch (adminFetchError) {
      console.warn('⚠️ Network error sending admin notification (non-critical):', adminFetchError);
      // No retornamos error porque el email al cliente ya se envió
    }

    // ============================================
    // 3. RESPUESTA EXITOSA
    // ============================================
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Emails enviats correctament',
      clientEmailId: clientResult.id,
      adminEmailId: adminResult?.id || null,
      data: {
        clientEmail: data.email,
        adminEmail: ADMIN_EMAIL,
        from: FROM_EMAIL
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Unexpected error in email handler:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Error inesperat del servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
