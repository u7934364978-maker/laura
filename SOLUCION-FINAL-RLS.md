# 🚨 SOLUCIÓN FINAL: Error RLS (42501)

## ❌ Error Actual
```
Error al guardar contacto: código 42501
"new row violates row-level security policy for table contact_submissions"
```

---

## 🎯 DIAGNÓSTICO RÁPIDO (1 minuto)

### Paso 1: Verificar estado actual
1. Abre: https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/sql
2. **Copia TODO el contenido** de `check-rls-status.sql`
3. Pégalo en el SQL Editor
4. Click en **Run**
5. Mira los resultados ⬇️

---

## 📊 INTERPRETACIÓN DE RESULTADOS

### Escenario A: RLS Habilitado + 0 Políticas
```sql
RLS_Enabled: true
Total_Policies: 0
```

**Problema:** RLS bloqueando TODO (no hay políticas permitiendo inserts)

**Solución:** Ejecuta `fix-rls-definitivo.sql` completo

---

### Escenario B: RLS Deshabilitado
```sql
RLS_Enabled: false
```

**Problema:** NO es RLS, es CACHÉ del navegador con URL vieja

**Solución:**
1. Purge Cloudflare: https://dash.cloudflare.com (Caching → Purge Everything)
2. Modo incógnito en navegador
3. DevTools → Network → ver si POST va a `yzlhczlqzvxjcnmonjaj` o `remyvruwpvvcestvjlsa`

---

### Escenario C: RLS Habilitado + Políticas Existen
```sql
RLS_Enabled: true
Total_Policies: 4
Policy_Names: admin_delete_policy, admin_select_policy, admin_update_policy, public_insert_policy
```

**Verifica:**
- `public_insert_policy` → Applies_To debe incluir `{anon}`
- `public_insert_policy` → Operation debe ser `INSERT`

Si NO cumple lo anterior, ejecuta `fix-rls-definitivo.sql` de nuevo

---

## 🔧 SOLUCIÓN DEFINITIVA (Si Escenario A o C)

### SQL para Ejecutar
```sql
-- 1️⃣ Deshabilitar RLS temporalmente
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- 2️⃣ Eliminar TODAS las políticas (loop dinámico)
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'contact_submissions') 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON contact_submissions', r.policyname);
    END LOOP;
END $$;

-- 3️⃣ Reactivar RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 4️⃣ Crear política de INSERT público (CRÍTICO)
CREATE POLICY "public_insert_policy" 
ON contact_submissions
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 5️⃣ Crear políticas admin (lectura/escritura/eliminación)
CREATE POLICY "admin_select_policy" 
ON contact_submissions
FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'));

CREATE POLICY "admin_update_policy" 
ON contact_submissions
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'));

CREATE POLICY "admin_delete_policy" 
ON contact_submissions
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com', 'admin@wild-fitness.com'));

-- ✅ Verificar que funcionó
SELECT COUNT(*) as "Total_Policies" 
FROM pg_policies 
WHERE tablename = 'contact_submissions';
-- Debe mostrar: 4
```

---

## 🧪 PRUEBA RÁPIDA (Después de ejecutar SQL)

### Test 1: Insert Manual
```sql
INSERT INTO contact_submissions (name, email, phone, location, service, message, status) 
VALUES ('Test RLS', 'test-rls@example.com', '640915772', 'barcelona', 'trail', 'Test message', 'new');
```

✅ Si funciona → RLS arreglado
❌ Si falla → Revisa los resultados de `check-rls-status.sql`

---

### Test 2: Formulario Web
1. Abre: https://www.wild-fitness.com/contacte.html (modo incógnito)
2. Llena el formulario
3. Envía
4. Abre DevTools → Console
5. Busca: `✅ Formulario enviado exitosamente`

---

## 🎯 CHECKLIST FINAL

- [ ] **Ejecutado** `check-rls-status.sql` en Supabase
- [ ] **Ejecutado** `fix-rls-definitivo.sql` si necesario
- [ ] **Verificado** que Total_Policies = 4
- [ ] **Probado** insert manual (Test 1)
- [ ] **Purgado** caché de Cloudflare
- [ ] **Configurado** variables en Vercel:
  - `RESEND_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- [ ] **Redeployado** en Vercel: `vercel --prod`
- [ ] **Probado** formulario en modo incógnito
- [ ] **Verificado** datos en Supabase

---

## 🆘 SI AÚN FALLA

**Opción 1:** Deshabilitar RLS completamente (NO recomendado para producción)
```sql
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
```

**Opción 2:** Revisar logs del navegador
1. DevTools → Network → buscar POST a Supabase
2. Ver la URL completa: ¿es `yzlhczlqzvxjcnmonjaj` o `remyvruwpvvcestvjlsa`?
3. Si es la vieja (`remyvruwpvvcestvjlsa`), el problema es CACHÉ

---

## 📞 PRÓXIMOS PASOS

1. **AHORA:** Ejecuta `check-rls-status.sql` y dime los resultados
2. **LUEGO:** Según resultados, ejecuto la solución apropiada
3. **DESPUÉS:** Configurar Resend DNS (para emails)

---

## 🔗 Enlaces Importantes

- **Supabase SQL Editor:** https://supabase.com/dashboard/project/yzlhczlqzvxjcnmonjaj/sql
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Cloudflare (Purge):** https://dash.cloudflare.com
- **Formulario:** https://www.wild-fitness.com/contacte.html
- **Pull Request:** https://github.com/u7934364978-maker/laura/pull/1

---

**🚀 HAZ EL DIAGNÓSTICO AHORA Y DIME LOS RESULTADOS**
