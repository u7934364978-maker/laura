# ✅ Stripe LIVE MODE - Configuración Completa

**Estado**: ✅ Cuenta Stripe ACTIVADA  
**Fecha**: 2026-01-28  
**Modo**: LIVE (Pagos Reales)

---

## 🎉 ¡Felicidades! Tu cuenta Stripe está activa

Tu sitio web ahora está configurado para aceptar **pagos reales** con Stripe.

---

## ✅ Configuración Completada en el Frontend

**Archivo**: `calendari.js`  
**Publishable Key**: `pk_live_51SkthTC2rq0k9lQ2...` ✅ Configurada

El frontend ya está listo para procesar pagos reales.

---

## 🔐 IMPORTANTE: Configurar Secret Key en Vercel

Para que los pagos funcionen, necesitas configurar la **Secret Key** en Vercel:

### Paso 1: Acceder a Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto: **laura** (o el nombre de tu proyecto)
3. Ve a: **Settings** → **Environment Variables**

### Paso 2: Configurar la Secret Key

1. **Busca la variable**: `STRIPE_SECRET_KEY`
   - Si existe, haz clic en **Edit** (editar)
   - Si no existe, haz clic en **Add New** (añadir nueva)

2. **Configura estos valores**:
   ```
   Name: STRIPE_SECRET_KEY
   Value: sk_live_51SkthTC2rq0k9lQ2... (usa tu Secret Key completa)
   ```
   
   ⚠️ **Importante**: Usa la Secret Key completa que comienza con `sk_live_51SkthTC2rq0k9lQ2...`  
   (Por seguridad, no se muestra la key completa aquí)

3. **Selecciona los entornos**:
   - ✅ Production
   - ✅ Preview (opcional)
   - ✅ Development (opcional)

4. **Guarda** haciendo clic en **Save**

### Paso 3: Re-deploy

Después de guardar la variable:

1. Ve a: **Deployments**
2. Busca el último deployment
3. Haz clic en los **tres puntos** (⋮)
4. Selecciona: **Redeploy**
5. Confirma el re-deploy

⏱️ **Tiempo estimado**: 1-2 minutos

---

## 🧪 Probar el Sistema de Pagos

### Opción 1: Prueba en Producción (Tarjeta Real)

⚠️ **IMPORTANTE**: Esto procesará un pago real

1. Ve a: https://wild-fitness.com/calendari.html
2. Selecciona una actividad
3. Haz clic en "Reservar"
4. Completa el formulario con tus datos reales
5. Usa tu tarjeta bancaria real
6. Completa el pago

### Opción 2: Verificar en Stripe Dashboard

1. Ve a: https://dashboard.stripe.com
2. Asegúrate de estar en **LIVE mode** (interruptor apagado)
3. Ve a: **Payments** → **All payments**
4. Aquí verás todos los pagos reales que recibas

---

## 💳 Tarjetas de Prueba (Solo para TEST Mode)

**⚠️ NOTA**: En LIVE mode solo funcionan tarjetas reales.

Si necesitas volver a TEST mode para pruebas:
1. Cambia las keys a `pk_test_...` y `sk_test_...`
2. Usa las tarjetas de prueba de Stripe:
   ```
   Número: 4242 4242 4242 4242
   Fecha: 12/34
   CVC: 123
   ```

---

## 📊 Resumen de Configuración

| Componente | Estado | Valor |
|------------|--------|-------|
| **Publishable Key (Frontend)** | ✅ Configurada | `pk_live_51Skt...` |
| **Secret Key (Backend)** | ⚠️ Configurar en Vercel | `sk_live_51Skt...` |
| **Modo Stripe** | ✅ LIVE | Pagos reales |
| **Cuenta Stripe** | ✅ Activada | Verificación completa |

---

## 🔒 Seguridad

✅ **Publishable Key**: Segura en el frontend (pk_live_...)  
🔐 **Secret Key**: Protegida en variables de entorno de Vercel  
🚫 **NUNCA expongas**: La Secret Key en el código del frontend

---

## 🎯 Próximos Pasos

1. ✅ Frontend configurado (Completado)
2. ⚠️ Configurar Secret Key en Vercel (Pendiente)
3. ⚠️ Re-deploy del proyecto (Pendiente)
4. ⚠️ Probar un pago real (Pendiente)
5. ⚠️ Verificar pago en Stripe Dashboard (Pendiente)

---

## 📞 Soporte

### Problemas con Stripe:
- Dashboard: https://dashboard.stripe.com
- Soporte: https://support.stripe.com
- Documentación: https://stripe.com/docs

### Problemas con Vercel:
- Dashboard: https://vercel.com/dashboard
- Documentación: https://vercel.com/docs

---

## 📝 Notas Importantes

1. **Pagos Reales**: Todos los pagos procesados serán reales y se transferirán a tu cuenta bancaria
2. **Comisiones Stripe**: Stripe cobra ~1.5% + €0.25 por transacción en Europa
3. **Transferencias**: Los pagos se transfieren a tu cuenta bancaria cada 2-7 días
4. **Facturación**: Stripe genera facturas automáticas para tus clientes
5. **Reembolsos**: Puedes procesar reembolsos desde el Dashboard de Stripe

---

**¿Necesitas ayuda?** Contacta al desarrollador o consulta la documentación oficial de Stripe.

---

**Última actualización**: 2026-01-28  
**Configurado por**: GenSpark AI Developer  
**Cuenta Stripe**: Activada ✅
