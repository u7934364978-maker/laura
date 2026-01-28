# 🔧 Configurar API Key de Resend en Vercel

## ✅ API Key Proporcionada

```
re_e7qMUJFF_2WiKZuWd9Z28QSoK8SZbR55y
```

---

## 🚀 Método 1: Desde Vercel Dashboard (Recomendado - 2 minutos)

### Paso 1: Accede a Vercel
```
https://vercel.com/dashboard
```

### Paso 2: Selecciona tu Proyecto
- Busca: `wild-fitness` o el nombre de tu proyecto
- Click en el proyecto

### Paso 3: Ve a Settings → Environment Variables
- Click en la pestaña **"Settings"** (arriba)
- En el menú lateral, click en **"Environment Variables"**

### Paso 4: Agrega las 3 Variables

#### Variable 1: RESEND_API_KEY
```
Name: RESEND_API_KEY
Value: re_e7qMUJFF_2WiKZuWd9Z28QSoK8SZbR55y
Environments: ✅ Production ✅ Preview ✅ Development
```
Click en **"Save"**

#### Variable 2: SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://yzlhczlqzvxjcnmonjaj.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```
Click en **"Save"**

#### Variable 3: SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI
Environments: ✅ Production ✅ Preview ✅ Development
```
Click en **"Save"**

### Paso 5: Redesplegar
- Ve a la pestaña **"Deployments"**
- Click en el último deployment
- Click en el menú **"..."** (tres puntos)
- Selecciona **"Redeploy"**
- Confirma

---

## 🚀 Método 2: Desde Terminal con Vercel CLI (Rápido - 1 minuto)

### Opción A: Usar el Script Automático

```bash
cd /home/user/webapp
./setup-vercel-env.sh
```

### Opción B: Manual con Comandos

```bash
# Configurar RESEND_API_KEY
echo "re_e7qMUJFF_2WiKZuWd9Z28QSoK8SZbR55y" | vercel env add RESEND_API_KEY production

# Configurar SUPABASE_URL
echo "https://yzlhczlqzvxjcnmonjaj.supabase.co" | vercel env add SUPABASE_URL production

# Configurar SUPABASE_ANON_KEY
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI" | vercel env add SUPABASE_ANON_KEY production

# Redesplegar
vercel --prod
```

---

## ✅ Verificar que Funcionó

### 1. Después de Redesplegar

Ve a: https://www.wild-fitness.com/contacte.html

### 2. Llena el Formulario

Abre la consola (F12) y envía el formulario.

### 3. Revisa los Logs

En Vercel Dashboard:
- Deployments → Latest → View Function Logs
- Busca: `/api/send-welcome-email`

Deberías ver:
```
✅ Saved to Supabase
📤 Sending welcome email to: cliente@example.com
✅ Client email response: { id: "..." }
📤 Sending notification to admin: info@wild-fitness.com
✅ Admin notification response: { id: "..." }
```

### 4. Verifica en Supabase

Ve a: https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/editor
- Tabla: `contact_submissions`
- Deberías ver el nuevo registro

---

## 🎯 Resultado Esperado

### ✅ Lo que DEBERÍA funcionar:
- ✅ Formulario envía datos sin errores
- ✅ Datos se guardan en Supabase
- ✅ Email de bienvenida se envía al cliente
- ✅ Email de notificación se envía al admin (info@wild-fitness.com)
- ✅ **SIN error de RLS**
- ✅ **SIN error de Resend domain** (si el dominio está verificado)

### ⚠️ Si aparece error "domain not verified":
- El dominio `wild-fitness.com` aún no está verificado en Resend
- Los emails NO se enviarán
- Los datos SÍ se guardan en Supabase
- Siguiente paso: Verificar dominio en Resend

---

## 🔍 Troubleshooting

### Error: "RESEND_API_KEY is not defined"
**Solución**: La variable no se guardó correctamente
- Verifica en Vercel Dashboard → Settings → Environment Variables
- Asegúrate de que dice: `RESEND_API_KEY = re_e7qMUJFF_2WiKZuWd9Z28QSoK8SZbR55y`
- Redesplega de nuevo

### Error: "The wild-fitness.com domain is not verified"
**Solución**: El dominio no está verificado en Resend
- Ve a: https://resend.com/domains
- Agrega y verifica el dominio `wild-fitness.com`
- Sigue la guía: `CLOUDFLARE-RESEND-SETUP.md`

### Los datos NO se guardan en Supabase
**Solución**: Verifica las variables de Supabase
- Asegúrate de que `SUPABASE_URL` y `SUPABASE_ANON_KEY` estén configuradas
- Revisa los logs en Vercel para ver el error exacto

---

## 📞 Siguiente Paso

1. **Configura las variables** (Método 1 o 2)
2. **Redesplega** en Vercel
3. **Prueba el formulario**
4. **Dime**:
   - ¿Funcionó? (Sí/No)
   - ¿Qué error aparece? (si hay)
   - ¿Ves los datos en Supabase? (Sí/No)

---

**¡La API key ya está lista! Solo falta configurarla en Vercel.** 🚀
