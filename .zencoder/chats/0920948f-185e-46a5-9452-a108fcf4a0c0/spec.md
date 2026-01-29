# Technical Specification - Optimización SEO Blog

## 1. Contexto Técnico
- **Tecnología**: HTML5, CSS3 (styles.css), Vanilla JS.
- **Estructura**: Sitio estático alojado en Vercel.
- **Imágenes**: Actualmente externas (Unsplash).

## 2. Enfoque de Implementación

### 2.1. Nueva Estructura de Directorios
Crear carpeta `blog/` en la raíz para alojar los artículos individuales.
```
laura/
├── blog/
│   ├── preparar-primera-trail-running-catalunya-2026.html
│   ├── nutricio-esportiva-trail-runners-catalunya-2026.html
│   └── exercicis-forca-trail-runners-2026.html
├── images/
│   └── blog/
│       ├── trail-running-principiants.webp
│       └── ...
```

### 2.2. Optimización de Imágenes
- Utilizar `images/` como base.
- Implementar la etiqueta `<picture>` para fallback de formato.
- Usar `loading="lazy"` para todas las imágenes fuera del viewport inicial.

### 2.3. Schema.org
Insertar scripts JSON-LD en el `<head>` de cada archivo HTML.

### 2.4. Navegación
- Actualizar `blog.html` para que actúe como índice/directorio con enlaces a las nuevas páginas.
- Mantener consistencia visual usando `styles.css`.

## 3. Plan de Verificación
- **Linting**: Validar HTML5.
- **SEO**: Usar herramientas como Lighthouse o extensiones SEO para verificar meta tags y Schema.
- **Performance**: Verificar tiempos de carga en Vercel Preview.
