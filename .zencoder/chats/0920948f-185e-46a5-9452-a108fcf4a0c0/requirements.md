# Product Requirements Document (PRD) - Mejoras SEO Críticas Blog

## 1. Contexto y Objetivos
Wild Fitness tiene un blog con contenido de alta calidad pero con deficiencias técnicas que impiden su posicionamiento en buscadores. El objetivo es solventar los errores críticos identificados en la auditoría SEO del 29/01/2026.

## 2. Requisitos Funcionales

### 2.1. Arquitectura de URLs SEO-Friendly
- Los artículos deben dejar de ser secciones dentro de `blog.html` (#article-n).
- Cada artículo debe tener su propia página HTML con una URL descriptiva:
    - `blog/preparar-primera-trail-running-catalunya-2026.html`
    - `blog/nutricio-esportiva-trail-runners-catalunya-2026.html`
    - `blog/exercicis-forca-trail-runners-2026.html`

### 2.2. Optimización de Imágenes
- Descargar las imágenes actuales de Unsplash.
- Convertirlas a formato **WebP** para reducir el peso.
- Alojar las imágenes localmente en `/images/blog/`.
- Añadir atributos `width`, `height` y `alt` descriptivos.

### 2.3. Datos Estructurados (Schema.org)
- Implementar JSON-LD en cada artículo:
    - **Article**: Para todos los posts.
    - **FAQPage**: Para el artículo de nutrición.
    - **HowTo**: Para el artículo de ejercicios.
    - **BreadcrumbList**: En todas las páginas del blog.

### 2.4. Enlazado Interno y Meta Tags
- Cada página de artículo debe tener meta tags únicos (title, description, canonical).
- Incluir un mínimo de 8 enlaces internos por artículo (otros posts, servicios, contacto).
- Implementar breadcrumbs visuales.

## 3. Requisitos No Funcionales
- **Rendimiento**: Mejorar la puntuación de PageSpeed (especialmente LCP y CLS).
- **SEO**: Indexación correcta de los 3 artículos individuales.
- **Accesibilidad**: Mantener cumplimiento WCAG 2.1.

## 4. Criterios de Aceptación
- [ ] Cada artículo es accesible vía URL directa sin hashes (#).
- [ ] El validador de Schema.org no arroja errores en las nuevas páginas.
- [ ] Las imágenes cargan desde el servidor local en formato WebP.
- [ ] El `sitemap.xml` incluye las nuevas URLs.
