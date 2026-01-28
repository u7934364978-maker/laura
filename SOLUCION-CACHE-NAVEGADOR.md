# 🔥 PROBLEMA REAL IDENTIFICADO: Cache del Navegador

## 🚨 El Error Real

El error muestra:
```
POST https://remyvruwpvvcestvjlsa.supabase.co/rest/v1/contact_submissions
```

**Esa es la URL VIEJA de Supabase**. Pero el código tiene la correcta:
```javascript
url: 'https://yzlhczlqzvxjcnmonjaj.supabase.co'
```

**Conclusión**: Tu navegador está usando **archivos JavaScript cacheados** (viejos).

---

## ✅ SOLUCIÓN EN 3 PASOS (2 minutos)

### Paso 1: Limpiar Cache Completo

#### Opción A: DevTools (Recomendado)
1. Abre el sitio: https://www.wild-fitness.com/contacte.html
2. Presiona **F12** (abrir DevTools)
3. Click **derecho** en el botón de Reload (junto a la barra de URL)
4. Selecciona: **"Empty Cache and Hard Reload"**

#### Opción B: Modo Incógnito
1. Abre ventana de **incógnito/privada**
2. Ve a: https://www.wild-fitness.com/contacte.html
3. Prueba el formulario ahí

#### Opción C: Limpiar Cache Manual
1. **Chrome**: Ctrl + Shift + Delete → Selecciona "Cached images and files" → Borrar
2. **Firefox**: Ctrl + Shift + Delete → Selecciona "Cache" → Borrar ahora

---

### Paso 2: Verificar en la Consola

Después de limpiar cache:
1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Llena el formulario y envía
4. Busca la petición POST a Supabase
5. **Verifica que la URL sea**: `yzlhczlqzvxjcnmonjaj.supabase.co`

Si aún aparece `remyvruwpvvcestvjlsa`, el cache NO se limpió.

---

### Paso 3: Arreglar RLS en el Proyecto CORRECTO

Una vez que el navegador use la URL correcta, ejecuta el SQL en el proyecto correcto:

```sql
-- En el proyecto: yzlhczlqzvxjcnmonjaj

ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
```

O mejor, usa la política permisiva:

```sql
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'contact_submissions') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON contact_submissions', r.policyname);
    END LOOP;
END $$;

-- Crear política ultra permisiva
CREATE POLICY "allow_all" ON contact_submissions
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Dar permisos explícitos
GRANT INSERT ON contact_submissions TO anon;
GRANT SELECT ON contact_submissions TO authenticated;
```

---

## 🎯 Checklist de Verificación

Después de limpiar cache, verifica:

- [ ] La consola muestra: `✅ Supabase inicializado correctamente`
- [ ] La consola muestra: `📊 URL: https://yzlhczlqzvxjcnmonjaj.supabase.co`
- [ ] La petición POST va a: `yzlhczlqzvxjcnmonjaj.supabase.co`
- [ ] NO aparece el error de RLS

---

## 🚨 Si SIGUE Fallando Después de Limpiar Cache

### Verifica que Cloudflare no esté cacheando

El sitio usa Cloudflare, que puede estar cacheando los archivos JS.

#### Solución:
1. Ve a Cloudflare Dashboard
2. **Purge Cache**:
   - Caching → Configuration
   - **Purge Everything**
3. Espera 1 minuto
4. Prueba de nuevo

#### O agrega versión al archivo:

En `contacte.html`, cambia:
```html
<script src="supabase-config.js"></script>
```

Por:
```html
<script src="supabase-config.js?v=2"></script>
```

Esto fuerza al navegador a recargar el archivo.

---

## 📞 Siguiente Acción

1. **Limpia el cache** (método A: DevTools)
2. **Verifica en Network** que la URL sea la correcta
3. **Dime**:
   - ¿Qué URL de Supabase ves ahora en Network?
   - ¿Sigue apareciendo el error de RLS?

---

**Tiempo estimado**: 2 minutos  
**Prioridad**: CRÍTICA - El problema es cache, no RLS
