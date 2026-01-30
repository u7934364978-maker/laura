# 🔧 Guía Paso a Paso: Corrección de Problemas de Indexación

## Preparación

Antes de empezar, asegúrate de tener:
- [ ] Acceso al panel de Vercel (donde está alojado el sitio)
- [ ] Acceso al código fuente del sitio web
- [ ] Acceso a Google Search Console

---

## PASO 1: Actualizar el Sitemap.xml

### Acción:
Reemplazar el contenido del archivo `sitemap.xml` con el archivo corregido.

### Instrucciones:

1. **Descargar el archivo corregido:**
   - Usa el archivo `sitemap-corrected.xml` incluido en esta carpeta

2. **Reemplazar en tu servidor:**
   - Ve a tu repositorio de código (GitHub, GitLab, etc.)
   - Localiza el archivo `sitemap.xml` (probablemente en la raíz del proyecto)
   - Reemplaza su contenido con el del archivo `sitemap-corrected.xml`

3. **Cambios principales realizados:**
   - ✅ Todas las URLs ahora incluyen `www`
   - ✅ Eliminadas extensiones `.html` de las URLs
   - ✅ URLs consistentes en todo el sitemap

### Verificación:
```bash
# Después de subir, verifica que funcione:
curl https://www.wild-fitness.com/sitemap.xml
```

---

## PASO 2: Corregir Etiquetas Canonical en HTML

### Archivos a Modificar:

#### 2.1. Página Principal (index.html o /)

**Buscar:**
```html
<link rel="canonical" href="https://wild-fitness.com/">
```

**Reemplazar por:**
```html
<link rel="canonical" href="https://www.wild-fitness.com/">
```

---

#### 2.2. Página Calendari

**Buscar:**
```html
<link rel="canonical" href="https://wild-fitness.com/calendari">
```

**Reemplazar por:**
```html
<link rel="canonical" href="https://www.wild-fitness.com/calendari">
```

---

#### 2.3. Página Blog

**Buscar:**
```html
<link rel="canonical" href="https://wild-fitness.com/blog">
```

**Reemplazar por:**
```html
<link rel="canonical" href="https://www.wild-fitness.com/blog">
```

---

#### 2.4. Artículos de Blog

Para cada artículo de blog, verificar que la etiqueta canonical:
- ✅ Incluya `www`
- ✅ NO incluya extensión `.html`

**Ejemplo para artículo:**

**Buscar:**
```html
<link rel="canonical" href="https://wild-fitness.com/blog/preparar-primera-trail-running-catalunya-2026.html">
```

**Reemplazar por:**
```html
<link rel="canonical" href="https://www.wild-fitness.com/blog/preparar-primera-trail-running-catalunya-2026">
```

---

### Verificación:
Después de hacer los cambios, verifica con:

```bash
# Verificar home
curl -s https://www.wild-fitness.com/ | grep canonical

# Verificar calendari
curl -s https://www.wild-fitness.com/calendari | grep canonical

# Verificar blog
curl -s https://www.wild-fitness.com/blog | grep canonical
```

Deberías ver URLs con `www` en todas las etiquetas canonical.

---

## PASO 3: Verificar robots.txt

### Acción:
Confirmar que el archivo `robots.txt` apunte al sitemap correcto.

### Verificar:
El archivo debe contener:

```
Sitemap: https://www.wild-fitness.com/sitemap.xml
```

(Con `www`)

### Si necesitas actualizarlo:

```
# Wild Fitness - Robots.txt
User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /test-*.html
Disallow: /debug-*.html
Disallow: /*.backup$
Disallow: /check_sync.html
Disallow: /PRUEBA_SINCRONIZACION.html
Disallow: /menu-mockups.html

# Sitemap
Sitemap: https://www.wild-fitness.com/sitemap.xml
```

---

## PASO 4: Subir Cambios al Servidor

### Si usas Git:

```bash
# Agregar cambios
git add sitemap.xml robots.txt index.html calendari.html blog.html

# Commit
git commit -m "fix: Corregir URLs canónicas y sitemap para indexación correcta en Google"

# Push
git push origin main
```

### Si usas Vercel:
- Vercel detectará automáticamente los cambios
- El deploy se hará automáticamente
- Espera 1-2 minutos a que el deploy termine

