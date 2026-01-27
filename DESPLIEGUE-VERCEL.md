# 🚀 Despliegue en Vercel - Wild Fitness

## 📋 Guía Completa para Desplegar con Resend y Supabase

Esta guía te ayudará a desplegar **wild-fitness.com** en Vercel con el formulario de contacto completamente funcional.

---

## ✅ Requisitos Previos

Antes de desplegar, asegúrate de tener:

- [ ] Cuenta en [Vercel](https://vercel.com) (gratis)
- [ ] Cuenta en [Resend](https://resend.com) (gratis hasta 3,000 emails/mes)
- [ ] Proyecto Supabase configurado (✅ ya lo tienes)
- [ ] Repositorio Git conectado a Vercel
- [ ] API Key de Resend (obtenerla en paso 1)

---

## 🔑 PASO 1: Obtener API Key de Resend

### 1.1. Crear cuenta y obtener API Key

1. Ve a [Resend](https://resend.com) y crea una cuenta (o inicia sesión)
2. Ve a **API Keys** en el menú lateral
3. Haz clic en **"Create API Key"**
4. Configura:
   - **Name:** `Wild Fitness Production`
   - **Permission:** `Full Access` o `Sending Access`
   - **Domain:** `wild-fitness.com`
5. Haz clic en **"Create"**
6. **¡IMPORTANTE!** Copia la API Key que empieza con `re_...`
   - Solo se muestra UNA VEZ
   - Guárdala en un lugar seguro temporalmente

---

## 🌐 PASO 2: Configurar DNS en Cloudflare

**⚠️ CRÍTICO:** Sin esta configuración, los emails NO se enviarán.

### 2.1. Agregar dominio en Resend

1. Ve a [Resend Dashboard](https://resend.com/domains)
2. Haz clic en **"Add Domain"**
3. Ingresa: `wild-fitness.com`
4. Haz clic en **"Add"**
5. Resend te mostrará los registros DNS que necesitas agregar

### 2.2. Configurar DNS en Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona el dominio: **wild-fitness.com**
3. Ve a **DNS** → **Records**
4. Agrega los siguientes registros (copia los valores EXACTOS de Resend):

#### 📝 Registro DKIM (Autenticación)

- **Tipo:** TXT
- **Nombre:** `resend._domainkey`
- **Contenido:** (Copia el valor completo de Resend, empieza con `p=MIG...`)
- **TTL:** Auto
- **Proxy:** 🔴 DNS only (desactivado)

#### 📬 Registro MX (Recepción)

- **Tipo:** MX
- **Nombre:** `send`
- **Contenido:** `feedback-smtp.eu-west-1.amazonses.com` (verifica en Resend)
- **Prioridad:** 10
- **TTL:** Auto
- **Proxy:** 🔴 DNS only (desactivado)

#### 🛡️ Registro SPF (Anti-spam)

- **Tipo:** TXT
- **Nombre:** `send`
- **Contenido:** `v=spf1 include:amazonses.com ~all` (verifica en Resend)
- **TTL:** Auto
- **Proxy:** 🔴 DNS only (desactivado)

### 2.3. Verificar DNS

1. Espera 5-10 minutos
2. Ve a [Resend Domains](https://resend.com/domains)
3. Haz clic en tu dominio
4. Haz clic en **"Verify DNS Records"**
5. Deberías ver ✅ verde en todos los registros

**📖 Más detalles:** Ver [`DNS-CLOUDFLARE-RESEND.md`](DNS-CLOUDFLARE-RESEND.md)

---

## 🚀 PASO 3: Desplegar en Vercel

### 3.1. Conectar Repositorio (Si aún no lo has hecho)

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio Git (GitHub/GitLab/Bitbucket)
4. Si no está conectado:
   - Autoriza Vercel a acceder a tu cuenta Git
   - Selecciona el repositorio **wild-fitness**

### 3.2. Configurar Proyecto

En la pantalla de configuración del proyecto:

**Build & Development Settings:**
```
Framework Preset: Other
Build Command: (dejar vacío)
Output Directory: .
Install Command: npm install
```

**Root Directory:**
```
./
```

**Node.js Version:**
```
18.x (o superior)
```

### 3.3. Configurar Variables de Entorno

**⚠️ IMPORTANTE:** Haz esto ANTES de hacer clic en "Deploy"

1. En la sección **"Environment Variables"**, agrega:

#### Variable 1: RESEND_API_KEY
```
Name: RESEND_API_KEY
Value: re_tu_api_key_aqui (la que copiaste en el paso 1)
Environment: Production, Preview, Development (marca las 3)
```

#### Variable 2: SUPABASE_URL (Opcional)
```
Name: SUPABASE_URL
Value: https://remyvruwpvvcestvjlsa.supabase.co
Environment: Production, Preview, Development (marca las 3)
```

#### Variable 3: SUPABASE_KEY (Opcional)
```
Name: SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development (marca las 3)
```

**Nota sobre Supabase:**
- Las credenciales de Supabase ya están en el código frontend (`supabase-config.js`)
- Solo agrega estas variables si quieres usarlas del lado del servidor
- Para el formulario de contacto, NO son necesarias aquí

### 3.4. Desplegar

1. Haz clic en **"Deploy"**
2. Vercel comenzará a construir y desplegar tu sitio
3. Espera 1-2 minutos
4. Cuando termine, verás: ✅ "Your project has been deployed"

### 3.5. Configurar Dominio Personalizado

1. En tu proyecto de Vercel, ve a **Settings** → **Domains**
2. Agrega tu dominio: `wild-fitness.com`
3. También agrega: `www.wild-fitness.com`
4. Vercel te dará instrucciones DNS para Cloudflare

**Registros DNS a agregar en Cloudflare:**
```
Tipo: A
Nombre: @
Valor: 76.76.21.21
Proxy: ✅ Proxied (activado)

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
Proxy: ✅ Proxied (activado)
```

5. Espera 5-10 minutos para que propague

---

## 🧪 PASO 4: Probar el Formulario

Una vez desplegado y con el DNS configurado:

### 4.1. Probar en producción

1. Ve a [wild-fitness.com/contacte.html](https://wild-fitness.com/contacte.html)
2. Llena el formulario con **tu email real**:
   - Nombre: Tu nombre
   - Email: tu-email@gmail.com
   - Teléfono: tu número
   - Mensaje: "Prueba del formulario"
3. Haz clic en **"Enviar Sol·licitud"**

### 4.2. Verificar funcionamiento

Deberías ver y recibir:

#### ✅ En la web:
- Mensaje: "✅ Missatge enviat correctament! Et contactaré aviat."
- El formulario se limpia automáticamente

#### ✅ En tu email:
- Subject: "¡Benvingut/da a Wild Fitness! 🏔️"
- From: "Wild Fitness <noreply@wild-fitness.com>"
- Con diseño turquesa y tu mensaje

#### ✅ En info@wild-fitness.com:
- Subject: "🔔 Nou contacte: [Tu Nombre]"
- Con todos los datos del formulario

#### ✅ En Supabase:
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Abre tu proyecto
3. Ve a **Table Editor** → `contact_submissions`
4. Deberías ver el nuevo registro con tus datos

---

## 🔍 PASO 5: Verificar Logs (Si hay problemas)

### 5.1. Logs de Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Deployments**
3. Haz clic en el último deployment
4. Ve a **Functions** → **send-welcome-email**
5. Revisa los logs para ver errores

### 5.2. Logs de Resend

1. Ve a [Resend Emails](https://resend.com/emails)
2. Busca el email que intentaste enviar
3. Verifica el status:
   - ✅ **Delivered:** Email enviado correctamente
   - ⏳ **Queued:** En cola, espera unos segundos
   - ❌ **Bounced:** Hubo un error (revisa DNS)

### 5.3. Logs de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Logs** → **API Logs**
3. Busca las inserciones en `contact_submissions`
4. Revisa si hay errores de permisos (RLS)

---

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios en tu código:

### Método 1: Push a Git (Automático)

```bash
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

Vercel detectará el push automáticamente y redespliegará.

### Método 2: Redeploy Manual

1. Ve a tu proyecto en Vercel
2. Ve a **Deployments**
3. Haz clic en los tres puntos del último deployment
4. Selecciona **"Redeploy"**

---

## 🔧 Actualizar Variables de Entorno

Si necesitas cambiar la API Key de Resend u otras variables:

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Encuentra la variable que quieres actualizar
4. Haz clic en los tres puntos → **"Edit"**
5. Cambia el valor
6. Haz clic en **"Save"**
7. **¡IMPORTANTE!** Haz un **Redeploy** para que tome efecto

---

## 📊 Monitoreo y Analytics

### Ver estadísticas de emails (Resend)

1. Ve a [Resend Dashboard](https://resend.com/dashboard)
2. Verás gráficos de:
   - Emails enviados
   - Tasa de entrega
   - Bounces y errores

### Ver contactos (Supabase)

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. **Table Editor** → `contact_submissions`
3. O usa el admin dashboard: `wild-fitness.com/admin.html`

### Ver analytics del sitio (Vercel)

1. En tu proyecto de Vercel
2. Ve a **Analytics**
3. Verás visitas, performance, etc.

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "RESEND_API_KEY is not defined"

**Causa:** La variable de entorno no está configurada en Vercel.

**Solución:**
1. Ve a **Settings** → **Environment Variables**
2. Verifica que `RESEND_API_KEY` esté agregada
3. Haz un **Redeploy**

### ❌ Error: "Domain not verified"

**Causa:** Los registros DNS en Cloudflare no están configurados correctamente.

**Solución:**
1. Ve a [Resend Domains](https://resend.com/domains)
2. Verifica qué registros fallan
3. Revisa los valores en Cloudflare DNS
4. Asegúrate de que **Proxy esté desactivado** (DNS only)

### ❌ Emails no llegan al usuario

**Causa 1:** DNS no verificado → Solución: Paso 2.3

**Causa 2:** Email en spam → Solución:
- Revisa la carpeta de spam del usuario
- Agrega registro DMARC (opcional)
- Espera unos días para ganar reputación del dominio

**Causa 3:** API Key incorrecta → Solución:
- Ve a Resend y genera una nueva API Key
- Actualízala en Vercel

### ❌ Datos no se guardan en Supabase

**Causa:** Error en las políticas RLS o tabla no creada.

**Solución:**
1. Ve a Supabase **SQL Editor**
2. Ejecuta: `SELECT * FROM contact_submissions LIMIT 1;`
3. Si da error, ejecuta el SQL completo de `supabase-contact-table.sql`

---

## 📈 Límites y Costos

### Vercel (Plan Gratuito)
- ✅ 100 GB bandwidth/mes
- ✅ Despliegues ilimitados
- ✅ SSL automático
- ✅ Funciones serverless

### Resend (Plan Gratuito)
- ✅ 3,000 emails/mes
- ✅ 100 emails/día
- ✅ 1 dominio verificado
- 💰 Si necesitas más: desde $20/mes por 50,000 emails

### Supabase (Plan Gratuito)
- ✅ 500 MB database
- ✅ 2 GB bandwidth/mes
- ✅ 50,000 solicitudes/mes
- 💰 Si necesitas más: desde $25/mes

---

## ✅ Checklist Final

Antes de considerar el despliegue completo:

- [ ] ✅ API Key de Resend obtenida
- [ ] 🌐 Registros DNS configurados en Cloudflare (DKIM, SPF, MX)
- [ ] ✅ DNS verificado en Resend Dashboard (todos ✅ verde)
- [ ] 🚀 Sitio desplegado en Vercel
- [ ] 🔑 Variable `RESEND_API_KEY` configurada en Vercel
- [ ] 🌐 Dominio `wild-fitness.com` conectado a Vercel
- [ ] 🧪 Formulario probado y funciona correctamente
- [ ] 📧 Email de bienvenida recibido
- [ ] 🔔 Email de notificación recibido en info@wild-fitness.com
- [ ] 💾 Datos guardados en Supabase
- [ ] 📊 Admin dashboard funciona (wild-fitness.com/admin.html)

---

## 🔗 Links Útiles

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Resend Dashboard:** https://resend.com/dashboard
- **Resend Domains:** https://resend.com/domains
- **Resend Emails:** https://resend.com/emails
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Cloudflare DNS:** https://dash.cloudflare.com

---

## 📞 Próximos Pasos

Una vez que todo funcione:

1. **Monitorea los emails** en Resend para ver la tasa de entrega
2. **Revisa los contactos** en Supabase regularmente
3. **Personaliza los templates** de email en `api/send-welcome-email.js`
4. **Configura DMARC** (opcional) para mejorar deliverabilidad
5. **Considera un plan de pago** si superas los límites gratuitos

---

**¡Felicidades! Tu formulario de contacto está completamente funcional en producción. 🎉**

*Última actualización: Enero 2026*
