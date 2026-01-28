# 📧 Estado de Resend API - Wild Fitness

## 🔍 Situación Actual

### ❌ **NO HAY API KEY DE RESEND CONFIGURADA**

Actualmente el proyecto **NO tiene una API key real de Resend**. Solo hay placeholders:

```bash
# En .dev.vars
RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE
```

## 📋 Archivos que Requieren Resend API

El proyecto utiliza Resend API en **3 archivos**:

### 1. `/api/send-welcome-email.js` (Formulario de Contacto)
**Función**: Enviar email de bienvenida al cliente y notificación al admin
- Email al cliente: Confirmación de contacto
- Email al admin: Notificación de nuevo contacto

### 2. `/api/send-booking-confirmation.js` (Confirmación de Reservas)
**Función**: Enviar confirmación de reserva de actividades
- Email al cliente: Detalles de la reserva
- Email al admin: Notificación de nueva reserva

### 3. `/api/cron/send-reminders.js` (Recordatorios Automáticos)
**Función**: Enviar recordatorios de actividades próximas (cron diario 8:00 AM)
- Email a participantes: Recordatorio 24h antes de la actividad
- Email al admin: Resumen de recordatorios enviados

## 🚨 Impacto Actual

### ❌ Lo que NO funciona sin Resend API:
- ✖️ Formulario de contacto NO envía emails
- ✖️ Confirmaciones de reserva NO se envían
- ✖️ Recordatorios automáticos NO funcionan

### ✅ Lo que SÍ funciona sin Resend API:
- ✅ Los datos del formulario SÍ se guardan en Supabase
- ✅ Las reservas SÍ se guardan en Supabase
- ✅ El calendario de actividades funciona
- ✅ El sistema de pagos Stripe funciona

## 💡 Opciones de Solución

### Opción 1: Obtener Resend API Key (Recomendado)

**Ventajas**:
- ✅ Servicio moderno y fácil de usar
- ✅ 100 emails/día gratis
- ✅ 3,000 emails/mes gratis
- ✅ Entregabilidad excelente
- ✅ Dashboard intuitivo
- ✅ Ya está integrado en el código

**Costo**:
- Gratis hasta 3,000 emails/mes
- $20/mes para 50,000 emails/mes
- Sin costos ocultos

**Pasos**:
1. Registrarse en https://resend.com
2. Verificar dominio `wild-fitness.com`
3. Crear API Key
4. Configurar en Vercel:
   ```bash
   vercel env add RESEND_API_KEY production
   vercel env add RESEND_API_KEY preview
   vercel env add RESEND_API_KEY development
   ```

**Tiempo estimado**: 15-30 minutos

---

### Opción 2: Usar SendGrid

**Ventajas**:
- ✅ Servicio establecido
- ✅ 100 emails/día gratis
- ✅ Buena reputación

**Desventajas**:
- ❌ Requiere modificar el código
- ❌ API más compleja
- ❌ Verificación de dominio más complicada

**Requiere**: Modificar los 3 archivos API mencionados

---

### Opción 3: Usar SMTP directo (Gmail, etc.)

**Ventajas**:
- ✅ Puede usar cuenta Gmail existente
- ✅ Gratis

**Desventajas**:
- ❌ Límites muy bajos (500 emails/día con Google Workspace, 100/día con Gmail)
- ❌ Mayor riesgo de ir a spam
- ❌ Requiere modificar el código significativamente
- ❌ No recomendado para producción

---

### Opción 4: Usar Mailgun

**Ventajas**:
- ✅ API robusta
- ✅ 5,000 emails/mes gratis primeros 3 meses

**Desventajas**:
- ❌ Requiere modificar el código
- ❌ Después de 3 meses: $35/mes mínimo
- ❌ Más caro que Resend

---

## 🎯 Recomendación

### ⭐ **Opción Recomendada: Resend API**

**Por qué Resend es la mejor opción**:
1. Ya está integrado en el código (no requiere cambios)
2. Plan gratuito generoso (3,000 emails/mes)
3. API moderna y simple
4. Excelente para transaccionales (confirmaciones, recordatorios)
5. Dashboard claro y fácil de usar
6. Verificación de dominio rápida

**Para Wild Fitness** (volumen estimado):
- Formulario contacto: ~50 emails/mes (cliente + admin)
- Confirmaciones reservas: ~100 emails/mes
- Recordatorios: ~100 emails/mes
- **Total**: ~250 emails/mes → **Dentro del plan gratuito** ✅

---

## 📝 Guía Rápida: Configurar Resend

### Paso 1: Crear Cuenta
1. Ve a https://resend.com
2. Click en "Get Started"
3. Regístrate con email o GitHub
4. Verifica tu email

### Paso 2: Verificar Dominio
1. Dashboard → Domains → Add Domain
2. Ingresa: `wild-fitness.com`
3. Agrega estos registros DNS en Cloudflare:

```
Tipo: TXT
Nombre: @
Valor: [El que te proporcione Resend]

Tipo: MX
Nombre: @
Prioridad: 10
Valor: feedback-smtp.us-east-1.amazonses.com

Tipo: CNAME
Nombre: [subdomain proporcionado por Resend]
Valor: [valor proporcionado por Resend]
```

4. Click en "Verify Domain"

### Paso 3: Crear API Key
1. Dashboard → API Keys → Create API Key
2. Nombre: "Wild Fitness Production"
3. Permisos: "Full Access" o "Sending Access"
4. Click en "Create"
5. **COPIA LA CLAVE** (comienza con `re_`)
   - ⚠️ Solo se muestra una vez

### Paso 4: Configurar en Vercel
```bash
# Opción A: Desde terminal
vercel login
cd /home/user/webapp
vercel env add RESEND_API_KEY production
# Pegar la clave cuando lo pida

# Opción B: Desde dashboard de Vercel
# 1. Ve a https://vercel.com/dashboard
# 2. Selecciona tu proyecto (wild-fitness)
# 3. Settings → Environment Variables
# 4. Add New Variable:
#    - Name: RESEND_API_KEY
#    - Value: re_tu_clave_aqui
#    - Environments: Production, Preview, Development
# 5. Save
```

### Paso 5: Redesplegar
```bash
vercel --prod
```

### Paso 6: Probar
1. Ir a https://wild-fitness.com/contacte.html
2. Llenar el formulario
3. Enviar
4. Verificar:
   - Email recibido en la casilla del cliente
   - Email recibido en info@wild-fitness.com
   - Dashboard de Resend muestra los emails enviados

---

## 🔍 Verificar si ya tienes Resend configurado en Vercel

```bash
# Desde terminal
vercel env ls

# O desde el dashboard:
# https://vercel.com/[tu-usuario]/wild-fitness/settings/environment-variables
```

---

## 📞 ¿Necesitas la API Key?

Si prefieres que yo te ayude a:
1. ✅ Configurar una cuenta de Resend
2. ✅ Obtener la API key
3. ✅ Configurarla en Vercel

Solo dime y te guío paso a paso.

**O si ya tienes una API key de Resend**, solo necesitas:
1. Copiarla
2. Configurarla en Vercel con: `vercel env add RESEND_API_KEY`
3. Redesplegar con: `vercel --prod`

---

**Última actualización**: 2026-01-28
**Estado**: ⚠️ Resend API Key NO configurada - Emails NO funcionan
**Acción requerida**: Configurar Resend API Key para activar envío de emails
