# 🚀 Comandos de Deployment - Wild Fitness

## ⚠️ EJECUTAR EN TU TERMINAL LOCAL (NO EN EL SANDBOX)

Estos comandos deben ejecutarse en tu máquina local donde tienes acceso a Cloudflare.

---

## 📋 Pre-requisitos

- ✅ Cuenta de Cloudflare creada
- ✅ Dominio `wild-fitness.com` configurado en Cloudflare
- ✅ Cuenta de Resend creada (https://resend.com/signup)
- ✅ Dominio verificado en Resend
- ✅ DNS configurado (ver `DNS_SETUP_GUIDE.md`)

---

## 🔧 Setup Inicial (Solo una vez)

### **1. Instalar Wrangler**

```bash
npm install -g wrangler
```

### **2. Login a Cloudflare**

```bash
wrangler login
```

Esto abrirá tu navegador para autenticarte.

### **3. Verificar autenticación**

```bash
wrangler whoami
```

Deberías ver tu cuenta de Cloudflare.

---

## 🗂️ Crear KV Namespace

```bash
# Navegar al directorio del proyecto
cd /ruta/a/tu/proyecto

# Crear el KV namespace
wrangler kv namespace create ACTIVITIES_KV
```

**Salida esperada:**
```
🌀 Creating namespace with title "wild-fitness-ACTIVITIES_KV"
✨ Success!

[[kv_namespaces]]
binding = "ACTIVITIES_KV"
id = "abc123def456ghi789"
```

**🚨 IMPORTANTE:**
1. **Copia el `id`** (ej: `abc123def456ghi789`)
2. **Edita ambos archivos:**

**Archivo 1: `wrangler.toml` (línea ~25)**
```toml
[[kv_namespaces]]
binding = "ACTIVITIES_KV"
id = "abc123def456ghi789"  # ← PEGA TU ID AQUÍ
```

**Archivo 2: `wrangler-scheduled.toml` (línea ~34)**
```toml
[[kv_namespaces]]
binding = "ACTIVITIES_KV"
id = "abc123def456ghi789"  # ← EL MISMO ID AQUÍ
```

---

## 🔐 Configurar Secrets

### **Obtener API Key de Resend**

1. Ve a https://resend.com/api-keys
2. Click en "Create API Key"
3. Nombre: `wild-fitness-production`
4. Permisos: **Full Access**
5. Copia la API Key (solo se muestra una vez)

### **Configurar en Worker Principal**

```bash
wrangler secret put RESEND_API_KEY
```

Te pedirá que pegues la API Key. **Pégala y presiona Enter.**

### **Configurar en Worker Programado**

```bash
wrangler secret put RESEND_API_KEY --config wrangler-scheduled.toml
```

Te pedirá que pegues la API Key nuevamente. **Pega la MISMA API Key.**

---

## 🚀 Deploy de los Workers

### **1. Deploy Worker Principal (Emails inmediatos + Sincronización)**

```bash
wrangler deploy
```

**Salida esperada:**
```
⛅️ wrangler 4.x.x
------------------
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded wild-fitness-email-worker (x.xx sec)
Published wild-fitness-email-worker (x.xx sec)
  https://wild-fitness-email-worker.tu-usuario.workers.dev
Current Deployment ID: xxxx-xxxx-xxxx-xxxx
```

### **2. Deploy Worker Programado (Recordatorios con Cron)**

```bash
wrangler deploy --config wrangler-scheduled.toml
```

**Salida esperada:**
```
⛅️ wrangler 4.x.x
------------------
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded wild-fitness-scheduled-emails (x.xx sec)
Published wild-fitness-scheduled-emails (x.xx sec)
  https://wild-fitness-scheduled-emails.tu-usuario.workers.dev
  Schedule: 0 9 * * *
Current Deployment ID: xxxx-xxxx-xxxx-xxxx
```

---

## 🌐 Configurar Rutas en Cloudflare

### **Opción A: Desde el Dashboard (Recomendado)**

1. Ve a https://dash.cloudflare.com/
2. Selecciona tu cuenta → **Workers & Pages**
3. Click en **`wild-fitness-email-worker`**
4. Pestaña **Triggers** → Sección **Routes**
5. Click **Add Route**
6. Configurar:
   - **Route:** `wild-fitness.com/api/*`
   - **Zone:** `wild-fitness.com`
   - **Worker:** `wild-fitness-email-worker`
7. Click **Save**

### **Opción B: Desde Wrangler**

Edita `wrangler.toml` y descomenta (si está comentado):

```toml
routes = [
  { pattern = "wild-fitness.com/api/*", zone_name = "wild-fitness.com" }
]
```

Luego re-deploy:

```bash
wrangler deploy
```

---

## ✅ Verificación Post-Deployment

### **1. Verificar Workers en Dashboard**

Ve a: https://dash.cloudflare.com/ → **Workers & Pages**

Deberías ver:
- ✅ **wild-fitness-email-worker** (Estado: Active)
- ✅ **wild-fitness-scheduled-emails** (Estado: Active)

### **2. Verificar Cron Trigger**

Click en **`wild-fitness-scheduled-emails`** → Pestaña **Triggers**

Deberías ver:
- **Cron Triggers:** `0 9 * * *`
- **Next Scheduled Run:** (fecha y hora)

### **3. Verificar KV Binding**

Click en cualquier worker → Pestaña **Settings** → **Variables**

Deberías ver:
- `ACTIVITIES_KV` (tipo: KV Namespace)
- `RESEND_API_KEY` (tipo: Secret, valor oculto)

### **4. Verificar Rutas**

Click en **`wild-fitness-email-worker`** → Pestaña **Triggers** → **Routes**

Deberías ver:
- `wild-fitness.com/api/*`

---

## 🧪 Testing

### **Test 1: Email de Bienvenida**

```bash
curl -X POST https://wild-fitness.com/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Usuario",
    "email": "tu-email@example.com",
    "message": "Esto es una prueba",
    "level": "Intermedi"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "welcomeEmailSent": true,
  "notificationSent": true
}
```

Verifica que recibes el email en `tu-email@example.com`.

### **Test 2: Sincronización de Actividades**

```bash
curl -X POST https://wild-fitness.com/api/sync-activities \
  -H "Content-Type: application/json" \
  -d '{
    "activities": [
      {
        "id": 1737400000000,
        "title": "Trail Running Test",
        "type": "trail",
        "date": "2026-01-25",
        "time": "08:00",
        "location": "Parc de Prueba",
        "latitude": 42.123,
        "longitude": 2.456,
        "capacity": 10,
        "enrolled": 0,
        "description": "Actividad de prueba",
        "participants": []
      }
    ]
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "1 actividades sincronizadas",
  "count": 1
}
```

### **Test 3: Verificar Datos en KV**

```bash
wrangler kv key get --namespace-id=TU_KV_ID wild_fitness_activities
```

Reemplaza `TU_KV_ID` con el ID de tu namespace.

Deberías ver el JSON de las actividades.

### **Test 4: Recordatorios Manuales**

```bash
curl -X POST https://wild-fitness-scheduled-emails.tu-usuario.workers.dev/test-reminders
```

Reemplaza `tu-usuario` con tu subdomain de Cloudflare Workers.

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "X recordatorios enviados para Y actividades",
  "result": {
    "sent": 0,
    "activities": 0
  }
}
```

(Si no hay actividades para mañana, `sent` y `activities` serán 0)

---

## 📊 Monitoreo

### **Ver Logs en Tiempo Real**

**Worker Principal:**
```bash
wrangler tail
```

**Worker Programado:**
```bash
wrangler tail --config wrangler-scheduled.toml
```

### **Ver Estadísticas**

Dashboard → Workers → (seleccionar worker) → Pestaña **Metrics**

Verás:
- Requests
- Errors
- Duration
- CPU Time

### **Ver Historial de Emails en Resend**

https://resend.com/emails

Verás todos los emails enviados con:
- Estado (Delivered, Opened, etc.)
- Fecha y hora
- Destinatario
- Asunto

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios en el código:

```bash
# 1. Hacer cambios en worker.js o scheduled-worker.js

