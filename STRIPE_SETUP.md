# Guía de Configuración de Stripe para Wild Fitness

Esta guía te ayudará a configurar Stripe para procesar pagos con tarjeta y Bizum en tu sitio web.

## 📋 Requisitos Previos

1. **Cuenta de Stripe**: Regístrate en [https://stripe.com](https://stripe.com)
2. **Verificación de cuenta**: Completa la verificación de tu cuenta en España
3. **Activar Bizum**: Solicita la activación de Bizum en tu cuenta de Stripe

## 🔑 Paso 1: Obtener las Claves de API

### 1.1 Accede al Dashboard de Stripe
1. Inicia sesión en [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Ve a **Developers** > **API keys**

### 1.2 Copia tus claves
Necesitarás dos claves:

- **Publishable key** (pk_test_... o pk_live_...)
  - Esta clave es pública y va en el frontend
  - Ubicación: `checkout.js` línea 5
  
- **Secret key** (sk_test_... o sk_live_...)
  - Esta clave es PRIVADA y va en el backend
  - ⚠️ NUNCA la compartas ni la pongas en el código del frontend

### 1.3 Modo de pruebas vs Producción
- **Test mode**: Usa las claves `pk_test_...` y `sk_test_...` para pruebas
- **Live mode**: Usa las claves `pk_live_...` y `sk_live_...` para producción

## 🛠️ Paso 2: Configurar el Frontend

### 2.1 Actualizar checkout.js
Abre el archivo `checkout.js` y reemplaza la clave de Stripe:

```javascript
// Línea 5
const STRIPE_PUBLISHABLE_KEY = 'pk_test_TU_CLAVE_AQUI'; // Reemplazar
```

**Ejemplo:**
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51MqK8sJ9kLmN0pQr...'; // Tu clave real
```

## ☁️ Paso 3: Configurar el Backend (Cloudflare Worker)

### 3.1 Configurar variables de entorno
Desde tu terminal en el proyecto:

```bash
cd /home/user/webapp

# Configurar la Secret Key de Stripe
npx wrangler secret put STRIPE_SECRET_KEY
# Pega tu clave sk_test_... o sk_live_... cuando se te solicite

# Configurar webhook secret (opcional pero recomendado)
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

### 3.2 Desplegar el Worker de pagos
```bash
# Desplegar a Cloudflare
npx wrangler publish payment-worker.js
```

### 3.3 Actualizar la URL del backend
Una vez desplegado, obtendrás una URL como:
```
https://payment-worker.TU_CUENTA.workers.dev
```

Actualiza `checkout.js` en la función `createPaymentIntent()`:

```javascript
const response = await fetch('https://payment-worker.TU_CUENTA.workers.dev/create-payment-intent', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});
```

## 💳 Paso 4: Activar Bizum

### 4.1 Requisitos para Bizum
1. Cuenta de Stripe verificada en España
2. CIF/NIF de empresa o autónomo
3. Solicitud a Stripe para activar Bizum

### 4.2 Solicitar activación
1. Ve a [https://dashboard.stripe.com/settings/payment_methods](https://dashboard.stripe.com/settings/payment_methods)
2. Busca **Bizum** en la lista de métodos de pago
3. Haz clic en **Enable** (Activar)
4. Completa el formulario de solicitud
5. Espera la aprobación (normalmente 2-3 días hábiles)

### 4.3 Configuración de Bizum
Una vez activado:
- Bizum funcionará automáticamente en tu checkout
- Los pagos se procesarán a través de la app bancaria del cliente
- Recibirás notificaciones de confirmación en el dashboard

## 🧪 Paso 5: Probar la Integración

### 5.1 Tarjetas de prueba de Stripe
En **modo test**, usa estas tarjetas:

**Tarjetas que funcionan:**
- `4242 4242 4242 4242` - Visa (éxito)
- `5555 5555 5555 4444` - Mastercard (éxito)

**Tarjetas que fallan:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

**Detalles de la tarjeta de prueba:**
- Fecha de expiración: Cualquier fecha futura (ej: 12/25)
- CVV: Cualquier 3 dígitos (ej: 123)
- Código postal: Cualquiera (ej: 08001)

### 5.2 Probar Bizum
En modo test, Bizum no puede ser probado. Necesitas:
1. Activar el modo live (producción)
2. Usar un número real de Bizum
3. Confirmar desde la app bancaria

### 5.3 Verificar pagos
1. Ve a [https://dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
2. Verifica que aparezcan los pagos de prueba
3. Revisa los detalles de cada transacción

## 📧 Paso 6: Configurar Webhooks (Opcional pero Recomendado)

Los webhooks te notifican cuando ocurre un evento (pago exitoso, fallo, reembolso, etc.)

### 6.1 Crear webhook endpoint
1. Ve a **Developers** > **Webhooks**
2. Haz clic en **Add endpoint**
3. URL del endpoint: `https://payment-worker.TU_CUENTA.workers.dev/webhook`
4. Selecciona estos eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `charge.dispute.created`

### 6.2 Obtener el webhook secret
1. Copia el **Signing secret** (whsec_...)
2. Guárdalo como variable de entorno:
```bash
npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Pega el whsec_... cuando se solicite
```

## 🔒 Paso 7: Seguridad y Buenas Prácticas

### 7.1 Nunca expongas tu Secret Key
- ❌ NO la pongas en el código frontend
- ❌ NO la subas a GitHub
- ✅ Úsala solo en el backend (Cloudflare Worker)
- ✅ Guárdala como variable de entorno

### 7.2 Validación de datos
El worker ya incluye validación de:
- Montos mínimos (>= 0.50 EUR)
- Email válido
- Datos requeridos

### 7.3 HTTPS obligatorio
- Stripe requiere HTTPS en producción
- Cloudflare Pages proporciona HTTPS automáticamente

## 💰 Paso 8: Comisiones de Stripe

### 8.1 Tarifas en España
- **Tarjetas europeas**: 1.4% + 0.25€ por transacción
- **Tarjetas no europeas**: 2.9% + 0.25€ por transacción
- **Bizum**: 1.5% + 0.25€ por transacción
- **Sin cuota mensual** (con plan estándar)

### 8.2 Calcular beneficio neto
Para un programa de €79/mes:
- Comisión Stripe: €1.36 (1.4% + €0.25)
- **Beneficio neto**: €77.64

## 🚀 Paso 9: Poner en Producción

### 9.1 Checklist antes de lanzar
- [ ] Cambiar a claves live (pk_live_... y sk_live_...)
- [ ] Verificar cuenta de Stripe completamente
- [ ] Activar Bizum (si lo usas)
- [ ] Configurar webhooks
- [ ] Probar con una transacción real pequeña
- [ ] Configurar email de confirmación
- [ ] Revisar términos y condiciones
- [ ] Verificar política de privacidad

### 9.2 Desplegar a producción
```bash
# 1. Actualizar claves live
npx wrangler secret put STRIPE_SECRET_KEY
# Pega tu sk_live_... 

# 2. Desplegar worker
npx wrangler publish payment-worker.js

# 3. Desplegar frontend
git add .
git commit -m "Añadir pasarela de pago con Stripe"
git push origin main
```

## 📊 Paso 10: Monitorizar Pagos

### 10.1 Dashboard de Stripe
Accede regularmente a:
- **Payments**: Ver todas las transacciones
- **Balance**: Revisar balance disponible
- **Reports**: Generar informes financieros

### 10.2 Alertas
Configura alertas para:
- Pagos fallidos
- Disputas (chargebacks)
- Balance bajo

### 10.3 Exportar datos
Puedes exportar:
- Transacciones a CSV/Excel
- Informes fiscales
- Reconciliación bancaria

## 🔧 Solución de Problemas

### Error: "Invalid API key"
- Verifica que la clave es correcta
- Comprueba que usas pk_test en checkout.js y sk_test en el worker
- Asegúrate de no tener espacios extra

### Error: "Payment method not available"
- Bizum solo funciona en cuentas españolas verificadas
- Verifica que has activado Bizum en el dashboard
- Comprueba que el cliente tiene Bizum en su banco

### Error: "Amount must be at least 50 cents"
- Stripe requiere un mínimo de 0.50€
- Verifica los cálculos en checkout.js

### Los pagos no aparecen
- Verifica que usas las mismas claves (test/live)
- Revisa los logs del worker en Cloudflare
- Comprueba los eventos en el dashboard de Stripe

## 📞 Soporte

### Documentación oficial
- [Stripe Docs](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Bizum Payments](https://stripe.com/docs/payments/bizum)

### Contacto Stripe
- Email: support@stripe.com
- Chat en vivo: Disponible en el dashboard
- Teléfono España: +34 911 23 98 73

## ✅ Checklist Final

Antes de considerar completada la integración:

- [ ] ✅ Cuenta de Stripe creada y verificada
- [ ] ✅ Claves de API configuradas (test primero)
- [ ] ✅ Frontend actualizado con Publishable Key
- [ ] ✅ Worker desplegado con Secret Key
- [ ] ✅ Probado con tarjetas de prueba
- [ ] ✅ Bizum activado (si lo necesitas)
- [ ] ✅ Webhooks configurados
- [ ] ✅ Emails de confirmación funcionando
- [ ] ✅ Probado en producción con transacción real
- [ ] ✅ Dashboard de Stripe monitoreado

---

## 🎉 ¡Listo!

Tu pasarela de pago está configurada. Los clientes ahora pueden:
- ✅ Pagar con tarjeta de crédito/débito
- ✅ Pagar con Bizum (una vez activado)
- ✅ Recibir confirmaciones automáticas
- ✅ Acceder a un checkout profesional y seguro

**Última actualización**: Enero 2026
**Versión**: 1.0
**Autor**: Wild Fitness Team
