-- ============================================
-- DIAGNÓSTICO COMPLETO Y FIX DEFINITIVO
-- ============================================
-- Este script hace un diagnóstico completo y arregla el problema

-- PASO 1: Ver el estado actual de RLS
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- PASO 2: Ver TODAS las políticas actuales
SELECT 
  policyname,
  cmd::text as command,
  roles::text,
  permissive::text,
  qual::text as using_clause,
  with_check::text
FROM pg_policies 
WHERE tablename = 'contact_submissions'
ORDER BY cmd;

-- PASO 3: Ver permisos a nivel de tabla
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'contact_submissions'
ORDER BY grantee, privilege_type;

-- ============================================
-- FIX DEFINITIVO: DESACTIVAR RLS COMPLETAMENTE
-- ============================================
-- Si las políticas no funcionan, la solución es desactivar RLS
-- temporalmente hasta encontrar el problema

-- OPCIÓN A: Desactivar RLS (SOLUCIÓN RÁPIDA)
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Verificar que se desactivó
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'contact_submissions';
-- Debe mostrar: rls_enabled = false

-- ============================================
-- IMPORTANTE: AHORA PRUEBA EL FORMULARIO
-- ============================================
-- Con RLS desactivado, el formulario DEBE funcionar
-- Esto nos confirma que el problema es solo de RLS

-- ============================================
-- DESPUÉS DE PROBAR, PUEDES REACTIVAR RLS
-- ============================================
-- Si el formulario funciona con RLS desactivado,
-- entonces el problema es la configuración de políticas

-- Para reactivar RLS después (SOLO si quieres):
-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Y crear UNA SOLA política super permisiva:
-- CREATE POLICY "allow_all_inserts" 
-- ON contact_submissions 
-- FOR INSERT 
-- WITH CHECK (true);
