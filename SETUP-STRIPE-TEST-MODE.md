# 🚀 CONFIGURAR STRIPE EN TEST MODE - Guía Rápida

## 🎯 OBJETIVO

Cambiar TODO el sistema de pagos a **Test Mode** para que funcione mientras activas tu cuenta.

---

## 📋 ARCHIVOS QUE NECESITAS ACTUALIZAR

1. ✅ **calendari.js** (línea ~35)
2. ✅ **checkout.js** (línea ~20)
3. ✅ **Vercel Environment Variables** (2 variables)

---

## 🔑 PASO 1: Obtener Test Keys de Stripe (2 minutos)

### 1. Ve a Stripe Dashboard
https://dashboard.stripe.com

### 2. Cambia a Test Mode
Interruptor superior derecho → **"Test mode"** (debe estar en azul)

### 3. Ve a API Keys
https://dashboard.stripe.com/test/apikeys

### 4. Copia AMBAS keys

Verás algo como:

```
Publishable key
pk_test_51SrimkKOKBlj0PU4xxxxxxxxxxxxxxxxxxxxxx
[Show] [Copy]

Secret key  
sk_test_51SrimkKOKBlj0PU4xxxxxxxxxxxxxxxxxxxxxx
[Reveal test key] [Copy]
```

**Copia AMBAS** (click en "Reveal" para ver la secret key)

---

## 🔧 PASO 2: Actualizar Archivos JavaScript

### A) Actualizar calendari.js

1. **Abre**: `calendari.js`
2. **Busca** (línea ~35):
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'PONER_TU_PK_TEST_AQUI';
   ```
3. **Reemplaza con**:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SrimkKOKBlj0PU4xxx...';
   ```
   (usa tu key real que copiaste)

### B) Actualizar checkout.js

1. **Abre**: `checkout.js`
2. **Busca** (línea ~20):
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'PONER_TU_PK_TEST_AQUI';
   ```
3. **Reemplaza con**:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SrimkKOKBlj0PU4xxx...';
   ```
   (la MISMA key que en calendari.js)

---

## ☁️ PASO 3: Actualizar Vercel (2 minutos)

### 1. Ve a Vercel
https://vercel.com/dashboard

### 2. Tu proyecto → Settings → Environment Variables

### 3. Edita estas 2 variables:

**Variable 1:**
```
Name: STRIPE_PUBLISHABLE_KEY
Value: pk_test_51SrimkKOKBlj0PU4xxx...
```

**Variable 2:**
```
Name: STRIPE_SECRET_KEY
Value: sk_test_51SrimkKOKBlj0PU4xxx...
```

### 4. Save cada una

---

## 🚀 PASO 4: Deploy (3 minutos)

### Opción A: Git (Recomendado)

```bash
# En la terminal:
git add calendari.js checkout.js
git commit -m "feat: Cambiar a Stripe Test Mode"
git push origin main

# Espera 2-3 minutos al auto-deploy
```

### Opción B: Vercel Manual Deploy

1. Ve a Vercel → Deployments
2. Click en "..." del último deployment
3. Click en "Redeploy"
4. Espera 2-3 minutos

---

## 🧪 PASO 5: Probar (2 minutos)

### A) Probar Calendario

1. **Ve a**: https://wild-fitness.com/calendari.html
2. **Click en "Reservar"** en cualquier actividad
3. **Rellena el formulario**
4. **Usa tarjeta de prueba**:
   ```
   Número: 4242 4242 4242 4242
   Fecha: 12/34
   CVC: 123
   ```
5. **Envía el pago**

**Resultado esperado**: ✅ Pago exitoso

### B) Probar Checkout

1. **Ve a**: https://wild-fitness.com/checkout.html
2. **Selecciona un programa**
3. **Usa la misma tarjeta de prueba**
4. **Envía el pago**

**Resultado esperado**: ✅ Pago exitoso

---

## 🎴 TARJETAS DE PRUEBA STRIPE

### Éxito (aprobada):
```
Número: 4242 4242 4242 4242
Fecha: Cualquier fecha futura (12/34)
CVC: Cualquier 3 dígitos (123)
```

### Rechazada (insuficientes fondos):
```
Número: 4000 0000 0000 9995
```

### Requiere autenticación 3D Secure:
```
Número: 4000 0025 0000 3155
```

Más tarjetas: https://stripe.com/docs/testing#cards

---

## ✅ CHECKLIST COMPLETO

- [ ] Test keys copiadas de Stripe Dashboard
- [ ] calendari.js actualizado con pk_test
- [ ] checkout.js actualizado con pk_test
- [ ] STRIPE_PUBLISHABLE_KEY actualizada en Vercel
- [ ] STRIPE_SECRET_KEY actualizada en Vercel
- [ ] Git commit y push ejecutado
- [ ] Deploy completado (2-3 min)
- [ ] Calendario probado con tarjeta 4242
- [ ] Checkout probado con tarjeta 4242
- [ ] Todo funciona ✅

---

## 🔄 DESPUÉS (cuando se active tu cuenta)

### Cambiar a LIVE mode:

**1. En calendari.js y checkout.js:**
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SrimkKOKBlj0PU4E0Hwmgo6GmX9BwUVlskqk3CoTKj2jlJx32V8Bs1oMhSv4RdSXfMzxSHphXgtQ6rGYZdKqjlw00L6KLhGIf';
```

**2. En Vercel:**
```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

**3. Commit, push, deploy**

---

## ⚠️ IMPORTANTE

### ❌ NO uses Test Mode en producción permanentemente
- Es solo para desarrollo y pruebas
- Cambia a LIVE cuando tu cuenta esté activada

### ✅ SÍ verifica que todo funciona en Test Mode
- Prueba todos los flujos de pago
- Verifica que los pagos se registran correctamente
- Asegúrate que los webhooks funcionan (si los usas)

---

## 🆘 TROUBLESHOOTING

### Error: "Stripe key not configured"
- Verifica que la key empiece con `pk_test_` (no `pk_live_`)
- Revisa que no tenga espacios al principio/final
- Confirma que está entre comillas simples

### Error: "Invalid API Key"
- Asegúrate de estar en Test mode en Stripe Dashboard
- Copia de nuevo las keys
- Verifica que no copiaste la anon key por error

### Tarjeta rechazada
- Usa exactamente: 4242 4242 4242 4242
- Verifica que estás en Test mode
- Prueba con otra tarjeta de prueba de la lista

---

## 📞 SOPORTE

- **Stripe Test Cards**: https://stripe.com/docs/testing
- **Stripe Support**: https://support.stripe.com
- **Documentación Stripe**: https://stripe.com/docs

---

**⏰ Tiempo total estimado: 10-15 minutos**

**🎯 Resultado: Sistema de pagos funcionando en Test Mode**
