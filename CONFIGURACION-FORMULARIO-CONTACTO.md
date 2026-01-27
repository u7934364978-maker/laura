# 📧 Configuración del Formulario de Contacto - Wild Fitness

## 🎯 ¿Qué hace este formulario?

Cuando un usuario envía el formulario de contacto en **wild-fitness.com**, el sistema hace 3 cosas automáticamente:

1. **💾 Guarda los datos en Supabase** - Para que puedas gestionar todos los contactos
2. **📧 Envía un email al usuario** - Email de confirmación automático usando Resend
3. **🔔 Te notifica por email** - Recibes los datos del contacto en tu email (info@wild-fitness.com)

---

## 🛠️ Configuración Paso a Paso

### ✅ PASO 1: Configurar Supabase (Base de Datos)

**Estado actual:** ✅ **YA ESTÁ CONFIGURADO**

Tu proyecto de Supabase ya está conectado:
- **URL:** `https://remyvruwpvvcestvjlsa.supabase.co`
- **Anon Key:** Configurada en `supabase-config.js`

#### ✅ Verificar que la tabla existe

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Abre tu proyecto **wild-fitness**
3. Ve a **SQL Editor** (menú izquierdo)
4. Ejecuta esta consulta para verificar:

```sql
SELECT * FROM contact_submissions LIMIT 5;
```

#### 🆕 Si la tabla NO existe, créala

Si recibes un error que la tabla no existe, ejecuta el archivo SQL completo:

1. En **SQL Editor**, haz clic en **New Query**
2. Copia y pega TODO el contenido del archivo `supabase-contact-table.sql`
3. Haz clic en **Run** (o presiona Ctrl+Enter)
4. Deberías ver: "Success. No rows returned"

**¿Qué crea este SQL?**
- ✅ Tabla `contact_submissions` con todos los campos
- ✅ Índices para mejorar el rendimiento
- ✅ Políticas de seguridad (RLS) - Permite inserts públicos pero solo admins pueden leer
- ✅ Trigger para notificaciones en tiempo real

---

### ⚠️ PASO 2: Configurar Resend (Envío de Emails)

**Estado actual:** ⚠️ **REQUIERE CONFIGURACIÓN DE DNS**

#### 📝 2.1. Obtener tu API Key de Resend

