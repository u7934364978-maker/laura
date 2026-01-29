# 📧 Verificación y Configuración de Emails de Confirmación

**Fecha**: 2026-01-28  
**Sistema**: Resend Email Service  
**Estado**: Requiere verificación ⚠️

---

## 🔍 Cómo Funciona el Sistema de Emails

Tu sistema usa **Resend** para enviar emails de confirmación cuando alguien reserva una actividad.

### Flujo del Email:

```
Usuario reserva actividad
    ↓
Pago procesado con Stripe
    ↓
API llama a /api/send-booking-confirmation
    ↓
Resend envía email a: booking.email
    ↓
Cliente recibe confirmación con QR code
```

---

## ✅ Pasos para Verificar y Configurar

### Paso 1: Verificar si Resend está Configurado

1. **Ve a Vercel Dashboard**:
   - URL: https://vercel.com/dashboard
   - Tu proyecto → Settings → Environment Variables

2. **Busca estas variables**:
   - `RESEND_API_KEY` - ¿Existe? ¿Tiene valor?

**Si NO existe** → Necesitas configurarla (sigue Paso 2)  
**Si existe** → Necesitas verificar que funciona (sigue Paso 3)

---

### Paso 2: Obtener API Key de Resend

#### A. Crear Cuenta en Resend (si no tienes)

1. **Ve a**: https://resend.com
2. **Regístrate** con tu email
3. **Verifica** tu email

#### B. Obtener API Key

1. **Login a Resend**: https://resend.com/login
2. **Ve a**: API Keys → https://resend.com/api-keys
3. **Haz clic en**: "Create API Key"
4. **Nombre**: "Wild Fitness Production"
5. **Permisos**: "Sending access"
6. **Copia** la API Key (empieza con `re_...`)

⚠️ **IMPORTANTE**: Guarda esta key, solo se muestra una vez.

#### C. Configurar en Vercel

1. **Ve a Vercel**: https://vercel.com/dashboard
2. **Tu proyecto** → Settings → Environment Variables
3. **Add New**:
   ```
   Name: RESEND_API_KEY
   Value: re_[tu_api_key_aquí]
   Environments: ✅ Production
   ```
4. **Save**
5. **Re-deploy** el proyecto (Deployments → Redeploy)

---

### Paso 3: Verificar Dominio en Resend

Para que los emails NO vayan a spam, necesitas verificar tu dominio.

#### Opción A: Usar Dominio de Prueba (Rápido pero a Spam)

**Ya está configurado** por defecto si no verificas dominio:
- Emails se envían desde: `onboarding@resend.dev`
- ⚠️ Pueden ir a spam
- ⚠️ No profesional
- ✅ Funciona inmediatamente para testing

#### Opción B: Verificar tu Dominio (Recomendado - Profesional)

1. **Ve a Resend**: https://resend.com/domains
2. **Add Domain**: `wild-fitness.com`
3. **Copia los registros DNS** que te muestra Resend

Ejemplo de registros DNS:
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCS... (largo)

Type: TXT  
Name: @
Value: resend-domain-verification=xxx
```

4. **Ve a tu proveedor de dominio** (Cloudflare, GoDaddy, etc.)
5. **Añade los registros DNS** exactamente como te indica Resend
6. **Espera verificación** (5 min - 48 horas)
7. **Una vez verificado**, los emails se enviarán desde:
   ```
   Wild Fitness <noreply@wild-fitness.com>
   ```

---

### Paso 4: Probar el Sistema de Emails

#### A. Probar con cURL (Método Rápido)

```bash
curl -X POST https://www.wild-fitness.com/api/send-booking-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "booking": {
      "id": "test-123",
      "name": "Test User",
      "email": "tu-email@gmail.com",
      "paymentId": "pi_test"
    },
    "activity": {
      "id": "act-1",
      "title": "Grup Fonteta",
      "type": "Entrenament en grup",
      "date": "2026-02-15T17:15:00Z",
      "time": "17:15",
      "location": "Fonteta, Girona",
      "description": "Entrenament de força funcional"
    }
  }'
