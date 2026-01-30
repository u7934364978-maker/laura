#!/bin/bash

# Script de Verificación SEO - Wild Fitness
# Este script verifica los problemas de indexación encontrados

echo "================================================"
echo "🔍 VERIFICACIÓN SEO - WILD FITNESS"
echo "================================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="https://www.wild-fitness.com"
ERRORS=0
WARNINGS=0
SUCCESS=0

echo "📋 Verificando: $DOMAIN"
echo ""

# ==================================================
# TEST 1: Verificar Sitemap.xml
# ==================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Verificando Sitemap.xml"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar que el sitemap existe
SITEMAP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/sitemap.xml")

if [ "$SITEMAP_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓${NC} Sitemap.xml accesible (HTTP 200)"
    SUCCESS=$((SUCCESS + 1))
    
    # Verificar que todas las URLs tengan www
    SITEMAP_CONTENT=$(curl -s "$DOMAIN/sitemap.xml")
    NO_WWW_COUNT=$(echo "$SITEMAP_CONTENT" | grep -o "https://wild-fitness.com" | wc -l)
    
    if [ "$NO_WWW_COUNT" -gt 0 ]; then
        echo -e "${RED}✗${NC} PROBLEMA: $NO_WWW_COUNT URLs sin 'www' encontradas en sitemap"
        echo "  → Debes actualizar sitemap.xml con URLs que incluyan 'www'"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓${NC} Todas las URLs del sitemap incluyen 'www'"
        SUCCESS=$((SUCCESS + 1))
    fi
    
    # Verificar que no haya URLs con .html
    HTML_COUNT=$(echo "$SITEMAP_CONTENT" | grep -o "\.html" | wc -l)
    
    if [ "$HTML_COUNT" -gt 0 ]; then
        echo -e "${RED}✗${NC} PROBLEMA: $HTML_COUNT URLs con extensión .html encontradas"
        echo "  → Las URLs no deberían tener extensión .html"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓${NC} Ninguna URL contiene extensión .html"
        SUCCESS=$((SUCCESS + 1))
    fi
else
    echo -e "${RED}✗${NC} PROBLEMA: Sitemap.xml no accesible (HTTP $SITEMAP_RESPONSE)"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ==================================================
# TEST 2: Verificar Redirecciones
# ==================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Verificando Redirecciones"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 2.1: Home sin www debe redirigir a con www
echo "Test 2.1: Redirección de dominio sin www → con www"
NO_WWW_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://wild-fitness.com/")
if [ "$NO_WWW_RESPONSE" == "308" ] || [ "$NO_WWW_RESPONSE" == "301" ]; then
    echo -e "${GREEN}✓${NC} Redirección correcta: wild-fitness.com → www.wild-fitness.com"
    SUCCESS=$((SUCCESS + 1))
else
    echo -e "${YELLOW}⚠${NC} ADVERTENCIA: No hay redirección desde dominio sin www"
    WARNINGS=$((WARNINGS + 1))
fi

# Test 2.2: Home con www debe devolver 200
echo "Test 2.2: URL canónica www.wild-fitness.com/"
WWW_HOME_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/")
if [ "$WWW_HOME_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓${NC} Página principal accesible (HTTP 200)"
    SUCCESS=$((SUCCESS + 1))
else
    echo -e "${RED}✗${NC} PROBLEMA: Página principal no accesible (HTTP $WWW_HOME_RESPONSE)"
    ERRORS=$((ERRORS + 1))
fi

# Test 2.3: Verificar que .html redirija a sin .html
echo "Test 2.3: Redirección de URLs con .html"
CALENDARI_HTML=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/calendari.html")
if [ "$CALENDARI_HTML" == "308" ] || [ "$CALENDARI_HTML" == "301" ]; then
    echo -e "${GREEN}✓${NC} calendari.html redirige correctamente"
    SUCCESS=$((SUCCESS + 1))
else
    echo -e "${YELLOW}⚠${NC} ADVERTENCIA: calendari.html no redirige (HTTP $CALENDARI_HTML)"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ==================================================
# TEST 3: Verificar Etiquetas Canonical
# ==================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Verificando Etiquetas Canonical"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Función para verificar canonical
check_canonical() {
    local url=$1
    local page_name=$2
    
    echo "Test 3.$page_name: Verificando canonical de $url"
    
    CANONICAL=$(curl -s "$url" | grep -o '<link rel="canonical" href="[^"]*"' | sed 's/.*href="\([^"]*\)".*/\1/')
    
    if [ -z "$CANONICAL" ]; then
        echo -e "${RED}✗${NC} PROBLEMA: No se encontró etiqueta canonical"
        ERRORS=$((ERRORS + 1))
        return
    fi
    
    echo "  Canonical encontrado: $CANONICAL"
    
    # Verificar que tenga www
    if [[ $CANONICAL == *"www.wild-fitness.com"* ]]; then
        echo -e "${GREEN}✓${NC} Canonical incluye 'www'"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}✗${NC} PROBLEMA: Canonical NO incluye 'www'"
        echo "  → Cambiar a: https://www.wild-fitness.com/..."
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar que no tenga .html
    if [[ $CANONICAL == *".html"* ]]; then
        echo -e "${RED}✗${NC} PROBLEMA: Canonical contiene .html"
        echo "  → Eliminar extensión .html de la URL canonical"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓${NC} Canonical no contiene .html"
        SUCCESS=$((SUCCESS + 1))
    fi
}

# Verificar canonical de páginas principales
check_canonical "$DOMAIN/" "1 (Home)"
echo ""
check_canonical "$DOMAIN/calendari" "2 (Calendari)"
echo ""
check_canonical "$DOMAIN/blog" "3 (Blog)"
echo ""

# ==================================================
# TEST 4: Verificar robots.txt
# ==================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: Verificando robots.txt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ROBOTS_CONTENT=$(curl -s "$DOMAIN/robots.txt")

if [[ $ROBOTS_CONTENT == *"Sitemap:"* ]]; then
    echo -e "${GREEN}✓${NC} robots.txt contiene referencia a Sitemap"
    SUCCESS=$((SUCCESS + 1))
    
    SITEMAP_URL=$(echo "$ROBOTS_CONTENT" | grep "Sitemap:" | awk '{print $2}')
    echo "  Sitemap declarado: $SITEMAP_URL"
    
    if [[ $SITEMAP_URL == *"www.wild-fitness.com"* ]]; then
        echo -e "${GREEN}✓${NC} URL de sitemap incluye 'www'"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}✗${NC} PROBLEMA: URL de sitemap no incluye 'www'"
        echo "  → Cambiar a: https://www.wild-fitness.com/sitemap.xml"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} PROBLEMA: robots.txt no contiene referencia a Sitemap"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ==================================================
