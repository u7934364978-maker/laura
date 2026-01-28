#!/bin/bash

# ============================================
# 🔍 Script de Verificación - Wild Fitness
# Verifica la configuración del formulario de contacto
# ============================================

echo "🏔️  WILD FITNESS - Verificación de Configuración"
echo "=================================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0
WARNINGS=0

# ============================================
# 1. Verificar archivos necesarios
# ============================================
echo "📂 Verificando archivos..."

FILES=(
    "contacte.html"
    "script.js"
    "supabase-config.js"
    ".dev.vars"
    "api/send-welcome-email.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file existe"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $file NO ENCONTRADO"
        ((FAILED++))
    fi
done

echo ""

# ============================================
# 2. Verificar configuración de Supabase
# ============================================
echo "🔑 Verificando configuración de Supabase..."

SUPABASE_URL=$(grep -o "url: '[^']*'" supabase-config.js | cut -d"'" -f2)
SUPABASE_KEY=$(grep -o "anonKey: '[^']*'" supabase-config.js | cut -d"'" -f2)

if [[ $SUPABASE_URL == "https://yzlhczlqzvxjcnmonjaj.supabase.co" ]]; then
    echo -e "${GREEN}✅${NC} Supabase URL configurada correctamente"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Supabase URL incorrecta: $SUPABASE_URL"
    ((FAILED++))
fi

if [[ $SUPABASE_KEY == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI" ]]; then
    echo -e "${GREEN}✅${NC} Supabase Anon Key configurada correctamente"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Supabase Anon Key incorrecta"
    ((FAILED++))
fi

echo ""

# ============================================
# 3. Verificar .dev.vars
# ============================================
echo "🔐 Verificando variables de entorno..."

if [ -f ".dev.vars" ]; then
    if grep -q "SUPABASE_URL=https://yzlhczlqzvxjcnmonjaj.supabase.co" .dev.vars; then
        echo -e "${GREEN}✅${NC} SUPABASE_URL en .dev.vars"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC}  SUPABASE_URL no configurada en .dev.vars"
        ((WARNINGS++))
    fi
    
    if grep -q "STRIPE_PUBLISHABLE_KEY=pk_live_" .dev.vars; then
        echo -e "${GREEN}✅${NC} STRIPE_PUBLISHABLE_KEY en .dev.vars"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} STRIPE_PUBLISHABLE_KEY no configurada"
        ((FAILED++))
    fi
    
    if grep -q "STRIPE_SECRET_KEY=sk_live_" .dev.vars; then
        echo -e "${GREEN}✅${NC} STRIPE_SECRET_KEY en .dev.vars"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} STRIPE_SECRET_KEY no configurada"
        ((FAILED++))
    fi
    
    if grep -q "RESEND_API_KEY=re_" .dev.vars; then
        echo -e "${GREEN}✅${NC} RESEND_API_KEY configurada en .dev.vars"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC}  RESEND_API_KEY no configurada (necesaria para envío de emails)"
        ((WARNINGS++))
    fi
fi

echo ""

# ============================================
# 4. Verificar estructura del formulario
# ============================================
echo "📝 Verificando formulario HTML..."

if grep -q 'id="contactForm"' contacte.html; then
    echo -e "${GREEN}✅${NC} Formulario con ID correcto"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Formulario no encontrado o ID incorrecto"
    ((FAILED++))
fi

FORM_FIELDS=("name" "email" "phone" "location" "level" "message")
for field in "${FORM_FIELDS[@]}"; do
    if grep -q "name=\"$field\"" contacte.html; then
        echo -e "${GREEN}✅${NC} Campo '$field' presente"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} Campo '$field' faltante"
        ((FAILED++))
    fi
done

echo ""

# ============================================
# 5. Verificar script.js
# ============================================
echo "⚙️  Verificando script.js..."

if grep -q "const contactForm = document.getElementById('contactForm')" script.js; then
    echo -e "${GREEN}✅${NC} Handler del formulario presente"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Handler del formulario no encontrado"
    ((FAILED++))
fi

if grep -q "saveContactSubmission" script.js; then
    echo -e "${GREEN}✅${NC} Integración con Supabase presente"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC}  Integración con Supabase no encontrada"
    ((WARNINGS++))
fi

if grep -q "/api/send-welcome-email" script.js; then
    echo -e "${GREEN}✅${NC} Llamada a API de email presente"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Llamada a API de email no encontrada"
    ((FAILED++))
fi

echo ""

# ============================================
# 6. Verificar API backend
# ============================================
echo "🚀 Verificando backend API..."

if grep -q "RESEND_API_KEY" api/send-welcome-email.js; then
    echo -e "${GREEN}✅${NC} API configurada para usar Resend"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} RESEND_API_KEY no referenciada en API"
    ((FAILED++))
fi

if grep -q "EmailTemplates" api/send-welcome-email.js; then
    echo -e "${GREEN}✅${NC} Templates de email presentes"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Templates de email no encontrados"
    ((FAILED++))
fi

echo ""

# ============================================
# 7. Verificar seguridad
# ============================================
echo "🔒 Verificando configuración de seguridad..."

if grep -q ".dev.vars" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✅${NC} .dev.vars en .gitignore"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} .dev.vars NO está en .gitignore (¡PELIGRO DE SEGURIDAD!)"
    ((FAILED++))
fi

echo ""

# ============================================
# 8. Test de conectividad (opcional)
# ============================================
echo "🌐 Verificando conectividad..."

# Test Supabase
if command -v curl &> /dev/null; then
    SUPABASE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://yzlhczlqzvxjcnmonjaj.supabase.co/rest/v1/" -H "apikey: $SUPABASE_KEY")
    if [ "$SUPABASE_STATUS" == "200" ] || [ "$SUPABASE_STATUS" == "401" ]; then
        echo -e "${GREEN}✅${NC} Supabase accesible (HTTP $SUPABASE_STATUS)"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} Supabase no accesible (HTTP $SUPABASE_STATUS)"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️${NC}  curl no disponible, saltando test de conectividad"
    ((WARNINGS++))
fi

echo ""

# ============================================
# Resumen final
# ============================================
echo "=================================================="
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=================================================="
echo -e "${GREEN}✅ Pasadas:${NC} $PASSED"
echo -e "${RED}❌ Fallidas:${NC} $FAILED"
echo -e "${YELLOW}⚠️  Advertencias:${NC} $WARNINGS"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASSED * 100 / TOTAL))
    echo "📈 Porcentaje de éxito: $PERCENTAGE%"
fi

echo ""

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Configuración perfecta! Todo listo para producción.${NC}"
    exit 0
elif [ $FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Configuración funcional con algunas advertencias.${NC}"
    echo "   Revisa los warnings antes de ir a producción."
    exit 0
else
    echo -e "${RED}❌ Hay problemas que deben resolverse antes de desplegar.${NC}"
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Revisa los elementos marcados con ❌"
    echo "2. Consulta CONFIGURACION-CONTACTO.md para más detalles"
    echo "3. Ejecuta este script nuevamente después de corregir"
    exit 1
fi
