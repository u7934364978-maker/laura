# 🔧 Guía de Solución: Verificar Dominio en Resend

## 🎯 Problema Actual
- ✅ API Key de Resend configurada en Vercel
- ❌ Dominio `wild-fitness.com` NO verificado en Resend

---

## 📋 Pasos para Verificar el Dominio

### Paso 1: Obtener los Registros DNS de Resend

1. Ve a tu dashboard de Resend: https://resend.com/domains
2. Haz click en el dominio `wild-fitness.com` (o agrégalo si no está)
3. Resend te mostrará los registros DNS que necesitas agregar

**Ejemplo de registros que verás**:

```
1. Registro TXT (Verificación):
   Tipo: TXT
   Nombre: @ (o wild-fitness.com)
   Valor: resend-verification=XXXXXXXXXXXX

2. Registros DKIM (Autenticación):
   Tipo: TXT
   Nombre: resend._domainkey
   Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA4... (largo)

3. Registros SPF (evitar spam):
   Tipo: TXT
   Nombre: @
   Valor: v=spf1 include:resend.com ~all

4. Registro DMARC (políticas):
   Tipo: TXT
   Nombre: _dmarc
   Valor: v=DMARC1; p=none; rua=mailto:dmarc@wild-fitness.com
```

---

### Paso 2: Configurar DNS en Cloudflare

Vamos a revisar y configurar los registros DNS en Cloudflare:

1. **Accede a Cloudflare**: https://dash.cloudflare.com
2. **Selecciona tu dominio**: `wild-fitness.com` (o `wildbreathing.com`)
3. **Ve a DNS**: Click en "DNS" en el menú lateral
4. **Agrega los registros** que Resend te proporcionó

---

### Paso 3: Configuración en Cloudflare (Paso a Paso)

#### A) Verificar Dominio Actual
Primero necesito saber qué dominio estás usando exactamente. El proyecto menciona ambos:
- `wild-fitness.com` (en código)
- `wildbreathing.com` (en README)

**¿Cuál es el dominio real que usas?**

#### B) Agregar Registros TXT en Cloudflare

Para cada registro TXT que Resend te proporciona:

1. Click en "Add record"
2. Selecciona:
   - **Type**: TXT
   - **Name**: (lo que indique Resend, ej: `@` o `resend._domainkey`)
   - **Content**: (el valor largo que te da Resend)
   - **TTL**: Auto o 3600
   - **Proxy status**: 🔘 DNS only (IMPORTANTE: desactivar el proxy naranja)
3. Click "Save"

**⚠️ MUY IMPORTANTE**: Para registros TXT/MX, el proxy de Cloudflare (nube naranja ☁️) debe estar **DESACTIVADO** (gris).

---

## 🔍 Método Alternativo: Usar Subdominios

Si tienes problemas verificando el dominio raíz, puedes usar un subdominio:

### Opción A: mail.wild-fitness.com

1. En Resend, agrega el dominio como: `mail.wild-fitness.com`
2. En Cloudflare, agrega los registros con el prefijo `mail`
3. Actualiza el código para enviar desde: `noreply@mail.wild-fitness.com`

### Opción B: resend.wild-fitness.com

Similar al anterior, pero usando `resend.wild-fitness.com`

---

## 🛠️ Script de Verificación DNS

Voy a crear un script que verifica los registros DNS actuales:

```bash
#!/bin/bash
# Verificar registros DNS para Resend

DOMAIN="wild-fitness.com"  # O wildbreathing.com

echo "🔍 Verificando registros DNS para: $DOMAIN"
echo "================================================"
echo ""

echo "📧 Registros MX:"
dig MX $DOMAIN +short
echo ""

echo "📝 Registros TXT (SPF, DKIM, Verificación):"
dig TXT $DOMAIN +short
echo ""

echo "🔑 Registro DKIM de Resend:"
dig TXT resend._domainkey.$DOMAIN +short
echo ""

echo "🛡️ Registro DMARC:"
dig TXT _dmarc.$DOMAIN +short
echo ""

echo "✅ Si ves valores, los registros están configurados"
echo "❌ Si no ves nada, necesitas agregar los registros en Cloudflare"
```

