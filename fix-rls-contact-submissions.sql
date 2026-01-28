-- ============================================
-- 🔧 CORRECCIÓN: Políticas RLS para contact_submissions
-- ============================================
-- Error: "new row violates row-level security policy"
-- Solución: Eliminar políticas existentes y crear nuevas correctas
-- ============================================

-- PASO 1: Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin read all" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin updates" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin deletes" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anon users" ON contact_submissions;
DROP POLICY IF EXISTS "Enable read for admins" ON contact_submissions;

-- PASO 2: Crear política de INSERT público (CRÍTICO)
-- Esta política permite que CUALQUIERA pueda insertar desde el frontend
CREATE POLICY "public_insert_policy" ON contact_submissions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- PASO 3: Crear política de SELECT solo para admins autenticados
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

-- PASO 4: Crear política de UPDATE solo para admins
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

-- PASO 5: Crear política de DELETE solo para admins
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

-- ============================================
-- VERIFICACIÓN: Probar que funciona
-- ============================================

-- Test 1: Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contact_submissions';
-- Debería mostrar: rowsecurity = true

-- Test 2: Listar todas las políticas activas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- Test 3: Probar INSERT público (como si fuera el formulario web)
-- Este insert debería funcionar SIN autenticación
INSERT INTO contact_submissions (name, email, phone, location, service, message, status)
VALUES (
  'Test User',
  'test@example.com',
  '640915772',
  'barcelona',
  'trail',
  'This is a test message from SQL',
  'new'
);

-- Si el INSERT de arriba funciona: ✅ RLS configurado correctamente
-- Si da error: ❌ Hay un problema con las políticas

-- Test 4: Verificar que el registro se insertó
SELECT * FROM contact_submissions 
WHERE email = 'test@example.com'
ORDER BY created_at DESC 
LIMIT 1;

-- ============================================
-- LIMPIEZA (OPCIONAL): Eliminar registro de prueba
-- ============================================
-- DELETE FROM contact_submissions WHERE email = 'test@example.com';

-- ============================================
-- 📋 INSTRUCCIONES DE USO
-- ============================================
/*
CÓMO EJECUTAR ESTE SCRIPT:

1. Ve a Supabase Dashboard: https://supabase.com/dashboard
2. Selecciona tu proyecto: yzlhczlqzvxjcnmonjaj
3. Click en "SQL Editor" (menú lateral izquierdo)
4. Click en "New Query"
5. Copia y pega TODO este archivo
6. Click en "Run" (o presiona Ctrl+Enter)
7. Verifica que dice "Success" sin errores
8. Prueba el formulario de contacto en el sitio web

VERIFICAR QUE FUNCIONA:
- Ve a: https://wild-fitness.com/contacte.html
- Llena el formulario
- Envía
- Debería funcionar sin el error "row-level security policy"
- Verifica en Supabase → Table Editor → contact_submissions

NOTAS:
✅ TO anon: Permite inserts desde usuarios NO autenticados (formulario web)
✅ TO authenticated: Solo para admins con login
✅ WITH CHECK (true): Permite CUALQUIER valor en el insert
✅ Las políticas de SELECT/UPDATE/DELETE solo funcionan para admins autenticados

SEGURIDAD:
🔒 Usuarios anónimos (web): Solo pueden INSERT
🔒 Usuarios anónimos: NO pueden leer, actualizar o eliminar
🔒 Admins autenticados: Pueden hacer todo (SELECT, UPDATE, DELETE)
🔒 Emails admin permitidos: laura@wild-fitness.com, info@wild-fitness.com
*/
