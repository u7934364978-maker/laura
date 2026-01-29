#!/bin/bash

# Script de Diagnóstico Resend - Wild Fitness
# Verifica el estado de configuración del dominio

echo "🔍 DIAGNÓSTICO RESEND - wild-fitness.com"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar comando
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 disponible"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NO disponible"
        return 1
    fi
}

echo "📋 1. Verificando herramientas necesarias..."
echo "-------------------------------------------"
check_command "dig" || echo "   → Instala: apt-get install dnsutils"
check_command "curl" || echo "   → Instala: apt-get install curl"
echo ""

# Verificar registros DNS
echo "📡 2. Verificando registros DNS..."
echo "-------------------------------------------"

# SPF
echo -n "SPF Record: "
SPF=$(dig TXT wild-fitness.com +short 2>/dev/null | grep "spf1")
if [[ -n "$SPF" ]]; then
    echo -e "${GREEN}✓ Encontrado${NC}"
    echo "   $SPF"
    if [[ "$SPF" == *"_spf.resend.com"* ]]; then
        echo -e "   ${GREEN}✓ Incluye Resend${NC}"
    else
        echo -e "   ${RED}✗ NO incluye Resend${NC}"
        echo -e "   ${YELLOW}Añade: include:_spf.resend.com${NC}"
    fi
else
    echo -e "${RED}✗ NO encontrado${NC}"
    echo -e "   ${YELLOW}Acción: Añade registro TXT en DNS:${NC}"
    echo "   Name: @"
    echo "   Value: v=spf1 include:_spf.resend.com ~all"
fi
echo ""

# DKIM
echo -n "DKIM Record: "
DKIM=$(dig TXT resend._domainkey.wild-fitness.com +short 2>/dev/null)
if [[ -n "$DKIM" ]]; then
    echo -e "${GREEN}✓ Encontrado${NC}"
    echo "   ${DKIM:0:50}... (truncado)"
else
    echo -e "${RED}✗ NO encontrado${NC}"
    echo -e "   ${YELLOW}Acción: Añade registro TXT en DNS:${NC}"
    echo "   Name: resend._domainkey"
    echo "   Value: [obtener de Resend Dashboard]"
fi
echo ""

# Verificación
echo -n "Verification Record: "
VERIFY=$(dig TXT _resend.wild-fitness.com +short 2>/dev/null)
if [[ -n "$VERIFY" ]]; then
    echo -e "${GREEN}✓ Encontrado${NC}"
    echo "   $VERIFY"
else
    echo -e "${RED}✗ NO encontrado${NC}"
    echo -e "   ${YELLOW}Acción: Añade registro TXT en DNS:${NC}"
    echo "   Name: _resend"
    echo "   Value: [obtener de Resend Dashboard]"
fi
echo ""

# Test de conectividad con Resend API
echo "🌐 3. Verificando conectividad con Resend API..."
echo "-------------------------------------------"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.resend.com/emails \
  -H "Content-Type: application/json" \
  -d '{"test":"connection"}')

if [ "$RESPONSE" == "401" ] || [ "$RESPONSE" == "400" ]; then
    echo -e "${GREEN}✓ API Resend accesible${NC} (HTTP $RESPONSE esperado sin API key)"
else
    echo -e "${YELLOW}⚠ Respuesta inesperada${NC}: HTTP $RESPONSE"
fi
echo ""

# Verificar archivo de configuración
echo "📄 4. Verificando configuración local..."
echo "-------------------------------------------"

if [ -f ".dev.vars" ]; then
    echo -e "${GREEN}✓ .dev.vars existe${NC}"
    
    if grep -q "FROM_EMAIL.*wild-fitness.com" .dev.vars; then
        echo -e "${GREEN}✓ FROM_EMAIL usa wild-fitness.com${NC}"
        FROM_EMAIL=$(grep FROM_EMAIL .dev.vars | cut -d'=' -f2)
        echo "   $FROM_EMAIL"
    else
        echo -e "${RED}✗ FROM_EMAIL NO usa wild-fitness.com${NC}"
        echo -e "   ${YELLOW}Acción: Cambia FROM_EMAIL a usar @wild-fitness.com${NC}"
    fi
    
    if grep -q "RESEND_API_KEY=re_" .dev.vars; then
        echo -e "${GREEN}✓ RESEND_API_KEY configurada${NC}"
    else
        echo -e "${RED}✗ RESEND_API_KEY falta o inválida${NC}"
        echo -e "   ${YELLOW}Acción: Obtén API key en https://resend.com/api-keys${NC}"
    fi
else
    echo -e "${YELLOW}⚠ .dev.vars no encontrado${NC}"
    echo "   Verifica variables en Vercel/Cloudflare Workers"
fi
echo ""

# Resumen y próximos pasos
echo "📊 RESUMEN Y PRÓXIMOS PASOS"
echo "=========================================="
echo ""

# Contar problemas
ISSUES=0

if [[ -z "$SPF" ]] || [[ "$SPF" != *"_spf.resend.com"* ]]; then
    ISSUES=$((ISSUES + 1))
fi

if [[ -z "$DKIM" ]]; then
    ISSUES=$((ISSUES + 1))
fi

if [[ -z "$VERIFY" ]]; then
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ TODO CORRECTO${NC}"
    echo ""
    echo "Tu dominio debería estar listo para usar."
    echo ""
    echo "Próximos pasos:"
    echo "1. Ve a https://resend.com/domains"
    echo "2. Verifica que wild-fitness.com muestra estado 'Verified'"
    echo "3. Prueba enviar un email de test"
    echo ""
    echo "Si aún tienes error 403:"
    echo "- Espera 15-30 minutos más (propagación DNS)"
    echo "- Verifica variables en Vercel/Workers"
    echo "- Lee RESEND-403-ERROR-FIX.md para troubleshooting"
else
    echo -e "${RED}⚠ ENCONTRADOS $ISSUES PROBLEMAS${NC}"
    echo ""
    echo "Acciones requeridas:"
    echo ""
    
    if [[ -z "$SPF" ]] || [[ "$SPF" != *"_spf.resend.com"* ]]; then
        echo "1. 📝 Configurar SPF Record"
        echo "   Ve a tu proveedor DNS (Cloudflare/GoDaddy)"
        echo "   Añade/modifica registro TXT:"
        echo "   Name: @"
        echo "   Value: v=spf1 include:_spf.resend.com ~all"
        echo ""
    fi
    
    if [[ -z "$DKIM" ]]; then
        echo "2. 📝 Configurar DKIM Record"
        echo "   Ve a: https://resend.com/domains"
        echo "   Copia el valor DKIM largo"
        echo "   Añade registro TXT en DNS:"
        echo "   Name: resend._domainkey"
        echo "   Value: [valor largo de Resend]"
        echo ""
    fi
    
    if [[ -z "$VERIFY" ]]; then
        echo "3. 📝 Configurar Verification Record"
        echo "   Ve a: https://resend.com/domains"
        echo "   Copia el código re_xxxxx"
        echo "   Añade registro TXT en DNS:"
        echo "   Name: _resend"
        echo "   Value: re_xxxxx"
        echo ""
    fi
    
    echo "Después de configurar DNS:"
    echo "- Espera 15-30 minutos"
    echo "- Ejecuta este script de nuevo"
    echo "- Verifica en https://resend.com/domains"
fi

echo ""
echo "📚 Documentación completa: RESEND-403-ERROR-FIX.md"
echo "🆘 Soporte: https://resend.com/support"
echo ""
