# 📧 Configuración del Formulario de Contacto - Wild Fitness

## 📋 Resumen de la Arquitectura

El formulario de contacto de Wild Fitness utiliza una arquitectura moderna con múltiples servicios:

```
Usuario (contacte.html)
    ↓
JavaScript (script.js)
    ↓
    ├─→ Supabase (Guardar datos)
    └─→ Vercel Edge Function (/api/send-welcome-email)
         ↓
         └─→ Resend API (Enviar emails)
```

## 🔧 Componentes Actuales

### 1. **Frontend** (`contacte.html` + `script.js`)
- **Ubicación**: `/contacte.html`
- **Formulario**: ID `contactForm`
- **Campos**:
  - Nombre (`name`) - Requerido
  - Email (`email`) - Requerido
  - Teléfono (`phone`) - Requerido
  - Ubicación (`location`) - Opcional
  - Servicio de interés (`level`) - Opcional
  - Mensaje (`message`) - Requerido
  - Checkbox de privacidad - Requerido

### 2. **Supabase Database** (Almacenamiento de datos)
- **Configuración**: `/supabase-config.js`
- **Credenciales ACTUALIZADAS** (2026-01-28):
  ```javascript
  url: 'https://yzlhczlqzvxjcnmonjaj.supabase.co'
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI'
  ```
- **Tabla**: `contact_submissions`
- **SQL Schema**: Disponible en `/supabase-contact-table.sql`

### 3. **Vercel Edge Function** (Backend API)
- **Archivo**: `/api/send-welcome-email.js`
- **Runtime**: Edge Function (serverless)
- **Funciones**:
  1. Validar datos del formulario
  2. Enviar email de bienvenida al cliente
  3. Enviar notificación al administrador
- **Dependencia**: Resend API

### 4. **Resend API** (Servicio de Email)
- **Proveedor**: https://resend.com
- **Variable requerida**: `RESEND_API_KEY`
- **Emails enviados**:
  - `FROM_EMAIL`: `Wild Fitness <noreply@wild-fitness.com>`
  - `ADMIN_EMAIL`: `info@wild-fitness.com`

## ✅ Estado de Configuración

| Componente | Estado | Notas |
|------------|--------|-------|
| Supabase URL | ✅ Actualizado | Credenciales nuevas configuradas |
| Supabase Anon Key | ✅ Actualizado | Credenciales nuevas configuradas |
| Stripe Publishable Key | ✅ Configurado | Clave de producción disponible |
| Stripe Secret Key | ✅ Configurado | Clave de producción disponible |
| Resend API Key | ⚠️ **PENDIENTE** | Debe configurarse en Vercel |

## ⚠️ ACCIÓN REQUERIDA: Configurar Resend API Key

### Opción 1: Obtener clave de Resend (Recomendado)

1. **Registrarse en Resend**:
   - Ve a https://resend.com
   - Crea una cuenta gratuita
   - Verifica tu email

2. **Configurar dominio**:
   - Ve a "Domains" en el dashboard
   - Agrega el dominio `wild-fitness.com`
   - Configura los registros DNS (MX, TXT, CNAME)
   - Verifica el dominio

3. **Crear API Key**:
   - Ve a "API Keys"
   - Click en "Create API Key"
   - Dale un nombre: "Wild Fitness Production"
   - Copia la clave (comienza con `re_`)

4. **Configurar en Vercel**:
   ```bash
   # En la terminal de Vercel CLI
   vercel env add RESEND_API_KEY
   # Pega tu clave cuando te lo pida
   
   # O desde el dashboard de Vercel:
   # Settings → Environment Variables → Add New
   # Name: RESEND_API_KEY
   # Value: re_tu_clave_aqui
   ```

### Opción 2: Usar servicio alternativo

Si prefieres no usar Resend, puedes modificar `/api/send-welcome-email.js` para usar:
- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://mailgun.com
- **AWS SES**: https://aws.amazon.com/ses

## 📂 Archivos Clave

