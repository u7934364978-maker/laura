/**
 * 🔥 CONFIGURACIÓN DE SUPABASE - WILD FITNESS
 * 
 * INSTRUCCIONES:
 * 1. Ve a https://supabase.com y crea una cuenta
 * 2. Crea un nuevo proyecto llamado "wild-fitness"
 * 3. Ve a Settings → API
 * 4. Copia y pega aquí tu Project URL y anon key
 */

const SUPABASE_CONFIG = {
    // 🔑 Credenciales de Supabase - Wild Fitness (ACTUALIZADAS 2026-01-28)
    url: 'https://yzlhczlqzvxjcnmonjaj.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI'
};

// ✅ No toques esto - Cliente de Supabase
let supabaseClient = null;

function initSupabase() {
    // Verificar si el objeto global de Supabase está disponible
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase library no cargada. Verifica que el CDN esté incluido.');
        return null;
    }
    
    if (SUPABASE_CONFIG.url === 'TU_PROJECT_URL_AQUI' || 
        SUPABASE_CONFIG.anonKey === 'TU_ANON_KEY_AQUI') {
        console.error('❌ SUPABASE NO CONFIGURADO - Lee las instrucciones en supabase-config.js');
        return null;
    }
    
    if (!supabaseClient) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✅ Supabase inicializado correctamente');
            console.log('📊 URL:', SUPABASE_CONFIG.url);
        } catch (error) {
            console.error('❌ Error al inicializar Supabase:', error);
            return null;
        }
    }
    
    return supabaseClient;
}

/**
 * 📊 FUNCIONES DE BASE DE DATOS
 */

// Obtener todas las actividades
async function getActivities() {
    const client = initSupabase();
    if (!client) return [];
    
    try {
        const { data, error } = await client
            .from('activities')
            .select('*')
            .order('date', { ascending: true });
        
        if (error) throw error;
        
        console.log(`✅ ${data.length} actividades cargadas desde Supabase`);
        return data || [];
    } catch (error) {
        console.error('❌ Error al cargar actividades:', error);
        return [];
    }
}

// Crear actividad
async function createActivity(activity) {
    const client = initSupabase();
    if (!client) return null;
    
    try {
        console.log('📤 Intentando insertar actividad:', activity);
        const { data, error } = await client
            .from('activities')
            .insert([activity])
            .select()
            .single();
        
        if (error) {
            console.error('❌ Error de Supabase al insertar:', error);
            // Si el error es por la columna price, intentamos sin ella como fallback temporal
            if (error.message && error.message.includes('price')) {
                console.warn('⚠️ Columna "price" no encontrada. Reintentando sin ella...');
                const { price, ...activityWithoutPrice } = activity;
                const retry = await client
                    .from('activities')
                    .insert([activityWithoutPrice])
                    .select()
                    .single();
                
                if (retry.error) throw retry.error;
                return retry.data;
            }
            throw error;
        }
        
        console.log('✅ Actividad creada:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al crear actividad:', error);
        throw error;
    }
}

// Actualizar actividad
async function updateActivity(id, updates) {
    const client = initSupabase();
    if (!client) return null;
    
    try {
        const { data, error } = await client
            .from('activities')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('✅ Actividad actualizada:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al actualizar actividad:', error);
        throw error;
    }
}

// Eliminar actividad
async function deleteActivityFromDB(id) {
    const client = initSupabase();
    if (!client) return false;
    
    try {
        const { error } = await client
            .from('activities')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        console.log('✅ Actividad eliminada:', id);
        return true;
    } catch (error) {
        console.error('❌ Error al eliminar actividad:', error);
        throw error;
    }
}

// Suscribirse a cambios en tiempo real
function subscribeToActivities(callback) {
    const client = initSupabase();
    if (!client) return null;
    
    const subscription = client
        .channel('activities_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'activities' },
            (payload) => {
                console.log('🔄 Cambio detectado en Supabase:', payload);
                callback(payload);
            }
        )
        .subscribe();
    
    console.log('✅ Suscrito a cambios en tiempo real');
    return subscription;
}

// Guardar formulario de contacto
// ⚠️ DESHABILITADO: Ahora se guarda desde el backend (/api/send-welcome-email)
// Para evitar problemas de RLS, el backend maneja el guardado en Supabase
async function saveContactSubmission(contactData) {
    console.log('⚠️ saveContactSubmission llamada desde frontend (ignorada)');
    console.log('💡 El guardado en Supabase se hace desde el backend API');
    return null; // No hacemos nada, el backend lo maneja
    
    /* CÓDIGO ORIGINAL COMENTADO
    const client = initSupabase();
    if (!client) {
        console.warn('⚠️ Supabase no disponible, saltando guardado');
        return null;
    }
    
    try {
        const { data, error } = await client
            .from('contact_submissions')
            .insert([{
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone || null,
                location: contactData.location || null,
                service: contactData.level || null,
                message: contactData.message,
                status: 'new'
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('✅ Contacto guardado en Supabase:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al guardar contacto:', error);
        return null;
    }
    */
}

console.log('📦 supabase-config.js cargado');
