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
// Worker desplegado y configurado
window.CONTACT_API_URL = 'https://wild-fitness-contact-form.w5kvt5ypsr.workers.dev';

// Opción 2: Vercel Serverless Functions (Actual)
// Deja comentada la línea de arriba para usar la API de Vercel
// window.CONTACT_API_URL = '/api/send-welcome-email';

// Opción 3: Cloudflare Workers con Custom Domain
// Si configuraste una ruta personalizada en tu dominio:
// window.CONTACT_API_URL = 'https://wild-fitness.com/api/contact';

// ============================================
// CONFIGURACIÓN ACTUAL
// ============================================

// Configuración actual: Cloudflare Workers desplegado
// URL: https://wild-fitness-contact-form.w5kvt5ypsr.workers.dev

console.log('⚙️ API configurada:', window.CONTACT_API_URL || '/api/send-welcome-email (Vercel)');
console.log('✅ Usando Cloudflare Workers para formulario de contacto');