# TEST 5: Verificar Páginas de Blog
# ==================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 5: Verificando Accesibilidad de Artículos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BLOG_URLS=(
    "$DOMAIN/blog/preparar-primera-trail-running-catalunya-2026"
    "$DOMAIN/blog/nutricio-esportiva-trail-runners-catalunya-2026"
    "$DOMAIN/blog/trail-running-pirineus-catalans-guia-2026"
)

BLOG_SUCCESS=0
for blog_url in "${BLOG_URLS[@]}"; do
    BLOG_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$blog_url")
    
    if [ "$BLOG_RESPONSE" == "200" ]; then
        echo -e "${GREEN}✓${NC} Artículo accesible: $(basename $blog_url)"
        BLOG_SUCCESS=$((BLOG_SUCCESS + 1))
    else
        echo -e "${YELLOW}⚠${NC} Artículo no accesible (HTTP $BLOG_RESPONSE): $(basename $blog_url)"
    fi
done

if [ "$BLOG_SUCCESS" -gt 0 ]; then
    SUCCESS=$((SUCCESS + 1))
fi

echo ""

# ==================================================
# RESUMEN FINAL
# ==================================================
echo "================================================"
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "================================================"
echo ""
echo -e "${GREEN}✓ Tests exitosos:${NC}    $SUCCESS"
echo -e "${YELLOW}⚠ Advertencias:${NC}      $WARNINGS"
echo -e "${RED}✗ Errores encontrados:${NC} $ERRORS"
echo ""

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    echo "================================================"
    echo -e "${GREEN}🎉 ¡PERFECTO! No se encontraron problemas${NC}"
    echo "================================================"
    echo ""
    echo "Tu sitio está configurado correctamente para SEO."
    echo "Google debería indexar todas las páginas sin problemas."
    exit 0
elif [ "$ERRORS" -eq 0 ]; then
    echo "================================================"
    echo -e "${YELLOW}⚠ CASI PERFECTO - Algunas advertencias${NC}"
    echo "================================================"
    echo ""
    echo "Hay algunas advertencias menores."
    echo "El sitio debería funcionar, pero revisa las advertencias arriba."
    exit 1
else
    echo "================================================"
    echo -e "${RED}❌ SE ENCONTRARON PROBLEMAS${NC}"
    echo "================================================"
    echo ""
    echo "Por favor, corrige los errores mencionados arriba."
    echo "Consulta los archivos:"
    echo "  - informe-auditoria-seo-wild-fitness.md"
    echo "  - guia-paso-a-paso-correccion.md"
    exit 2
fi
