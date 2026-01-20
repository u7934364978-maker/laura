# 🎯 GUÍA RÁPIDA: CONFIGURAR DNS PARA WILD FITNESS
## Dominio: www.wild-fitness.com

---

## 📋 PASO A PASO COMPLETO

### **PASO 1: Crear cuenta en Resend** (5 minutos)

1. Ir a: **https://resend.com/signup**
2. Registrarse con el email: **info@wild-fitness.com**
3. Verificar el email que llegue a la bandeja de entrada
4. Iniciar sesión en Resend

---

### **PASO 2: Añadir dominio en Resend** (2 minutos)

1. En el Dashboard de Resend, hacer clic en **"Domains"** (menú izquierdo)
2. Hacer clic en botón **"Add Domain"**
3. En el campo, escribir: **`wild-fitness.com`** (sin www)
4. Hacer clic en **"Add"**

✅ Resend mostrará una pantalla con 3 registros DNS que necesitas añadir.

---

### **PASO 3: Copiar los registros DNS de Resend**

Resend te mostrará algo como esto (copia estos valores):

```
📝 REGISTRO 1 - Verificación del dominio:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo: TXT
Nombre: @ (o wild-fitness.com)
Valor: resend-verify=abc123def456... (copiar TODO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 REGISTRO 2 - DKIM (Autenticación):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo: TXT
Nombre: resend._domainkey
Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA4... (MUY LARGO, copiar TODO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 REGISTRO 3 - MX (Recepción de emails):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo: MX
Nombre: @ (o wild-fitness.com)
Prioridad: 10
Servidor: mx.resend.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

⚠️ **NO CIERRES LA PÁGINA DE RESEND** - La necesitarás para copiar los valores exactos.

---

### **PASO 4: Ir a Cloudflare DNS** (1 minuto)

1. Abrir nueva pestaña: **https://dash.cloudflare.com/**
2. Iniciar sesión con tu cuenta de Cloudflare
3. En la lista de sitios, hacer clic en **`wild-fitness.com`**
4. En el menú lateral izquierdo, hacer clic en **"DNS"**
5. Verás la página de "DNS Management"

---

### **PASO 5: Añadir REGISTRO 1 - Verificación (TXT)** (2 minutos)

1. En Cloudflare DNS, hacer clic en botón azul **"Add record"**

2. Rellenar el formulario:
   ```
   Type:     Seleccionar → TXT
   Name:     Escribir → @
   Content:  Pegar → resend-verify=abc123def456...
             (el valor completo de Resend)
   TTL:      Dejar → Auto
   Proxy:    Debe estar en → DNS only (nube GRIS, no naranja)
   ```

3. Hacer clic en **"Save"**

**Aspecto visual del formulario:**
```
┌──────────────────────────────────────────────────┐
│ Add DNS record                                   │
├──────────────────────────────────────────────────┤
│                                                  │
│ Type:    [TXT ▼]                                │
│                                                  │
│ Name:    [@                                   ]  │
│          ↑ Escribir arroba                       │
│                                                  │
│ Content: [resend-verify=abc123def456ghij...]    │
│          ↑ Pegar el valor completo de Resend     │
│                                                  │
│ TTL:     [Auto ▼]                               │
│                                                  │
│ Proxy:   ○ Proxied  ● DNS only                  │
│          ↑ Seleccionar DNS only (gris)           │
│                                                  │
│          [Cancel]  [Save]                        │
└──────────────────────────────────────────────────┘
```

---

### **PASO 6: Añadir REGISTRO 2 - DKIM (TXT)** (2 minutos)

1. Hacer clic de nuevo en **"Add record"**

2. Rellenar el formulario:
   ```
   Type:     Seleccionar → TXT
   Name:     Escribir → resend._domainkey
   Content:  Pegar → p=MIGfMA0GCSqGSIb3DQEBAQUAA4...
             (el valor MUY LARGO de Resend, asegúrate de copiarlo TODO)
   TTL:      Dejar → Auto
   Proxy:    Debe estar en → DNS only (nube GRIS)
   ```

3. Hacer clic en **"Save"**

⚠️ **IMPORTANTE**: El valor de DKIM es muy largo (200+ caracteres). Asegúrate de copiarlo completo.

---

### **PASO 7: Añadir REGISTRO 3 - MX** (2 minutos)

1. Hacer clic en **"Add record"** otra vez

2. Rellenar el formulario:
   ```
   Type:        Seleccionar → MX
   Name:        Escribir → @
   Mail server: Escribir → mx.resend.com
   Priority:    Escribir → 10
   TTL:         Dejar → Auto
   ```

3. Hacer clic en **"Save"**

**Aspecto visual:**
```
┌──────────────────────────────────────────────────┐
│ Add DNS record                                   │
├──────────────────────────────────────────────────┤
│                                                  │
│ Type:        [MX ▼]                             │
│                                                  │
│ Name:        [@                               ]  │
│                                                  │
│ Mail server: [mx.resend.com                   ]  │
│              ↑ Escribir esto exactamente         │
│                                                  │
│ Priority:    [10                              ]  │
│              ↑ Número diez                       │
│                                                  │
│ TTL:         [Auto ▼]                           │
│                                                  │
│              [Cancel]  [Save]                    │
└──────────────────────────────────────────────────┘
```

---

### **PASO 8: Verificar que están bien añadidos** (1 minuto)

Después de añadir los 3 registros, tu lista de DNS en Cloudflare debería verse así:

```
┌──────┬─────────────────────────┬────────────────────────┬──────────┐
│ Type │ Name                    │ Content                │ Proxy    │
├──────┼─────────────────────────┼────────────────────────┼──────────┤
│ A    │ wild-fitness.com        │ 76.76.21.21           │ Proxied  │
│ AAAA │ wild-fitness.com        │ 2606:...              │ Proxied  │
│ CNAME│ www                     │ wild-fitness.com       │ Proxied  │
├──────┼─────────────────────────┼────────────────────────┼──────────┤
│ TXT  │ wild-fitness.com        │ resend-verify=abc...   │ DNS only │ ← NUEVO
│ TXT  │ resend._domainkey       │ p=MIGfMA0GCSqG...      │ DNS only │ ← NUEVO
│ MX   │ wild-fitness.com        │ mx.resend.com (10)     │ —        │ ← NUEVO
└──────┴─────────────────────────┴────────────────────────┴──────────┘
```

✅ Deberías ver los 3 nuevos registros en la lista.

---

### **PASO 9: Esperar propagación DNS** (15-30 minutos)

Los cambios DNS tardan un poco en propagarse por internet.

**Mientras esperas, puedes:**
- ☕ Tomar un café
- 📱 Revisar Instagram
- 💻 Continuar con otros pasos del proyecto

⏰ **Tiempo recomendado de espera: 15 minutos**

---

### **PASO 10: Verificar dominio en Resend** (1 minuto)

1. **Volver a la pestaña de Resend** (donde añadiste el dominio)

2. Debería haber un botón que dice:
   - **"Verify Domain"** o
   - **"Check Status"** o
   - **"Refresh Status"**

3. **Hacer clic en el botón**

4. **Resultado esperado:**
   ```
   ✅ Domain verified
   ✅ DKIM configured  
   ✅ SPF configured
   ✅ Ready to send
   ```

Si muestra esto, ¡PERFECTO! ✅

---

### **SI DICE "NOT VERIFIED" O "PENDING":**

No te preocupes, es normal. Significa que los DNS aún no han propagado.

**Qué hacer:**
1. Esperar 10-15 minutos más
2. Intentar verificar de nuevo
3. Repetir hasta que funcione (puede tardar hasta 48h, pero normalmente es rápido)

**Verificar manualmente los DNS:**
1. Ir a: https://mxtoolbox.com/SuperTool.aspx
2. Escribir: `wild-fitness.com`
3. Seleccionar: **"TXT Lookup"**
4. Hacer clic en **"TXT Lookup"**
5. Deberías ver el registro `resend-verify=...`

Si lo ves ahí, los DNS están propagados y deberías poder verificar en Resend.

---

## ✅ CHECKLIST COMPLETO

```
☐ Cuenta Resend creada (info@wild-fitness.com)
☐ Email de Resend verificado
☐ Dominio wild-fitness.com añadido en Resend
☐ Registros DNS copiados de Resend
☐ Login en Cloudflare Dashboard
☐ Registro TXT de verificación añadido
☐ Registro TXT DKIM añadido
☐ Registro MX añadido
☐ Los 3 registros visibles en lista de Cloudflare
☐ Esperado 15-30 minutos
☐ Dominio verificado en Resend (✅ verde)
```

---

## 🎉 ¡LISTO!

Cuando veas los checks verdes en Resend, el sistema de emails está configurado y listo.

**Siguiente paso:** Continuar con el deploy del Cloudflare Worker (siguiente guía).

---

## ❓ PROBLEMAS COMUNES

### "Domain already exists"
**Solución:** El dominio ya fue añadido antes. Buscar en la lista de dominios en Resend.

### "Invalid domain"
**Solución:** Escribir `wild-fitness.com` sin `www` y sin `https://`

### "DNS records not found"
**Solución:** 
1. Verificar que los registros están en Cloudflare
2. Verificar que copiaste los valores completos
3. Esperar más tiempo (hasta 48h en casos extremos)

### "Name already exists" en Cloudflare
**Solución:**
1. Buscar si ya existe un registro con ese nombre
2. Editarlo en lugar de crear uno nuevo
3. O eliminarlo y crear uno fresco

---

## 📸 ¿NECESITAS AYUDA VISUAL?

Si necesitas capturas de pantalla de:
- Cómo se ve Resend
- Cómo se ve Cloudflare DNS
- Dónde hacer clic exactamente

Solo pregúntame y te guío paso a paso! 🚀

---

**Dominio configurado:** wild-fitness.com ✅
**Email del admin:** info@wild-fitness.com ✅
**Sistema de emails:** Resend + Cloudflare Workers ✅
