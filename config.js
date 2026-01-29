/**
 * CONFIGURACIÓN DE WILD FITNESS
 * 
 * Este archivo permite cambiar entre diferentes proveedores de API
 * para el formulario de contacto.
 */

// ============================================
// CONFIGURACIÓN DE API
// ============================================

// Opción 1: Cloudflare Workers (Recomendado)
// Descomenta esta línea y reemplaza con la URL de tu Worker desplegado
// window.CONTACT_API_URL = 'https://wild-fitness-contact-form.TUUSUARIO.workers.dev';

// Opción 2: Vercel Serverless Functions (Actual)
// Deja comentada la línea de arriba para usar la API de Vercel
// window.CONTACT_API_URL = '/api/send-welcome-email';

// Opción 3: Cloudflare Workers con Custom Domain
// Si configuraste una ruta personalizada en tu dominio:
// window.CONTACT_API_URL = 'https://wild-fitness.com/api/contact';

// ============================================
// CONFIGURACIÓN ACTUAL
// ============================================

// Por defecto, usa Vercel API (comentado = fallback a /api/send-welcome-email)
// Si despliegas en Cloudflare Workers, descomenta y configura la URL de arriba

console.log('⚙️ API configurada:', window.CONTACT_API_URL || '/api/send-welcome-email (Vercel)');
