# 📸 Instrucciones para Subir las Nuevas Imágenes de la Galería

## ⚠️ Problema Detectado
Las imágenes que compartiste están protegidas y no puedo descargarlas automáticamente.

**Error recibido:** `{"detail":"Access denied","reason":"Backend denied access"}`

## ✅ Solución: Subir Manualmente

### Opción 1: Usando Git (Recomendado)

1. **Clona el repositorio en tu ordenador:**
   ```bash
   git clone https://github.com/pcsnh9gwgv-pixel/laura.git
   cd laura
   ```

2. **Copia las 3 nuevas imágenes a la carpeta correcta:**
   - Renombra tus imágenes a:
     - `laura-hero-1.jpg` (primera imagen)
     - `laura-hero-2.jpg` (segunda imagen)
     - `laura-hero-3.jpg` (tercera imagen)
   - Cópialas a la carpeta `images/`:
     ```bash
     cp /ruta/a/tus/imagenes/laura-hero-1.jpg images/
     cp /ruta/a/tus/imagenes/laura-hero-2.jpg images/
     cp /ruta/a/tus/imagenes/laura-hero-3.jpg images/
     ```

3. **Sube los cambios:**
   ```bash
   git add images/laura-hero-1.jpg images/laura-hero-2.jpg images/laura-hero-3.jpg
   git commit -m "feat: add new gallery images for home page"
   git push origin main
   ```

### Opción 2: Usando GitHub Web Interface

1. **Ve a tu repositorio en GitHub:**
   https://github.com/pcsnh9gwgv-pixel/laura

2. **Navega a la carpeta `images/`**

3. **Haz clic en "Add file" → "Upload files"**

4. **Arrastra las 3 imágenes** (asegúrate de que tengan estos nombres exactos):
   - `laura-hero-1.jpg`
   - `laura-hero-2.jpg`
   - `laura-hero-3.jpg`

5. **Escribe un commit message:** "Add new gallery images"

6. **Haz clic en "Commit changes"**

### Opción 3: Compartir las Imágenes Conmigo

Si prefieres que lo haga yo, comparte las imágenes de una de estas formas:

1. **Dropbox/Google Drive:**
   - Sube las imágenes
   - Genera un enlace público
   - Compárteme los enlaces

2. **Imgur:**
   - Sube a https://imgur.com/upload
   - Copia los enlaces directos de las imágenes
   - Compártelos conmigo

3. **Base64 (si las imágenes son pequeñas):**
   - Puedes convertirlas a base64 y pegarlas en el chat

## 📁 Nombres de Archivo Requeridos

**IMPORTANTE:** Las imágenes deben tener exactamente estos nombres:

```
/home/user/webapp/images/laura-hero-1.jpg
/home/user/webapp/images/laura-hero-2.jpg
/home/user/webapp/images/laura-hero-3.jpg
```

## 🗂️ Imágenes Anteriores

Las 3 imágenes anteriores de la galería han sido respaldadas en:

```
/home/user/webapp/images/archive/laura-trail-1.jpg
/home/user/webapp/images/archive/laura-trail-2.jpg
/home/user/webapp/images/archive/laura-training-group.jpg
```

Estas imágenes están disponibles para usarlas en otra sección de la web cuando quieras.

## 🎯 Tamaño Recomendado de Imágenes

Para un rendimiento óptimo:

- **Ancho:** 800-1200px
- **Formato:** JPG (optimizado)
- **Peso:** Máximo 300KB por imagen
- **Aspecto:** Horizontal o cuadrado (ratio 4:3 o 1:1)

### Herramientas de Optimización

Si las imágenes pesan mucho:

- **Online:** https://tinyjpg.com/ o https://squoosh.app/
- **Mac:** Vista Previa → Exportar → Reducir calidad al 80%
- **Windows:** Paint → Guardar como → Ajustar calidad

## ✅ Verificación

Una vez subidas las imágenes:

1. **Espera 1-2 minutos** para que Cloudflare Pages se despliegue
2. **Visita:** https://wildbreathing.com/
3. **Desplázate** hasta la sección "Photo Gallery" (después de "Sobre Laura")
4. **Verifica** que las 3 nuevas imágenes aparecen correctamente

## 🔧 Cambios Ya Realizados

✅ El código HTML ya está actualizado para usar las nuevas imágenes:

```html
<div class="gallery-item">
    <img src="/images/laura-hero-1.jpg" alt="Laura Ramírez trail running pels Pirineus" loading="lazy">
    <div class="gallery-overlay">
        <p>Trail pels Pirineus</p>
    </div>
</div>
<div class="gallery-item">
    <img src="/images/laura-hero-2.jpg" alt="Laura Ramírez entrenament de muntanya" loading="lazy">
    <div class="gallery-overlay">
        <p>Entrenament de Muntanya</p>
    </div>
</div>
<div class="gallery-item">
    <img src="/images/laura-hero-3.jpg" alt="Laura Ramírez guiant trail running" loading="lazy">
    <div class="gallery-overlay">
        <p>Guiant per Muntanya</p>
    </div>
</div>
```

## 📱 Contacto

Si tienes problemas, puedes:

1. **Compartirme enlaces públicos** de las imágenes
2. **Usar la interfaz web de GitHub** para subirlas
3. **Pedirme que cree imágenes placeholder** temporales mientras subes las reales

---

**Estado Actual:**
- ✅ Código HTML actualizado
- ⏳ Esperando que subas las imágenes
- 📦 Imágenes antiguas respaldadas en `/images/archive/`
