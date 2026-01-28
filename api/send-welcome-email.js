
export const config = {
  runtime: 'edge',
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Wild Fitness <noreply@wild-fitness.com>';
const ADMIN_EMAIL = 'info@wild-fitness.com';

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
  contactNotification: (data) => ({
    subject: `🔔 Nou contacte: ${data.name}`,
    html: `
      <h2>🔔 Nou contacte rebut</h2>
      <p><strong>👤 Nom:</strong> ${data.name}</p>
      <p><strong>📧 Email:</strong> ${data.email}</p>
      <p><strong>📱 Telèfon:</strong> ${data.phone || 'No proporcionat'}</p>
      <p><strong>📍 Ubicació:</strong> ${data.location || 'No proporcionada'}</p>
      <p><strong>📊 Nivell/Interès:</strong> ${data.level || 'No proporcionat'}</p>
      <p><strong>💬 Missatge:</strong> ${data.message || 'Sense missatge'}</p>
      <p>⏰ Rebut: ${new Date().toLocaleString('ca-ES')}</p>
    `
  })
};

export default async function handler(req) {
  console.log('📨 Welcome Email Request received');
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const data = await req.json();
    console.log('📝 Form data:', data);
    
    if (!data.name || !data.email) {
      console.error('❌ Missing name or email');
      return new Response(JSON.stringify({ error: 'Nom i email són obligatoris' }), { status: 400 });
    }

    // ============================================
    // 1. GUARDAR EN SUPABASE (NUEVO)
    // ============================================
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yzlhczlqzvxjcnmonjaj.supabase.co';
      const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI';
      
      console.log('💾 Saving to Supabase...');
      const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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
      
      if (supabaseRes.ok) {
        const supabaseData = await supabaseRes.json();
        console.log('✅ Saved to Supabase:', supabaseData);
      } else {
        const error = await supabaseRes.text();
        console.error('⚠️ Supabase save failed (continuing anyway):', error);
        // No detenemos el flujo si Supabase falla
      }
    } catch (supabaseError) {
      console.error('⚠️ Supabase error (continuing anyway):', supabaseError);
      // No detenemos el flujo si Supabase falla
    }

    // ============================================
    // 2. ENVIAR EMAILS (EXISTENTE)
    // ============================================
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not defined in environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // Email al cliente
    console.log('📤 Sending welcome email to:', data.email);
    const welcomeTemplate = EmailTemplates.welcome(data);
    let clientResult;
    let clientRes;
    
    try {
      clientRes = await fetch('https://api.resend.com/emails', {
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
      console.log('📊 Client email status:', clientRes.status);
      console.log('✅ Client email response:', JSON.stringify(clientResult, null, 2));

      if (!clientRes.ok) {
        console.error('❌ Resend Client Email Error:', clientResult);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Resend error (${clientRes.status}): ${clientResult.message || 'Unknown error'}`,
          details: clientResult 
        }), {
          status: clientRes.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (fetchError) {
      console.error('❌ Fetch error (Client Email):', fetchError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Network error sending client email: ${fetchError.message}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Notificación al admin
    console.log('📤 Sending notification to admin:', ADMIN_EMAIL);
    const adminTemplate = EmailTemplates.contactNotification(data);
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
        })
      });
      
      const adminResult = await adminRes.json();
      console.log('📊 Admin email status:', adminRes.status);
      console.log('✅ Admin notification response:', JSON.stringify(adminResult, null, 2));

      if (!adminRes.ok) {
        console.warn('⚠️ Admin notification failed, but client email was sent:', adminResult);
      }
    } catch (adminFetchError) {
      console.warn('⚠️ Network error sending admin notification:', adminFetchError);
    }

    return new Response(JSON.stringify({ success: true, clientResult }), {
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
