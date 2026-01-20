# 🔍 GUÍA: Indexar Wild Fitness en Google

## 📋 RESUMEN DE LO QUE HEMOS PREPARADO

✅ **sitemap.xml** - Actualizado con todas las páginas
✅ **robots.txt** - Configurado correctamente
✅ **Meta tags SEO** - Ya implementados en todas las páginas
✅ **Schema.org** - Structured data para Laura Ramírez
✅ **URLs limpias** - www.wild-fitness.com

---

## 🚀 PASO 1: VERIFICAR PROPIEDAD EN GOOGLE SEARCH CONSOLE

### 1️⃣ Acceder a Google Search Console

1. Ve a: **https://search.google.com/search-console**
2. Inicia sesión con tu cuenta de Google (usa el email de Laura o el del negocio)
3. Click en **"Añadir propiedad"** o **"Add property"**

### 2️⃣ Seleccionar tipo de propiedad

**IMPORTANTE:** Selecciona **"Prefijo de URL"** (URL prefix)

- Ingresa: `https://www.wild-fitness.com`
- Click en **"Continuar"**

### 3️⃣ Verificar propiedad - MÉTODO RECOMENDADO: Archivo HTML

Google te dará varias opciones de verificación. **La más fácil es:**

**Opción A: Archivo HTML** ⭐ RECOMENDADO

1. Google te dará un archivo como: `google1234567890abcdef.html`
2. Descárgalo
3. **YO LO SUBIRÉ AL REPOSITORIO** (dime el nombre del archivo)
4. Una vez subido, click en **"Verificar"**

**Opción B: Etiqueta HTML (Meta tag)**

1. Google te dará una etiqueta como:
   ```html
   <meta name="google-site-verification" content="ABC123XYZ..." />
   ```
2. **DÍMELA** y yo la añadiré al `<head>` de index.html
3. Esperamos que se despliegue
4. Click en **"Verificar"**

**Opción C: Google Analytics** (si ya lo tienes configurado)

**Opción D: Google Tag Manager** (si ya lo tienes)

---

## 🚀 PASO 2: ENVIAR SITEMAP A GOOGLE

Una vez verificada la propiedad:

1. En **Google Search Console**, ve a **"Sitemaps"** (menú lateral)
2. En **"Añadir un nuevo sitemap"**, ingresa:
   ```
   sitemap.xml
   ```
3. Click en **"Enviar"**
4. Deberías ver: ✅ **"Éxito"**

Google empezará a rastrear e indexar las páginas automáticamente.

---

## 🚀 PASO 3: SOLICITAR INDEXACIÓN MANUAL (OPCIONAL PERO RECOMENDADO)

Para acelerar el proceso:

1. En **Google Search Console**, ve a **"Inspección de URLs"**
2. Ingresa estas URLs una por una:
   - `https://www.wild-fitness.com/`
   - `https://www.wild-fitness.com/calendari.html`
   - `https://www.wild-fitness.com/blog.html`
   - `https://www.wild-fitness.com/contacte.html`
3. Para cada URL, click en **"Solicitar indexación"**
4. Espera 1-2 minutos por URL
5. Repite con todas las páginas importantes

---

## 🚀 PASO 4: CONFIGURAR GOOGLE ANALYTICS 4 (OPCIONAL)

### 1️⃣ Crear cuenta de Google Analytics

1. Ve a: **https://analytics.google.com**
2. Click en **"Empezar a medir"**
3. Nombre de la cuenta: **"Wild Fitness"**
4. Nombre de la propiedad: **"Wild Fitness Website"**
5. Zona horaria: **España**
6. Moneda: **Euro (EUR)**

### 2️⃣ Configurar flujo de datos

1. Selecciona: **"Web"**
2. URL del sitio web: `https://www.wild-fitness.com`
3. Nombre del flujo: **"Wild Fitness Web"**
4. Click en **"Crear flujo"**

### 3️⃣ Obtener el Measurement ID

1. Google te dará un **Measurement ID**: `G-XXXXXXXXXX`
2. **DÍMELO** y yo lo añadiré a todas las páginas

### 4️⃣ Código de seguimiento (YO LO AÑADIRÉ)

Una vez tengas el Measurement ID, añadiré este código en todas las páginas:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🚀 PASO 5: VERIFICAR INDEXACIÓN

