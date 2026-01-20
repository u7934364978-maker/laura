# 🚀 Guía Rápida - Configuración de Pagos

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Configurar Publishable Key

Edita `checkout.js` línea 6:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'TU_PUBLISHABLE_KEY_AQUI';
```

**Tu clave**: `pk_test_...` (cópiala desde tu dashboard de Stripe)

---

### 2️⃣ Desplegar Worker de Pagos

```bash
# Clonar las variables de ejemplo
cp .dev.vars.example .dev.vars

# Editar .dev.vars y añadir tu Secret Key
nano .dev.vars
# Añade: STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui

# Configurar el secret en Cloudflare
npx wrangler secret put STRIPE_SECRET_KEY
# Pega tu clave cuando se solicite

# Desplegar el worker
npx wrangler publish payment-worker.js --config wrangler-payment.toml
```

---

### 3️⃣ Actualizar URL del Worker

Después de desplegar, obtendrás una URL como:
```
https://wild-fitness-payments.TU_CUENTA.workers.dev
```

Edita `checkout.js` línea 308 aprox:

```javascript
const workerUrl = 'https://wild-fitness-payments.TU_CUENTA.workers.dev/create-payment-intent';
```

---

### 4️⃣ Probar con Tarjetas de Test

Abre: `checkout.html?program=trail-runners-mensual`

**Tarjeta de prueba:**
- Número: `4242 4242 4242 4242`
- Fecha: `12/25`
- CVV: `123`
- Código postal: `08001`

---

## ✅ ¡Listo!

Tu sistema de pagos está configurado. Ahora puedes:
- Probar todos los programas
- Ver transacciones en [dashboard.stripe.com](https://dashboard.stripe.com)
- Activar Bizum (opcional)

---

## 📚 Más Información

- **Guía completa**: `STRIPE_SETUP.md`
- **Manual técnico**: `PAYMENT_SYSTEM_README.md`

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**: 
- Nunca subas `.dev.vars` a GitHub
- Las claves actuales son de TEST mode
- Para producción, cambia a claves LIVE
