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
    // 🔑 Credenciales de Supabase - Wild Fitness
    url: 'https://remyvruwpvvcestvjlsa.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbXl2cnV3cHZ2Y2VzdHZqbHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjA1NTYsImV4cCI6MjA4NDQ5NjU1Nn0.VUl2tuftugAEOvyy18DsO5Qfq4SPyFcXFcLb5Nn15nU'
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
        const { data, error } = await client
            .from('activities')
            .insert([activity])
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('✅ Actividad creada:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al crear actividad:', error);
        return null;
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
        return null;
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
        return false;
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

console.log('📦 supabase-config.js cargado');
