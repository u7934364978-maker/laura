-- ============================================
-- FIX: RLS AND PERMISSIONS - Wild Fitness
-- ============================================

-- 1. Asegurar que la tabla existe y tiene RLS habilitado
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin read all" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin updates" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin deletes" ON contact_submissions;

-- 3. Crear política de inserción pública (Formulario de contacto)
-- Usamos FOR INSERT y permitimos a cualquiera (anon y authenticated)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Crear políticas para administradores
CREATE POLICY "Allow admin read all" ON contact_submissions
  FOR SELECT 
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

CREATE POLICY "Allow admin updates" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

CREATE POLICY "Allow admin deletes" ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

-- 5. Asegurar permisos a nivel de base de datos para los roles de Supabase
GRANT ALL ON TABLE contact_submissions TO postgres, service_role;
GRANT INSERT ON TABLE contact_submissions TO anon, authenticated;
GRANT SELECT ON TABLE contact_submissions TO authenticated;

-- 6. Repetir para la tabla payments (por si acaso)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public inserts" ON payments;
CREATE POLICY "Allow public inserts" ON payments
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);
GRANT INSERT ON TABLE payments TO anon, authenticated;

-- 7. Repetir para la tabla activities (lectura pública, edición admin)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON activities;
CREATE POLICY "Allow public read" ON activities
  FOR SELECT 
  TO anon, authenticated
  USING (true);
GRANT SELECT ON TABLE activities TO anon, authenticated;

-- 8. Verificar configuración
COMMENT ON TABLE contact_submissions IS 'Tabla para formularios de contacto con RLS corregido';
