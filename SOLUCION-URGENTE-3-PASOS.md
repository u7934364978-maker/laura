# 🚨 SOLUCIÓN URGENTE: 3 Pasos Rápidos

## ⚡ Paso 1: Ejecutar SQL en Supabase (2 min)

**CRÍTICO**: Primero debes ejecutar el SQL para arreglar RLS.

### Ve a:
```
https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/sql
```

### Copia y pega este SQL:

```sql
-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin read all" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin updates" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin deletes" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anon users" ON contact_submissions;
DROP POLICY IF EXISTS "Enable read for admins" ON contact_submissions;

-- Crear política de INSERT público
CREATE POLICY "public_insert_policy" ON contact_submissions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Crear política de SELECT solo para admins
CREATE POLICY "admin_select_policy" ON contact_submissions
  FOR SELECT 
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'laura@wild-fitness.com', 
      'info@wild-fitness.com',
      'admin@wild-fitness.com'
    )
  );

-- Crear política de UPDATE solo para admins
CREATE POLICY "admin_update_policy" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'laura@wild-fitness.com', 
      'info@wild-fitness.com',
      'admin@wild-fitness.com'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'laura@wild-fitness.com', 
      'info@wild-fitness.com',
      'admin@wild-fitness.com'
    )
  );

-- Crear política de DELETE solo para admins
CREATE POLICY "admin_delete_policy" ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'laura@wild-fitness.com', 
      'info@wild-fitness.com',
      'admin@wild-fitness.com'
    )
  );
```

### Click en "Run"

---

## ⚡ Paso 2: Limpiar Cache del Navegador (1 min)

El error muestra la URL VIEJA de Supabase, lo que significa que tu navegador tiene cache.

### Opción A: Hard Refresh
1. Ve a: https://www.wild-fitness.com/contacte.html
2. Presiona: **Ctrl + Shift + R** (Windows/Linux) o **Cmd + Shift + R** (Mac)
3. Esto fuerza recargar sin cache

### Opción B: Limpiar Cache Completo
1. Presiona **F12** para abrir DevTools
2. Click derecho en el botón de **Reload** (junto a la URL)
3. Selecciona **"Empty Cache and Hard Reload"**

### Opción C: Modo Incógnito
1. Abre una ventana de incógnito/privada
2. Ve a: https://www.wild-fitness.com/contacte.html
3. Prueba el formulario

---

## ⚡ Paso 3: Verificar Dominio en Resend (10 min)

### Ve a Resend:
```
https://resend.com/domains
```

### Click en `wild-fitness.com`

Verás algo como:

```
☐ Domain Verification
  Type: TXT
  Name: @
  Value: resend-domain-verify=abc123xyz456

☐ DKIM
  Type: TXT
  Name: resend._domainkey
  Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4...
```

### Copia esos 2 registros EXACTOS

### Ve a Cloudflare:
```
https://dash.cloudflare.com
```

1. Selecciona: `wild-fitness.com`
2. Ve a: **DNS** → **Records**
3. Agrega los 2 registros de Resend
4. **IMPORTANTE**: Proxy en **GRIS** (DNS only), NO naranja

### Espera 10 minutos y verifica en Resend

---

## 🎯 Resumen Rápido

1. ✅ **SQL en Supabase** → Arregla RLS
2. ✅ **Limpiar cache** → Usa URL correcta
3. ✅ **DNS en Cloudflare** → Verifica dominio Resend

**Tiempo total**: 15 minutos

---

## 📞 Verifica que Funcionó

Después de los 3 pasos:

1. Ve a: https://www.wild-fitness.com/contacte.html
2. **Hard refresh**: Ctrl + Shift + R
3. Llena el formulario
4. Envía
5. Abre la consola (F12) y verifica:
   - ✅ NO debe decir "row-level security policy"
   - ✅ URL debe ser `yzlhczlqzvxjcnmonjaj.supabase.co` (no la vieja)
   - ⚠️ Puede decir "domain not verified" hasta que agregues DNS

---

## 🚨 ¿Sigue sin funcionar?

Después de hacer los 3 pasos, dime:

1. ¿Ejecutaste el SQL en Supabase? (Sí/No)
2. ¿Hiciste hard refresh? (Ctrl + Shift + R)
3. ¿Qué URL de Supabase ves en los errores ahora?
4. ¿Agregaste los registros DNS en Cloudflare?

---

**EMPIEZA CON EL PASO 1** (SQL en Supabase) y luego continúa. 🚀
