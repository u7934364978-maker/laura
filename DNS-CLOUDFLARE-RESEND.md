# 🌐 Configuración DNS en Cloudflare para Resend

## 📋 Registros DNS que debes agregar

Según tu dashboard de Resend, necesitas agregar estos registros DNS en Cloudflare para que los emails funcionen correctamente.

---

## 🔧 Instrucciones Paso a Paso

### 1️⃣ Accede a Cloudflare DNS

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona el dominio: **wild-fitness.com**
3. En el menú lateral, haz clic en **DNS** → **Records**

---

### 2️⃣ Agrega los Registros DNS

**⚠️ IMPORTANTE:** 
- Todos los registros deben estar en modo **"DNS only"** (🔴 nube gris)
- **NO actives el proxy** de Cloudflare (❌ nube naranja)
- Copia los valores EXACTOS de tu dashboard de Resend

---

## 📝 Registro 1: DKIM (Autenticación de Email)

| Campo | Valor |
|-------|-------|
| **Tipo** | TXT |
| **Nombre** | `resend._domainkey` |
| **Contenido** | Ve a tu dashboard de Resend y copia el valor completo que empieza con `p=MIGfMA0GCSqGSIb3DQEB...` |
| **TTL** | Auto |
| **Proxy status** | DNS only (🔴 gris) |

