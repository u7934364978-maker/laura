#!/bin/bash

# ============================================
# 🔍 Verificar DNS de Wild Fitness para Resend
# ============================================

DOMAIN="wild-fitness.com"
DOMAIN_WWW="www.wild-fitness.com"

echo "=============================================="
echo "🔍 Verificación DNS para Resend"
echo "Dominio: $DOMAIN"
echo "=============================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# 1. Verificar IP del dominio
# ============================================
echo -e "${BLUE}📍 1. IP del dominio raíz${NC}"
IP=$(dig +short $DOMAIN A | head -1)
if [ -z "$IP" ]; then
    echo -e "${RED}❌ No se encuentra registro A${NC}"
else
    echo -e "${GREEN}✅ IP: $IP${NC}"
fi
echo ""

# ============================================
# 2. Verificar registros TXT (SPF, DKIM, Verificación)
# ============================================
echo -e "${BLUE}📝 2. Registros TXT en el dominio raíz${NC}"
TXT_RECORDS=$(dig +short $DOMAIN TXT)
if [ -z "$TXT_RECORDS" ]; then
    echo -e "${RED}❌ No hay registros TXT configurados${NC}"
    echo -e "${YELLOW}⚠️  Necesitas agregar los registros TXT de Resend${NC}"
else
    echo -e "${GREEN}✅ Registros TXT encontrados:${NC}"
    echo "$TXT_RECORDS" | while read line; do
        echo "   $line"
    done
fi
echo ""

# ============================================
# 3. Verificar DKIM de Resend
# ============================================
echo -e "${BLUE}🔑 3. Registro DKIM de Resend (resend._domainkey)${NC}"
DKIM=$(dig +short resend._domainkey.$DOMAIN TXT)
if [ -z "$DKIM" ]; then
    echo -e "${RED}❌ No se encuentra el registro DKIM de Resend${NC}"
    echo -e "${YELLOW}⚠️  Necesitas agregar: resend._domainkey.$DOMAIN${NC}"
else
    echo -e "${GREEN}✅ DKIM configurado:${NC}"
    echo "   $DKIM" | head -c 80
    echo "... (recortado)"
fi
echo ""

# ============================================
# 4. Verificar DMARC
# ============================================
echo -e "${BLUE}🛡️  4. Registro DMARC${NC}"
DMARC=$(dig +short _dmarc.$DOMAIN TXT)
if [ -z "$DMARC" ]; then
    echo -e "${YELLOW}⚠️  No hay registro DMARC (opcional pero recomendado)${NC}"
else
    echo -e "${GREEN}✅ DMARC configurado:${NC}"
    echo "   $DMARC"
fi
echo ""

# ============================================
# 5. Verificar registros MX
# ============================================
echo -e "${BLUE}📧 5. Registros MX (email)${NC}"
MX=$(dig +short $DOMAIN MX)
if [ -z "$MX" ]; then
    echo -e "${YELLOW}⚠️  No hay registros MX configurados${NC}"
    echo "   (Puede ser normal si no recibes emails en este dominio)"
else
    echo -e "${GREEN}✅ Registros MX:${NC}"
    echo "$MX"
fi
echo ""

# ============================================
# 6. Verificar nameservers (Cloudflare)
# ============================================
echo -e "${BLUE}🌐 6. Nameservers${NC}"
NS=$(dig +short $DOMAIN NS)
if echo "$NS" | grep -q "cloudflare"; then
    echo -e "${GREEN}✅ Usando Cloudflare:${NC}"
    echo "$NS"
else
    echo -e "${YELLOW}⚠️  Nameservers:${NC}"
    echo "$NS"
fi
echo ""

# ============================================
# 7. Verificar registros alternativos comunes
# ============================================
echo -e "${BLUE}🔄 7. Verificando registros alternativos de Resend${NC}"

# Intentar con diferentes prefijos comunes de Resend
PREFIXES=("resend" "rs1" "rs2" "resend1" "resend2" "s1" "s2")

found_any=false
for prefix in "${PREFIXES[@]}"; do
    result=$(dig +short ${prefix}._domainkey.$DOMAIN TXT 2>/dev/null)
    if [ ! -z "$result" ]; then
        echo -e "${GREEN}✅ Encontrado: ${prefix}._domainkey.$DOMAIN${NC}"
        found_any=true
    fi
done

if [ "$found_any" = false ]; then
    echo -e "${YELLOW}⚠️  No se encontraron registros DKIM alternativos${NC}"
fi
echo ""

# ============================================
# Resumen y recomendaciones
# ============================================
echo "=============================================="
echo -e "${BLUE}📊 RESUMEN Y RECOMENDACIONES${NC}"
echo "=============================================="
echo ""

# Comprobar si tiene los básicos para Resend
has_txt=false
has_dkim=false

if [ ! -z "$TXT_RECORDS" ]; then
    has_txt=true
fi

if [ ! -z "$DKIM" ]; then
    has_dkim=true
fi

if [ "$has_txt" = true ] && [ "$has_dkim" = true ]; then
    echo -e "${GREEN}✅ Configuración DNS básica para Resend presente${NC}"
    echo ""
    echo "🎯 Pasos siguientes:"
    echo "1. Ve a https://resend.com/domains"
    echo "2. Haz click en 'Verify' para tu dominio"
    echo "3. Si aún no verifica, espera 5-10 minutos más (propagación DNS)"
    echo "4. Verifica con: https://dnschecker.org"
else
    echo -e "${RED}❌ Configuración incompleta para Resend${NC}"
    echo ""
    echo "🎯 Necesitas hacer:"
    if [ "$has_txt" = false ]; then
        echo -e "${RED}❌ 1. Agregar registros TXT de verificación en Cloudflare${NC}"
    fi
    if [ "$has_dkim" = false ]; then
        echo -e "${RED}❌ 2. Agregar registro DKIM (resend._domainkey) en Cloudflare${NC}"
    fi
    echo ""
    echo "📋 Pasos para agregar en Cloudflare:"
    echo "1. Ve a: https://dash.cloudflare.com"
    echo "2. Selecciona: wild-fitness.com"
    echo "3. Ve a: DNS → Records"
    echo "4. Click: Add record"
    echo "5. Agrega los registros que Resend te proporciona"
    echo "6. ⚠️  IMPORTANTE: Desactiva el proxy (nube naranja → gris)"
fi
echo ""

echo "=============================================="
echo "🔗 Enlaces útiles:"
echo "=============================================="
echo "Resend Dashboard: https://resend.com/domains"
echo "Cloudflare DNS: https://dash.cloudflare.com"
echo "Verificar DNS: https://dnschecker.org"
echo "=============================================="
