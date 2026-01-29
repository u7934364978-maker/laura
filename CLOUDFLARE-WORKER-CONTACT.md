# 🔧 Configuración de Cloudflare Worker para Formulario de Contacto

## 📋 Alternativa a Vercel Edge Functions

Si decides migrar de Vercel a Cloudflare Workers para el manejo del formulario, aquí está la configuración necesaria.

## 📂 Estructura Propuesta

```
/home/user/webapp/
├── workers/
│   └── contact-form-handler.js    # Worker principal
├── wrangler.toml                   # Configuración de Wrangler
└── .dev.vars                       # Variables de entorno locales
```

## 🚀 Instalación y Configuración

### 1. Instalar Wrangler CLI

```bash
npm install -g wrangler

# Autenticarse con Cloudflare
wrangler login
```

### 2. Crear `wrangler.toml`

```toml
name = "wild-fitness-contact-handler"
main = "workers/contact-form-handler.js"
compatibility_date = "2024-01-01"

# Variables de entorno (valores en Cloudflare Dashboard)
[vars]
SUPABASE_URL = "https://yzlhczlqzvxjcnmonjaj.supabase.co"
FROM_EMAIL = "Wild Fitness <noreply@wild-fitness.com>"
ADMIN_EMAIL = "info@wild-fitness.com"

# Secrets (configurar con wrangler secret put)
# - SUPABASE_ANON_KEY
# - RESEND_API_KEY
```

### 3. Crear el Worker

**Archivo**: `workers/contact-form-handler.js`

```javascript
/**
 * 🏔️ Wild Fitness - Contact Form Handler (Cloudflare Worker)
 * 
 * Maneja el envío del formulario de contacto:
 * 1. Valida los datos del formulario
 * 2. Guarda en Supabase
 * 3. Envía emails vía Resend API
 */

// ============================================
// CORS Headers
// ============================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ============================================
// Email Templates
// ============================================
const EmailTemplates = {
  welcome: (data) => ({
    subject: '¡Benvingut/da a Wild Fitness! 🏔️',
    html: \`
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
      <div class="greeting">Hola \${data.name}! 👋</div>
      <p>Gràcies per contactar amb <strong>Wild Fitness</strong>! He rebut el teu missatge i em posaré en contacte amb tu el més aviat possible.</p>
      <div class="info-box">
        <strong>📝 El teu missatge:</strong>
        <p style="margin: 10px 0 0; font-style: italic;">"\${data.message || 'Sense missatge'}"</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wild-fitness.com/calendari.html" class="cta-button">📅 Veure Calendari d'Activitats</a>
      </div>
      <p>Estic emocionada de poder ajudar-te a assolir els teus objectius!</p>
    </div>
    <div class="footer">
      <p><strong>Laura Ramírez</strong><br>Wild Fitness<br>+34 640 915 772</p>
      <p style="margin-top: 20px; font-size: 12px;">© \${new Date().getFullYear()} Wild Fitness. Tots els drets reservats.</p>
    </div>
  </div>
</body>
</html>
    \`
  }),
  contactNotification: (data) => ({
    subject: \`🔔 Nou contacte: \${data.name}\`,
    html: \`
      <h2>🔔 Nou contacte rebut</h2>
      <p><strong>👤 Nom:</strong> \${data.name}</p>
      <p><strong>📧 Email:</strong> \${data.email}</p>
      <p><strong>📱 Telèfon:</strong> \${data.phone || 'No proporcionat'}</p>
      <p><strong>📍 Ubicació:</strong> \${data.location || 'No proporcionada'}</p>
      <p><strong>📊 Nivell/Interès:</strong> \${data.level || 'No proporcionat'}</p>
      <p><strong>💬 Missatge:</strong> \${data.message || 'Sense missatge'}</p>
      <p>⏰ Rebut: \${new Date().toLocaleString('ca-ES')}</p>
    \`
  })
};

// ============================================
// Guardar en Supabase
// ============================================
async function saveToSupabase(data, env) {
  try {
    const response = await fetch(\`\${env.SUPABASE_URL}/rest/v1/contact_submissions\`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_ANON_KEY,
        'Authorization': \`Bearer \${env.SUPABASE_ANON_KEY}\`,
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
      console.error('❌ Supabase error:', error);
      return null;
    }
    
    const result = await response.json();
    console.log('✅ Guardado en Supabase:', result);
    return result;
  } catch (error) {
    console.error('❌ Error guardando en Supabase:', error);
    return null;
  }
}

// ============================================
// Enviar Email vía Resend
// ============================================
async function sendEmail(to, subject, html, env) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${env.RESEND_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: to,
        subject: subject,
        html: html
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error(\`❌ Error enviando email a \${to}:\`, error);
      return { success: false, error };
    }
    
    const result = await response.json();
    console.log(\`✅ Email enviado a \${to}:\`, result);
    return { success: true, result };
  } catch (error) {
    console.error(\`❌ Error de red enviando email a \${to}:\`, error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Handler Principal
// ============================================
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }
    
    // Solo aceptar POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    try {
      // Parsear datos del formulario
      const data = await request.json();
      console.log('📝 Datos recibidos:', data);
      
      // Validar campos requeridos
      if (!data.name || !data.email || !data.message) {
        return new Response(JSON.stringify({ 
          error: 'Nom, email i missatge són obligatoris' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // 1. Guardar en Supabase
      const savedData = await saveToSupabase(data, env);
      
      // 2. Enviar email de bienvenida al cliente
      const welcomeTemplate = EmailTemplates.welcome(data);
      const clientEmail = await sendEmail(
        data.email,
        welcomeTemplate.subject,
        welcomeTemplate.html,
        env
      );
      
      if (!clientEmail.success) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Error enviant l\'email de benvinguda'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // 3. Enviar notificación al admin
      const adminTemplate = EmailTemplates.contactNotification(data);
      await sendEmail(
        env.ADMIN_EMAIL,
        adminTemplate.subject,
        adminTemplate.html,
        env
      );
      
      // Respuesta exitosa
      return new Response(JSON.stringify({
        success: true,
        message: 'Missatge enviat correctament'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Error processant la sol·licitud'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
```

