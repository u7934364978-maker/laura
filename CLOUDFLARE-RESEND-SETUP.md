# 🎯 Guía Paso a Paso: Configurar Resend en Cloudflare

## 🔍 Diagnóstico Actual
✅ API Key de Resend: Configurada en Vercel  
❌ Dominio verificado: **NO VERIFICADO**  
❌ Registros DNS: **NO CONFIGURADOS**

---

## 📋 Registros que Necesitas de Resend

### Paso 1: Obtén los Registros Específicos de Resend

1. Ve a tu dashboard de Resend: **https://resend.com/domains**

2. Busca tu dominio `wild-fitness.com` o agrégalo si no está:
   - Click en **"Add Domain"**
   - Ingresa: `wild-fitness.com`
   - Click en **"Add"**

3. Resend te mostrará una pantalla con **3-4 registros DNS** que necesitas copiar:

---

## 📝 Ejemplo de Registros (los tuyos serán diferentes)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. VERIFICACIÓN DEL DOMINIO                                 │
├─────────────────────────────────────────────────────────────┤
│ Type: TXT                                                    │
│ Name: @   (o el dominio completo)                           │
│ Value: resend-domain-verify=abc123xyz456...                 │
│ TTL: Auto                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. DKIM (Autenticación de Email)                            │
├─────────────────────────────────────────────────────────────┤
│ Type: TXT                                                    │
│ Name: resend._domainkey                                      │
│ Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNA...  │
│        (valor MUY LARGO - 400+ caracteres)                   │
│ TTL: Auto                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. SPF (Prevención de Spam) - OPCIONAL                      │
├─────────────────────────────────────────────────────────────┤
│ Type: TXT                                                    │
│ Name: @                                                      │
│ Value: v=spf1 include:_spf.resend.com ~all                  │
│ TTL: Auto                                                    │
└─────────────────────────────────────────────────────────────┘
```

**⚠️ IMPORTANTE**: Los valores de arriba son **ejemplos**. Copia los valores EXACTOS que Resend te muestra a TI.

---

## 🔧 Configurar en Cloudflare (Paso a Paso con Imágenes)

### Paso 1: Acceder a Cloudflare DNS

1. Ve a: **https://dash.cloudflare.com**
2. Inicia sesión con tu cuenta
3. Click en el dominio: **wild-fitness.com**
4. En el menú lateral izquierdo, click en **"DNS"** → **"Records"**

---

### Paso 2: Agregar Registro de Verificación TXT

1. Click en el botón azul **"Add record"** (arriba a la derecha)

2. Completa el formulario:
   ```
   ┌─────────────────────────────────────────────────┐
   │ Type:    TXT                                    │
   ├─────────────────────────────────────────────────┤
   │ Name:    @                                      │
   │          (o deja en blanco, o wild-fitness.com) │
   ├─────────────────────────────────────────────────┤
   │ Content: resend-domain-verify=abc123...        │
   │          (COPIA el valor EXACTO de Resend)      │
   ├─────────────────────────────────────────────────┤
   │ TTL:     Auto                                   │
   ├─────────────────────────────────────────────────┤
   │ Proxy:   🔘 DNS only (GRIS - NO NARANJA)       │
   │          ⚠️ DESACTIVA LA NUBE NARANJA          │
   └─────────────────────────────────────────────────┘
   ```

3. Click en **"Save"**

**✅ Resultado**: Verás el registro en la lista con una nube GRIS (no naranja)

---

### Paso 3: Agregar Registro DKIM

1. Click de nuevo en **"Add record"**

2. Completa el formulario:
   ```
   ┌─────────────────────────────────────────────────┐
   │ Type:    TXT                                    │
   ├─────────────────────────────────────────────────┤
   │ Name:    resend._domainkey                      │
   │          ⚠️ EXACTAMENTE así (sin @)            │
   ├─────────────────────────────────────────────────┤
   │ Content: v=DKIM1; k=rsa; p=MIGfMA0GCS...       │
   │          (COPIA TODO el valor de Resend)        │
   │          ⚠️ Es MUY LARGO (400+ caracteres)     │
   │          Asegúrate de copiarlo COMPLETO         │
   ├─────────────────────────────────────────────────┤
   │ TTL:     Auto                                   │
   ├─────────────────────────────────────────────────┤
   │ Proxy:   🔘 DNS only (GRIS - NO NARANJA)       │
   └─────────────────────────────────────────────────┘
   ```

3. Click en **"Save"**

**✅ Resultado**: Ahora tienes 2 registros TXT configurados

---

### Paso 4: Agregar SPF (Opcional pero Recomendado)

Si Resend te pide un registro SPF:

1. Click en **"Add record"**

2. Completa:
   ```
   ┌─────────────────────────────────────────────────┐
   │ Type:    TXT                                    │
   ├─────────────────────────────────────────────────┤
   │ Name:    @                                      │
   ├─────────────────────────────────────────────────┤
   │ Content: v=spf1 include:_spf.resend.com ~all   │
   ├─────────────────────────────────────────────────┤
   │ TTL:     Auto                                   │
   ├─────────────────────────────────────────────────┤
   │ Proxy:   🔘 DNS only                           │
   └─────────────────────────────────────────────────┘
   ```

---

## ⏰ Paso 5: Esperar Propagación DNS

Después de agregar los registros:

1. **Espera 5-15 minutos** (a veces hasta 30 minutos)
2. Los cambios DNS no son instantáneos
3. ☕ Toma un café mientras se propaga

---

## ✅ Paso 6: Verificar en Resend

1. Vuelve a: **https://resend.com/domains**
2. Encuentra tu dominio `wild-fitness.com`
3. Click en el botón **"Verify"** o **"Check DNS"**

### Posibles resultados:

#### ✅ Éxito:
```
✓ Domain verified
✓ DKIM configured
✓ Ready to send emails
```

#### ⏳ Propagando:
```
⚠ DNS records not found yet
  Please wait 5-30 minutes