```
/home/user/webapp/
├── contacte.html                    # Página del formulario
├── script.js                        # Lógica del formulario (líneas 374-446)
├── supabase-config.js              # ✅ Configuración Supabase (ACTUALIZADA)
├── .dev.vars                       # ✅ Variables de entorno (CREADO)
├── .dev.vars.example               # Ejemplo de configuración
├── supabase-contact-table.sql      # Schema de la tabla
└── api/
    └── send-welcome-email.js       # ⚠️ Backend (necesita RESEND_API_KEY)
```

## 🔒 Seguridad

### Credenciales Configuradas

**Supabase** (Base de datos):
- URL: `https://yzlhczlqzvxjcnmonjaj.supabase.co`
- Anon Key: ✅ Configurado (ver `supabase-config.js`)

**Stripe** (Pagos):
- Publishable Key: ✅ Configurado en `.dev.vars` (pk_live_51Skth...)
- Secret Key: ✅ Configurado en `.dev.vars` (sk_live_51Skth...)

⚠️ **IMPORTANTE**: Las claves Secret Key de Stripe NUNCA deben exponerse en el frontend.

### Archivos a NO Subir a Git

Ya están configurados en `.gitignore`:
- `.dev.vars`
- `.env`
- `.env.local`

## 🧪 Cómo Probar el Formulario

### 1. **Prueba Local** (con Vercel CLI)

```bash
# Instalar Vercel CLI
npm install -g vercel

# En el directorio del proyecto
cd /home/user/webapp

# Configurar variables de entorno
vercel env add RESEND_API_KEY  # Pega tu clave cuando te lo pida

# Ejecutar en desarrollo
vercel dev

# Abrir en navegador: http://localhost:3000/contacte.html
```

### 2. **Prueba en Producción**

1. Asegúrate de que `RESEND_API_KEY` esté configurado en Vercel
2. Despliega el sitio: `vercel --prod`
3. Abre: `https://wild-fitness.com/contacte.html`
4. Completa el formulario
5. Verifica:
   - Email de bienvenida al cliente
   - Notificación al admin (`info@wild-fitness.com`)
   - Registro en Supabase tabla `contact_submissions`

### 3. **Verificar en Supabase**

1. Ve a: https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj
2. Navega a: Table Editor → `contact_submissions`
3. Verifica que aparece el nuevo registro

## 🐛 Solución de Problemas

### Error: "Server configuration error"
**Causa**: `RESEND_API_KEY` no está configurado
**Solución**: Configura la clave en Vercel (ver sección "Configurar Resend API Key")

### Error: "Resend error (403): Forbidden"
**Causa**: El dominio no está verificado en Resend
**Solución**: Verifica el dominio `wild-fitness.com` en Resend

### Error: "Supabase no disponible"
**Causa**: El cliente de Supabase no se inicializó correctamente
**Solución**: Verifica que el CDN esté cargado en `contacte.html` (línea 319):
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Los datos se guardan pero no llegan emails
**Causa**: Problema con Resend API o configuración de email
**Solución**: 
1. Verifica logs en Vercel: `vercel logs`
2. Comprueba la configuración del dominio en Resend
3. Verifica que `FROM_EMAIL` y `ADMIN_EMAIL` sean correctos

## 📊 Monitoreo

### Logs de Vercel
```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de una función específica
vercel logs --follow api/send-welcome-email
```

### Dashboard de Resend
- Emails enviados: https://resend.com/emails
- Estadísticas de entrega
- Tasa de apertura y clics

### Dashboard de Supabase
- Registros en tabla: https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/editor
- Logs de API: https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/logs

## 🚀 Próximos Pasos

1. **URGENTE**: Configurar `RESEND_API_KEY` en Vercel
2. Verificar el dominio `wild-fitness.com` en Resend
3. Probar el formulario end-to-end
4. Configurar alertas de errores (Sentry, LogRocket)
5. Implementar rate limiting para evitar spam

## 📞 Contacto de Soporte

Si necesitas ayuda adicional:
- Email: info@wild-fitness.com
- WhatsApp: +34 640 915 772

---

**Última actualización**: 2026-01-28
**Actualizado por**: Claude AI Assistant
**Estado**: ✅ Supabase actualizado | ⚠️ Resend pendiente de configuración
