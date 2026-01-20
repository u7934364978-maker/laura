# 📧 Sistema de Emails Programados - Wild Fitness

## 📋 Resumen

Sistema automático de envío de emails usando **Cloudflare Workers con Cron Triggers** (100% gratuito).

### ✨ Funcionalidades

✅ **Recordatorios automáticos** 24 horas antes de cada actividad  
✅ **Ejecuta diariamente** a las 10:00 AM (hora de España)  
✅ **Email personalizado** para cada participante con:
- Detalles de la actividad (fecha, hora, ubicación)
- Enlace a Google Maps (si hay coordenadas)
- Lista de qué llevar
- Botón de contacto directo con Laura

✅ **Resumen al admin** con estadísticas de envío  
✅ **Notificación de errores** al admin si algo falla  

---

## 💰 Costos

### ✅ 100% GRATUITO

| Servicio | Plan Gratuito | Wild Fitness |
|----------|---------------|--------------|
| **Cloudflare Workers** | 100,000 requests/día | ✅ Incluye Cron Triggers |
| **KV Storage** | 1 GB + 100k reads/día | ✅ Solo usamos ~10 KB |
| **Resend API** | 3,000 emails/mes | ✅ ~60 emails/mes estimado |

**Total: $0/mes** 🎉

---

## 🚀 Configuración Paso a Paso

### **Paso 1: Instalar Wrangler (si no está instalado)**

```bash
npm install -g wrangler
```

### **Paso 2: Login a Cloudflare**

```bash
wrangler login
```

Esto abrirá el navegador para autenticarte.

### **Paso 3: Crear KV Namespace**

El KV (Key-Value) es donde se almacenan las actividades para que el Worker pueda acceder a ellas.

```bash
wrangler kv namespace create ACTIVITIES_KV
```

**Ejemplo de salida:**
```
🌀 Creating namespace with title "wild-fitness-scheduled-emails-ACTIVITIES_KV"
✨ Success! Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "ACTIVITIES_KV"
id = "abcd1234567890efgh"
```

**⚠️ IMPORTANTE:** Copia el `id` que te devuelve y pégalo en **DOS ARCHIVOS**:

1. **`wrangler-scheduled.toml`** línea 34:
```toml
[[kv_namespaces]]
binding = "ACTIVITIES_KV"
id = "abcd1234567890efgh"  # ← Pega aquí tu ID
```

2. **`wrangler.toml`** línea 25:
```toml
[[kv_namespaces]]
binding = "ACTIVITIES_KV"
id = "abcd1234567890efgh"  # ← El MISMO ID aquí también
```

**💡 Nota:** El mismo KV se usa en ambos workers:
- `worker.js` (principal) - Para recibir sincronizaciones desde el frontend
- `scheduled-worker.js` (cron) - Para leer actividades y enviar recordatorios

### **Paso 4: Configurar Resend API Key**

Si aún no has configurado la API Key de Resend:

```bash
npx wrangler secret put RESEND_API_KEY --config wrangler-scheduled.toml
```

