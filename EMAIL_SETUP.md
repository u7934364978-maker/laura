# 📧 Configuración del Sistema de Envío de Emails
## Wild Fitness - Cloudflare + Resend

Este documento explica cómo configurar el sistema completo de envío de emails automáticos usando **Cloudflare Workers** y **Resend**.

---

## 🎯 Características del Sistema

### ✅ Funcionalidades
- ✉️ **Email de bienvenida** al rellenar formulario de contacto
- 📧 **Notificación al admin** con los datos del contacto
- 🎟️ **Confirmación de reserva** al apuntarse a una actividad
- 🎨 **Plantillas HTML** con diseño profesional
- 🚀 **Envío rápido** a través de Cloudflare Edge Network
- 🔐 **Seguro y confiable** con autenticación DKIM

### 💰 Costos
- **Cloudflare Workers**: Gratuito (100,000 requests/día)
- **Resend API**: Gratuito (3,000 emails/mes)
- **Total**: 100% GRATIS para el uso de Wild Fitness

---

## 🚀 Pasos de Configuración

### 1️⃣ Crear Cuenta en Resend

1. Ir a [https://resend.com/signup](https://resend.com/signup)
2. Crear cuenta con email de Laura
3. Verificar email

### 2️⃣ Verificar Dominio wild-fitness.com

#### En Resend:
1. Ir a **Domains** > **Add Domain**
2. Introducir: `wild-fitness.com`
3. Resend te dará los DNS records necesarios

#### En Cloudflare:
1. Ir al Dashboard de Cloudflare
2. Seleccionar dominio `wild-fitness.com`
3. Ir a **DNS** > **Records**
4. Añadir estos records (los valores exactos los da Resend):

```
Tipo: TXT
Nombre: @
Contenido: resend-verify=xxxxx...
TTL: Auto

Tipo: TXT  
Nombre: resend._domainkey
Contenido: p=MIGfMA0GCSq...
TTL: Auto

Tipo: MX
Nombre: @
Priority: 10
Contenido: mx.resend.com
TTL: Auto
```

5. Esperar ~15 minutos para propagación DNS
6. En Resend, hacer clic en **Verify Domain**

### 3️⃣ Obtener API Key de Resend

1. En Resend, ir a **API Keys**
2. Hacer clic en **Create API Key**
3. Nombre: `wild-fitness-production`
4. Permisos: **Full Access**
5. **¡COPIAR LA API KEY!** (solo se muestra una vez)
6. Guardar en lugar seguro (LastPass, 1Password, etc.)

### 4️⃣ Instalar Wrangler (CLI de Cloudflare)

En tu ordenador o servidor:

```bash
# Instalar Node.js si no lo tienes
# https://nodejs.org/

# Instalar Wrangler globalmente
npm install -g wrangler

# Verificar instalación
wrangler --version
```

### 5️⃣ Login en Cloudflare

```bash
wrangler login
```

Se abrirá el navegador para autorizar. Iniciar sesión con la cuenta de Cloudflare.

### 6️⃣ Configurar API Key como Secret

⚠️ **IMPORTANTE**: Nunca poner la API key directamente en el código

```bash
# Navegar al directorio del proyecto
cd /path/to/webapp

# Añadir el secret
wrangler secret put RESEND_API_KEY

# Cuando pregunte, pegar la API Key de Resend y presionar Enter
```

### 7️⃣ Deploy del Worker

```bash
# Desde el directorio del proyecto
wrangler deploy

# Salida esperada:
# ✨ Successfully deployed worker wild-fitness-email-worker
# 🌍 Available at:
#    https://wild-fitness-email-worker.tu-usuario.workers.dev
#    https://wild-fitness.com/api/*
```

### 8️⃣ Configurar Rutas en Cloudflare Dashboard

1. Ir a **Cloudflare Dashboard**
2. Seleccionar dominio `wild-fitness.com`
3. Ir a **Workers Routes**
4. Añadir ruta:
   - **Route**: `wild-fitness.com/api/*`
   - **Worker**: `wild-fitness-email-worker`
   - **Zone**: `wild-fitness.com`

---

## 🧪 Testing

### Probar en Local (Desarrollo)

```bash
# Ejecutar Worker localmente
wrangler dev

# El Worker estará en:
# http://localhost:8787/api/send-welcome-email
```

### Probar Email de Bienvenida

```bash
curl -X POST http://localhost:8787/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "tu-email@ejemplo.com",
    "phone": "+34600000000",
    "level": "🌱 Principiant",
    "message": "Mensaje de prueba"
  }'
```

### Probar Email de Confirmación de Reserva

```bash
curl -X POST http://localhost:8787/api/send-booking-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "booking": {
      "name": "Test User",
      "email": "tu-email@ejemplo.com",
      "phone": "+34600000000"
    },
    "activity": {
      "title": "Trail Running Test",
      "type": "Trail Running",
      "date": "2024-02-15",
      "time": "09:00",
      "location": "Parc Natural",
      "description": "Actividad de prueba"
    }
  }'
```

### Probar desde la Web

1. Abrir `wild-fitness.com`
2. Rellenar formulario de contacto
3. Verificar:
   - ✅ Email de bienvenida recibido
   - ✅ Notificación al admin (info@wild-fitness.com)
4. Ir al calendario y hacer una reserva
5. Verificar:
   - ✅ Email de confirmación recibido

---

## 📊 Monitorización

### Ver Logs en Cloudflare

```bash
# Ver logs en tiempo real
wrangler tail

# Ver logs recientes
wrangler tail --format=pretty
```

### Dashboard de Resend

1. Ir a [https://resend.com/emails](https://resend.com/emails)
2. Ver todos los emails enviados
3. Estadísticas de entrega
4. Logs de errores

---

## 🔧 Troubleshooting

### Problema: "Worker not found"
**Solución**: Verificar que el deploy fue exitoso
```bash
wrangler deploy
```

### Problema: "API key is invalid"
**Solución**: Volver a configurar el secret
```bash
wrangler secret put RESEND_API_KEY
```

### Problema: "Domain not verified"
**Solución**: 
1. Verificar DNS records en Cloudflare
2. Esperar propagación (hasta 48h, usualmente 15min)
3. Intentar verificar de nuevo en Resend

### Problema: "CORS error"
**Solución**: El Worker ya tiene configurado CORS. Verificar que la petición viene desde `wild-fitness.com`

### Problema: Emails no llegan
**Soluciones**:
1. Verificar en carpeta de SPAM
2. Revisar Dashboard de Resend para ver estado de envío
3. Verificar logs con `wrangler tail`
4. Comprobar que el email es válido

---

## 🔄 Actualizar el Worker

Si necesitas hacer cambios en `worker.js`:

```bash
# 1. Editar worker.js

# 2. Deploy de nuevo
wrangler deploy

# 3. Verificar cambios
wrangler tail
```

---

## 📝 Plantillas de Email

Las plantillas están en `worker.js` en el objeto `EmailTemplates`:

- `welcome`: Email de bienvenida
- `contactNotification`: Notificación al admin
- `bookingConfirmation`: Confirmación de reserva

Para modificar el contenido HTML de los emails, editar estas funciones en `worker.js`.

---

## 🔐 Seguridad

### Buenas Prácticas Implementadas

✅ **API Key como Secret**: No está en el código
✅ **CORS configurado**: Solo acepta peticiones de wild-fitness.com
✅ **Validación de datos**: Verifica campos requeridos
✅ **Rate limiting**: Cloudflare protege contra abuso
✅ **DKIM/SPF**: Configurado automáticamente por Resend

---

## 💡 Notas Adicionales

### Email de Remitente
Actualmente configurado como:
```
Wild Fitness <noreply@wild-fitness.com>
```

Para cambiar, editar `CONFIG.fromEmail` en `worker.js`.

### Email del Admin
```
info@wild-fitness.com
```

Para cambiar, editar `CONFIG.adminEmail` en `worker.js`.

### Límites del Plan Gratuito

**Resend Free Tier:**
- 3,000 emails/mes
- 100 emails/día
- ✅ Suficiente para Wild Fitness

Si se supera, upgrade a plan Pro ($20/mes para 50,000 emails).

---

## 📞 Soporte

- **Resend Docs**: https://resend.com/docs
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

---

## ✅ Checklist de Configuración

- [ ] Cuenta en Resend creada
- [ ] Dominio wild-fitness.com verificado en Resend
- [ ] DNS records configurados en Cloudflare
- [ ] API Key de Resend obtenida
- [ ] Wrangler instalado
- [ ] Login en Cloudflare completado
- [ ] Secret RESEND_API_KEY configurado
- [ ] Worker deployado
- [ ] Rutas configuradas en Cloudflare
- [ ] Tests de email realizados
- [ ] Email de bienvenida funciona
- [ ] Email de confirmación de reserva funciona
- [ ] Notificaciones al admin funcionan

---

**¡Sistema listo para producción!** 🎉
