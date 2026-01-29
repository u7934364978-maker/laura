#!/bin/bash

# Script de prueba para verificar emails de confirmación
# Wild Fitness - Email Verification Test

echo "🧪 PRUEBA DE EMAILS DE CONFIRMACIÓN"
echo "====================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Solicitar email de prueba
echo -e "${YELLOW}📧 Introduce tu email para recibir el email de prueba:${NC}"
read -p "Email: " TEST_EMAIL

if [ -z "$TEST_EMAIL" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar un email${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Enviando email de prueba a: $TEST_EMAIL${NC}"
echo ""

# Enviar solicitud
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST https://www.wild-fitness.com/api/send-booking-confirmation \
  -H "Content-Type: application/json" \
  -d "{
    \"booking\": {
      \"id\": \"test-$(date +%s)\",
      \"name\": \"Usuario de Prueba\",
      \"email\": \"$TEST_EMAIL\",
      \"paymentId\": \"pi_test_verification\"
    },
    \"activity\": {
      \"id\": \"act-test\",
      \"title\": \"Prueba de Email - Grup Fonteta\",
      \"type\": \"Entrenament en grup\",
      \"date\": \"$(date -d '+7 days' --iso-8601)T17:15:00Z\",
      \"time\": \"17:15\",
      \"location\": \"Fonteta, Girona\",
      \"description\": \"Email de prueba del sistema de confirmaciones\"
    }
  }")

# Separar respuesta y código HTTP
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo ""
echo "📊 RESULTADO:"
echo "=============="

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Email enviado correctamente!${NC}"
    echo ""
    echo "Respuesta del servidor:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo -e "${YELLOW}📬 Revisa tu bandeja de entrada (y spam):${NC}"
    echo "   - Email: $TEST_EMAIL"
    echo "   - Asunto: ✅ Reserva confirmada: Prueba de Email - Grup Fonteta"
    echo "   - Remitente: Wild Fitness <noreply@wild-fitness.com>"
    echo ""
    echo -e "${GREEN}✅ Si ves el email, el sistema funciona correctamente!${NC}"
else
    echo -e "${RED}❌ Error al enviar email${NC}"
    echo "   HTTP Code: $HTTP_CODE"
    echo ""
    echo "Respuesta del servidor:"
    echo "$BODY"
    echo ""
    echo -e "${YELLOW}⚠️ Posibles causas:${NC}"
    echo "   - RESEND_API_KEY no configurada en Vercel"
    echo "   - Dominio no verificado en Resend"
    echo "   - Email inválido"
    echo ""
    echo -e "${YELLOW}📝 Lee EMAIL-CONFIGURATION-GUIDE.md para más detalles${NC}"
fi

echo ""
echo "🔍 Ver logs detallados en:"
echo "   https://vercel.com/dashboard → Tu proyecto → Functions"
echo "   Filtra por: /api/send-booking-confirmation"
echo ""
