# 🔧 ACTIVAR STRIPE PARA PAGOS

## 🔴 PROBLEMA ACTUAL

Tu cuenta Stripe muestra: **"No hay tareas activas para tu cuenta"**

Esto significa que tu cuenta está en **modo restringido** y no puede procesar pagos reales (LIVE mode).

---

## ✅ SOLUCIÓN 1: Usar TEST MODE (Recomendado - funciona YA)

Mientras activas tu cuenta, usa **Test Mode** para probar el sistema:

### Paso 1: Obtener Test Keys de Stripe

1. **Ve a Stripe Dashboard**: https://dashboard.stripe.com

2. **Cambia a Test mode**: Interruptor superior derecho → "Test mode"

3. **Ve a API Keys**: https://dashboard.stripe.com/test/apikeys

4. **Copia estas 2 keys**:
   ```
   Publishable key: pk_test_51SrimkKOKBlj0PU4xxx...
   Secret key: sk_test_51SrimkKOKBlj0PU4xxx...
   ```

---

### Paso 2: Configurar en Vercel

1. **Ve a Vercel**: https://vercel.com/dashboard

2. **Tu proyecto** → Settings → Environment Variables

3. **Edita estas 2 variables**:
   ```bash
   STRIPE_PUBLISHABLE_KEY=pk_test_[copia_aqui_tu_test_key]
   STRIPE_SECRET_KEY=sk_test_[copia_aqui_tu_test_key]
   ```

4. **Save** cada una

---

### Paso 3: Actualizar calendari.js

1. **Abre**: `calendari.js` (línea ~35)

2. **Busca**:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'PONER_TU_PK_TEST_AQUI';
   ```

3. **Reemplaza con tu pk_test_...**:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SrimkKOKBlj0PU4xxx...';
   ```

4. **Guarda el archivo**

---

### Paso 4: Commit y Deploy

```bash
git add calendari.js
git commit -m "feat: Cambiar a Stripe Test Mode"
git push origin main
```

Espera 2-3 minutos al auto-deploy.

---

### Paso 5: Probar

1. **Ve a**: https://wild-fitness.com/calendari.html

2. **Intenta reservar** una actividad

3. **Usa tarjetas de prueba** de Stripe:
   ```
   Número: 4242 4242 4242 4242
   Fecha: Cualquier fecha futura (ej: 12/34)
   CVC: Cualquier 3 dígitos (ej: 123)
   ```

4. **Debería funcionar** ✅

---

## ✅ SOLUCIÓN 2: Activar cuenta Stripe (Para LIVE mode - pagos reales)

Si quieres aceptar pagos reales, necesitas **activar completamente** tu cuenta:

### Paso 1: Completar el perfil de la empresa

1. **Ve a**: https://dashboard.stripe.com/settings/account

2. **Completa todos los campos requeridos**:
   - ✅ Información de la empresa
   - ✅ Información del representante legal
   - ✅ Documentos de verificación (ID, prueba de dirección)
   - ✅ Información bancaria para recibir pagos

### Paso 2: Verificación de Stripe

1. **Stripe revisará tu información** (puede tardar 1-3 días)

2. **Te enviarán emails** con actualizaciones

3. **Si piden más información**, responde rápidamente

### Paso 3: Cuenta activada

Una vez activada, verás:
- ✅ "Your account is activated"
- ✅ Desaparecerá el mensaje "No hay tareas activas"

### Paso 4: Volver a LIVE mode

Cuando tu cuenta esté activada:

1. **En Vercel**, cambia las variables a LIVE keys:
   ```bash
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. **En calendari.js**, cambia a pk_live:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Srimk...';
   ```

3. **Commit, push, deploy**

---

## 📊 COMPARACIÓN

| Aspecto | TEST Mode | LIVE Mode |
|---------|-----------|-----------|
| **Funciona ahora** | ✅ SÍ | ❌ NO (cuenta no activada) |
| **Pagos reales** | ❌ Simulados | ✅ Reales |
| **Tarjetas de prueba** | ✅ SÍ (4242...) | ❌ NO |
| **Tarjetas reales** | ❌ NO | ✅ SÍ |
| **Tiempo de setup** | ⚡ 5 minutos | ⏰ 1-3 días |

---

## 🎯 RECOMENDACIÓN

**AHORA**: Usa **TEST MODE** para probar y desarrollar

**DESPUÉS**: Activa la cuenta y cambia a **LIVE MODE** para producción

---

## ⚠️ IMPORTANTE

### Tarjetas de prueba Stripe (TEST mode)

```
✅ Éxito:
Número: 4242 4242 4242 4242
Fecha: 12/34
CVC: 123

❌ Fallo (rechazada):
Número: 4000 0000 0000 0002

🔐 Requiere 3D Secure:
Número: 4000 0025 0000 3155
```

Más tarjetas: https://stripe.com/docs/testing

---

## 📞 SI TIENES PROBLEMAS

1. **Error en test mode**: Revisa que ambas keys (publishable y secret) sean pk_test_ y sk_test_
2. **Cuenta no se activa**: Contacta soporte de Stripe: https://support.stripe.com
3. **Otros errores**: Revisa logs en Vercel → Function Logs

---

**Última actualización**: 2026-01-28  
**Estado**: Cuenta Stripe requiere activación para LIVE mode