### 4. Configurar Secrets

```bash
# Configurar la clave anónima de Supabase
wrangler secret put SUPABASE_ANON_KEY
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI

# Configurar la clave de Resend
wrangler secret put RESEND_API_KEY
# Pegar tu clave de Resend (comienza con re_)
```

### 5. Desplegar

```bash
# Desarrollo local
wrangler dev

# Producción
wrangler deploy
```

## 🔄 Actualizar el Frontend

Modifica `script.js` para apuntar al nuevo Worker:

```javascript
// Línea ~409 en script.js
// ANTES:
const response = await fetch('/api/send-welcome-email', {

// DESPUÉS:
const response = await fetch('https://wild-fitness-contact-handler.tu-cuenta.workers.dev', {
```

O configurar una ruta en Cloudflare Pages:

```javascript
// En wrangler.toml, agregar:
routes = [
  { pattern = "wild-fitness.com/api/contact", custom_domain = true }
]

// Luego en script.js:
const response = await fetch('/api/contact', {
```

## 📊 Ventajas de Cloudflare Workers vs Vercel

| Aspecto | Cloudflare Workers | Vercel Edge Functions |
|---------|-------------------|----------------------|
| Latencia global | <50ms (310+ ubicaciones) | ~100ms (varias regiones) |
| Cold start | ~0ms | ~100-300ms |
| Precio | Gratis hasta 100k req/día | Gratis hasta 100k req/mes |
| Límite de CPU | 10ms (gratis), 50ms (paid) | 30s max |
| Tamaño código | 1MB | 1MB |
| Variables env | ✅ Secrets seguros | ✅ Env vars seguros |

## 🔧 Configuración de Ruta en Cloudflare Pages

Si usas Cloudflare Pages, puedes hacer que `/api/contact` apunte al Worker:

1. Ve a tu proyecto en Cloudflare Pages
2. Settings → Functions → Routes
3. Agrega: `/api/contact` → `wild-fitness-contact-handler`

## ✅ Checklist de Migración

- [ ] Instalar Wrangler CLI
- [ ] Crear `wrangler.toml`
- [ ] Crear `workers/contact-form-handler.js`
- [ ] Configurar secrets (SUPABASE_ANON_KEY, RESEND_API_KEY)
- [ ] Probar localmente con `wrangler dev`
- [ ] Desplegar con `wrangler deploy`
- [ ] Actualizar script.js con la nueva URL
- [ ] Probar el formulario end-to-end
- [ ] Verificar logs en Cloudflare dashboard

## 📞 Soporte

Si necesitas ayuda con la migración:
- Documentación Wrangler: https://developers.cloudflare.com/workers/wrangler/
- Comunidad Discord: https://discord.gg/cloudflaredev

---

**Estado**: Documentación preparada para migración opcional
**Recomendación**: Mantener Vercel si ya funciona. Migrar a Cloudflare solo si necesitas mejor latencia global o más requests gratuitas.
