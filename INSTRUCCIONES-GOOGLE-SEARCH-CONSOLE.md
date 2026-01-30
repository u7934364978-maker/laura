# 📨 INSTRUCCIONES PARA GOOGLE SEARCH CONSOLE

**⚠️ IMPORTANTE:** Sigue estos pasos DESPUÉS de que Vercel complete el deploy (espera 2-3 minutos)

---

## ✅ PASO 1: Verificar que el Deploy está Completo

Antes de notificar a Google, confirma que los cambios están en producción:

### Opción A: Verificación Rápida (Navegador)
```
1. Abre: https://www.wild-fitness.com/sitemap.xml
2. Verifica que todas las URLs tengan www
3. Verifica que no haya extensiones .html
```

### Opción B: Verificación Automatizada (Recomendado)
```bash
cd /home/user/webapp
./verificar-seo.sh
```

**Resultado esperado:** ✅ 0 errores, todos los tests exitosos

---

## 📋 PASO 2: Acceder a Google Search Console

1. Ve a: **https://search.google.com/search-console**
2. Inicia sesión con tu cuenta de Google
3. Selecciona la propiedad: **wild-fitness.com**

---

## 🗺️ PASO 3: Enviar Nuevo Sitemap

### 3.1. Eliminar Sitemap Antiguo (si existe)

```
1. En el menú lateral → Indexación → Sitemaps
2. Si ves un sitemap listado:
   • Haz clic en los tres puntos (⋮) al lado del sitemap
   • Selecciona "Eliminar sitemap"
   • Confirma la eliminación
```

### 3.2. Agregar Sitemap Nuevo

```
1. En la misma página (Indexación → Sitemaps)
2. En el campo "Agregar un sitemap nuevo"
3. Escribe: sitemap.xml
4. Haz clic en "Enviar"
5. Espera la confirmación (aparecerá el sitemap en la lista)
```

**Estado esperado:** 
- Estado: "Éxito" (puede tardar unos minutos)
- URLs descubiertas: 13

---

## 🔍 PASO 4: Solicitar Re-indexación de Páginas Principales

Debes solicitar la re-indexación de las 3 páginas más importantes:

### URL 1: Página Principal

```
1. En el menú lateral → Inspección de URLs
2. En la barra superior, pega: https://www.wild-fitness.com/
3. Presiona Enter y espera
4. Google inspeccionará la URL (10-20 segundos)
5. Una vez termine, haz clic en "Solicitar indexación"
6. Espera confirmación (1-2 minutos)
7. Verás: "Se ha solicitado la indexación"
```

### URL 2: Calendari

```
1. En la misma barra de Inspección de URLs
2. Pega: https://www.wild-fitness.com/calendari
3. Presiona Enter y espera
4. Haz clic en "Solicitar indexación"
5. Espera confirmación
```

### URL 3: Blog

```
1. En la misma barra de Inspección de URLs
2. Pega: https://www.wild-fitness.com/blog
3. Presiona Enter y espera
4. Haz clic en "Solicitar indexación"
5. Espera confirmación
```

---

## ⏱️ PASO 5: OPCIONAL - Solicitar Re-indexación de Artículos

Si quieres acelerar la indexación de los artículos del blog, repite el proceso para:

- https://www.wild-fitness.com/blog/preparar-primera-trail-running-catalunya-2026
- https://www.wild-fitness.com/blog/nutricio-esportiva-trail-runners-catalunya-2026
- https://www.wild-fitness.com/blog/trail-running-pirineus-catalans-guia-2026

**Nota:** Google solo permite solicitar indexación de unas pocas URLs por día. Si te sale error de "cuota", espera 24 horas.

---

## 📊 PASO 6: Revisar Estado de Cobertura

Después de solicitar las indexaciones:

```
1. Menú lateral → Indexación → Páginas
2. Verás un gráfico con el estado de indexación
3. Actualmente verás:
   - "No se encontró" o "Error de redirección": 3-5 páginas
4. Este número debería empezar a bajar en 1-2 semanas
```

---

## 🎯 CRONOGRAMA DE VERIFICACIÓN

### Semana 1:
- ✅ Día 1: Enviar sitemap y solicitar indexación (HOY)
- ✅ Día 3: Verificar que Google procesó el sitemap
- ✅ Día 7: Revisar "Indexación → Páginas" - deberían empezar a reducirse errores

