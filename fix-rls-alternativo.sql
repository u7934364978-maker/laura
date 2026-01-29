-- ============================================
-- 🔥 SOLUCIÓN ALTERNATIVA: Permisos Directos
-- ============================================
-- Si RLS sigue fallando, probamos dar permisos directos
-- ============================================

-- OPCIÓN 1: DESHABILITAR RLS COMPLETAMENTE (Temporal para testing)
-- ⚠️ SOLO PARA PROBAR - NO RECOMENDADO EN PRODUCCIÓN
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '❌ RLS AÚN HABILITADO'
    ELSE '✅ RLS DESHABILITADO'
  END as status
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- ============================================
-- DESPUÉS DE PROBAR: Si funciona sin RLS
-- ============================================
/*
Si el formulario FUNCIONA después de deshabilitar RLS:
→ El problema es la configuración de políticas
→ Podemos intentar con políticas más simples

Si el formulario SIGUE FALLANDO después de deshabilitar RLS:
→ El problema es otro (permisos de tabla, anon key incorrecta, etc.)
*/

-- ============================================
-- OPCIÓN 2: HABILITAR RLS CON POLÍTICA MUY PERMISIVA
-- ============================================
-- Solo ejecuta esto DESPUÉS de probar la Opción 1

-- Habilitar RLS de nuevo
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes (método alternativo)
DROP POLICY IF EXISTS "public_insert_policy" ON contact_submissions CASCADE;
DROP POLICY IF EXISTS "admin_select_policy" ON contact_submissions CASCADE;
DROP POLICY IF EXISTS "admin_update_policy" ON contact_submissions CASCADE;
DROP POLICY IF EXISTS "admin_delete_policy" ON contact_submissions CASCADE;

-- Crear política ULTRA PERMISIVA (permite TODO a usuarios anónimos)
CREATE POLICY "allow_all_anon" ON contact_submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verificar políticas
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- ============================================
-- OPCIÓN 3: GRANT PERMISOS DIRECTOS A ANON
-- ============================================
-- Dar permisos explícitos al rol anon

GRANT INSERT ON contact_submissions TO anon;
GRANT SELECT ON contact_submissions TO anon;

-- Verificar permisos
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'contact_submissions';

-- ============================================
-- DIAGNÓSTICO: Verificar configuración actual
-- ============================================

-- 1. Ver estado de RLS
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'contact_submissions';

-- 2. Ver todas las políticas
SELECT * FROM pg_policies WHERE tablename = 'contact_submissions';

-- 3. Ver permisos de la tabla
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'contact_submissions';

-- 4. Verificar que la tabla existe en public schema
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'contact_submissions';

-- ============================================
-- 📋 INSTRUCCIONES
-- ============================================
/*
PASO 1: Ejecuta solo la OPCIÓN 1 (deshabilitar RLS)
- Copia solo las líneas 8-9 (ALTER TABLE... DISABLE)
- Ejecuta en Supabase SQL Editor
- Prueba el formulario

SI FUNCIONA (formulario guarda datos):
→ El problema es la configuración de políticas RLS
→ Continúa con OPCIÓN 2 (política permisiva)

SI NO FUNCIONA (sigue dando error):
→ El problema es más profundo
→ Ejecuta las 4 queries de DIAGNÓSTICO
→ Copia los resultados y envíamelos
*/
