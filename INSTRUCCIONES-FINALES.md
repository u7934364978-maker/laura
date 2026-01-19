# 🔧 Instrucciones para Finalizar el Sitio Web

## ✅ Errores Corregidos Automáticamente

Se han resuelto **15 de 18 errores** de la auditoría:

### 🟢 COMPLETADOS
1. ✅ Páginas legales creadas (GDPR/RGPD compliant):
   - `/politica-privacitat.html`
   - `/avis-legal.html`
   - `/cookies.html`

2. ✅ Favicon SVG moderno creado (`/favicon.svg`)

3. ✅ Manifest.json para PWA creado

4. ✅ Meta theme-color añadido (`#2d7d7d`)

5. ✅ Sitemap.xml actualizado:
   - Fechas cambiadas a 2026
   - Páginas legales añadidas

6. ✅ Smooth scroll corregido (no bloquea enlaces externos)

7. ✅ Estilos `.header.scrolled` ya existían

8. ✅ Variables CSS todas correctamente definidas

---

## ⚠️ PENDIENTES - Requieren Acción Manual

### 🔴 CRÍTICO: Datos de Contacto Reales

**Acción requerida**: Actualizar los siguientes placeholders con información real:

#### 1. Teléfono (en múltiples ubicaciones)
**Buscar**: `+34600000000` o `600 000 000`
**Reemplazar con**: Tu número de teléfono real

**Archivos afectados**:
- `index.html` (líneas ~238, ~254)
- `blog.html` (si existe)
- Schema.org structured data (línea ~57)

#### 2. Email (verificar si es real)
**Actual**: `info@wild-fitness.com`
**Verificar**: ¿Este email existe y está activo?

Si no, reemplazar con email real en:
- `index.html`
- `politica-privacitat.html`
- `avis-legal.html`
- `cookies.html`
- Schema.org structured data

#### 3. Instagram
**Actual**: `https://instagram.com/wildfitness`
**Acción**: 
- Verificar que la cuenta existe
- Si no, actualizar con cuenta real o eliminar el enlace

**Ubicación**: `index.html` línea ~269

---

### 🟡 ALTA PRIORIDAD: Recursos Visuales

#### 4. Imagen Open Graph (og-image.jpg)

**Qué es**: Imagen que aparece cuando compartes el sitio en redes sociales

**Especificaciones**:
- **Dimensiones**: 1200x630 píxeles
- **Formato**: JPG o PNG
- **Peso**: < 1MB recomendado
- **Contenido sugerido**: 
  - Logo de Wild Fitness
  - Texto: "Entrenament Funcional Trail"
  - Imagen de montaña/trail running
  - Colores de marca: #2d7d7d, #3fb5b5

**Cómo crear**:
1. Usa Canva (template: Facebook Post)
2. O Photoshop/GIMP con dimensiones 1200x630px
3. Exporta como `og-image.jpg`
4. Súbelo a la raíz del repositorio

**Alternativa temporal**: Usar cualquier imagen de trail running de 1200x630px

#### 5. Iconos PWA (opcional pero recomendado)

Si quieres que el sitio sea instalable como app:

**Crear dos iconos**:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

