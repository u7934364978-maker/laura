export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

  return new Response(JSON.stringify({
    stripe_secret_configured: !!STRIPE_SECRET_KEY,
    stripe_secret_prefix: STRIPE_SECRET_KEY ? STRIPE_SECRET_KEY.substring(0, 7) + '...' : 'NOT SET',
    stripe_secret_length: STRIPE_SECRET_KEY ? STRIPE_SECRET_KEY.length : 0,
    stripe_publishable_configured: !!STRIPE_PUBLISHABLE_KEY,
    stripe_publishable_prefix: STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY.substring(0, 7) + '...' : 'NOT SET',
    all_env_vars: Object.keys(process.env).filter(key => key.includes('STRIPE'))
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