---

## PASO 5: Notificar a Google Search Console

### 5.1. Enviar Nuevo Sitemap

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Selecciona la propiedad: `wild-fitness.com`
3. En el menú lateral: **Indexación** → **Sitemaps**
4. Si hay un sitemap antiguo:
   - Haz clic en los tres puntos (⋮)
   - Selecciona "Eliminar sitemap"
5. Agrega el nuevo sitemap:
   - En "Agregar un sitemap nuevo"
   - Escribe: `sitemap.xml`
   - Haz clic en "Enviar"

### 5.2. Solicitar Re-indexación de Páginas Principales

Para cada una de estas URLs:
- `https://www.wild-fitness.com/`
- `https://www.wild-fitness.com/calendari`
- `https://www.wild-fitness.com/blog`

**Hacer lo siguiente:**

1. En Google Search Console, ve a: **Inspección de URLs**
2. Pega la URL en la barra de búsqueda
3. Espera a que termine la inspección
4. Haz clic en "Solicitar indexación"
5. Espera confirmación (puede tomar 1-2 minutos)

---

## PASO 6: Monitoreo y Seguimiento

### Semana 1:
- [ ] Verificar que el sitemap esté siendo procesado en GSC
- [ ] Revisar si aparecen errores nuevos

### Semana 2:
- [ ] Verificar reducción de errores de redirección
- [ ] Confirmar que páginas empiecen a indexarse

### Semana 3-4:
- [ ] Los errores deberían estar cerca de 0
- [ ] Verificar que todas las páginas importantes estén indexadas

### Mensualmente:
- [ ] Revisar cobertura de indexación
- [ ] Analizar tráfico orgánico
- [ ] Detectar nuevos problemas

---

## PASO 7: Verificación Final

### Checklist de Verificación:

```bash
# 1. Verificar que sitemap.xml tenga URLs con www
curl https://www.wild-fitness.com/sitemap.xml | grep -o "https://www.wild-fitness.com"

# 2. Verificar canonical de home
curl -s https://www.wild-fitness.com/ | grep canonical

# 3. Verificar canonical de calendari
curl -s https://www.wild-fitness.com/calendari | grep canonical

# 4. Verificar canonical de blog
curl -s https://www.wild-fitness.com/blog | grep canonical

# 5. Verificar que no haya redirecciones en cadena
curl -I https://www.wild-fitness.com/ 2>&1 | grep "HTTP/2"
# Debería mostrar: HTTP/2 200 (no 308)

# 6. Verificar robots.txt
curl https://www.wild-fitness.com/robots.txt | grep Sitemap
# Debería mostrar: Sitemap: https://www.wild-fitness.com/sitemap.xml
```

---

## 🚨 Problemas Comunes

### Problema: "Los cambios no se reflejan"
**Solución:**
- Espera 5-10 minutos después del deploy
- Limpia la caché de Vercel si es necesario
- Verifica que los archivos se hayan subido correctamente

### Problema: "Google Search Console muestra los mismos errores"
**Solución:**
- Es normal, Google puede tardar 1-2 semanas en actualizar
- Sigue solicitando re-indexación de páginas clave
- Ten paciencia, el proceso es gradual

### Problema: "No tengo acceso al código fuente"
**Solución:**
- Contacta al desarrollador que tiene acceso
- Proporciona este documento como referencia
- Pide que implemente los cambios listados aquí

---

## 📞 Contacto y Soporte

Si necesitas ayuda adicional:
- Revisa el documento `informe-auditoria-seo-wild-fitness.md` para más detalles
- Consulta la documentación oficial de Google Search Console
- Considera contratar un consultor SEO si los problemas persisten

---

## ✅ Confirmación Final

Una vez completados todos los pasos:

- [ ] Sitemap.xml actualizado y subido
- [ ] Etiquetas canonical corregidas en todas las páginas
- [ ] Robots.txt verificado
- [ ] Cambios deployados a producción
- [ ] Sitemap enviado a Google Search Console
- [ ] Re-indexación solicitada para páginas principales
- [ ] Monitoreo configurado

**¡Felicidades! Has completado la corrección de problemas de indexación.** 🎉

Los resultados deberían empezar a verse en 2-4 semanas.

---

**Última actualización:** 30 de Enero de 2026
