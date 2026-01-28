# 🔑 INSTRUCCIONES: Obtener Stripe Test Keys

## Paso 1: Ve a Stripe Dashboard
https://dashboard.stripe.com/test/apikeys

## Paso 2: Asegúrate de estar en TEST MODE
- Mira el interruptor superior derecho
- Debe decir "Viewing test data" o "Test mode"

## Paso 3: Copia las keys de TEST

### Publishable key (frontend)
```
pk_test_51...
```
- Esta va en calendari.js línea 32
- También en Vercel como STRIPE_PUBLISHABLE_KEY

### Secret key (backend)
```
sk_test_51...
```
- Esta va SOLO en Vercel como STRIPE_SECRET_KEY
- NUNCA en el código frontend

## Paso 4: Tarjetas de prueba

Con test mode, puedes usar estas tarjetas:

**Tarjeta exitosa:**
- Número: 4242 4242 4242 4242
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos
- CP: Cualquier código postal

**Tarjeta rechazada:**
- Número: 4000 0000 0000 0002

**Más tarjetas de prueba:**
https://stripe.com/docs/testing

## Paso 5: Configurar en Vercel

Ve a: https://vercel.com/dashboard
→ Tu proyecto → Settings → Environment Variables

**Edita estas 2 variables:**

```bash
STRIPE_PUBLISHABLE_KEY=pk_test_tu_key_aqui
STRIPE_SECRET_KEY=sk_test_tu_key_aqui
```

**Guarda y haz REDEPLOY**

## Paso 6: Actualizar calendari.js

Cambia la línea 32:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_tu_key_aqui';
```

Commit y push:
```bash
git add calendari.js
git commit -m "feat: Usar Stripe test keys"
git push origin main
```

## Verificar

Después del redeploy:
1. Ve a: https://wild-fitness.com/calendari.html
2. Intenta reservar una actividad
3. Usa la tarjeta: 4242 4242 4242 4242
4. Debería funcionar sin errores

---

**Nota**: Con test mode NO se hacen cobros reales. Es 100% seguro para probar.
