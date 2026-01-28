# 🔧 Guía de Solución de Errores - Wild Fitness

## 📋 Problemas Identificados

### ❌ Error 1: Supabase RLS (Row Level Security)
```
Error code: 42501
Message: 'new row violates row-level security policy for table "contact_submissions"'
```

### ❌ Error 2: Resend Domain Not Verified
```
Error 403: The wild-fitness.com domain is not verified. 
Please, add and verify your domain on https://resend.com/domains
```

---

## 🛠️ SOLUCIÓN 1: Arreglar Supabase RLS

### Paso 1: Ejecutar Script SQL en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Navega a **SQL Editor** (menú lateral izquierdo)
3. Haz clic en **New Query**
4. Abre el archivo `fix-rls-contact-submissions.sql` en este proyecto
5. Copia TODO el contenido del archivo
6. Pégalo en el editor SQL de Supabase
7. Haz clic en **Run** (o presiona `Ctrl+Enter`)

### Paso 2: Verificar que se aplicó correctamente

Ejecuta esta consulta en Supabase SQL Editor:

```sql
-- Verificar políticas
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- Verificar permisos
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'contact_submissions';
```

Deberías ver:
- ✅ Política `Enable insert for anon users` con rol `anon`
- ✅ Política `Enable insert for authenticated users` con rol `authenticated`
- ✅ Permisos `INSERT` para `anon` y `authenticated`

### Paso 3: Probar inserción desde la web

Visita tu formulario de contacto en:
- https://wild-fitness.com/contacte.html

Rellena y envía el formulario. Si todo está bien, verás:
- ✅ Mensaje de éxito en el formulario
- ✅ Registro guardado en Supabase (Table Editor → contact_submissions)

---

## 🛠️ SOLUCIÓN 2: Verificar Dominio en Resend

Tienes **DOS OPCIONES**:

### Opción A: Verificar wild-fitness.com (Recomendado para producción)

#### Paso 1: Añadir dominio en Resend

1. Ve a https://resend.com/domains
2. Haz clic en **Add Domain**
3. Introduce: `wild-fitness.com`
4. Haz clic en **Add**

#### Paso 2: Configurar registros DNS

Resend te mostrará los registros DNS que debes añadir. Típicamente:

```
Type: TXT
Name: resend._domainkey
Value: [valor proporcionado por Resend]

Type: TXT  
Name: _dmarc
Value: [valor proporcionado por Resend]
```

**¿Dónde añadir estos registros?**
- Si usas **Cloudflare**: Dashboard → DNS → Add Record
- Si usas **Namecheap/GoDaddy**: Panel de control DNS
- Si usas otro proveedor: Busca "DNS Management" o "DNS Settings"

#### Paso 3: Esperar verificación

- La verificación puede tardar **5 minutos a 48 horas**
- Resend comprobará automáticamente los registros DNS
- Recibirás un email cuando el dominio esté verificado

#### Paso 4: Configurar variables de entorno en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Navega a **Settings → Environment Variables**
3. Añade o actualiza estas variables:

```bash
FROM_EMAIL=Wild Fitness <noreply@wild-fitness.com>
ADMIN_EMAIL=info@wild-fitness.com
RESEND_API_KEY=re_tu_api_key_aqui
```

4. **Redeploy** el proyecto para aplicar los cambios

---

### Opción B: Usar dominio temporal (Para pruebas rápidas)

Si necesitas que funcione **YA** mientras verificas el dominio:

#### Paso 1: Configurar variables de entorno temporales

1. Ve a Vercel → Settings → Environment Variables
2. Añade/modifica:

```bash
# ⚠️ Dominio temporal de Resend (solo para pruebas)
FROM_EMAIL=onboarding@resend.dev

# Tu email para recibir notificaciones
ADMIN_EMAIL=info@wild-fitness.com

# Tu API Key de Resend
RESEND_API_KEY=re_tu_api_key_aqui
```

3. **Redeploy** el proyecto

#### Paso 2: Probar el formulario

- Los emails ahora se enviarán desde `onboarding@resend.dev`
- ⚠️ **Nota**: Este dominio puede ir a spam, y no es profesional
- ⚠️ **Recomendación**: Úsalo solo temporalmente mientras verificas tu dominio

---

## 🔑 Obtener API Key de Resend

1. Ve a https://resend.com/api-keys
2. Haz clic en **Create API Key**
3. Dale un nombre: `wild-fitness-production`
4. Selecciona permisos: **Sending access** (✅ emails.send)
5. Copia la API key (empieza con `re_...`)
6. Guárdala en Vercel como `RESEND_API_KEY`

---

## ✅ Verificación Final

### Test 1: Supabase RLS

```bash
# En Supabase SQL Editor:
INSERT INTO contact_submissions (name, email, phone, location, service, message)
VALUES ('Test Usuario', 'test@example.com', '640915772', 'Barcelona', 'Trail', 'Test desde SQL');

# Deberías ver: ✅ Success
# Si ves error 42501, repite Solución 1
```

### Test 2: Resend Email

```bash
# En tu navegador:
1. Ve a https://wild-fitness.com/contacte.html
2. Rellena el formulario de contacto
3. Haz clic en "Enviar"

# Deberías ver:
✅ "Missatge enviat correctament! Et contactaré aviat."

# Verifica emails:
✅ Email de bienvenida en tu bandeja de entrada
✅ Notificación en info@wild-fitness.com
```

---

## 🚨 Troubleshooting

### Problema: Sigo viendo error 42501

**Solución:**
1. Ve a Supabase → Database → Tables → contact_submissions
2. Haz clic en los tres puntos (⋮) → Edit Table → RLS
3. Asegúrate que **RLS is enabled** está marcado
4. Verifica que las políticas estén creadas
5. Si no están, ejecuta de nuevo `fix-rls-contact-submissions.sql`

### Problema: Email no llega

**Verificaciones:**
1. ¿Está configurada la `RESEND_API_KEY` en Vercel?
   - Vercel Dashboard → Settings → Environment Variables
   - Debe existir `RESEND_API_KEY=re_...`
2. ¿Está verificado el dominio?
   - Resend Dashboard → Domains → wild-fitness.com → Status: **Verified** ✅
3. ¿Se ha hecho redeploy después de cambiar variables?
   - Vercel Dashboard → Deployments → Redeploy

### Problema: Email llega a spam

**Soluciones:**
1. **Verifica el dominio** en Resend (Opción A)
2. Configura **SPF, DKIM y DMARC** correctamente
3. Añade wild-fitness.com a tu libreta de direcciones
4. Usa el dominio personalizado, no `onboarding@resend.dev`

---

## 📞 Soporte

Si después de seguir todos estos pasos sigues teniendo problemas:

1. **Supabase RLS**: Contacta con soporte de Supabase
2. **Resend Domain**: Abre un ticket en https://resend.com/support
3. **Errores generales**: Revisa los logs en Vercel → Deployments → Function Logs

---

## 📚 Referencias

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Resend Domain Verification](https://resend.com/docs/dashboard/domains/introduction)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

**Última actualización**: 2026-01-28  
**Versión**: 1.0.0  
**Autor**: GenSpark AI Developer