# 2. Deploy worker principal (si modificaste worker.js)
wrangler deploy

# 3. Deploy worker programado (si modificaste scheduled-worker.js)
wrangler deploy --config wrangler-scheduled.toml
```

---

## 🆘 Troubleshooting

### **Error: "Not authorized"**

```bash
wrangler logout
wrangler login
```

### **Error: "KV namespace not found"**

Verifica que el `id` en `wrangler.toml` y `wrangler-scheduled.toml` es correcto:

```bash
wrangler kv namespace list
```

Busca el namespace `ACTIVITIES_KV` y copia su ID.

### **Error: "Route already exists"**

La ruta ya está configurada. Verifica en:
Dashboard → Workers → Triggers → Routes

### **Cron no se ejecuta**

1. Verifica en Dashboard → Workers → `wild-fitness-scheduled-emails` → Triggers
2. Asegúrate que el cron aparece: `0 9 * * *`
3. Re-deploy: `wrangler deploy --config wrangler-scheduled.toml`

### **Emails no se envían**

1. Verifica API Key de Resend:
   ```bash
   wrangler secret put RESEND_API_KEY
   wrangler secret put RESEND_API_KEY --config wrangler-scheduled.toml
   ```

2. Verifica dominio en Resend: https://resend.com/domains
   - Estado debe ser: ✅ Verified

3. Ver logs:
   ```bash
   wrangler tail
   ```

---

## 📝 Checklist Final

- [ ] Wrangler instalado y login completado
- [ ] KV Namespace creado
- [ ] ID del KV copiado en `wrangler.toml` y `wrangler-scheduled.toml`
- [ ] API Key de Resend configurada en ambos workers
- [ ] Worker principal deployado
- [ ] Worker programado deployado
- [ ] Ruta configurada: `wild-fitness.com/api/*`
- [ ] Cron visible en Dashboard (0 9 * * *)
- [ ] Test de email de bienvenida exitoso
- [ ] Test de sincronización exitoso
- [ ] Datos visibles en KV
- [ ] Logs funcionando correctamente

---

## 🎉 ¡Deployment Completo!

Una vez completados todos los pasos, el sistema estará:

- ✅ Enviando emails de bienvenida automáticamente
- ✅ Enviando confirmaciones de reserva
- ✅ Sincronizando actividades del frontend al KV
- ✅ Ejecutando recordatorios todos los días a las 10:00 AM
- ✅ Enviando resúmenes al admin
- ✅ Todo funcionando **100% gratis**

---

## 📚 Recursos

- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)
- [KV Docs](https://developers.cloudflare.com/kv/)
- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Resend Docs](https://resend.com/docs)

---

**¿Necesitas ayuda?** Consulta:
- `SCHEDULED_EMAIL_SETUP.md` - Guía detallada
- `EMAIL_SETUP.md` - Setup de emails básicos
- `DNS_SETUP_GUIDE.md` - Configuración DNS
