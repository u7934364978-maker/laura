# 🔧 Solución Error 403 en Resend

**Fecha:** 29 enero 2026  
**Problema:** Error 403 al enviar emails desde `wild-fitness.com`  
**Causa:** Dominio no verificado correctamente en Resend  

---

## 📋 Checklist Rápida

Antes de empezar, verifica que tienes:
- ✅ Acceso al panel de Resend: https://resend.com/domains
- ✅ Acceso al DNS de tu dominio (Cloudflare, GoDaddy, etc.)
- ✅ API Key de Resend activa

---

## 🎯 PASO 1: Verificar Estado del Dominio en Resend

### 1.1 Accede al Dashboard de Resend

1. Ve a: https://resend.com/domains
2. Inicia sesión con tu cuenta
3. Busca tu dominio: `wild-fitness.com`

### 1.2 Verifica el Estado

Deberías ver uno de estos estados:

| Estado | Significado | Acción |
|--------|-------------|--------|
| ✅ **Verified** | Dominio OK | Ir a PASO 2 |
| ⏳ **Pending** | Esperando verificación DNS | Ir a PASO 3 |
| ❌ **Not Added** | Dominio no añadido | Ir a PASO 1.3 |
| ⚠️ **Failed** | Error en verificación | Ir a PASO 4 |

### 1.3 Si el Dominio NO está añadido

1. Click en **"Add Domain"**
2. Introduce: `wild-fitness.com`
3. Click **"Add"**
4. Resend te mostrará los registros DNS necesarios

---

## 🎯 PASO 2: Copiar Registros DNS de Resend

Una vez añadido el dominio, Resend te mostrará algo como esto:

```
📋 DNS Records Required:

1. SPF Record (TXT)
   Name: wild-fitness.com
   Type: TXT
   Value: v=spf1 include:_spf.resend.com ~all

2. DKIM Record (TXT)
   Name: resend._domainkey.wild-fitness.com
   Type: TXT
   Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNA... (largo)

3. Domain Verification (TXT)
   Name: _resend.wild-fitness.com
   Type: TXT
   Value: re_xxxxxxxxxxxx (código único)
```

**⚠️ IMPORTANTE:** 
- Copia EXACTAMENTE estos valores
- NO añadas espacios extra
- NO modifiques los valores

---

## 🎯 PASO 3: Configurar DNS en tu Proveedor

Dependiendo de dónde tengas tu dominio:

### Opción A: Cloudflare (Recomendado)

#### 3.1 Accede a Cloudflare

1. Ve a: https://dash.cloudflare.com
2. Selecciona tu dominio: `wild-fitness.com`
3. Ve a: **DNS** → **Records**

#### 3.2 Añadir Registro SPF

1. Click **"Add record"**
2. Rellena:
   ```
   Type: TXT
   Name: @
   Content: v=spf1 include:_spf.resend.com ~all
   TTL: Auto
   Proxy status: DNS only (nube gris)
   ```
3. Click **"Save"**

**⚠️ NOTA:** Si ya existe un registro SPF, debes MODIFICARLO (no crear uno nuevo).

**Ejemplo de modificación:**
```
❌ Incorrecto (2 registros SPF):
v=spf1 include:_spf.google.com ~all
v=spf1 include:_spf.resend.com ~all

✅ Correcto (1 registro SPF combinado):
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

#### 3.3 Añadir Registro DKIM

1. Click **"Add record"**
2. Rellena:
   ```
   Type: TXT
   Name: resend._domainkey
   Content: [pegar el valor largo de Resend]
   TTL: Auto
   Proxy status: DNS only (nube gris)
   ```
3. Click **"Save"**

#### 3.4 Añadir Registro de Verificación

1. Click **"Add record"**
2. Rellena:
   ```
   Type: TXT
   Name: _resend
   Content: [pegar el código re_xxxxxxxx de Resend]
   TTL: Auto
   Proxy status: DNS only (nube gris)
   ```
3. Click **"Save"**

#### 3.5 Configuración Final en Cloudflare

**MUY IMPORTANTE:**
- Todos los registros DNS de Resend deben estar en modo **"DNS only"** (nube gris)
- Si están en modo **"Proxied"** (nube naranja), cámbialos a gris

**Cómo cambiar:**
1. Click en la nube naranja junto al registro
2. Cambiará a nube gris
3. Click **"Save"**

---

### Opción B: Otros Proveedores DNS (GoDaddy, Namecheap, etc.)

El proceso es similar:

1. Accede al panel DNS de tu proveedor
2. Añade los 3 registros TXT proporcionados por Resend
3. Asegúrate de usar EXACTAMENTE los valores de Resend
4. Guarda los cambios

**Nota:** Cada proveedor tiene una interfaz diferente, pero todos permiten añadir registros TXT.

---

## 🎯 PASO 4: Verificar Propagación DNS

### 4.1 Esperar Propagación (5 min - 48h)

- **Normalmente:** 15-30 minutos
- **Máximo:** Hasta 48 horas

### 4.2 Verificar Manualmente con Herramientas Online

#### Opción 1: MXToolbox (Recomendado)

1. Ve a: https://mxtoolbox.com/SuperTool.aspx
2. Selecciona: **"TXT Lookup"**
3. Introduce: `wild-fitness.com`
4. Click **"TXT Lookup"**
5. Verifica que aparece: `v=spf1 include:_spf.resend.com ~all`

6. Repite para DKIM:
   - Introduce: `resend._domainkey.wild-fitness.com`
   - Verifica que aparece el valor largo de DKIM

7. Repite para verificación:
   - Introduce: `_resend.wild-fitness.com`
   - Verifica que aparece el código `re_xxxxxxxx`

#### Opción 2: Comando Terminal (Linux/Mac)

```bash
# Verificar SPF
dig TXT wild-fitness.com +short