Te pedirá que pegues tu API Key de Resend (obtenida desde https://resend.com/api-keys).

### **Paso 5: Deploy del Worker Programado**

```bash
cd /home/user/webapp
npx wrangler deploy --config wrangler-scheduled.toml
```

**Salida esperada:**
```
⛅️ wrangler 3.x.x
------------------
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded wild-fitness-scheduled-emails (x.xx sec)
Published wild-fitness-scheduled-emails (x.xx sec)
  https://wild-fitness-scheduled-emails.tu-usuario.workers.dev
  Schedule: 0 9 * * *
Current Deployment ID: abcd-1234-efgh-5678
```

### **Paso 6: Verificar en Cloudflare Dashboard**

1. Ve a https://dash.cloudflare.com/
2. **Workers & Pages** → Busca `wild-fitness-scheduled-emails`
3. Pestaña **Triggers** → Deberías ver:
   - **Cron Triggers:** `0 9 * * *` (cada día a las 9:00 UTC)
4. Pestaña **Settings** → **Variables** → Verifica:
   - `RESEND_API_KEY` (secreto, oculto)
   - `ACTIVITIES_KV` (KV binding)

---

## 🔄 Sincronización de Actividades

Las actividades del calendario web (localStorage) deben sincronizarse con el KV de Cloudflare.

### **Opción A: Sincronización Automática (Recomendada)**

El código del frontend (`calendari.js`) ya está configurado para sincronizar automáticamente cada vez que se crea o elimina una actividad.

**Cómo funciona:**
1. Usuario admin crea/elimina actividad en `/calendari.html`
2. Se guarda en `localStorage` (navegador)
3. **Automáticamente** se envía al Worker principal (`worker.js`)
4. Worker sincroniza con KV Storage
5. Worker programado lee desde KV para enviar recordatorios

**Endpoint de sincronización:**
```
POST https://wild-fitness.com/api/sync-activities
Content-Type: application/json

{
  "activities": [ ... array de actividades ... ]
}
```

### **Opción B: Sincronización Manual**

Si necesitas sincronizar manualmente (ej. migración inicial):

```bash
# 1. Exportar actividades desde el navegador (consola JavaScript)
localStorage.getItem('wild_fitness_activities')

# 2. Copiar el JSON y guardarlo en activities.json

# 3. Subir a KV
wrangler kv key put --namespace-id=TU_KV_ID wild_fitness_activities --path=activities.json
```

**Nota:** Reemplaza `TU_KV_ID` con el ID del namespace que obtuviste en el Paso 3.

---

## 🧪 Probar el Sistema

### **Prueba Manual de Recordatorios**

```bash
curl -X POST https://wild-fitness-scheduled-emails.tu-usuario.workers.dev/test-reminders
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "3 recordatorios enviados para 2 actividades",
  "result": {
    "sent": 3,
    "activities": 2
  }
}
```

### **Ver Logs en Tiempo Real**

```bash
npx wrangler tail --config wrangler-scheduled.toml
```

Esto mostrará los logs cuando se ejecute el cron o cuando pruebes manualmente.

### **Crear Actividad de Prueba**

1. Ve a https://wild-fitness.com/calendari.html
2. Login como admin (`admin` / `WildFitness2024!`)
3. Crea una actividad para **mañana**
4. Añade un participante con tu email
5. Espera hasta las 10:00 AM del día de hoy para recibir el recordatorio automáticamente

O prueba manualmente con el endpoint `/test-reminders`.

---

## 📊 Monitoreo

### **Ver Estadísticas de Ejecución**

1. Cloudflare Dashboard → Workers → `wild-fitness-scheduled-emails`
2. Pestaña **Metrics**:
   - Requests (cron executions)
   - Errors
   - CPU time
   - KV reads

### **Recibir Resumen Diario**

El admin (`info@wild-fitness.com`) recibirá automáticamente un email cada vez que se envíen recordatorios:

**Asunto:** `📊 Resumen: X recordatorios enviados`

**Contenido:**
- Número de emails enviados
- Número de actividades procesadas
- Fecha y hora del envío

### **Notificaciones de Errores**

Si algo falla, el admin recibirá:

**Asunto:** `⚠️ Error en envío de recordatorios`

**Contenido:**
- Descripción del error
- Mensaje técnico
- Enlace a los logs

---

## 🔧 Solución de Problemas

### **❌ "No hay actividades para mañana"**

**Causa:** No hay actividades programadas para mañana en el KV.

**Solución:**
1. Verifica que las actividades se están sincronizando:
   ```bash
   wrangler kv key get --namespace-id=TU_KV_ID wild_fitness_activities
   ```
   (Reemplaza `TU_KV_ID` con tu ID del namespace)
2. Si está vacío, sincroniza manualmente (ver Opción B arriba)

### **❌ "Error obteniendo actividades"**

**Causa:** El KV namespace no está correctamente configurado.

**Solución:**
1. Verifica que el `id` en `wrangler-scheduled.toml` es correcto
2. Re-deploy: `npx wrangler deploy --config wrangler-scheduled.toml`

### **❌ "Resend API error"**

**Causa:** API Key de Resend no configurada o inválida.

**Solución:**
1. Verifica tu API Key en https://resend.com/api-keys
2. Re-configura:
   ```bash
   npx wrangler secret put RESEND_API_KEY --config wrangler-scheduled.toml
   ```

### **❌ El cron no se ejecuta**

**Causa:** Worker no desplegado correctamente.

**Solución:**
1. Re-deploy: `npx wrangler deploy --config wrangler-scheduled.toml`
2. Verifica en Cloudflare Dashboard → Triggers → Cron Triggers
3. Prueba manualmente: `curl -X POST .../test-reminders`

---

## 📅 Horarios del Cron

El cron actual está configurado para ejecutarse **todos los días a las 10:00 AM** (hora de España).

Para cambiar el horario, edita `wrangler-scheduled.toml` línea 17:

```toml
crons = ["0 9 * * *"]  # 9:00 UTC = 10:00 España (invierno)
```

### **Ejemplos de Horarios:**

| Descripción | Formato Cron | Hora España (invierno) |
|-------------|--------------|------------------------|
| Cada día 8:00 AM | `"0 7 * * *"` | 8:00 AM |
| Cada día 6:00 PM | `"0 17 * * *"` | 6:00 PM |
| Solo Lunes 9:00 AM | `"0 8 * * 1"` | 9:00 AM |
| Lunes y Viernes 8 AM | `"0 7 * * 1,5"` | 8:00 AM |
| Cada 6 horas | `"0 */6 * * *"` | 12:00, 18:00, 00:00, 06:00 |

**Después de cambiar, re-deploy:**
```bash
npx wrangler deploy --config wrangler-scheduled.toml
```

---

## 📧 Plantilla del Email de Recordatorio

Los participantes recibirán un email con:

### **Asunto**
```
⏰ Recordatori: [Nombre de la Actividad] és demà!
```

### **Contenido**
- 👋 Saludo personalizado
- 🔔 Aviso destacado de que es mañana
- 📋 Tarjeta con detalles:
  - 📅 Fecha (ej: "dimarts, 21 de gener de 2026")
  - ⏰ Hora (ej: "08:00")
  - 📍 Ubicación (ej: "Parc Natural Cadí-Moixeró")
- ✅ Lista de qué llevar:
  - 💧 Agua (mínimo 1L)
  - 👟 Calzado adecuado
  - ☀️ Protección solar
  - 🍎 Desayuno ligero
  - 📱 Móvil con batería
- 🗺️ Botón "Cómo Llegar" (Google Maps) - si hay coordenadas
- 💬 Botón "Contactar Laura" (WhatsApp)
- ⏱️ Recordatorio de llegar 10 minutos antes

**Diseño:**
- Header con gradient turquesa (#2d7d7d → #3fb5b5)
- Logo "Wild Fitness"
- Diseño responsive para móviles
- Colores y estilo consistente con la web

---

## 🎯 Roadmap Futuro (Opcional)

### **Posibles Mejoras:**

1. **Emails de Seguimiento Post-Actividad**
   - Enviar 1 día después de la actividad
   - Pedir feedback
   - Sugerir próximas actividades

2. **Newsletter Mensual**
   - Resumen de actividades del mes
   - Consejos de entrenamiento
   - Historias de éxito

3. **Recordatorio 1 Semana Antes**
   - Recordatorio adicional para actividades especiales
   - Dar más tiempo de preparación

4. **Emails de Cumpleaños**
   - Felicitación personalizada
   - Descuento especial

5. **Lista de Espera**
   - Si actividad llena, ofrecer lista de espera
   - Notificar automáticamente si hay cancelación

---

## 📚 Recursos

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)
- [Resend API Docs](https://resend.com/docs/api-reference/introduction)
- [Cron Expression Generator](https://crontab.guru/)

---

## ✅ Checklist Final

- [ ] Wrangler instalado (`npm install -g wrangler`)
- [ ] Login a Cloudflare (`wrangler login`)
- [ ] KV Namespace creado y ID copiado en `wrangler-scheduled.toml`
- [ ] Resend API Key configurada (`wrangler secret put RESEND_API_KEY`)
- [ ] Worker desplegado (`wrangler deploy --config wrangler-scheduled.toml`)
- [ ] Cron trigger visible en Cloudflare Dashboard
- [ ] Actividades sincronizándose correctamente al KV
- [ ] Prueba manual exitosa (`/test-reminders`)
- [ ] Crear actividad de prueba para mañana
- [ ] Verificar recepción de recordatorio al día siguiente

---

## 🆘 Soporte

Si necesitas ayuda:

1. **Ver logs:** `npx wrangler tail --config wrangler-scheduled.toml`
2. **Revisar KV:** `wrangler kv key get --namespace-id=TU_KV_ID wild_fitness_activities`
3. **Cloudflare Dashboard:** https://dash.cloudflare.com/ → Workers → wild-fitness-scheduled-emails
4. **Resend Dashboard:** https://resend.com/emails → Ver historial de envíos

---

**¡Sistema listo para funcionar! 🚀**

El sistema está 100% configurado y listo para enviar recordatorios automáticos todos los días a las 10:00 AM.
