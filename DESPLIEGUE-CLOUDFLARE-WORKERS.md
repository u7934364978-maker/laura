# ☁️ Despliegue con Cloudflare Workers - Wild Fitness

## 🎯 Alternativa a Vercel

Esta guía te muestra cómo desplegar el formulario de contacto usando **Cloudflare Workers** en lugar de Vercel. Cloudflare Workers es una excelente opción si ya usas Cloudflare para tu DNS.

---

## ✅ Ventajas de Cloudflare Workers

| Característica | Cloudflare Workers | Vercel |
|----------------|-------------------|--------|
| **Requests gratis/día** | 100,000 | ~100,000 (indirecto) |
| **Latencia** | Ultra baja (red Cloudflare) | Baja |
| **Integración DNS** | Nativa (ya usas Cloudflare) | Externa |
| **Precio** | $5/mes (10M requests) | $20/mes (funciones) |
| **Facilidad** | Media | Alta |

---

## 📋 Requisitos Previos

Antes de empezar necesitas:

- [ ] Cuenta en Cloudflare (gratis)
- [ ] Node.js instalado (v16 o superior)
- [ ] npm instalado
- [ ] API Key de Resend (obtenida previamente)
- [ ] Credenciales de Supabase (ya configuradas)

---

## 🚀 PASO 1: Instalar Wrangler CLI

Wrangler es la herramienta de línea de comandos para Cloudflare Workers.

### 1.1. Instalar Wrangler globalmente

```bash
npm install -g wrangler
```

### 1.2. Iniciar sesión en Cloudflare

```bash
wrangler login
```

Esto abrirá tu navegador para autenticarte con Cloudflare.

### 1.3. Verificar instalación

```bash
wrangler --version
```

---

## 📂 PASO 2: Navegar al directorio del Worker

El Worker ya está creado en el proyecto:

```bash
cd workers/contact-form
```

**Archivos incluidos:**
- `index.js` - Código del Worker (ya creado)
- `wrangler.toml` - Configuración (ya creado)
- `package.json` - Dependencias (ya creado)

---

## 🔑 PASO 3: Configurar Variables de Entorno

### 3.1. Configurar Secrets vía CLI

Los secrets son variables encriptadas que solo el Worker puede leer.

**Secret 1: RESEND_API_KEY**
```bash
wrangler secret put RESEND_API_KEY
```
Cuando te pida el valor, pega tu API Key de Resend (empieza con `re_...`)

**Secret 2: SUPABASE_URL**
```bash
wrangler secret put SUPABASE_URL
```
Ingresa: `https://remyvruwpvvcestvjlsa.supabase.co`

**Secret 3: SUPABASE_KEY**
```bash
wrangler secret put SUPABASE_KEY
```
Ingresa tu Supabase anon key (la que está en `supabase-config.js`)

### 3.2. Configurar Secrets vía Dashboard (Alternativa)

Si prefieres usar el dashboard de Cloudflare:

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages** (menú izquierdo)
3. Haz clic en tu Worker después de desplegarlo
4. **Settings** → **Variables**
5. **Add variable** → Selecciona **"Encrypt"**
6. Agrega las 3 variables:
   - `RESEND_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

---

## 🧪 PASO 4: Probar Localmente (Opcional)

Antes de desplegar a producción, puedes probar localmente:

### 4.1. Instalar dependencias

```bash
npm install
```

### 4.2. Iniciar servidor de desarrollo

```bash
npm run dev
```

O con wrangler directamente:
```bash
wrangler dev
```

### 4.3. Probar el Worker

El Worker estará disponible en: `http://localhost:8787`

Puedes probar enviando una petición POST:

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "640915772",
    "message": "Mensaje de prueba"
  }'
```

---

## 🚀 PASO 5: Desplegar a Producción

### 5.1. Desplegar el Worker

Desde el directorio `workers/contact-form`:

```bash
wrangler deploy
```

O con npm:
```bash
npm run deploy
```

### 5.2. Obtener la URL del Worker

Después del despliegue, Wrangler te mostrará la URL:

```
✨ Success! Deployed wild-fitness-contact-form
🌍 https://wild-fitness-contact-form.TUUSUARIO.workers.dev
```

**¡Copia esta URL!** La necesitarás en el siguiente paso.

---

## 🔗 PASO 6: Configurar la URL en tu Web

### 6.1. Editar config.js

Abre el archivo `config.js` en la raíz del proyecto y descomenta la línea:

```javascript
// Antes (comentado - usa Vercel):
// window.CONTACT_API_URL = 'https://wild-fitness-contact-form.TUUSUARIO.workers.dev';