---

## 🚨 Problemas Comunes y Soluciones

### Problema 1: "Dominio no verificado después de agregar registros"
**Causa**: Los cambios DNS pueden tardar en propagarse
**Solución**: 
- Espera 5-30 minutos
- Limpia cache DNS: `ipconfig /flushdns` (Windows) o `sudo dscacheutil -flushcache` (Mac)
- Verifica con: https://dnschecker.org

### Problema 2: "Registro TXT ya existe"
**Causa**: Ya tienes un registro TXT en `@` (por ejemplo, para Google Site Verification)
**Solución**: 
- Puedes tener múltiples registros TXT en el mismo nombre
- Agrega uno nuevo, no reemplaces el existente
- Cloudflare permite múltiples registros TXT

### Problema 3: "DKIM no verifica"
**Causa**: El valor DKIM es muy largo y puede tener problemas
**Solución**:
- Asegúrate de copiar el valor COMPLETO (puede tener 500+ caracteres)
- No agregues espacios ni saltos de línea
- El proxy de Cloudflare debe estar DESACTIVADO (gris, no naranja)

### Problema 4: "El proxy de Cloudflare interfiere"
**Causa**: El proxy naranja (☁️) no funciona con registros de email
**Solución**:
- Para TODOS los registros relacionados con email (TXT, MX, CNAME de email):
- Click en la nube naranja para ponerla GRIS
- "Proxy status" debe decir "DNS only"

---

## 📸 Necesito Ver Tu Configuración

Para ayudarte mejor, necesito saber:

### 1. ¿Qué dominio estás verificando en Resend?
- [ ] `wild-fitness.com`
- [ ] `wildbreathing.com`
- [ ] Otro: ___________

### 2. ¿Qué registros te pide Resend?
Copia aquí los registros que Resend te muestra (sin valores sensibles si prefieres).

### 3. ¿Qué error específico muestra Resend?
- [ ] "Domain not verified"
- [ ] "DKIM record not found"
- [ ] "SPF record not found"
- [ ] Otro: ___________

### 4. ¿Cuánto tiempo hace que agregaste los registros?
- [ ] Menos de 5 minutos
- [ ] 5-30 minutos
- [ ] Más de 30 minutos

---

## 🔧 Ayuda Inmediata

Ejecuta este comando para ver el estado actual de tu DNS:

```bash
cd /home/user/webapp && cat << 'SCRIPT' > check-dns.sh
#!/bin/bash
echo "🔍 Verificando DNS para Wild Fitness..."
echo ""
echo "📍 Dominio principal:"
dig wild-fitness.com +short
echo ""
echo "📧 Registros MX:"
dig MX wild-fitness.com +short
echo ""
echo "📝 Registros TXT:"
dig TXT wild-fitness.com +short
echo ""
echo "🔑 DKIM Resend:"
dig TXT resend._domainkey.wild-fitness.com +short
echo ""
echo "✅ Wildbreathing.com también:"
dig wildbreathing.com +short
echo ""
dig TXT wildbreathing.com +short
SCRIPT

chmod +x check-dns.sh
./check-dns.sh
```

---

## 💡 Solución Rápida: Usar Email Sandbox

Mientras verificas el dominio, puedes probar los emails usando el sandbox de Resend:

### En el código, temporalmente:

```javascript
// api/send-welcome-email.js - Línea ~7
const FROM_EMAIL = 'onboarding@resend.dev'; // Email de sandbox de Resend
```

Esto te permitirá:
- ✅ Probar que la API key funciona
- ✅ Ver los emails en el dashboard de Resend
- ❌ Pero solo recibirás emails en la dirección verificada en tu cuenta Resend

---

## 🎯 Siguiente Paso

**Dame más información sobre**:
1. ¿Qué dominio exactamente estás tratando de verificar?
2. ¿Qué mensaje de error específico ves en Resend?
3. ¿Ya agregaste los registros DNS en Cloudflare?

Con esa información puedo darte instrucciones más específicas.

---

**Última actualización**: 2026-01-28
**Estado**: ⚠️ Dominio pendiente de verificación en Resend