1. Ve a [Resend Dashboard](https://resend.com/api-keys)
2. Si no tienes cuenta, créala (es gratis hasta 3,000 emails/mes)
3. Haz clic en **Create API Key**
4. Dale un nombre: "Wild Fitness Production"
5. Copia la clave (empieza con `re_...`)

#### 🌐 2.2. Configurar DNS en Cloudflare (CRÍTICO)

**IMPORTANTE:** Sin configurar el DNS, los emails **NO se entregarán**.

Según tu captura de pantalla de Resend, necesitas agregar estos registros DNS en Cloudflare:

##### 📍 **Ve a Cloudflare DNS**

1. Abre [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona el dominio **wild-fitness.com**
3. Ve a **DNS** → **Records**

##### ➕ **Agrega los siguientes registros:**

**IMPORTANTE:** Los valores exactos están en tu dashboard de Resend. Aquí están los valores basados en tu captura:

| Tipo | Nombre | Contenido | TTL | Proxy |
|------|--------|-----------|-----|-------|
| **TXT** | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEB...` (valor completo de Resend) | Auto | DNS only (🔴) |
| **MX** | `send` | `feedback-smtp.eu-west-...` | Auto | DNS only (🔴) |
| **TXT** | `send` | `v=spf1 include:amazons...` | Auto | DNS only (🔴) |

**⚠️ IMPORTANTE:** 
- **NO actives el proxy de Cloudflare** (debe estar en "DNS only" 🔴 gris)
- Los valores exactos están en tu dashboard de Resend en la sección "DNS Records"
- Copia y pega los valores COMPLETOS, no los truncados

##### ✅ **Verificar la configuración**

1. Guarda los registros DNS en Cloudflare
2. Espera 5-10 minutos (propagación DNS)
3. Vuelve a [Resend Dashboard](https://resend.com/domains)
4. Haz clic en **Verify DNS Records**
5. Deberías ver ✅ verde en todos los registros

**Si ves errores:**
- ⏰ Espera más tiempo (puede tardar hasta 24 horas, pero normalmente 5-10 min)
- 🔍 Verifica que copiaste los valores completos sin espacios extras
- 🔴 Asegúrate de que el proxy de Cloudflare esté desactivado (DNS only)

#### 🔑 2.3. Configurar la API Key en tu proyecto

**✅ DESPLIEGUE EN VERCEL (TU CASO)**

Ya que despliegas en Vercel, sigue estos pasos:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **wild-fitness**
3. Ve a **Settings** → **Environment Variables**
4. Agrega una nueva variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_tu_api_key_aqui` (la que copiaste de Resend)
   - **Environment:** Marca `Production`, `Preview` y `Development`
5. Haz clic en **Save**
6. **Redeploy** tu proyecto para que tome efecto

**📖 Guía completa de despliegue en Vercel:** Ver [`DESPLIEGUE-VERCEL.md`](DESPLIEGUE-VERCEL.md) para instrucciones detalladas paso a paso.

**💡 Desarrollo local (Opcional)**

Para probar localmente antes de desplegar:

1. Crea un archivo `.dev.vars` en la raíz del proyecto (NO lo subas a Git)
2. Copia el contenido de `.dev.vars.example`
3. Reemplaza `re_TU_API_KEY_AQUI` con tu API Key real
4. Usa Vercel CLI: `vercel dev` para probar localmente

---

### 🧪 PASO 3: Probar el Formulario

#### 🧪 Test 1: Verificar Supabase

1. Abre la consola del navegador (F12)
2. Ve a [wild-fitness.com/contacte.html](https://wild-fitness.com/contacte.html)
3. Llena el formulario con datos de prueba
4. Envía el formulario
5. Observa la consola, deberías ver:
   ```
   ✅ Contacto guardado en Supabase: {id: "...", name: "...", ...}
   ```

6. Ve a Supabase → **Table Editor** → `contact_submissions`
7. Deberías ver el nuevo registro

#### 📧 Test 2: Verificar Emails de Resend

1. Asegúrate de que el DNS esté verificado (✅ verde en Resend)
2. Envía otro formulario usando **TU email real**
3. Deberías recibir 2 emails:
   - **Email al usuario:** "¡Benvingut/da a Wild Fitness! 🏔️"
   - **Email a ti (info@wild-fitness.com):** "🔔 Nou contacte: [Nombre]"

4. **Si NO recibes emails:**
   - Revisa la carpeta de SPAM
   - Ve a [Resend Logs](https://resend.com/emails) para ver el estado
   - Verifica que el DNS esté correctamente configurado (paso 2.2)

---

## 🎨 Personalización de Emails

Los templates de email están en: `api/send-welcome-email.js`

### 📧 Email de Bienvenida (Usuario)

```javascript
// Línea 12-54 en api/send-welcome-email.js
const EmailTemplates = {
  welcome: (data) => ({
    subject: '¡Benvingut/da a Wild Fitness! 🏔️',
    html: `...` // HTML del email
  })
}
```

**Puedes personalizar:**
- ✏️ El asunto del email
- 🎨 Los colores (actualmente usa la paleta turquesa de Wild Fitness)
- 📝 El texto y mensajes
- 🔗 Los links (actualmente apunta a calendari.html)

### 🔔 Email de Notificación (Admin)

```javascript
// Línea 56-68 en api/send-welcome-email.js
contactNotification: (data) => ({
  subject: `🔔 Nou contacte: ${data.name}`,
  html: `...` // HTML de la notificación
})
```

**Puedes personalizar:**
- ✏️ El formato de la notificación
- 📊 Los campos que quieres recibir
- 📧 El email de destino (actualmente: info@wild-fitness.com)

---

## 🔍 Solución de Problemas

### ❌ Error: "Invalid domain"

**Causa:** Los registros DNS no están configurados o no han propagado.

**Solución:**
1. Ve a Cloudflare DNS
2. Verifica que todos los registros del paso 2.2 estén agregados
3. Espera 10-15 minutos
4. Ve a Resend y haz clic en "Verify DNS Records"

### ❌ Error: "DKIM Verification Failed"

**Causa:** El registro TXT `resend._domainkey` no está configurado correctamente.

**Solución:**
1. Ve a Cloudflare DNS
2. Busca el registro TXT con nombre `resend._domainkey`
3. Verifica que el contenido sea el valor COMPLETO de Resend (empieza con `p=MIG...`)
4. Asegúrate de que **Proxy esté desactivado** (DNS only)

### ❌ Error: "SPF Records Failed"

**Causa:** Falta el registro TXT SPF para el subdominio `send`.

**Solución:**
1. Ve a Cloudflare DNS
2. Agrega un registro **TXT** con:
   - Nombre: `send`
   - Contenido: `v=spf1 include:amazonses.com ~all` (o el valor de Resend)
3. Asegúrate de que **Proxy esté desactivado**

### ❌ Error: "Missing required MX record"

**Causa:** Falta el registro MX para el subdominio `send`.

**Solución:**
1. Ve a Cloudflare DNS
2. Agrega un registro **MX** con:
   - Nombre: `send`
   - Contenido: `feedback-smtp.eu-west-1.amazonses.com` (o el valor de Resend)
   - Prioridad: 10
3. Asegúrate de que **Proxy esté desactivado**

### 📧 Los emails van a SPAM

**Causa:** El dominio es nuevo o falta configuración DMARC.

**Solución:**
1. Espera unos días para que tu dominio genere reputación
2. Agrega un registro DMARC en Cloudflare:
   - Tipo: **TXT**
   - Nombre: `_dmarc`
   - Contenido: `v=DMARC1; p=quarantine; rua=mailto:info@wild-fitness.com`
3. Pide a los primeros usuarios que marquen como "No es spam"

---

## 📊 Dashboard de Contactos (Opcional)

Ya tienes un archivo `admin.html` para gestionar contactos. Para usarlo:

1. Ve a [wild-fitness.com/admin.html](https://wild-fitness.com/admin.html)
2. Inicia sesión con tu cuenta de Supabase (laura@wild-fitness.com o info@wild-fitness.com)
3. Podrás ver, filtrar y gestionar todos los contactos recibidos

**Campos disponibles:**
- ✅ **Status:** new → contacted → converted → archived
- 📝 **Notes:** Notas internas sobre cada contacto
- 🔍 **Filtros:** Por fecha, status, servicio, ubicación

---

## 🚀 Checklist Final

Antes de lanzar a producción, verifica:

- [ ] ✅ Tabla `contact_submissions` creada en Supabase
- [ ] 🔑 API Key de Resend configurada en Vercel/Cloudflare
- [ ] 🌐 Registros DNS configurados en Cloudflare (DKIM, SPF, MX)
- [ ] ✅ DNS verificado en Resend Dashboard (todos ✅ verdes)
- [ ] 🧪 Formulario probado y funciona correctamente
- [ ] 📧 Email de bienvenida recibido por el usuario
- [ ] 🔔 Email de notificación recibido en info@wild-fitness.com
- [ ] 💾 Datos guardados correctamente en Supabase
- [ ] 📊 Admin dashboard funciona y muestra los contactos

---

## 📞 Contacto y Soporte

Si tienes problemas con la configuración:

1. **Revisa los logs del navegador** (F12 → Console)
2. **Revisa los logs de Resend** ([resend.com/emails](https://resend.com/emails))
3. **Verifica Supabase** (Table Editor y SQL Editor)
4. **Consulta esta documentación** paso a paso

---

## 🔗 Links Útiles

- **Resend Dashboard:** https://resend.com/dashboard
- **Resend API Docs:** https://resend.com/docs
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Cloudflare DNS:** https://dash.cloudflare.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**¡Listo! Tu formulario de contacto está configurado para funcionar con Resend y Supabase. 🎉**

*Última actualización: Enero 2026*
