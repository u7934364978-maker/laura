-- ============================================
-- FIX CRÍTICO: RLS PARA CONTACT SUBMISSIONS
-- ============================================
-- Este script soluciona el error 42501: "new row violates row-level security policy"
-- 
-- PROBLEMA: La política "Allow public inserts" no está funcionando porque
-- el rol 'anon' no tiene los permisos correctos a nivel de tabla

-- Paso 1: Verificar el estado actual
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'contact_submissions';

-- Paso 2: ELIMINAR políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin read all" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin updates" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin deletes" ON contact_submissions;

-- Paso 3: DESHABILITAR RLS temporalmente para verificar permisos
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Paso 4: GARANTIZAR permisos a nivel de tabla PRIMERO
-- Estos permisos son CRÍTICOS y deben ejecutarse ANTES de habilitar RLS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE contact_submissions TO postgres, service_role;
GRANT INSERT ON TABLE contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE contact_submissions TO authenticated;

-- Paso 5: GARANTIZAR permisos en las secuencias (si existen)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Paso 6: RE-HABILITAR RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Paso 7: CREAR políticas SIMPLES y PERMISIVAS
-- Política para INSERT - CUALQUIER usuario anónimo puede insertar
CREATE POLICY "Enable insert for anon users"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para INSERT - usuarios autenticados también pueden insertar
CREATE POLICY "Enable insert for authenticated users"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para SELECT - solo admins pueden leer
CREATE POLICY "Enable read for admin users"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

-- Política para UPDATE - solo admins pueden actualizar
CREATE POLICY "Enable update for admin users"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

-- Política para DELETE - solo admins pueden eliminar
CREATE POLICY "Enable delete for admin users"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

-- Paso 8: VERIFICAR configuración final
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
WHERE schemaname = 'public' AND tablename = 'contact_submissions'
ORDER BY cmd, policyname;

-- Paso 9: PROBAR inserción pública
-- Ejecuta esto desde el cliente (sin autenticación):
-- INSERT INTO contact_submissions (name, email, phone, location, service, message)
-- VALUES ('Test Usuario', 'test@example.com', '640915772', 'Barcelona', 'Trail', 'Mensaje de prueba desde SQL');

-- Paso 10: VERIFICAR resultado
SELECT id, name, email, created_at, status 
FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 5;

-- ============================================
-- INSTRUCCIONES DE EJECUCIÓN
-- ============================================
/*
1. Ve a Supabase Dashboard → SQL Editor
2. Copia y pega TODO este script
3. Haz clic en "Run" (o Ctrl+Enter)
4. Verifica que no haya errores en la consola
5. Prueba el formulario de contacto desde la web
6. Si aún falla, ejecuta este comando para verificar:
   
   SELECT * FROM pg_roles WHERE rolname IN ('anon', 'authenticated', 'service_role');

7. Si el error persiste, contacta con soporte de Supabase
*/

-- ============================================
-- COMENTARIO FINAL
-- ============================================
COMMENT ON TABLE contact_submissions IS 'Tabla para formularios de contacto - RLS configurado correctamente para inserts públicos';
