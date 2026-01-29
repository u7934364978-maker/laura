# 🚨 SOLUCIÓN: Error de Row-Level Security en Supabase

## ❌ Error Actual
```javascript
Error al guardar contacto: 
Object { 
  code: "42501", 
  message: 'new row violates row-level security policy for table "contact_submissions"' 
}
```

## 🔍 Causa del Problema

**Supabase tiene Row-Level Security (RLS) habilitado** en la tabla `contact_submissions`, pero:
- ❌ Las políticas NO están configuradas correctamente
- ❌ Las políticas NO permiten inserts desde usuarios anónimos (formulario web)
- ❌ Solo permiten inserts desde usuarios autenticados

**Resultado**: El formulario web NO puede guardar datos porque el usuario NO está autenticado.

---

## ✅ SOLUCIÓN (5 minutos)

### Paso 1: Ve a Supabase SQL Editor

1. **Abre**: https://supabase.com/dashboard
2. **Inicia sesión** con tu cuenta
3. **Selecciona tu proyecto**: `yzlhczlqzvxjcnmonjaj`
4. En el menú lateral izquierdo, click en **"SQL Editor"** 
5. Click en el botón **"New Query"** (arriba a la derecha)

---

### Paso 2: Ejecuta el Script de Corrección

1. **Abre el archivo**: `fix-rls-contact-submissions.sql` (lo acabo de crear)
2. **Copia TODO el contenido** del archivo
3. **Pégalo en el SQL Editor** de Supabase
4. **Click en "Run"** (o presiona `Ctrl + Enter`)

---

### Paso 3: Verifica que Funcionó

Deberías ver:

```
✅ Success. No rows returned
```

O algo como:

```
✅ Query executed successfully
```

**Si ves errores**, copia el error exacto y dímelo.

---

### Paso 4: Prueba el Formulario

1. **Ve a**: https://wild-fitness.com/contacte.html
2. **Llena el formulario** con datos de prueba
3. **Envía el formulario**
4. **Debería funcionar** sin el error de RLS

---

### Paso 5: Verifica en Supabase

1. En Supabase, click en **"Table Editor"** (menú lateral)
2. Selecciona la tabla **"contact_submissions"**
3. **Deberías ver** el registro que acabas de insertar desde el formulario

---

## 🔍 Qué Hace el Script

El script `fix-rls-contact-submissions.sql` hace lo siguiente:

### 1. Elimina políticas antiguas/incorrectas
```sql
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
-- ... (elimina todas las políticas anteriores)
```

### 2. Crea política de INSERT público
```sql
CREATE POLICY "public_insert_policy" ON contact_submissions
  FOR INSERT 
  TO anon, authenticated  -- ← Permite anon (usuarios no autenticados)
  WITH CHECK (true);      -- ← Permite cualquier valor
```

**Esto es lo crítico**: `TO anon` permite que el formulario web (usuario anónimo) pueda insertar datos.

### 3. Crea políticas de SELECT/UPDATE/DELETE solo para admins
```sql
-- Solo admins autenticados pueden leer, actualizar, eliminar
CREATE POLICY "admin_select_policy" ...
CREATE POLICY "admin_update_policy" ...
CREATE POLICY "admin_delete_policy" ...
```

---

## 🔒 Seguridad

**Esta configuración es SEGURA** porque:

✅ **Usuarios anónimos (formulario web)**:
- ✅ Pueden INSERT (enviar formulario)
- ❌ NO pueden SELECT (leer otros contactos)
- ❌ NO pueden UPDATE (modificar contactos)
- ❌ NO pueden DELETE (eliminar contactos)

✅ **Admins autenticados** (laura@wild-fitness.com, info@wild-fitness.com):
- ✅ Pueden hacer TODO (SELECT, UPDATE, DELETE)
- ✅ Ven todos los contactos en el admin dashboard

---

## 📋 Resumen de Políticas

| Acción | Usuario Anónimo (Web) | Admin Autenticado |
|--------|----------------------|-------------------|
| INSERT | ✅ Permitido | ✅ Permitido |
| SELECT | ❌ Denegado | ✅ Permitido |
| UPDATE | ❌ Denegado | ✅ Permitido |
| DELETE | ❌ Denegado | ✅ Permitido |

---

## 🚨 Si el Script No Funciona

### Error: "permission denied for table contact_submissions"
**Causa**: No tienes permisos de admin en Supabase
**Solución**: Asegúrate de estar usando la cuenta owner del proyecto

### Error: "table contact_submissions does not exist"
**Causa**: La tabla no existe
**Solución**: Primero ejecuta `supabase-contact-table.sql` para crear la tabla

### Error: "policy ... already exists"
**Causa**: Las políticas ya existen con esos nombres
**Solución**: 
1. Ve a: Table Editor → contact_submissions → Policies
2. Elimina todas las políticas manualmente
3. Vuelve a ejecutar el script

---

## 🎯 Alternativa: Configurar desde la UI

Si prefieres NO usar SQL, puedes configurar las políticas desde la interfaz:

### Paso 1: Ve a Políticas
1. Supabase Dashboard → Table Editor
2. Selecciona tabla: `contact_submissions`
3. Click en la pestaña **"Policies"** (arriba)

### Paso 2: Agrega Política de INSERT Público
1. Click en **"New Policy"**
2. Selecciona: **"Create a policy from scratch"**
3. Nombre: `public_insert_policy`
4. Operation: **INSERT**
5. Target roles: **anon**, **authenticated** (selecciona ambos)
6. Using expression: `true`
7. With check expression: `true`
8. Click **"Save"**

### Paso 3: Verifica
- Deberías ver la política en la lista con un ✅

---

## 💡 Verificar Políticas Actuales

Para ver qué políticas tienes ahora:

```sql
SELECT 
  policyname,
  cmd,
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'contact_submissions';
```

Ejecuta esto en SQL Editor y dime qué ves si sigues con problemas.

---

## 📞 Siguiente Paso

**Después de ejecutar el script**:

1. ✅ Prueba el formulario de contacto
2. ✅ Verifica que se guarda en Supabase
3. ✅ Continúa con la configuración de Resend para los emails

**¿Funcionó?** Dime si el formulario ya guarda datos o si ves otro error.

---

**Última actualización**: 2026-01-28  
**Archivo SQL**: `fix-rls-contact-submissions.sql`  
**Estado**: ⚠️ Pendiente de ejecución en Supabase
