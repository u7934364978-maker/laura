# Instrucciones de Configuración DNS para Wild Fitness

Basado en las capturas de pantalla proporcionadas, aquí están los cambios necesarios en **Cloudflare** para que Resend verifique tu dominio correctamente:

## 1. Limpieza de Registros Duplicados (IMPORTANTE)
En tu captura de Cloudflare aparecen registros duplicados. **Elimina uno de ellos** para evitar conflictos:
- Tienes dos registros TXT para `resend._domainkey`. Elimina el que tiene el TTL de `1 h` y quédate con el que tiene TTL `Automático` (o asegúrate de que el valor coincida exactamente con el que pide Resend).
- Tienes dos registros TXT para `_vercel`. No afectan a Resend, pero revisa si ambos son necesarios.

## 2. Verificación de Registros Existentes
Asegúrate de que estos tres registros estén configurados como **"Solo DNS" (nube gris)**, NO "Proxied" (nube naranja):

### DKIM (TXT)
- **Nombre**: `resend._domainkey`
- **Valor**: Copia el valor exacto desde el panel de Resend (empieza por `p=MIGf...`).
- **Estado**: Solo DNS.

### SPF (TXT)
- **Nombre**: `send`
- **Valor**: `v=spf1 include:amazonses.com ~all`
- **Estado**: Solo DNS.

### MX (MX)
- **Nombre**: `send`
- **Servidor de correo**: `feedback-smtp.eu-west-1.amazonses.com`
- **Prioridad**: `10`
- **Estado**: Solo DNS.

## 3. Siguientes Pasos
Una vez realizados los cambios en Cloudflare:
1. Ve al panel de **Resend > Domains**.
2. Haz clic en tu dominio (`wild-fitness.com`).
3. Haz clic en el botón **Verify** (arriba a la derecha).
4. El estado debería cambiar de `Failed` a `Verified`.

*Nota: Los cambios DNS pueden tardar unos minutos en propagarse.*
