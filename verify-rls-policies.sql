-- ============================================
-- VERIFICAR POLÍTICAS RLS ACTUALES
-- ============================================
-- Ejecuta esto primero para ver qué políticas existen

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text as roles,
  cmd::text as command,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'contact_submissions'
ORDER BY cmd, policyname;

-- ============================================
-- VERIFICAR PERMISOS DE TABLA
-- ============================================

SELECT 
  grantee,
  string_agg(privilege_type, ', ') as privileges
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
  AND table_name = 'contact_submissions'
GROUP BY grantee
ORDER BY grantee;

-- ============================================
-- VERIFICAR SI RLS ESTÁ HABILITADO
-- ============================================

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'contact_submissions';
