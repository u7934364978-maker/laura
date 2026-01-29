-- ============================================
-- VERIFICACIÓN Y FIX ULTRA AGRESIVO
-- ============================================

-- PASO 1: Verificar el estado REAL de RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- PASO 2: Verificar si la tabla existe
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_name = 'contact_submissions';

-- PASO 3: Ver TODAS las políticas
SELECT count(*) as num_policies
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- ============================================
-- FIX ULTRA AGRESIVO - ELIMINAR Y RECREAR TABLA
-- ============================================
-- ⚠️ CUIDADO: Esto borrará todos los contactos existentes
-- Solo hazlo si la tabla está vacía o no te importa perder los datos

-- Primero, guarda los datos existentes (si hay)
CREATE TABLE IF NOT EXISTS contact_submissions_backup AS 
SELECT * FROM contact_submissions;

-- Eliminar la tabla problemática
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Recrear la tabla SIN RLS
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
  notes TEXT
);

-- NO habilitar RLS
-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY; -- NO ejecutar esto

-- Dar permisos totales a anon y authenticated
GRANT ALL ON TABLE contact_submissions TO anon, authenticated, service_role, postgres;

-- Crear índices
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_email ON contact_submissions(email);

-- Restaurar datos (si había backup)
-- INSERT INTO contact_submissions SELECT * FROM contact_submissions_backup;

-- Verificar configuración final
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  tableowner
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- Verificar permisos
SELECT grantee, privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'contact_submissions'
ORDER BY grantee, privilege_type;

-- Debe mostrar:
-- rls_enabled = false
-- anon tiene permisos INSERT, SELECT, UPDATE, DELETE
