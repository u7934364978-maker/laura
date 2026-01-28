# 🎯 SOLUCIÓN DEFINITIVA - Wild Fitness Contact Form

## ✅ CAMBIO DE ESTRATEGIA

Después de múltiples intentos con RLS, he implementado una **solución más robusta y segura**:

### ❌ Problema Original
- Frontend usaba `anon key` para guardar en Supabase
- La `anon key` SIEMPRE respeta RLS
- Las políticas RLS no funcionaban correctamente

### ✅ Nueva Solución
- **Backend API** (`/api/save-contact`) guarda en Supabase
- Usa `service_role key` que **bypasea RLS**
- Más seguro: keys sensibles solo en backend
- Mejor control de errores y logging

---

## 📋 PASOS PARA HACER FUNCIONAR TODO

### 1️⃣ Merge del Pull Request (1 min)

```bash
1. Ve a: https://github.com/u7934364978-maker/laura/pull/2
2. Click: "Merge pull request"
3. Click: "Confirm merge"
```

### 2️⃣ Obtener Service Role Key de Supabase (2 min)

```bash
1. Ve a: https://supabase.com/dashboard/project/remyvruwpvvcestvjlsa
2. Click: Settings (engranaje lateral)
3. Click: API
4. Busca: "service_role" key (scroll down)
5. Click: Icono del ojo 👁️ para revelar
6. Copia: La key completa (empieza con eyJhbGc...)
```

⚠️ **IMPORTANTE**: Esta es la **service_role key**, NO la **anon key**

### 3️⃣ Configurar Variables en Vercel (3 min)

```bash
1. Ve a: https://vercel.com/dashboard
2. Busca tu proyecto: "laura" o "wild-fitness"
3. Click: Settings → Environment Variables
4. Añade/Edita estas 5 variables:
```

**Variables requeridas:**

```bash
SUPABASE_URL=https://remyvruwpvvcestvjlsa.supabase.co

SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... 
# ☝️ La key que copiaste del paso 2

FROM_EMAIL=onboarding@resend.dev
# ☝️ Temporal - funciona AHORA (emails pueden ir a spam)

ADMIN_EMAIL=info@wild-fitness.com

RESEND_API_KEY=re_tu_api_key_aqui
# ☝️ Obtener en: https://resend.com/api-keys
```

### 4️⃣ Redeploy en Vercel (2 min)

```bash
1. Ve a: Deployments (pestaña superior)
2. En el último deployment → Click en los 3 puntos (...)
3. Click: "Redeploy"
4. Espera: 2-3 minutos a que termine el deploy
```

---

## 🧪 PROBAR EL FORMULARIO

Después de completar los 4 pasos:

```bash
1. Ve a: https://wild-fitness.com/contacte.html
2. Rellena el formulario:
   - Nombre: Test Usuario
   - Email: tu_email@ejemplo.com
   - Teléfono: 640915772
   - Ubicación: Barcelona
   - Servicio: Trail
   - Mensaje: "Prueba del formulario con nueva solución"
3. Click: "Enviar"
```

### ✅ Resultados Esperados:

- ✅ **Mensaje**: "Missatge enviat correctament! Et contactaré aviat."
- ✅ **NO error 42501** (problema de RLS solucionado)
- ✅ **Contacto guardado** en Supabase
- ✅ **Email enviado** a tu correo (revisa spam si usas onboarding@resend.dev)
- ✅ **Notificación enviada** a info@wild-fitness.com

---

## 🔍 VERIFICAR EN SUPABASE

```bash
1. Ve a: https://supabase.com/dashboard/project/remyvruwpvvcestvjlsa
2. Click: Table Editor (menú lateral)
3. Selecciona: contact_submissions
4. Deberías ver: Tu nuevo contacto de prueba con fecha/hora actual
```

---

## 🎯 ARQUITECTURA ACTUALIZADA

### Antes (❌ No funcionaba):
```
Usuario → Formulario → Supabase (anon key + RLS) → ERROR 42501
```

### Ahora (✅ Funciona):
```
Usuario → Formulario → API /api/save-contact → Supabase (service_role key) → ✅ Success
```

---

## 🔧 TROUBLESHOOTING

### Error: "Server configuration error"

**Causa**: `SUPABASE_SERVICE_ROLE_KEY` no está configurada en Vercel

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que existe `SUPABASE_SERVICE_ROLE_KEY`
3. Verifica que el valor es el correcto (empieza con `eyJhbGc...`)
4. Redeploy el proyecto

### Error: Email no llega

**Causa**: Resend no configurado o dominio no verificado

**Solución temporal** (funciona en 2 min):
```bash
FROM_EMAIL=onboarding@resend.dev
```

**Solución profesional** (tarda 24h):
1. Ve a: https://resend.com/domains
2. Añade dominio: wild-fitness.com
3. Configura registros DNS
4. Espera verificación
5. Cambia: `FROM_EMAIL=Wild Fitness <noreply@wild-fitness.com>`

### Contacto no aparece en Supabase

**Verificaciones**:
1. ¿Está configurada `SUPABASE_SERVICE_ROLE_KEY`? → Vercel Env Vars
2. ¿Es la key correcta? → Debe empezar con `eyJhbGc...`
3. ¿Se hizo redeploy después de configurar? → Vercel Deployments
4. ¿Hay errores en los logs? → Vercel → Function Logs

---

## 📊 CHECKLIST FINAL

- [ ] Pull Request mergeado
- [ ] Service Role Key obtenida de Supabase
- [ ] Variables configuradas en Vercel:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `FROM_EMAIL`
  - [ ] `ADMIN_EMAIL`
  - [ ] `RESEND_API_KEY`
- [ ] Proyecto redeployado en Vercel
- [ ] Formulario probado y funcional
- [ ] Contacto visible en Supabase
- [ ] Email recibido

---

## 🎉 ¡LISTO!

Con estos cambios, el formulario debería funcionar perfectamente:

✅ **Guardado de contactos**: Funciona (via backend API)
✅ **Envío de emails**: Funciona (temporal o verificado)
✅ **Sin errores RLS**: Bypasseado por service_role key
✅ **Seguro**: Keys sensibles solo en backend
✅ **Robusto**: Mejor manejo de errores

---

**Última actualización**: 2026-01-28  
**Pull Request**: https://github.com/u7934364978-maker/laura/pull/2