### Semana 2:
- ✅ Día 10: Verificar reducción de errores
- ✅ Día 14: Confirmar que más páginas están indexadas

### Semana 3-4:
- ✅ Día 21: Los errores deberían estar casi en 0
- ✅ Día 28: Todas las páginas principales indexadas

### Mes 2-3:
- ✅ Monitorear tráfico orgánico en Google Analytics
- ✅ Verificar mejora en posiciones (ranking)

---

## 🔔 CONFIGURAR ALERTAS (Opcional)

Para recibir notificaciones de Google:

```
1. En Google Search Console
2. Icono de configuración (⚙️) en la parte superior derecha
3. "Preferencias de usuario"
4. Marca: "Recibir todas las notificaciones por correo"
5. Guardar
```

---

## ❓ PREGUNTAS FRECUENTES

### ¿Cuánto tarda Google en procesar el sitemap?
**R:** Entre 1-3 días. Verás el sitemap con estado "Éxito" en pocas horas.

### ¿Cuánto tarda en reducirse los errores?
**R:** Entre 1-3 semanas. Google necesita tiempo para re-inspeccionar todas las páginas.

### ¿Qué pasa si veo "Error de cobertura" en el sitemap?
**R:** Es normal los primeros días. Google está procesando los cambios. Si persiste después de 1 semana, revisa el sitemap.

### ¿Puedo solicitar indexación de más de 3 URLs por día?
**R:** Sí, pero hay un límite diario. Si te sale error de "cuota excedida", espera 24 horas.

### ¿Debo hacer algo más después de enviar el sitemap?
**R:** Solo monitorear semanalmente. Google hará el resto automáticamente.

---

## 📈 CÓMO VERIFICAR RESULTADOS

### Ver Páginas Indexadas:
```
1. Google Search Console
2. Indexación → Páginas
3. Gráfico mostrará páginas indexadas vs no indexadas
4. Deberías ver aumento de páginas indexadas semanalmente
```

### Ver Impresiones y Clics:
```
1. Google Search Console
2. Rendimiento
3. Últimos 3 meses
4. Compara "Clics totales" e "Impresiones totales"
5. Deberías ver aumento después de 4-6 semanas
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de completar todos los pasos:

- [ ] Deploy de Vercel completado
- [ ] Cambios verificados en producción
- [ ] Sitemap antiguo eliminado (si existía)
- [ ] Sitemap nuevo enviado (sitemap.xml)
- [ ] Google procesó el sitemap (Estado: "Éxito")
- [ ] Solicitada indexación de: www.wild-fitness.com/
- [ ] Solicitada indexación de: www.wild-fitness.com/calendari
- [ ] Solicitada indexación de: www.wild-fitness.com/blog
- [ ] Alertas por email configuradas (opcional)
- [ ] Recordatorio semanal para monitorear GSC

---

## 🎯 META FINAL

```
OBJETIVO EN GOOGLE SEARCH CONSOLE:

┌─────────────────────────────────────────┐
│ Indexación → Páginas:                   │
│                                         │
│ ✅ Páginas indexadas: 13/13            │
│ ❌ Errores: 0                           │
│ ⚠️  Advertencias: 0                     │
│                                         │
│ Estado: TODAS LAS PÁGINAS INDEXADAS    │
└─────────────────────────────────────────┘

TIMELINE:
- Hoy: Enviar sitemap ✅
- Semana 1: Google procesa cambios
- Semana 2-3: Errores reducidos
- Mes 1-2: Meta alcanzada 🎉
```

---

## 🚀 ¡VAMOS A HACERLO!

**Paso siguiente:** Ve a Google Search Console y empieza con el PASO 2 de este documento.

**Tiempo total estimado:** 15-20 minutos

**Dificultad:** ⭐⭐ Fácil (solo seguir pasos)

---

**¿Necesitas ayuda?** Revisa los archivos:
- `SOLUCIONES-IMPLEMENTADAS.md` - Resumen de cambios
- `informe-auditoria-seo-wild-fitness.md` - Análisis completo
- `verificar-seo.sh` - Script de verificación

---

**Última actualización:** 30 de Enero de 2026  
**Estado:** ✅ Listo para usar
