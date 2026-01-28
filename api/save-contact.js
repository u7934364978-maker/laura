export const config = {
  runtime: 'edge',
};

// Service Role Key - Bypasea RLS
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://remyvruwpvvcestvjlsa.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req) {
  console.log('📝 Save Contact Request received');
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await req.json();
    console.log('📊 Contact data:', { name: data.name, email: data.email });
    
    // Validación
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Name, email and message are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar service role key
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Server configuration error' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Guardar en Supabase usando Service Role Key (bypasea RLS)
    const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        location: data.location || null,
        service: data.level || data.service || null,
        message: data.message,
        status: 'new'
      })
    });

    const result = await supabaseRes.json();
    
    if (!supabaseRes.ok) {
      console.error('❌ Supabase error:', result);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Error saving contact',
        details: result
      }), { 
        status: supabaseRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Contact saved successfully:', result[0]?.id);

    return new Response(JSON.stringify({ 
      success: true,
      data: result[0]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Unexpected server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
