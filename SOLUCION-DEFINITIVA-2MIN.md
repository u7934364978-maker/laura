# ⚡ SOLUCIÓN DEFINITIVA - 2 Minutos

## 🚨 Problema Identificado

La política `public_insert_policy` **YA EXISTE** pero está mal configurada.

**No podemos crearla de nuevo sin eliminarla primero.**

---

## ✅ Solución en 3 Clicks

### 1. Copia este SQL:

```sql
-- Deshabilitar RLS temporalmente
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Eliminar TODAS las políticas (loop forzado)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'contact_submissions') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON contact_submissions', r.policyname);
    END LOOP;
END $$;

-- Habilitar RLS de nuevo
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Crear política INSERT público (CORRECTO)
CREATE POLICY "public_insert_policy" ON contact_submissions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Crear políticas admin
CREATE POLICY "admin_select_policy" ON contact_submissions
  FOR SELECT 
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'));

CREATE POLICY "admin_update_policy" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'));

CREATE POLICY "admin_delete_policy" ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'));
```

### 2. Pégalo en Supabase SQL Editor:
```
https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/sql
```

### 3. Click en "Run" (botón verde)

**Deberías ver**: ✅ Success (sin errores)

---

## 🧪 Verificar que Funcionó

Ejecuta este SELECT para ver las políticas:

```sql
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'contact_submissions';
```

**Deberías ver**:
```
public_insert_policy | INSERT | {anon,authenticated}
admin_select_policy  | SELECT | {authenticated}
admin_update_policy  | UPDATE | {authenticated}
admin_delete_policy  | DELETE | {authenticated}
```

---

## 🎯 Probar el Formulario

1. Ve a: https://www.wild-fitness.com/contacte.html
2. **Hard refresh**: Ctrl + Shift + R
3. Llena el formulario
4. Envía

**Resultado esperado**:
- ✅ Se guarda en Supabase (sin error RLS)
- ⚠️ Puede dar error de Resend (dominio no verificado) - eso es el paso 2

---

## 📊 Qué Hace Este Script (Diferente)

**Script anterior** (fallaba):
```sql
DROP POLICY IF EXISTS "public_insert_policy" ...  ❌ No funcionaba
CREATE POLICY "public_insert_policy" ...          ❌ Decía "already exists"
```

**Script nuevo** (funciona):
```sql
ALTER TABLE ... DISABLE ROW LEVEL SECURITY;      ✅ Deshabilita RLS
DO $$ LOOP ... END $$;                           ✅ Elimina TODO con loop
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;       ✅ Rehabilita RLS
CREATE POLICY ...                                 ✅ Crea políticas nuevas
```

**Diferencia**: Usa un **loop dinámico** que elimina TODAS las políticas sin importar el nombre.

---

## 🚨 Si Aún Da Error

**Si al ejecutar el SQL ves algún error**, copia el error EXACTO y dímelo.

**Si dice "Success" pero el formulario sigue fallando**:
1. Verifica que las políticas se crearon (ejecuta el SELECT de arriba)
2. Haz hard refresh del navegador (Ctrl + Shift + R)
3. Copia el error de la consola del navegador

---

## 📞 Siguiente Paso

Una vez que el SQL funcione:

1. ✅ El formulario guardará datos en Supabase
2. ⚠️ Los emails NO se enviarán (dominio Resend no verificado)
3. 👉 Siguiente: Configurar DNS de Resend en Cloudflare

---

**¿Ejecutaste el SQL?** Dime si dio "Success" o si viste algún error. 🚀
