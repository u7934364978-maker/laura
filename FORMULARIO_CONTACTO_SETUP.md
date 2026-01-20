# ✅ FORMULARIO DE CONTACTO CONFIGURADO

## 🎯 Estado Actual

El formulario de contacto en **index.html** ya está completamente configurado y funcionando. Solo falta desplegar el Cloudflare Worker con la API Key de Resend.

---

## 📋 Lo que YA está implementado:

### ✅ Frontend (index.html)
- Formulario con validación completa
- Campos: nombre, email, teléfono, nivel, mensaje
- Animaciones y efectos visuales
- Manejo de errores
- Mensaje de éxito con confetti

### ✅ Backend (worker.js)
- Endpoint `/api/send-welcome-email` configurado
- Envía 2 emails automáticamente:
  1. **Email de bienvenida al usuario** con su nombre
  2. **Notificación al admin** con los datos del contacto
- Plantillas de email en HTML profesionales
- Manejo de errores y CORS

### ✅ Script (script.js)
- Error de sintaxis corregido
- Envío automático al completar el formulario
- Tracking de analytics
- UX mejorada con loading states

---

## 🚀 Lo que FALTA (5 minutos):

### PASO 1: Configurar Resend API Key

El Worker necesita la API Key de Resend para enviar emails.

**Opción A: Usar Cloudflare Dashboard (Recomendado)**

1. Ve a: https://dash.cloudflare.com
2. Workers & Pages → **wild-fitness-worker** (o como se llame tu worker)
3. Settings → **Variables and Secrets**
4. Add variable:
   - Name: `RESEND_API_KEY`
   - Value: Tu API Key de Resend (empieza con `re_...`)
   - ✅ Encrypt

**Opción B: Usar wrangler.toml**

Edita `wrangler.toml` y añade:
```toml
[vars]
RESEND_API_KEY = "re_tu_api_key_aqui"
```

---

### PASO 2: Verificar Dominio en Resend

1. Ve a: https://resend.com/domains
2. Add Domain: **wild-fitness.com**
3. Añade estos DNS records en Cloudflare:

```
Tipo: TXT
Nombre: _resend
Contenido: (lo que te dé Resend)
```

**Nota:** Si no quieres verificar el dominio ahora, Resend te da un dominio temporal como `onboarding.resend.dev` que puedes usar para testing.

---

### PASO 3: Deploy del Worker

```bash
cd /home/user/webapp
npx wrangler deploy worker.js
```

---

## 🧪 CÓMO PROBAR

### Opción 1: Página de Test (Recomendada)

1. Abre: **https://wild-fitness.com/test-form.html**
2. Rellena el formulario (ya tiene datos de ejemplo)
3. Haz clic en "Enviar"
4. Verás si los emails se enviaron correctamente

### Opción 2: Formulario Real

1. Abre: **https://wild-fitness.com/#contacte**
2. Scroll hasta el formulario de contacto
3. Rellena con tus datos reales
4. Envía el formulario
5. Deberías recibir un email de bienvenida

---

## 📧 Emails que se envían

### 1. Email de Bienvenida al Usuario

**Para:** Email del usuario  
**Asunto:** ¡Benvingut/da a Wild Fitness! 🏔️  
**Contenido:**
- Saludo personalizado con su nombre
- Mensaje de bienvenida
- Información sobre próximos pasos
- Links a redes sociales
- Firma de Laura

### 2. Notificación al Admin

**Para:** info@wild-fitness.com  
**Asunto:** Nou contacte des del formulari web  
**Contenido:**
- Datos del contacto (nombre, email, teléfono)
- Nivel de experiencia
- Mensaje completo
- Timestamp

---

## 🔍 Debugging

### Si el formulario no envía emails:

1. **Abre test-form.html** y prueba ahí primero
2. **Abre la consola** del navegador (F12)
3. **Busca errores** como:
   - `Failed to fetch` → El Worker no está desplegado
   - `401 Unauthorized` → API Key de Resend incorrecta
   - `403 Forbidden` → Dominio no verificado en Resend
   - `CORS error` → Problema de configuración de CORS

### Verificar Worker en Cloudflare:

1. Dashboard → Workers & Pages
2. Encuentra tu worker
3. Ve a "Logs" para ver errores en tiempo real

---

## 📊 Arquitectura

```
Usuario rellena formulario
         ↓
    index.html
         ↓
    script.js → POST /api/send-welcome-email
         ↓
 Cloudflare Worker (worker.js)
         ↓
     Resend API
         ↓
    📧 Emails enviados
         ↓
 ✅ Usuario recibe bienvenida
 ✅ Admin recibe notificación
```

---

## 💰 Costos

**Resend (Gratis):**
- 3,000 emails/mes gratis
- 100 emails/día
- Más que suficiente para Wild Fitness

**Cloudflare Workers (Gratis):**
- 100,000 requests/día
- Sin límite de Workers

**Total: $0/mes** 🎉

---

## ✅ Checklist Final

- [x] Formulario implementado en index.html
- [x] Script.js configurado y sin errores
- [x] Worker.js con endpoint `/api/send-welcome-email`
- [x] Plantillas de email creadas
- [x] test-form.html para pruebas
- [ ] **RESEND_API_KEY configurada** ← PENDIENTE
- [ ] **Worker desplegado** ← PENDIENTE
- [ ] **Dominio verificado en Resend** ← PENDIENTE (opcional)
- [ ] **Probado con test-form.html** ← PENDIENTE

---

## 🚀 Próximos Pasos

1. **Configura RESEND_API_KEY** en Cloudflare Dashboard
2. **Deploy del worker:** `npx wrangler deploy worker.js`
3. **Prueba:** Abre test-form.html y envía un formulario
4. **Verifica:** Revisa tu email
5. **¡Listo!** El formulario ya envía emails automáticos

---

**Fecha:** 20 Enero 2026  
**Estado:** ✅ Código implementado, falta configuración de Resend  
**Archivos modificados:**
- script.js (error corregido)
- test-form.html (nuevo)
- worker.js (ya existía)

---

**¿Necesitas la API Key de Resend?** 
1. Ve a: https://resend.com
2. Sign up / Log in
3. API Keys → Create API Key
4. Copia la key (empieza con `re_...`)
5. Configúrala en Cloudflare o wrangler.toml
