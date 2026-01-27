# Wild Fitness - Laura Ramírez | Entrenadora Personal & Guia de Muntanya

![Wild Fitness](https://img.shields.io/badge/Mountain-Training-2D5016?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-4CAF50?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web-D84315?style=for-the-badge)

## 🏔️ Sobre el Proyecto

**Wild Fitness** és la plataforma web professional de Laura Ramírez, entrenadora personal independent especialitzada en entrenament de força funcional i trail running. Certificada oficialment pel Govern de Catalunya (ROPEC 062645).

## 👤 Sobre Laura Ramírez

Laura Ramírez és entrenadora personal independent i guia de muntanya certificada. Amb formació oficial homologada pel Govern de Catalunya, està especialitzada en entrenament de força funcional i trail running.

**Certificacions Oficials:**
- ROPEC 062645 (Registre Oficial de Professionals de l'Esport de Catalunya)
- Certificat de Professionalitat - Govern de Catalunya
- Guia Baixa i Mitjana Muntanya
- Entrenadora Funcional

## ✨ Características

- **🎨 Diseño UX Mejorado**: Experiencia de usuario intuitiva y visualmente agradable
- **📱 Diseño Responsive**: Optimizado para todos los dispositivos (móvil, tablet, desktop)
- **⚡ Performance Optimizada**: Carga rápida con animaciones fluidas
- **🎭 Microinteracciones**: Feedback visual en cada interacción del usuario
- **♿ Accesibilidad WCAG 2.1**: Navegación por teclado y lectores de pantalla
- **📧 Formulario Inteligente**: Validación en tiempo real con iconos visuales
- **🎯 Animaciones Suaves**: Transiciones CSS y JavaScript optimizadas
- **🔄 Loading States**: Estados de carga claros en formularios y botones
- **💾 Gestión de Clientes**: Almacenamiento automático en Formspree o Google Sheets
- **🎨 Paleta Turquesa**: Colores modernos y profesionales
- **🏷️ Badges de Credibilidad**: ROPEC, 50+ alumnos, contenido exclusivo
- **📊 SEO Optimizado**: Configurado para máxima visibilidad en buscadores

## 🎯 Mejoras de UX Implementadas

### 🖱️ Interactividad
- **Efectos Ripple**: Animación de onda en botones al hacer clic
- **Hover States**: Respuesta visual inmediata en todos los elementos interactivos
- **Scroll Suave**: Navegación fluida entre secciones
- **Header Dinámico**: Se oculta/muestra automáticamente al hacer scroll

### ✅ Formulario de Contacto
- **Validación en Tiempo Real**: Feedback instantáneo mientras escribes
- **Iconos de Validación**: Checkmarks verdes y X rojas
- **Contador de Caracteres**: Para el campo de mensaje
- **Estado de Carga**: Spinner animado al enviar
- **Efecto Confetti**: Celebración al enviar con éxito
- **Mensajes Animados**: Éxito y error con animaciones

### 🎨 Animaciones
- **Parallax Sutil**: Imagen del hero con zoom suave
- **Fade In Up**: Secciones aparecen al hacer scroll
- **Badge Bounce**: Los badges rebotan sutilmente
- **Button Pulse**: El botón principal pulsa para llamar la atención
- **Smooth Transitions**: Todas las transiciones son fluidas (cubic-bezier)

### ♿ Accesibilidad
- **Navegación por Teclado**: Tab, Enter, Escape funcionan correctamente
- **Focus Visible**: Borde claro en elementos enfocados
- **ARIA Labels**: Etiquetas para lectores de pantalla
- **Contraste WCAG 2.1**: Todos los textos cumplen nivel AA
- **Skip Links**: Saltar al contenido principal

### 📱 Responsive
- **Mobile First**: Diseñado primero para móvil
- **Touch Friendly**: Botones grandes y espaciados
- **Viewport Optimizado**: Funciona en pantallas desde 320px
- **Imágenes Adaptativas**: Se ajustan al tamaño de pantalla

## 🚀 Tecnologías

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con variables CSS y flexbox/grid
- **JavaScript Vanilla**: Sin dependencias, código limpio y eficiente
- **Google Fonts**: Tipografías Montserrat y Open Sans
- **GitHub Pages**: Hosting gratuito y confiable

## 📂 Estructura del Proyecto

```
wild-fitness/
├── index.html          # Página principal
├── blog.html           # Página de blog
├── styles.css          # Estilos CSS
├── script.js           # JavaScript
├── CNAME              # Configuración de dominio personalizado
├── FORMULARIO-CONTACTO.md  # Guía de configuración del formulario
└── README.md          # Documentación
```

## 🌐 Despliegue

**Plataforma:** Vercel
**Dominio:** wild-fitness.com

El sitio se despliega automáticamente en Vercel cuando se hace push a la rama principal. Vercel proporciona:
- ✅ Despliegues automáticos desde Git
- ✅ Funciones serverless (API para envío de emails)
- ✅ SSL automático y CDN global
- ✅ Preview deployments para cada PR

**📖 Guía completa:** Ver [`DESPLIEGUE-VERCEL.md`](DESPLIEGUE-VERCEL.md)

### Configuración DNS (Cloudflare)

Registros DNS necesarios:
```
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www wild-fitness.com
```

### SSL/TLS (Cloudflare)

- **Encryption Mode**: Full (strict)
- **Always Use HTTPS**: Activado
- **TLS Version**: 1.2+
- **HSTS**: Habilitado

## 🎨 Paleta de Colores

- **Primary Teal**: `#2d7d7d` (Verde azulado profundo)
- **Secondary Turquoise**: `#3fb5b5` (Turquesa brillante)
- **Accent Light**: `#5fcaca` (Turquesa claro)
- **Overlay**: `rgba(45, 125, 125, 0.75)` (Capa turquesa)
- **Text**: `#1e293b` (Negro principal)
- **Background**: `#f0f9f9` (Gris-turquesa muy claro)

## 📱 Secciones

1. **Hero Section**: Impacto visual con imagen de montaña y overlay turquesa
2. **Badges de Credibilidad**: Certificación ROPEC, 50+ alumnos, contenido exclusivo
3. **Botones de Acción**: Prova Gratuïta y WhatsApp directo
4. **Features**: 4 características principales del servicio
5. **Programas**: 3 niveles de entrenamiento con precios
6. **Sobre Mí**: Historia del entrenador y certificaciones
7. **Testimonios**: 3 historias reales de clientes
8. **Galería**: Imágenes de entrenamiento
9. **Blog Preview**: Últimos artículos del blog
10. **📧 Formulario de Contacto Completo**: Con gestión de datos externa
11. **CTA**: Llamada a la acción para consulta gratuita
12. **Footer**: Links, contacto y legal

## 🔧 Personalización

### 📧 Configurar el Formulario de Contacto

**Estado actual:** ✅ **Sistema completo implementado con Resend + Supabase**

El formulario de contacto está configurado para:
1. 💾 **Guardar datos en Supabase** - Gestión de contactos en base de datos
2. 📧 **Enviar email al usuario** - Confirmación automática vía Resend
3. 🔔 **Notificar al admin** - Email a info@wild-fitness.com con los datos

**📖 Guías de configuración:**
- **Despliegue en Vercel:** [`DESPLIEGUE-VERCEL.md`](DESPLIEGUE-VERCEL.md) - ⭐ Opción 1
- **Despliegue con Cloudflare Workers:** [`DESPLIEGUE-CLOUDFLARE-WORKERS.md`](DESPLIEGUE-CLOUDFLARE-WORKERS.md) - ⭐ Opción 2 (Alternativa)
- **Configuración completa:** [`CONFIGURACION-FORMULARIO-CONTACTO.md`](CONFIGURACION-FORMULARIO-CONTACTO.md)
- **DNS de Cloudflare:** [`DNS-CLOUDFLARE-RESEND.md`](DNS-CLOUDFLARE-RESEND.md)

**Opciones de despliegue:**

### Opción 1: Vercel (Más fácil)
1. ✅ Supabase ya está configurado
2. 🔑 Obtener API Key de Resend
3. ⚠️ Configurar DNS en Cloudflare (DKIM, SPF, MX)
4. 🚀 Agregar `RESEND_API_KEY` en Vercel Environment Variables
5. 🧪 Desplegar y probar

### Opción 2: Cloudflare Workers (Más rápido)
1. ✅ Supabase ya está configurado
2. 🔑 Obtener API Key de Resend
3. ⚠️ Configurar DNS en Cloudflare (DKIM, SPF, MX)
4. 📦 Instalar Wrangler CLI: `npm install -g wrangler`
5. 🚀 Desplegar Worker: `cd workers/contact-form && wrangler deploy`
6. 🔧 Configurar URL en `config.js`

### Actualizar Información de Contacto

Edita estos valores en `index.html`:

```html
<!-- Email -->
<a href="mailto:TU_EMAIL@wild-fitness.com">TU_EMAIL@wild-fitness.com</a>

<!-- WhatsApp -->
<a href="https://wa.me/34TU_NUMERO">+34 XXX XXX XXX</a>
```

### Cambiar Precios

En la sección de programas, actualiza:

```html
<span class="price-amount">€XX</span>
```

### Agregar Imágenes Reales

Reemplaza los placeholders con imágenes reales:

1. Crea carpeta `/images`
2. Agrega tus fotos
3. Actualiza las rutas en CSS/HTML

## 📊 SEO

- **Title**: Wild Fitness - Entrenamiento de Montaña Profesional
- **Description**: Programas de entrenamiento para montaña, trail running y fitness outdoor
- **Keywords**: entrenamiento montaña, trail running, fitness outdoor, hiking training

## 🔒 Seguridad

- HTTPS forzado via Cloudflare
- Sin dependencias externas vulnerables
- Validación de formularios
- Headers de seguridad configurados

## 📈 Analytics (Opcional)

Para agregar Google Analytics, añade antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Próximas Mejoras

- [x] Formulario de contacto completo con BD externa
- [x] Diseño turquesa/teal moderno
- [x] Hero section mejorado con badges
- [ ] Blog de consejos de entrenamiento ✅ (Implementado)
- [ ] Sistema de reservas online
- [ ] Área de cliente privada
- [ ] Calculadora de nivel fitness
- [ ] Integración con Strava
- [ ] Tienda online de planes
- [ ] CRM integrado para gestión de clientes

## 📝 Licencia

© 2024 Wild Fitness. Todos los derechos reservados.

## 👤 Contacto

- **Email**: info@wildbreathing.com
- **Web**: https://wildbreathing.com
- **WhatsApp**: +34 640 915 772
- **Bizum**: 640 915 772
- **Ubicación**: Girona & Barcelona

---

**Hecho con 💚 para los amantes de la montaña**

🏔️ **Wild Fitness** - Laura Ramírez | Entrenadora Personal & Guia de Muntanya