// Después (descomentado - usa Cloudflare Workers):
window.CONTACT_API_URL = 'https://wild-fitness-contact-form.TUUSUARIO.workers.dev';
```

Reemplaza `TUUSUARIO` con tu usuario real de Cloudflare.

### 6.2. Desplegar los cambios

Si usas **Vercel** para el sitio web:
```bash
git add config.js
git commit -m "feat: Configure Cloudflare Workers URL for contact form"
git push
```

Vercel redespliegará automáticamente con la nueva configuración.

Si usas **Cloudflare Pages**:
```bash
wrangler pages publish . --project-name wild-fitness
```

---

## 🌐 PASO 7: Configurar Custom Domain (Opcional)

Puedes hacer que el Worker esté disponible en tu propio dominio.

### 7.1. Agregar ruta personalizada

Edita `workers/contact-form/wrangler.toml`:

```toml
[[routes]]
pattern = "wild-fitness.com/api/contact"
zone_name = "wild-fitness.com"
```

### 7.2. Redesplegar

```bash
wrangler deploy
```

### 7.3. Actualizar config.js

```javascript
window.CONTACT_API_URL = 'https://wild-fitness.com/api/contact';
```

---

## 🧪 PASO 8: Probar el Formulario

### 8.1. Acceder al formulario

Ve a: https://wild-fitness.com/contacte.html

### 8.2. Enviar datos de prueba

Llena el formulario con **tu email real**:
- Nombre: Tu nombre
- Email: tu-email@gmail.com
- Teléfono: tu número
- Mensaje: "Prueba del formulario con Cloudflare Workers"

### 8.3. Verificar funcionamiento

Deberías recibir:
1. ✅ **Email de bienvenida** en tu inbox (de Resend)
2. ✅ **Email de notificación** en info@wild-fitness.com
3. ✅ **Registro en Supabase** (Table Editor → contact_submissions)

---

## 📊 PASO 9: Monitorear el Worker

### 9.1. Ver logs en tiempo real

```bash
wrangler tail
```

O con npm:
```bash
npm run tail
```

### 9.2. Ver métricas en Dashboard

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages**
3. Haz clic en tu Worker
4. Ve a **Metrics**

Verás:
- Requests por segundo
- Errores
- Latencia
- CPU time

### 9.3. Ver logs de ejecución

En el dashboard, ve a **Logs** → **Real-time Logs**

---

## 🐛 Solución de Problemas

### ❌ Error: "wrangler: command not found"

**Causa:** Wrangler no está instalado globalmente.

**Solución:**
```bash
npm install -g wrangler
```

### ❌ Error: "Authentication required"

**Causa:** No has iniciado sesión en Cloudflare.

**Solución:**
```bash
wrangler login
```

### ❌ Error: "Secret RESEND_API_KEY is not set"

**Causa:** No has configurado los secrets.

**Solución:**
```bash
wrangler secret put RESEND_API_KEY
```

### ❌ Error: "CORS policy blocked"

**Causa:** El Worker tiene CORS configurado con `*`, pero puede haber problemas.

**Solución:**
Edita `workers/contact-form/index.js` y cambia:

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://wild-fitness.com',  // Específico
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### 📧 Emails no llegan

**Verificar:**
1. ✅ DNS de Resend configurados correctamente
2. ✅ Secret `RESEND_API_KEY` configurado
3. ✅ Ver logs: `wrangler tail`
4. ✅ Ver emails en: https://resend.com/emails

---

## 💰 Costos y Límites

### Plan Gratuito de Cloudflare Workers

| Recurso | Límite Gratuito | Suficiente para |
|---------|-----------------|-----------------|
| **Requests** | 100,000/día | ~3,000,000/mes |
| **CPU Time** | 10ms por request | Formulario simple ✅ |
| **Workers** | Ilimitados | Todos los que necesites |
| **Cron Triggers** | 3 programados | Tareas periódicas |

### Plan de Pago ($5/mes)

- **10,000,000 requests/mes**
- **30s CPU time** por request
- **Soporte prioritario**

**Para Wild Fitness:** El plan gratuito es más que suficiente (100-200 formularios/mes estimados).

---

## 🔄 Actualizar el Worker

### Cambiar código

1. Edita `workers/contact-form/index.js`
2. Guarda los cambios
3. Despliega nuevamente:

```bash
cd workers/contact-form
wrangler deploy
```

### Actualizar secrets

```bash
wrangler secret put NOMBRE_DEL_SECRET
```

---

## 📊 Comparación: Vercel vs Cloudflare Workers

| Aspecto | Vercel | Cloudflare Workers |
|---------|--------|-------------------|
| **Configuración** | ⭐⭐⭐⭐⭐ Muy fácil | ⭐⭐⭐ Media |
| **Integración Git** | ✅ Automática | ⚠️ Manual (wrangler) |
| **Rendimiento** | ⭐⭐⭐⭐ Rápido | ⭐⭐⭐⭐⭐ Ultra rápido |
| **Requests gratis** | ~100k/mes | 100k/día (3M/mes) |
| **Integración DNS** | ⚠️ Externa | ✅ Nativa Cloudflare |
| **Logs** | ✅ Dashboard | ✅ Dashboard + CLI |
| **Costo escala** | $20/mes | $5/mes |

---

## ✅ Checklist Final

Antes de considerar la migración completa:

- [ ] Wrangler CLI instalado y autenticado
- [ ] Worker desplegado exitosamente
- [ ] Secrets configurados (RESEND_API_KEY, SUPABASE_URL, SUPABASE_KEY)
- [ ] DNS de Resend verificados en Cloudflare
- [ ] URL del Worker configurada en `config.js`
- [ ] Sitio web redespliegado con la nueva configuración
- [ ] Formulario probado y funciona correctamente
- [ ] Email de bienvenida recibido
- [ ] Email de notificación recibido en info@wild-fitness.com
- [ ] Datos guardados en Supabase
- [ ] Logs monitoreados sin errores

---

## 🔗 Links Útiles

- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Workers & Pages:** https://dash.cloudflare.com/?to=/:account/workers
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Workers Examples:** https://developers.cloudflare.com/workers/examples/
- **Resend Dashboard:** https://resend.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## 🎓 Comandos de Referencia Rápida

```bash
# Instalar Wrangler
npm install -g wrangler

# Iniciar sesión
wrangler login

# Desarrollo local
cd workers/contact-form
wrangler dev

# Desplegar
wrangler deploy

# Ver logs en tiempo real
wrangler tail

# Configurar secret
wrangler secret put NOMBRE_SECRET

# Ver lista de Workers
wrangler list

# Eliminar Worker
wrangler delete wild-fitness-contact-form
```

---

**¡Listo! Ahora tu formulario de contacto funciona con Cloudflare Workers. 🎉**

*Si tienes problemas, consulta la sección de Solución de Problemas o revisa los logs con `wrangler tail`.*

---

*Última actualización: Enero 2026*
