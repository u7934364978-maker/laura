# 🚀 INSTRUCCIONES DE INTEGRACIÓN - SUPABASE + WILD FITNESS

## ✅ PASO 1: Crear cuenta y proyecto en Supabase

1. Ve a: https://supabase.com
2. Haz clic en **"Start your project"**
3. Inicia sesión con GitHub o Email
4. Crea un nuevo proyecto:
   - **Name:** `wild-fitness`
   - **Database Password:** (Guarda esta contraseña en un lugar seguro)
   - **Region:** Europe West (London) o la más cercana a ti
5. Espera 2-3 minutos mientras se crea el proyecto ⏳

---

## ✅ PASO 2: Crear la tabla de actividades

1. En tu proyecto de Supabase, ve a **SQL Editor** (menú lateral)
2. Haz clic en **"New query"**
3. **Copia y pega este SQL:**

```sql
-- Crear tabla de actividades
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INTEGER NOT NULL,
    enrolled INTEGER DEFAULT 0,
    description TEXT,
    participants JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT DEFAULT 'admin'
);

-- Crear índice para búsquedas rápidas por fecha
CREATE INDEX idx_activities_date ON activities(date);

-- Crear índice para búsquedas por tipo
CREATE INDEX idx_activities_type ON activities(type);

-- Habilitar Row Level Security (RLS)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública (para el calendario)
CREATE POLICY "Permitir lectura pública" 
ON activities FOR SELECT 
USING (true);

-- Política: Permitir insert/update/delete para usuarios autenticados o anónimos
-- (por ahora permitimos todo, luego podemos restringir)
CREATE POLICY "Permitir escritura" 
ON activities FOR ALL 
USING (true);

-- Comentario en la tabla
COMMENT ON TABLE activities IS 'Tabla de actividades de Wild Fitness';
```

4. Haz clic en **"Run"** (botón verde) para ejecutar el SQL
5. Deberías ver: ✅ **"Success. No rows returned"**

---

## ✅ PASO 3: Obtener las credenciales

1. Ve a **Settings** → **API** (menú lateral)
2. Copia estos dos valores:

### 🔑 Project URL:
```
https://xxxxxxxxxxx.supabase.co
```

### 🔑 anon public key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

---

## ✅ PASO 4: Configurar las credenciales en el código

1. Abre el archivo: **`supabase-config.js`**
2. Reemplaza estas líneas:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://TU_PROJECT_URL.supabase.co',  // ← Pega tu URL aquí
    anonKey: 'eyJhbGciOiJIUzI1...'              // ← Pega tu key aquí
};
```

3. Guarda el archivo

---

## ✅ PASO 5: Verificar la instalación

1. Abre: https://wild-fitness.com/admin.html
2. Abre la consola del navegador (F12)
3. Deberías ver:
   - ✅ `Supabase inicializado correctamente`
   - ✅ `0 actividades cargadas desde Supabase`

4. Crea una actividad de prueba
5. Ve a Supabase → **Table Editor** → **activities**
6. Deberías ver tu actividad en la tabla 🎉

---

## ✅ PASO 6: Probar sincronización en tiempo real

1. Abre DOS PESTAÑAS:
   - **Pestaña A:** https://wild-fitness.com/admin.html (login: admin / WildFitness2024!)
   - **Pestaña B:** https://wild-fitness.com/calendari.html

2. En la **Pestaña A** (admin):
   - Crea una actividad de prueba

3. En la **Pestaña B** (calendario):
   - La actividad debería aparecer **AUTOMÁTICAMENTE** en menos de 1 segundo ⚡

---

## 🎯 Ventajas de Supabase vs localStorage

| Feature | localStorage | Supabase |
|---------|-------------|----------|
| **Sincronización** | ❌ Manual compleja | ✅ Automática |
| **Tiempo real** | ❌ No | ✅ Sí (<1s) |
| **Confiabilidad** | ⚠️ Se puede borrar | ✅ Base de datos real |
| **Backup** | ❌ No | ✅ Automático |
| **Multi-dispositivo** | ❌ No | ✅ Sí |
| **Capacidad** | ⚠️ ~5-10 MB | ✅ 500 MB gratis |

---

## 🔧 Troubleshooting

### ❌ Error: "Supabase library no cargada"
**Solución:** Asegúrate de que el CDN de Supabase esté en el HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### ❌ Error: "SUPABASE NO CONFIGURADO"
**Solución:** Verifica que hayas reemplazado `TU_PROJECT_URL_AQUI` y `TU_ANON_KEY_AQUI` con tus credenciales reales.

### ❌ Las actividades no aparecen en tiempo real
**Solución:** 
1. Verifica que las políticas RLS estén bien configuradas
2. Abre la consola (F12) y busca errores
3. Recarga ambas pestañas con Ctrl + Shift + R

### ❌ Error: "relation 'activities' does not exist"
**Solución:** Ejecuta el SQL del PASO 2 en Supabase → SQL Editor

---

## 📊 Monitoreo

Para ver el tráfico de tu base de datos:
- Ve a **Supabase** → **Database** → **Logs**
- Verás todas las queries en tiempo real

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Base de datos PostgreSQL real
- ✅ Sincronización en tiempo real (<1s)
- ✅ Sin complejidad de localStorage
- ✅ Backup automático
- ✅ Escalable

**Costo:** $0/mes (hasta 500 MB y 2 GB de transferencia)

---

## 📞 Soporte

Si tienes problemas:
1. Abre la consola del navegador (F12)
2. Copia los errores que aparezcan
3. Contáctame con esa información

---

**Fecha:** 20 Enero 2026  
**Versión:** 1.0  
**Estado:** ✅ Listo para implementar