**Cómo obtener el valor:**
1. Ve a [Resend Dashboard](https://resend.com/domains)
2. Selecciona tu dominio
3. En la sección **DKIM**, copia el valor completo del campo **Content**
4. Pégalo en Cloudflare

---

## 📬 Registro 2: MX Record (Recepción de Emails)

| Campo | Valor |
|-------|-------|
| **Tipo** | MX |
| **Nombre** | `send` |
| **Contenido** | `feedback-smtp.eu-west-1.amazonses.com` (verifica en Resend) |
| **Prioridad** | 10 |
| **TTL** | Auto |
| **Proxy status** | DNS only (🔴 gris) |

**Cómo obtener el valor:**
1. Ve a [Resend Dashboard](https://resend.com/domains)
2. En la sección **SPF** → **MX Record**, copia el valor del campo **Content**
3. Pégalo en Cloudflare

---

## 🛡️ Registro 3: SPF (Prevención de Spam)

| Campo | Valor |
|-------|-------|
| **Tipo** | TXT |
| **Nombre** | `send` |
| **Contenido** | `v=spf1 include:amazonses.com ~all` (verifica en Resend) |
| **TTL** | Auto |
| **Proxy status** | DNS only (🔴 gris) |

**Cómo obtener el valor:**
1. Ve a [Resend Dashboard](https://resend.com/domains)
2. En la sección **SPF** → **TXT Record**, copia el valor completo
3. Pégalo en Cloudflare

---

## 🔍 Registro 4: DMARC (Opcional pero Recomendado)

Este registro ayuda a prevenir que tus emails vayan a spam.

| Campo | Valor |
|-------|-------|
| **Tipo** | TXT |
| **Nombre** | `_dmarc` |
| **Contenido** | `v=DMARC1; p=quarantine; rua=mailto:info@wild-fitness.com` |
| **TTL** | Auto |
| **Proxy status** | DNS only (🔴 gris) |

---

## ✅ Verificación

### Después de agregar los registros:

1. **Espera 5-10 minutos** para que los cambios DNS propaguen
2. Ve a [Resend Dashboard](https://resend.com/domains)
3. Haz clic en tu dominio
4. Haz clic en **"Verify DNS Records"** o **"Refresh"**
5. Deberías ver ✅ verde en todos los registros:
   - ✅ DKIM: `resend._domainkey` - Status: **Verified**
   - ✅ MX Record: `send` - Status: **Verified**
   - ✅ SPF: `send` - Status: **Verified**

---

## 🐛 Solución de Problemas

### ❌ Status: "Failed" o "Pending"

**Si ves "Failed" después de 10 minutos:**

1. **Verifica el nombre del registro:**
   - Debe ser exactamente `resend._domainkey` (no `resend._domainkey.wild-fitness.com`)
   - Debe ser `send` (no `send.wild-fitness.com`)
   - Cloudflare agrega automáticamente el dominio, solo escribe el prefijo

2. **Verifica el proxy:**
   - Debe estar en modo **"DNS only"** (🔴 nube gris)
   - Si está en naranja (proxied), haz clic para desactivarlo

3. **Verifica el contenido:**
   - Copia EXACTAMENTE el valor de Resend
   - No agregues espacios ni saltos de línea
   - El valor completo del DKIM puede ser muy largo (200+ caracteres)

4. **Limpia la cache DNS:**
   ```bash
   # En tu computadora (Windows)
   ipconfig /flushdns
   
   # En tu computadora (Mac/Linux)
   sudo dscacheutil -flushcache
   ```

---

## 📸 Referencia Visual

### Cómo debería verse en Cloudflare:

```
┌─────────────────────────────────────────────────────┐
│ DNS Records - wild-fitness.com                       │
├─────────┬──────────────────────┬──────────┬────────┤
│ Type    │ Name                 │ Content  │ Proxy  │
├─────────┼──────────────────────┼──────────┼────────┤
│ TXT     │ resend._domainkey    │ p=MIG... │ 🔴 DNS │
│ MX      │ send                 │ feedb... │ 🔴 DNS │
│ TXT     │ send                 │ v=spf1.. │ 🔴 DNS │
│ TXT     │ _dmarc               │ v=DMARC1 │ 🔴 DNS │
└─────────┴──────────────────────┴──────────┴────────┘
```

### Cómo debería verse en Resend:

```
✅ Domain Verification
   Status: Verified

✅ DKIM
   resend._domainkey → Status: Verified

✅ Enable Sending
   MX: send → Status: Verified
   TXT: send (SPF) → Status: Verified
```

---

## ⏰ Tiempos de Propagación

| Registro | Tiempo típico | Tiempo máximo |
|----------|---------------|---------------|
| DKIM (TXT) | 5-10 minutos | 1 hora |
| MX Record | 5-10 minutos | 1 hora |
| SPF (TXT) | 5-10 minutos | 1 hora |
| DMARC (TXT) | 15-30 minutos | 24 horas |

**Consejo:** Cloudflare suele propagar muy rápido (5-10 minutos). Si después de 1 hora no funciona, revisa los valores nuevamente.

---

## 🧪 Probar la Configuración

Una vez que todos los registros estén verificados (✅):

1. Ve a [wild-fitness.com/contacte.html](https://wild-fitness.com/contacte.html)
2. Llena el formulario con **tu email personal real**
3. Envía el formulario
4. Deberías recibir un email en **menos de 1 minuto**:
   - Subject: "¡Benvingut/da a Wild Fitness! 🏔️"
   - From: "Wild Fitness <noreply@wild-fitness.com>"

5. También deberías recibir en **info@wild-fitness.com**:
   - Subject: "🔔 Nou contacte: [Tu Nombre]"
   - Con todos los datos del formulario

---

## 📞 Si Necesitas Ayuda

1. **Verifica los logs de Resend:**
   - Ve a [Resend Emails](https://resend.com/emails)
   - Busca el email que enviaste
   - Revisa el status (Delivered, Bounced, etc.)

2. **Consulta el status de DNS:**
   - Ve a [Resend Domains](https://resend.com/domains)
   - Haz clic en tu dominio
   - Revisa qué registros faltan

3. **Herramientas útiles:**
   - [MXToolbox](https://mxtoolbox.com/SuperTool.aspx) - Verificar registros DNS
   - [DNS Checker](https://dnschecker.org/) - Ver propagación DNS global

---

**¡Una vez configurado, los emails se enviarán automáticamente! 🎉**

*Última actualización: Enero 2026*
