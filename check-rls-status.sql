-- ============================================
-- 🔍 DIAGNÓSTICO: Estado actual de RLS
-- ============================================
-- Copia y pega esto en Supabase SQL Editor
-- https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/sql

-- 1️⃣ Verificar si RLS está habilitado
SELECT 
    tablename,
    rowsecurity as "RLS_Enabled"
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- 2️⃣ Listar TODAS las políticas actuales
SELECT 
    schemaname,
    tablename,
    policyname as "Policy_Name",
    permissive,
    roles as "Applies_To",
    cmd as "Operation",
    qual as "USING_Clause",
    with_check as "WITH_CHECK_Clause"
FROM pg_policies 
WHERE tablename = 'contact_submissions'
ORDER BY policyname;

-- 3️⃣ Contar cuántas políticas hay
SELECT 
    COUNT(*) as "Total_Policies",
    STRING_AGG(policyname, ', ') as "Policy_Names"
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- ============================================
-- 📋 INTERPRETACIÓN DE RESULTADOS
-- ============================================
-- Si RLS_Enabled = true Y Total_Policies = 0:
--    → RLS está bloqueando TODO (ninguna política permite inserts)
--    → SOLUCIÓN: Ejecuta fix-rls-definitivo.sql
--
-- Si RLS_Enabled = false:
--    → Perfecto, los inserts deberían funcionar
--    → Si aún falla, el problema es OTRO (URL vieja en caché)
--
-- Si ves políticas con nombres como "public_insert_policy":
--    → Las políticas están creadas
--    → Verifica que "Applies_To" incluya 'anon'
--    → Verifica que "Operation" sea 'INSERT'
-- ============================================