### ¿Cómo saber si Google ya indexó la web?

1. En Google, busca: `site:www.wild-fitness.com`
2. Deberías ver las páginas indexadas

**Nota:** El proceso de indexación puede tardar:
- **24-48 horas** para primeras páginas
- **1-2 semanas** para indexación completa

---

## 📊 PASO 6: OPTIMIZACIONES ADICIONALES (YA IMPLEMENTADAS)

✅ **Meta descriptions** - Únicas en cada página
✅ **Title tags** - Optimizados con keywords
✅ **Headings (H1, H2, H3)** - Estructura correcta
✅ **Alt text en imágenes** - Descriptivo y con keywords
✅ **Schema.org JSON-LD** - Para Laura Ramírez como persona
✅ **Open Graph** - Para redes sociales
✅ **Canonical URLs** - Para evitar contenido duplicado
✅ **Mobile-friendly** - Responsive design
✅ **HTTPS** - Sitio seguro
✅ **Velocidad** - Optimizado con Cloudflare

---

## 🎯 KEYWORDS PRINCIPALES (YA OPTIMIZADAS)

**Primarias:**
- Laura Ramírez entrenadora
- Trail running Girona
- Trail running Barcelona
- Entrenament funcional Catalunya
- Guia muntanya Pirineus

**Secundarias:**
- Entrenadora personal Girona
- Trail running Pirineus
- Sortides guiades muntanya
- Entrenament trail running
- Preparació física trail

**Long-tail:**
- Entrenadora personal trail running Barcelona
- Guia de muntanya certificada Catalunya
- Sessions d'entrenament funcional outdoor
- Training camps trail running Pirineus

---

## 📈 MONITORIZACIÓN Y MEJORA CONTINUA

### En Google Search Console, revisa:

1. **Rendimiento** - Clics, impresiones, CTR, posición media
2. **Cobertura** - Páginas indexadas vs. no indexadas
3. **Mejoras** - Usabilidad móvil, datos estructurados
4. **Enlaces** - Enlaces externos e internos
5. **Core Web Vitals** - Velocidad y experiencia de usuario

### Recomendaciones:

📝 **Crear contenido regularmente** - Actualiza el blog cada 1-2 semanas
📸 **Añadir fotos con alt text** - De actividades, rutas, entrenamientos
🔗 **Conseguir backlinks** - De directorios locales, partners, colaboraciones
📱 **Compartir en redes** - Instagram, Facebook, LinkedIn
⭐ **Pedir reseñas** - En Google My Business (si lo tienes)

---

## 🆘 TROUBLESHOOTING

### "No se puede acceder al sitio"
- Verifica que www.wild-fitness.com esté funcionando
- Revisa DNS en Cloudflare

### "Sitemap no se puede leer"
- Verifica que https://www.wild-fitness.com/sitemap.xml sea accesible
- Comprueba que no tenga errores XML

### "Propiedad no verificada"
- Usa el método de archivo HTML (más fácil)
- Asegúrate de que el archivo esté en la raíz del sitio

### "Páginas no indexadas"
- Puede tardar días/semanas
- Solicita indexación manual en Search Console
- Verifica robots.txt no esté bloqueando

---

## 📞 SIGUIENTE PASO

**AHORA TÚ:**

1. Ve a https://search.google.com/search-console
2. Añade la propiedad: `https://www.wild-fitness.com`
3. Selecciona **método de verificación** (archivo HTML o meta tag)
4. **DIME:**
   - ¿Qué método elegiste?
   - Si es archivo HTML: ¿Cuál es el nombre del archivo?
   - Si es meta tag: ¿Cuál es el código completo?

**YO ME ENCARGO DE:**
- Subir el archivo de verificación
- O añadir la meta tag al HTML
- Deploy de los cambios
- Verificar que todo funcione

---

## ✅ CHECKLIST DE INDEXACIÓN

- [ ] Verificar propiedad en Google Search Console
- [ ] Enviar sitemap.xml
- [ ] Solicitar indexación de páginas principales
- [ ] Configurar Google Analytics 4 (opcional)
- [ ] Verificar con `site:www.wild-fitness.com`
- [ ] Monitorizar rendimiento semanalmente
- [ ] Crear contenido nuevo mensualmente

---

**¡Vamos a posicionar Wild Fitness en Google!** 🚀
