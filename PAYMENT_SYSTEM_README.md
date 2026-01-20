# 💳 Sistema de Pagos - Wild Fitness

Sistema completo de pagos con Stripe integrado para procesar pagos con tarjeta y Bizum.

## 📁 Archivos Creados

### Frontend
- **`checkout.html`** - Página de checkout con formulario de pago
- **`checkout.css`** - Estilos para la página de checkout
- **`checkout.js`** - Lógica del frontend para procesar pagos

### Backend
- **`payment-worker.js`** - Cloudflare Worker para procesar pagos en el servidor
- **`wrangler-payment.toml`** - Configuración del worker de pagos

### Documentación
- **`STRIPE_SETUP.md`** - Guía completa de configuración de Stripe
- **`PAYMENT_SYSTEM_README.md`** - Este archivo

## 🚀 Programas Disponibles

### 1. Grup Fonteta - 35€/mes
- Entrenamiento en grupo en Girona
- Dilluns i dimecres 17:15-18:15h
- Pago por Bizum o efectivo

### 2. Trail Runners
- **Mensual**: 55€/mes
- **Trimestral**: 150€/trimestre (ahorro de 15€)
- Seguimiento personalizado online
- App con ejercicios + WhatsApp

### 3. Pla Bàsic - 70€/mes
- Entrevista inicial + evaluación
- Plan mensual personalizado
- Entrena a tu ritmo

### 4. Sesiones Individuales
- **Sesión presencial**: 45€/hora (trail o fuerza)
- **Acompañamiento online**: 25€/hora (videocall)

## 🔧 Configuración Rápida

### Paso 1: Obtener Claves de Stripe

1. Regístrate en [stripe.com](https://stripe.com)
2. Ve a **Developers** > **API keys**
3. Copia tus claves:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### Paso 2: Configurar Frontend

Edita `checkout.js` línea 5:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_TU_CLAVE_AQUI';
```

### Paso 3: Desplegar Backend Worker

```bash
# Configurar la secret key
npx wrangler secret put STRIPE_SECRET_KEY
# Pega tu sk_test_... cuando se solicite

# Desplegar el worker
npx wrangler publish payment-worker.js --config wrangler-payment.toml
```

### Paso 4: Conectar Frontend con Backend

Una vez desplegado el worker, obtendrás una URL como:
```
https://wild-fitness-payments.TU_CUENTA.workers.dev
```

Actualiza `checkout.js` en la función `createPaymentIntent()`:

```javascript
const response = await fetch('https://wild-fitness-payments.TU_CUENTA.workers.dev/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
});
```

### Paso 5: Activar Bizum (Opcional)

1. Ve a [dashboard.stripe.com/settings/payment_methods](https://dashboard.stripe.com/settings/payment_methods)
2. Busca **Bizum** y haz clic en **Enable**
3. Completa el formulario de solicitud
4. Espera aprobación (2-3 días hábiles)

## 🧪 Probar el Sistema

### Tarjetas de Prueba

En modo test, usa estas tarjetas:

**Éxito:**
- `4242 4242 4242 4242` - Visa
- `5555 5555 5555 4444` - Mastercard

**Fallos:**
- `4000 0000 0000 0002` - Declined
- `4000 0000 0000 9995` - Insufficient funds

**Detalles:**
- Fecha: Cualquier futura (12/25)
- CVV: Cualquier 3 dígitos (123)
- Código postal: Cualquiera (08001)

### URLs de Prueba

- **Checkout Grup Fonteta**: `checkout.html?program=grup-fonteta`
- **Checkout Trail Runners**: `checkout.html?program=trail-runners-mensual`
- **Checkout Pla Bàsic**: `checkout.html?program=pla-basic`
- **Checkout Sesión Presencial**: `checkout.html?program=sessio-presencial`

## 📊 Flujo de Pago

1. Usuario selecciona programa en `index.html#programes`
2. Click en botón → Redirige a `checkout.html?program=XXX`
3. Usuario completa formulario y datos de pago
4. Click en "Pagar Ara"
5. Frontend crea Payment Intent llamando al worker
6. Worker crea Payment Intent en Stripe API
7. Frontend confirma el pago con Stripe.js
8. Stripe procesa el pago
9. Usuario ve confirmación de éxito/error

## 🔐 Seguridad

### Claves de API
- ✅ Publishable Key en frontend (seguro, es pública)
- ✅ Secret Key en backend worker (seguro, nunca expuesta)
- ❌ NUNCA pongas la Secret Key en el frontend

### HTTPS
- Cloudflare Pages proporciona HTTPS automático
- Stripe requiere HTTPS para producción

### Validación
- Validación de datos en frontend y backend
- Verificación de webhooks con firma
- Protección CORS configurada

## 💰 Comisiones de Stripe

### Tarifas España
- Tarjetas europeas: **1.4% + 0.25€**
- Tarjetas no europeas: **2.9% + 0.25€**
- Bizum: **1.5% + 0.25€**
- Sin cuota mensual

### Ejemplo (Programa 55€)
- Cobro: 55€
- Comisión Stripe: 1.02€ (1.4% + 0.25€)
- **Beneficio neto: 53.98€**

## 📈 Dashboard de Stripe

Accede a [dashboard.stripe.com](https://dashboard.stripe.com) para:
- Ver todos los pagos
- Gestionar reembolsos
- Exportar informes
- Configurar webhooks
- Ver disputas

## 🆘 Solución de Problemas

### "Invalid API key"
→ Verifica que usas las claves correctas (test/live)

### "Payment method not available"
→ Bizum solo funciona en cuentas españolas verificadas

### "Amount must be at least 50 cents"
→ Stripe requiere mínimo 0.50€

### Los pagos no aparecen
→ Verifica que usas las mismas claves (test o live) en frontend y backend

## 📚 Documentación Completa

Para información detallada, consulta:
- **`STRIPE_SETUP.md`** - Guía completa de configuración
- [Stripe Docs](https://stripe.com/docs)
- [Bizum Payments](https://stripe.com/docs/payments/bizum)

## 🎯 Próximos Pasos

1. **Configurar claves de Stripe** (test primero)
2. **Desplegar worker de pagos**
3. **Probar con tarjetas de test**
4. **Activar Bizum** (si lo necesitas)
5. **Poner en producción** con claves live

---

**¿Necesitas ayuda?** Consulta `STRIPE_SETUP.md` para guía paso a paso.

**Última actualización**: Enero 2026  
**Versión**: 1.0  
**Autor**: Wild Fitness Team