```

**Resultado esperado**:
```json
{"success": true, "id": "xxx"}
```

Revisa tu email (`tu-email@gmail.com`) para ver si llegó.

#### B. Probar desde la Web

1. Ve a: https://www.wild-fitness.com/calendari.html
2. Reserva una actividad
3. Completa el pago
4. Revisa tu email de confirmación

---

## 🔍 Verificar Logs en Vercel

Si los emails no llegan:

1. **Vercel Dashboard** → Tu proyecto → **Functions**
2. **Filtra por**: `/api/send-booking-confirmation`
3. **Busca errores** como:
   ```
   ❌ Resend error: Missing API Key
   ❌ Resend error: Domain not verified
   ❌ Resend error: Invalid email address
   ```

---

## 📊 Checklist de Verificación

### Variables de Entorno en Vercel:

- [ ] `RESEND_API_KEY` - Configurada ✅
- [ ] `FROM_EMAIL` - Opcional (usa default si no está)
- [ ] `ADMIN_EMAIL` - Opcional

### Configuración de Resend:

- [ ] Cuenta Resend creada ✅
- [ ] API Key obtenida ✅
- [ ] Dominio verificado (opcional, recomendado) ⚠️
- [ ] Email de prueba enviado ✅

### Pruebas:

- [ ] Email de confirmación recibido ✅
- [ ] Email NO en spam (si dominio verificado) ✅
- [ ] QR code visible en el email ✅
- [ ] Links funcionando ✅

---

## 🎯 Estado Actual

Para saber el estado actual, necesito que verifiques:

### 1. ¿Tienes cuenta en Resend?
   - [ ] SÍ - Tengo cuenta
   - [ ] NO - Necesito crear

### 2. ¿Está configurado RESEND_API_KEY en Vercel?
   - Ve a: Vercel → Settings → Environment Variables
   - Busca: `RESEND_API_KEY`
   - [ ] SÍ - Está configurado
   - [ ] NO - Necesito configurar

### 3. ¿Quieres verificar el dominio? (Recomendado)
   - [ ] SÍ - Quiero emails profesionales desde wild-fitness.com
   - [ ] NO - Por ahora uso onboarding@resend.dev

---

## 🚀 Próximos Pasos

### Si NO tienes Resend configurado:

1. ✅ Crear cuenta en Resend
2. ✅ Obtener API Key
3. ✅ Configurar en Vercel
4. ✅ Re-deploy
5. ✅ Probar envío de email

**Tiempo estimado**: 10-15 minutos

### Si YA tienes Resend configurado:

1. ✅ Probar con el comando cURL de arriba
2. ✅ Verificar logs en Vercel
3. ✅ Confirmar que los emails llegan
4. ✅ (Opcional) Verificar dominio para evitar spam

**Tiempo estimado**: 5 minutos

---

## 🆘 Solución de Problemas

### Email no llega:

1. **Verifica RESEND_API_KEY** en Vercel
2. **Revisa spam/junk** en tu email
3. **Verifica logs** en Vercel Functions
4. **Prueba con otro email** (Gmail, Outlook, etc.)

### Email va a spam:

1. **Verifica el dominio** en Resend
2. **Añade registros DNS** correctos
3. **Espera verificación** del dominio
4. Una vez verificado, emails irán a inbox

### Error en logs:

```
Missing API Key → Configura RESEND_API_KEY
Domain not verified → Verifica dominio o usa onboarding@resend.dev
Invalid email → Verifica formato del email
Rate limit → Estás enviando demasiados emails
```

---

## 📞 Recursos

- **Resend Dashboard**: https://resend.com/dashboard
- **Resend Docs**: https://resend.com/docs
- **API Keys**: https://resend.com/api-keys
- **Domains**: https://resend.com/domains
- **Logs**: https://resend.com/logs

---

## 💡 Recomendación

**Para testing inmediato**:
- Configura solo `RESEND_API_KEY`
- Usa el dominio de prueba (onboarding@resend.dev)
- Los emails funcionarán pero pueden ir a spam

**Para producción**:
- Configura `RESEND_API_KEY`
- Verifica tu dominio (wild-fitness.com)
- Los emails irán a inbox y serán profesionales

---

**¿Qué necesitas que haga?**

A) Guiarte paso a paso para configurar Resend desde cero  
B) Ayudarte a verificar si ya está configurado  
C) Probar el sistema de emails ahora mismo  
D) Configurar verificación de dominio  

---

**Dime qué opción prefieres y te ayudo.** 📧🚀