# Verificar DKIM
dig TXT resend._domainkey.wild-fitness.com +short

# Verificar Código Verificación
dig TXT _resend.wild-fitness.com +short
```

#### Opción 3: Google Admin Toolbox

1. Ve a: https://toolbox.googleapps.com/apps/dig/
2. Introduce: `wild-fitness.com`
3. Type: `TXT`
4. Click **"Dig"**

---

## 🎯 PASO 5: Verificar Dominio en Resend

### 5.1 Forzar Verificación

1. Vuelve a: https://resend.com/domains
2. Busca tu dominio: `wild-fitness.com`
3. Click en **"Verify"** o **"Check Status"**
4. Espera 10-30 segundos

### 5.2 Estado Esperado

Deberías ver:

```
✅ Domain: wild-fitness.com
   Status: Verified
   SPF: ✅ Valid
   DKIM: ✅ Valid
   Verification: ✅ Confirmed
```

### 5.3 Si sigue "Pending"

- Espera 15-30 minutos más
- Verifica que los registros DNS están correctos
- Asegúrate que los registros están en modo "DNS only" (no proxied)

---

## 🎯 PASO 6: Actualizar Configuración en el Código

### 6.1 Verificar Variables de Entorno

Asegúrate que tu archivo `.dev.vars` (o variables en Vercel) tiene:

```bash
# ✅ Correcto - Usa tu dominio verificado
FROM_EMAIL=Wild Fitness <noreply@wild-fitness.com>

# ❌ Incorrecto - No uses resend.dev en producción
# FROM_EMAIL=onboarding@resend.dev
```

### 6.2 Si usas Vercel

1. Ve a: https://vercel.com/focusenglish/laura/settings/environment-variables
2. Busca: `FROM_EMAIL`
3. Verifica que es: `Wild Fitness <noreply@wild-fitness.com>`
4. Si está mal, edítala y guarda
5. Redeploy el proyecto

### 6.3 Si usas Cloudflare Workers

1. Ve a tu Worker en Cloudflare Dashboard
2. Settings → Variables
3. Edita `FROM_EMAIL`
4. Valor: `Wild Fitness <noreply@wild-fitness.com>`
5. Guarda

---

## 🎯 PASO 7: Probar Envío de Email

### 7.1 Código de Prueba

Crea un archivo `test-resend.js`:

```javascript
const RESEND_API_KEY = 're_TU_API_KEY_AQUI'; // Reemplaza con tu API key real

