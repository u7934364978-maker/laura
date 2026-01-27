# 📧 Cloudflare Worker - Contact Form Handler

Este Worker maneja el formulario de contacto de Wild Fitness, procesando los datos y enviando emails vía Resend.

## 🚀 Inicio Rápido

### 1. Instalar Wrangler

```bash
npm install -g wrangler
```

### 2. Iniciar sesión

```bash
wrangler login
```

### 3. Configurar secrets

```bash
wrangler secret put RESEND_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
```

### 4. Desplegar

```bash
wrangler deploy
```

## 📖 Documentación Completa

Ver: [`../../DESPLIEGUE-CLOUDFLARE-WORKERS.md`](../../DESPLIEGUE-CLOUDFLARE-WORKERS.md)

## 🧪 Desarrollo Local

```bash
npm install
npm run dev
```

El Worker estará disponible en `http://localhost:8787`

## 📝 Estructura

```
workers/contact-form/
├── index.js          # Código principal del Worker
├── wrangler.toml     # Configuración de Cloudflare
├── package.json      # Dependencias y scripts
└── README.md         # Este archivo
```

## 🔑 Variables Requeridas

| Variable | Descripción | Obtener de |
|----------|-------------|------------|
| `RESEND_API_KEY` | API Key de Resend | https://resend.com/api-keys |
| `SUPABASE_URL` | URL del proyecto Supabase | Supabase Dashboard |
| `SUPABASE_KEY` | Anon key de Supabase | Supabase Dashboard → API |

## 🧩 Funcionalidad

1. **Validación de datos** - Verifica nombre, email y mensaje
2. **Guarda en Supabase** - Almacena el contacto en la BD
3. **Email al usuario** - Envía confirmación con diseño personalizado
4. **Email al admin** - Notifica a info@wild-fitness.com
5. **CORS habilitado** - Permite requests desde wild-fitness.com

## 📊 Logs

Ver logs en tiempo real:

```bash
wrangler tail
```

O en Cloudflare Dashboard: Workers → tu Worker → Logs

## 🐛 Troubleshooting

### El Worker no responde

```bash
# Verificar estado
wrangler list

# Ver logs
wrangler tail
```

### Secrets no funcionan

```bash
# Verificar secrets configurados
wrangler secret list

# Reconfigurar un secret
wrangler secret put RESEND_API_KEY
```

### Error CORS

Edita `index.js` y ajusta los `CORS_HEADERS`:

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://wild-fitness.com',
  // ...
};
```

## 📈 Métricas

Ver en: Cloudflare Dashboard → Workers → tu Worker → Metrics

- Requests por segundo
- Errores
- Latencia
- CPU time usado

## 💰 Costos

- **Plan Gratuito:** 100,000 requests/día (suficiente)
- **Plan de Pago:** $5/mes por 10M requests

## 🔗 Links

- [Documentación completa](../../DESPLIEGUE-CLOUDFLARE-WORKERS.md)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