```

#### ❌ Error:
```
✗ DNS records not configured correctly
  Check your Cloudflare settings
```

---

## 🔍 Verificar Manualmente (Opcional)

Puedes verificar tus registros DNS usando herramientas online:

1. Ve a: **https://dnschecker.org**
2. Ingresa: `wild-fitness.com`
3. Selecciona tipo: **TXT**
4. Click en **"Search"**
5. Deberías ver tus registros de Resend

O para DKIM específicamente:
1. Ingresa: `resend._domainkey.wild-fitness.com`
2. Tipo: **TXT**
3. Deberías ver el registro DKIM

---

## 🚨 Problemas Comunes y Soluciones

### ❌ "El registro ya existe"

**Si ya tienes un registro TXT en `@`** (por ejemplo, Google Site Verification):

✅ **Solución**: Puedes tener múltiples registros TXT
- No borres el existente
- Agrega uno NUEVO con el valor de Resend
- Cloudflare permite varios registros TXT en el mismo nombre

### ❌ "La nube está naranja y no puedo cambiarla"

✅ **Solución**: 
- Click directamente en la nube naranja ☁️
- Debería cambiar a gris ⚪
- Si no cambia, edita el registro y busca el toggle "Proxy status"

### ❌ "DKIM no verifica después de 30 minutos"

✅ **Verifica**:
1. ¿Copiaste el valor COMPLETO? (es muy largo)
2. ¿El nombre es EXACTAMENTE `resend._domainkey`?
3. ¿La nube está en gris (DNS only)?
4. ¿Hay espacios o saltos de línea en el valor?

### ❌ "Cloudflare dice que el contenido es demasiado largo"

✅ **Solución**:
- El valor DKIM puede ser de 500+ caracteres
- Cloudflare sí lo acepta
- Asegúrate de NO tener espacios ni saltos de línea
- Copia y pega TODO en una sola línea

---

## 📸 ¿Necesitas Ayuda Visual?

Si ves algún error específico en Resend, dime:

1. **¿Qué mensaje de error exacto muestra Resend?**
   - Ejemplo: "DKIM record not found"
   - Ejemplo: "Domain not verified"

2. **¿Cuánto tiempo hace que agregaste los registros?**
   - Menos de 15 minutos → Espera más
   - Más de 30 minutos → Revisa configuración

3. **¿Puedes ver los registros en Cloudflare?**
   - Deberías ver al menos 2 registros TXT

---

## 🎯 Checklist de Verificación

Antes de contactar soporte, verifica:

- [ ] Agregué el registro TXT de verificación en Cloudflare
- [ ] Agregué el registro DKIM (resend._domainkey) en Cloudflare
- [ ] Ambos registros tienen la nube GRIS (DNS only), no naranja
- [ ] Esperé al menos 15 minutos después de agregar los registros
- [ ] Los valores copiados son EXACTOS (sin espacios extra)
- [ ] Verifiqué en dnschecker.org que los registros son visibles

---

## 💡 Alternativa: Usar Subdominio

Si tienes problemas con el dominio raíz, puedes usar un subdominio:

### Configurar `mail.wild-fitness.com`:

1. En Resend, agrega: `mail.wild-fitness.com`
2. Configura los registros DNS con el prefijo `mail`
3. En el código, cambia:
   ```javascript
   // Antes
   const FROM_EMAIL = 'Wild Fitness <noreply@wild-fitness.com>';
   
   // Después
   const FROM_EMAIL = 'Wild Fitness <noreply@mail.wild-fitness.com>';
   ```

---

## 📞 Siguiente Paso

**Una vez que el dominio esté verificado en Resend**:

1. Vuelve aquí y confirma que está verificado
2. Probaremos el formulario de contacto end-to-end
3. Verificaremos que los emails se envían correctamente

**¿Qué necesitas ahora?**
- [ ] Ayuda para encontrar los registros exactos en Resend
- [ ] Ayuda para agregar los registros en Cloudflare
- [ ] Verificar si los registros ya están pero no se detectan
- [ ] Usar el subdominio alternativo

---

**Última actualización**: 2026-01-28  
**Próximo paso**: Configurar registros DNS en Cloudflare según valores de Resend