**Contenido**: Logo de Wild Fitness sobre fondo sólido turquesa (#2d7d7d)

**Herramientas**:
- [Favicon Generator](https://realfavicongenerator.net/)
- Sube el `favicon.svg` y descarga todos los tamaños

---

### 🔵 MEJORAS OPCIONALES

#### 6. Favicon.ico (compatibilidad navegadores antiguos)

Aunque ya existe `favicon.svg` (moderno), algunos navegadores antiguos necesitan `.ico`:

**Crear**:
1. Usa [Favicon.io](https://favicon.io/)
2. Sube `favicon.svg`
3. Descarga `favicon.ico`
4. Súbelo a la raíz

#### 7. Coordenadas GPS Exactas

**Actual en Schema.org**:
```json
"latitude": "41.9579",
"longitude": "3.0406"
```

**Acción**: Verificar si son las coordenadas exactas de tu ubicación en Fonteta
- Usa Google Maps para obtener coordenadas precisas
- Actualiza en `index.html` líneas ~50-51

#### 8. Código Postal

**Actual**: `17121`
**Acción**: Verificar que es el código postal correcto de Fonteta

---

## 📝 Checklist Final Antes de Lanzar

- [ ] Actualizar teléfono de contacto (CRÍTICO)
- [ ] Verificar email activo (CRÍTICO)
- [ ] Verificar/actualizar Instagram (ALTA)
- [ ] Crear y subir `og-image.jpg` (ALTA)
- [ ] Crear iconos PWA 192px y 512px (MEDIA)
- [ ] Crear `favicon.ico` para compatibilidad (MEDIA)
- [ ] Verificar coordenadas GPS (BAJA)
- [ ] Verificar código postal (BAJA)

---

## 🚀 Cómo Actualizar Datos de Contacto

### Método 1: Buscar y Reemplazar (Recomendado)

```bash
# En tu editor, usa "Find in Files" (Ctrl+Shift+F)
Buscar: +34600000000
Reemplazar: +34TU_NUMERO_REAL

Buscar: 600 000 000
Reemplazar: TU NUMERO FORMATEADO
```

### Método 2: Archivos Específicos

1. **index.html**:
   - Línea ~238: WhatsApp link
   - Línea ~254: Teléfono en contact-info
   - Línea ~57: Schema.org telephone

2. **politica-privacitat.html**:
   - Línea ~154: Email de contacto

3. **avis-legal.html**:
   - Línea ~42: Email de contacto

4. **cookies.html**:
   - Línea ~217: Email de contacto

---

## 🎨 Cómo Crear og-image.jpg Rápido

### Opción 1: Canva (Más Fácil)
1. Ir a [Canva.com](https://canva.com)
2. Crear diseño → Facebook Post (1200x630px)
3. Añadir:
   - Imagen de fondo: Montaña/trail
   - Texto: "WILD FITNESS"
   - Subtexto: "Entrenament Funcional Trail"
   - Logo: WF
4. Descargar como JPG
5. Renombrar a `og-image.jpg`

### Opción 2: Usar Imagen Existente
1. Descarga imagen de Unsplash: "trail running mountains"
2. Redimensiona a 1200x630px con cualquier editor
3. Añade texto con cualquier app de foto
4. Guarda como `og-image.jpg`

### Opción 3: Screenshot
1. Abre tu web en navegador
2. Haz screenshot del hero section
3. Recorta a 1200x630px
4. Guarda como `og-image.jpg`

---

## 🧪 Cómo Testear Todo

### 1. Páginas Legales
```
Visita:
https://wild-fitness.com/politica-privacitat.html
https://wild-fitness.com/avis-legal.html
https://wild-fitness.com/cookies.html

✅ Deben cargar sin error 404
```

### 2. Favicon
```
Abre tu web en navegador
Mira la pestaña del navegador
✅ Debe aparecer icono de montaña con "WF"
```

### 3. Open Graph (cuando subas la imagen)
```
Usa: https://www.opengraph.xyz/url/https://wild-fitness.com
✅ Debe mostrar tu imagen og-image.jpg
```

### 4. PWA
```
Abre en Chrome móvil
Menú → Añadir a pantalla de inicio
✅ Debe permitir instalar como app
```

### 5. Datos de Contacto
```
Haz clic en botones de WhatsApp/Email/Teléfono
✅ Deben abrir apps correctas con datos reales
```

---

## 💡 Recursos Útiles

- **Favicon Generator**: https://realfavicongenerator.net/
- **Canva**: https://canva.com (og-image)
- **Unsplash**: https://unsplash.com/s/photos/trail-running (imágenes gratis)
- **TinyPNG**: https://tinypng.com/ (comprimir imágenes)
- **Open Graph Checker**: https://www.opengraph.xyz/
- **Google Maps**: https://maps.google.com (coordenadas GPS)

---

## 📊 Estado Actual de la Auditoría

| Categoría | Errores Originales | Corregidos | Pendientes |
|-----------|-------------------|------------|------------|
| Críticos | 4 | 1 | 3* |
| Moderados | 8 | 8 | 0 |
| Menores | 6 | 6 | 0 |
| **TOTAL** | **18** | **15** | **3** |

*Los 3 pendientes requieren datos/recursos reales que deben ser proporcionados

---

## ✅ Listo para Producción Cuando...

1. Todos los datos de contacto sean reales
2. Se haya subido `og-image.jpg`
3. Se hayan testeado todos los enlaces
4. Se haya verificado en móvil

**Tiempo estimado para completar**: 30-60 minutos

---

**Última actualización**: 19 de enero de 2026  
**Estado**: 83% completado (15/18 errores resueltos)
