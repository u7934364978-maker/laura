# 🌐 Corrección de Dominio - Wild Fitness

**Fecha:** 20 de Enero de 2026  
**Commit:** 912f35d  
**Estado:** ✅ DOMINIO CORREGIDO

---

## ✅ CAMBIO REALIZADO

**ANTES:** `wildbreathing.com`  
**AHORA:** `wild-fitness.com`

---

## 📝 ARCHIVOS ACTUALIZADOS

### **1. CNAME** (Más Importante)
```
wildbreathing.com → wild-fitness.com
```
Este archivo define el dominio personalizado en Cloudflare Pages.

### **2. Archivos HTML Principales**

#### **index.html**
- ✅ Meta tags Open Graph (`og:url`, `og:image`)
- ✅ Canonical URL
- ✅ Schema.org structured data (`url`, `image`)
- ✅ Email de contacto: `info@wild-fitness.com`

#### **blog.html**
- ✅ URLs canónicas
- ✅ Meta tags
- ✅ Email de contacto

#### **contacte.html**
- ✅ Formulario de contacto
- ✅ Email de destino

#### **calendari.html**
- ✅ URLs de referencia
- ✅ Meta tags

### **3. Configuración de Supabase**

#### **supabase-contact-table.sql**
Políticas RLS actualizadas con nuevos emails de admin:

```sql
-- ANTES
auth.jwt() ->> 'email' IN ('laura@wildbreathing.com', 'info@wildbreathing.com')

-- AHORA
auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
```

**⚠️ IMPORTANTE:** Si ya ejecutaste el SQL en Supabase, necesitas actualizar las políticas manualmente.

### **4. Documentación**
- ✅ `ACTUALIZACION_FOTOS_2026-01-20.md`
- ✅ `GALERIA_ACTUALIZADA_2026-01-20.md`
- ✅ `SUPABASE_FORMULARIO_CONTACTO.md`

---

## 📧 EMAILS ACTUALIZADOS

### **Emails de Contacto:**
- **ANTES:** `info@wildbreathing.com`
- **AHORA:** `info@wild-fitness.com`

### **Emails de Admin (Supabase RLS):**
- **ANTES:** `laura@wildbreathing.com`, `info@wildbreathing.com`
- **AHORA:** `laura@wild-fitness.com`, `info@wild-fitness.com`

---

## ✅ REFERENCIAS MANTENIDAS

### **Instagram**
✅ Mantenido: `@wildbreathing`  
Las siguientes referencias NO fueron cambiadas (correctas):
- Instagram handle: `@wildbreathing`
- Instagram URL: `https://instagram.com/wildbreathing`
- Clase CSS: `.why-wildbreathing`

Estas referencias están correctas porque el Instagram es diferente al dominio web.

---

## 🔧 CONFIGURACIÓN DNS

### **⚠️ IMPORTANTE: Configurar DNS**

Para que `wild-fitness.com` funcione correctamente, necesitas configurar:

#### **Opción A: Cloudflare DNS (Recomendado)**

1. Ve a tu panel de Cloudflare
2. Selecciona tu dominio `wild-fitness.com`
3. Ve a **DNS** → **Records**
4. Agrega estos registros:

```
Tipo: CNAME
Nombre: @
Contenido: [tu-proyecto].pages.dev
Proxy: ✅ Proxied (naranja)

Tipo: CNAME
Nombre: www
Contenido: wild-fitness.com
Proxy: ✅ Proxied (naranja)
```

#### **Opción B: Custom Domain en Cloudflare Pages**

1. Ve a **Workers & Pages** → Tu proyecto
2. Settings → **Custom domains**
3. Click **Set up a custom domain**
4. Introduce: `wild-fitness.com`
5. Click **Continue**
6. Sigue las instrucciones para verificar el dominio

---

## 🌐 URLS FINALES

Después de la configuración DNS, tu sitio estará disponible en:

- ✅ `https://wild-fitness.com`
- ✅ `https://www.wild-fitness.com` (si configuras el registro WWW)
- ✅ `https://[tu-proyecto].pages.dev` (URL de Cloudflare Pages, siempre disponible)