async function testResend() {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Wild Fitness <noreply@wild-fitness.com>',
        to: 'info@wild-fitness.com', // Cambia a tu email
        subject: 'Test de Verificación Resend',
        html: '<h1>✅ Dominio Verificado Correctamente</h1><p>Este email confirma que tu dominio wild-fitness.com está correctamente configurado en Resend.</p>'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Email enviado con éxito!');
      console.log('ID:', data.id);
    } else {
      console.error('❌ Error al enviar:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testResend();
```

### 7.2 Ejecutar Test

```bash
cd /home/user/webapp
node test-resend.js
```

### 7.3 Resultados Esperados

**✅ Si funciona:**
```
✅ Email enviado con éxito!
ID: 550e8400-e29b-41d4-a716-446655440000
```

**❌ Si falla con 403:**
```json
{
  "statusCode": 403,
  "message": "The 'from' email address is not a verified domain"
}
```
→ Vuelve al PASO 5 y verifica el estado del dominio

---

## 🎯 PASO 8: Solución de Problemas Comunes

### Problema 1: "Domain not verified" después de 48h

**Causa:** Registros DNS incorrectos

**Solución:**
1. Ve a Resend Dashboard
2. Copia de nuevo los valores EXACTOS
3. Compara con los que tienes en tu DNS
4. Busca diferencias (espacios, mayúsculas, etc.)
5. Corrige y espera 15 min

### Problema 2: SPF ya existe con otro proveedor

**Causa:** Solo puede haber UN registro SPF por dominio

**Solución:**
```bash
# ❌ Incorrecto (múltiples SPF)
v=spf1 include:_spf.google.com ~all
v=spf1 include:_spf.resend.com ~all

# ✅ Correcto (SPF combinado)
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

### Problema 3: Cloudflare Proxy interfiere

**Causa:** Registros DNS en modo "Proxied" (nube naranja)

**Solución:**
1. En Cloudflare DNS
2. Click en la nube naranja de los registros TXT
3. Cámbiala a gris (DNS only)
4. Guarda

### Problema 4: FROM_EMAIL incorrecto

**Causa:** El dominio en `from` no coincide con el verificado

**Soluciones:**

```javascript
// ❌ Incorrecto
from: 'noreply@resend.dev'  // NO usar en producción
from: 'info@otro-dominio.com'  // Dominio no verificado

// ✅ Correcto
from: 'Wild Fitness <noreply@wild-fitness.com>'
from: 'hola@wild-fitness.com'
from: 'info@wild-fitness.com'
```

### Problema 5: Error 403 solo en producción

**Causa:** Variables de entorno diferentes en dev/prod

**Solución:**
1. Vercel: Verifica variables en Settings → Environment Variables
2. Asegúrate que `FROM_EMAIL` está configurada para Production
3. Redeploy el proyecto

---

## 📊 Resumen Visual del Flujo

```
1. Añadir Dominio en Resend
   ↓
2. Copiar Registros DNS (SPF, DKIM, Verificación)
   ↓
3. Configurar DNS en Cloudflare/GoDaddy/etc
   ↓
4. Esperar Propagación (15-30 min)
   ↓
5. Verificar Dominio en Resend
   ↓
6. Actualizar FROM_EMAIL en código
   ↓
7. Probar envío de email
   ↓
8. ✅ Funcionando!
```

---

## 🆘 Si Nada Funciona: Contactar Soporte

Si después de seguir todos los pasos sigues teniendo error 403:

### Opción 1: Soporte Resend

1. Ve a: https://resend.com/support
2. Describe el problema:
   ```
   Subject: Domain Verification Issue - wild-fitness.com
   
   Hi, I've added and configured DNS records for wild-fitness.com
   but still getting 403 error when sending emails.
   
   DNS records are confirmed via dig/MXToolbox.
   Domain status shows: [PENDING/VERIFIED/etc]
   API Key: re_xxxxx (primeros 6 caracteres)
   
   Can you help verify what's wrong?
   ```

### Opción 2: Verificación Manual

Envíame los siguientes datos para ayudarte:

```bash
# Ejecuta estos comandos y envíame el resultado:

# 1. Estado DNS
dig TXT wild-fitness.com +short
dig TXT resend._domainkey.wild-fitness.com +short
dig TXT _resend.wild-fitness.com +short

# 2. Test API
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_TU_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@wild-fitness.com",
    "to": "info@wild-fitness.com",
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

---

## ✅ Checklist Final

Antes de dar por terminado, verifica:

- [ ] Dominio `wild-fitness.com` aparece como **Verified** en Resend
- [ ] Los 3 registros DNS (SPF, DKIM, Verificación) están configurados
- [ ] Registros DNS verificados con MXToolbox o dig
- [ ] `FROM_EMAIL` en código usa `@wild-fitness.com`
- [ ] Variables de entorno actualizadas en Vercel/Cloudflare
- [ ] Test de envío de email ejecutado con éxito
- [ ] Email de prueba recibido en buzón

---

## 📞 Contacto

Si necesitas ayuda adicional:
- **Email:** info@wild-fitness.com
- **Documentación Resend:** https://resend.com/docs
- **Soporte Resend:** https://resend.com/support

---

**Última actualización:** 29 enero 2026  
**Versión:** 1.0
