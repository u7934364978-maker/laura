# Wild Fitness - Entrenamiento de Montaña Profesional

![Wild Fitness](https://img.shields.io/badge/Mountain-Training-2D5016?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-4CAF50?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web-D84315?style=for-the-badge)

## 🏔️ Sobre el Proyecto

**Wild Fitness** es una plataforma web profesional dedicada al entrenamiento de montaña, trail running y fitness outdoor. Diseñada para atletas que buscan conquistar cumbres y mejorar su rendimiento en deportes de montaña.

## ✨ Características

- **Diseño Responsive**: Optimizado para todos los dispositivos (móvil, tablet, desktop)
- **SEO Optimizado**: Configurado para máxima visibilidad en buscadores
- **Performance**: Carga rápida y optimizada
- **Programas de Entrenamiento**: 3 niveles diferentes adaptados a cada atleta
- **Sección de Testimonios**: Historias reales de atletas
- **Formulario de Contacto**: Sistema de contacto integrado
- **Animaciones Suaves**: Experiencia de usuario fluida y profesional

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
├── styles.css          # Estilos CSS
├── script.js           # JavaScript
├── CNAME              # Configuración de dominio personalizado
└── README.md          # Documentación
```

## 🌐 Despliegue

El sitio está configurado para desplegarse automáticamente en GitHub Pages con el dominio personalizado **wild-fitness.com**.

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

- **Primary Green**: `#2D5016` (Verde bosque)
- **Secondary Orange**: `#D84315` (Naranja montaña)
- **Accent**: `#FFA726` (Amarillo cálido)
- **Text**: `#212121` (Negro principal)
- **Background**: `#FAFAFA` (Gris claro)

## 📱 Secciones

1. **Hero Section**: Impacto visual inmediato con CTA
2. **Features**: 4 características principales del servicio
3. **Programas**: 3 niveles de entrenamiento con precios
4. **Sobre Mí**: Historia del entrenador y certificaciones
5. **Testimonios**: 3 historias reales de clientes
6. **CTA**: Llamada a la acción para consulta gratuita
7. **Contacto**: Formulario y datos de contacto
8. **Footer**: Links, contacto y legal

## 🔧 Personalización

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

- [ ] Blog de consejos de entrenamiento
- [ ] Sistema de reservas online
- [ ] Área de cliente privada
- [ ] Calculadora de nivel fitness
- [ ] Integración con Strava
- [ ] Tienda online de planes

## 📝 Licencia

© 2024 Wild Fitness. Todos los derechos reservados.

## 👤 Contacto

- **Email**: info@wild-fitness.com
- **Web**: https://wild-fitness.com
- **WhatsApp**: +34 600 000 000

---

**Hecho con 💚 para los amantes de la montaña**

🏔️ **Wild Fitness** - Conquista tus cumbres