---

## 🔍 VERIFICACIÓN

### **Paso 1: Verificar cambios en GitHub**
```bash
git log --oneline -1
# Debería mostrar: 912f35d fix: Corregir dominio de wildbreathing.com a wild-fitness.com
```

### **Paso 2: Verificar CNAME**
```bash
cat CNAME
# Debería mostrar: wild-fitness.com
```

### **Paso 3: Esperar despliegue de Cloudflare**
- Tiempo estimado: 2-3 minutos
- Verifica en: https://dash.cloudflare.com/ → Workers & Pages → Deployments

### **Paso 4: Probar el sitio**
- Abre: `https://wild-fitness.com` (si DNS está configurado)
- O: `https://[tu-proyecto].pages.dev`

### **Paso 5: Verificar meta tags**
```bash
curl -s https://wild-fitness.com | grep "wild-fitness.com"
# Deberías ver múltiples referencias al nuevo dominio
```

---

## ⚙️ TAREAS PENDIENTES

### **1. Configurar DNS** ⏳
- [ ] Agregar registros CNAME en Cloudflare DNS
- [ ] Verificar dominio en Cloudflare Pages
- [ ] Esperar propagación DNS (hasta 24h)

### **2. Actualizar Políticas Supabase** ⚠️

Si ya ejecutaste el SQL anterior con emails `@wildbreathing.com`, ejecuta esto en Supabase SQL Editor:

```sql
-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Allow admin read all" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin updates" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin deletes" ON contact_submissions;

-- Crear políticas con nuevos emails
CREATE POLICY "Allow admin read all" ON contact_submissions
  FOR SELECT 
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

CREATE POLICY "Allow admin updates" ON contact_submissions
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

CREATE POLICY "Allow admin deletes" ON contact_submissions
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );
```

### **3. Actualizar Emails** 📧
- [ ] Configurar `info@wild-fitness.com` para recibir emails
- [ ] Configurar `laura@wild-fitness.com` (opcional)
- [ ] Redirigir emails antiguos de `@wildbreathing.com` (opcional)

### **4. SEO y Redirects** 🔍
- [ ] Configurar redirect 301 de `wildbreathing.com` → `wild-fitness.com` (si el dominio antiguo existe)
- [ ] Actualizar Google Search Console con nuevo dominio
- [ ] Actualizar Google Analytics (si existe)
- [ ] Actualizar perfiles en redes sociales con nueva URL

---

## 📊 IMPACTO DEL CAMBIO

### **Positivo:**
✅ Dominio correcto configurado  
✅ Emails profesionales con dominio correcto  
✅ Coherencia en toda la web  
✅ Meta tags y SEO actualizados  

### **Neutral:**
⚪ Instagram mantiene `@wildbreathing` (no afecta)  

### **Requiere Acción:**
⚠️ Configurar DNS para activar el dominio  
⚠️ Actualizar políticas de Supabase si ya existían  
⚠️ Configurar emails `@wild-fitness.com`  

---

## 🎯 CHECKLIST COMPLETO

- [x] Actualizar CNAME
- [x] Actualizar archivos HTML
- [x] Actualizar configuración Supabase
- [x] Actualizar documentación
- [x] Commit y push a GitHub
- [ ] Configurar DNS en Cloudflare
- [ ] Verificar dominio en Cloudflare Pages
- [ ] Actualizar políticas Supabase (si es necesario)
- [ ] Configurar emails `@wild-fitness.com`
- [ ] Probar acceso al sitio en nuevo dominio

---

## 🎉 RESUMEN

✅ **Dominio corregido de `wildbreathing.com` a `wild-fitness.com`**  
✅ **Todos los archivos actualizados**  
✅ **Cambios desplegados en GitHub**  

**Próximo paso:** Configurar DNS en Cloudflare para activar el dominio `wild-fitness.com`

---

**Última actualización:** 2026-01-20 17:45 UTC  
**Estado:** ✅ Código actualizado, pendiente configuración DNS  
**Dominio objetivo:** wild-fitness.com
