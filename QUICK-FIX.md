# 🚨 SOLUCIÓN RÁPIDA - 5 Minutos

## TL;DR - Los Dos Problemas

1. ⛔ **Supabase RLS**: No permite guardar contactos → Ejecutar SQL
2. ⛔ **Resend Domain**: No permite enviar emails → Usar dominio temporal o verificar

---

## ⚡ FIX RÁPIDO (5 minutos)

### 1️⃣ Arreglar Supabase (2 min)

```bash
# En Supabase SQL Editor (https://supabase.com/dashboard):
1. Copia el contenido de: fix-rls-contact-submissions.sql
2. Pégalo en SQL Editor
3. Click en "Run"
4. ✅ Listo - Ya puedes guardar contactos
```

### 2️⃣ Arreglar Resend Emails (3 min)

#### Opción A: Temporal (funciona YA - 1 minuto)

```bash
# En Vercel Environment Variables:
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=info@wild-fitness.com
RESEND_API_KEY=re_tuAPIkey

# Redeploy el proyecto
# ✅ Los emails se enviarán (pueden ir a spam)
```

#### Opción B: Profesional (tarda 24h pero mejor)

```bash
# 1. Ve a https://resend.com/domains
# 2. Añade: wild-fitness.com
# 3. Copia los registros DNS
# 4. Pégalos en Cloudflare DNS (o tu proveedor)
# 5. Espera 24h a que verifique
# 6. En Vercel:
FROM_EMAIL=Wild Fitness <noreply@wild-fitness.com>
```

---

## 📝 Checklist de Verificación

- [ ] Script SQL ejecutado en Supabase
- [ ] Políticas RLS creadas correctamente
- [ ] Variable `RESEND_API_KEY` en Vercel
- [ ] Variable `FROM_EMAIL` configurada
- [ ] Proyecto redeployado en Vercel
- [ ] Formulario probado y funcional

---

## 🧪 Test Rápido

```bash
# 1. Probar Supabase:
# En Supabase SQL Editor:
INSERT INTO contact_submissions (name, email, message) 
VALUES ('Test', 'test@test.com', 'Test message');
# ✅ Debe funcionar sin error 42501

# 2. Probar formulario web:
# Ve a: https://wild-fitness.com/contacte.html
# Rellena y envía
# ✅ Debe mostrar mensaje de éxito
# ✅ Debe enviar email (revisa spam si usas onboarding@resend.dev)
```

---

## 🚨 Si No Funciona

1. **Error 42501**: Ejecuta de nuevo el SQL en Supabase
2. **Error 403 Resend**: Usa `FROM_EMAIL=onboarding@resend.dev` temporalmente
3. **Email no llega**: Revisa spam, verifica API key en Vercel
4. **Otros errores**: Lee `TROUBLESHOOTING.md` completo

---

## 📞 Ayuda

- **Documentación completa**: Ver `TROUBLESHOOTING.md`
- **Logs de errores**: Vercel Dashboard → Function Logs
- **Soporte Supabase**: https://supabase.com/support
- **Soporte Resend**: https://resend.com/support

---

**⏱️ Tiempo estimado de solución**: 5 minutos (temporal) o 24h (profesional)
