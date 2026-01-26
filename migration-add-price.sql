-- ============================================
-- MIGRACIÓN: AÑADIR COLUMNA PRICE - Wild Fitness
-- ============================================
-- Ejecuta este SQL en el Editor SQL de Supabase

-- 1. Añadir la columna price a la tabla activities
ALTER TABLE activities ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 10.00;

-- 2. Actualizar las actividades existentes con el precio por defecto si es necesario
UPDATE activities SET price = 10.00 WHERE price IS NULL;

-- 3. (Opcional) Comentar la columna para documentación
COMMENT ON COLUMN activities.price IS 'Precio de la actividad en Euros';

-- 4. Verificar que la columna se ha añadido correctamente
SELECT id, title, price FROM activities LIMIT 5;
