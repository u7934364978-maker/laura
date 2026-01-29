// ============================================
// CALENDARI D'ACTIVITATS - WILD FITNESS
// Activity Management System with Admin Authentication
// ============================================

// Storage Keys
const STORAGE_KEY = 'wild_fitness_activities';
const AUTH_KEY = 'wild_fitness_admin_auth';
const ADMIN_CREDENTIALS_KEY = 'wild_fitness_admin_credentials';

// Default Admin Credentials (will be hashed)
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'WildFitness2024!' // Cambiar esta contraseña en producción
};

// Activity Type Icons and Labels
const ACTIVITY_TYPES = {
    trail: { 
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="type-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', 
        label: 'Trail Running' 
    },
    trekking: { 
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="type-icon"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>', 
        label: 'Trekking' 
    },
    training: { 
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="type-icon"><path d="M18 20V4M6 20V4M18 12H6M2 8h4M18 8h4M2 16h4M18 16h4"/></svg>', 
        label: 'Entrenament' 
    },
    yoga: { 
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="type-icon"><circle cx="12" cy="12" r="3"/><path d="M12 16.5c.667 1.167 2.167 3.5 1.5 4.5-.667 1-2.5-1-1.5-4.5z"/><path d="M12 7.5c-.667-1.167-2.167-3.5-1.5-4.5.667-1 2.5 1 1.5 4.5z"/><path d="M16.5 12c1.167-.667 3.5-2.167 4.5-1.5 1 .667-1 2.5-4.5 1.5z"/><path d="M7.5 12c-1.167.667-3.5 2.167-4.5 1.5-1-.667 1-2.5 4.5-1.5z"/></svg>', 
        label: 'Yoga' 
    },
    workshop: { 
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="type-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', 
        label: 'Workshop' 
    }
};

// State Management
let activities = [];
let currentFilter = 'all';
let isAdminLoggedIn = false;

// Stripe Configuration
// CONFIGURADO EN LIVE MODE - PAGOS REALES
// Cuenta Stripe activada - Aceptando pagos reales
// Última actualización: 2026-01-28
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SrimkKOKBlj0PU4E0Hwmgo6GmX9BwUVlskqk3CoTKj2jlJx32V8Bs1oMhSv4RdSXfMzxSHphXgtQ6rGYZdKqjlw00L6KLhGIf';
let stripe = null;
let elements = null;
let cardElement = null;

// ============================================
// Initialize Calendar
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Calendar...');
    
    // Initialize Stripe
    if (typeof Stripe !== 'undefined') {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        elements = stripe.elements();
        console.log('Stripe inicialitzat');
    }
    
    // Check if accessed from admin panel
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminMode = urlParams.get('admin') === 'true';
    
    // Initialize admin credentials if not exists
    initAdminCredentials();
    
    // Check if admin is logged in
    checkAdminAuth();
    
    // Show admin button only if in admin mode and authenticated
    const adminBtn = document.getElementById('toggleAdminBtn');
    if (adminBtn && isAdminMode && isAdminLoggedIn) {
        adminBtn.style.display = 'flex';
    }
    
    // Load activities from localStorage
    loadActivities();
    
    // Initialize event listeners
    initEventListeners();
    
    // Render activities
    renderActivities();
    
    // Update UI based on auth status
    updateUIForAuthState();
    
    // Set minimum date to today
    const dateInput = document.getElementById('activityDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // ============================================
    // SYNC: Real-time synchronization system
    // Uses BroadcastChannel API for instant updates across tabs
    // ============================================
    
    // Create broadcast channel for real-time sync
    let syncChannel;
    try {
        syncChannel = new BroadcastChannel('wild_fitness_sync');
        
        // Listen for sync messages from other tabs
        syncChannel.onmessage = (event) => {
            if (event.data.type === 'activities_updated') {
                console.log('Activitats actualitzades des d\'un altre panell (BroadcastChannel)');
                loadActivities();
                renderActivities();
                showNotification('Calendari actualitzat', 'Les activitats s\'han actualitzat automàticament');
            }
        };
        
        console.log('BroadcastChannel activat per sincronització');
    } catch (e) {
        console.warn('BroadcastChannel no disponible, usant storage events');
    }
    
    // Fallback: Listen for storage events (works between different windows)
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue !== e.oldValue) {
            console.log('Activitats actualitzades (storage event)');
            loadActivities();
        }
    });
    
    // Fallback: Periodic polling every 3 seconds
    setInterval(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const currentStored = JSON.stringify(activities);
        if (stored !== currentStored) {
            console.log('Actualització periòdica detectada');
            loadActivities();
        }
    }, 3000); // Check every 3 seconds
    
    // ============================================
    // SUPABASE: Real-time subscriptions
    // ============================================
    subscribeToActivities((payload) => {
        console.log('Supabase real-time update:', payload.eventType);
        loadActivities();
    });

    // Check for Bizum redirect success
    handleBizumCallback();
});

/**
 * Handle success callback from Bizum redirect
 */
async function handleBizumCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingSuccess = urlParams.get('booking_success');
    const paymentIntentId = urlParams.get('payment_intent');
    const clientSecret = urlParams.get('payment_intent_client_secret');
    
    if (bookingSuccess === 'true' && paymentIntentId && clientSecret) {
        console.log('Procesant retorn de Bizum...');
        
        try {
            // 1. Mostrar modal de càrrega
            const modal = document.getElementById('bookingModal');
            const modalBody = document.getElementById('modalBody');
            
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; border-top-color: var(--primary-color); margin: 0 auto 1.5rem; animation: rotate 2s linear infinite; border: 4px solid rgba(0,0,0,0.1); border-top: 4px solid var(--primary-color); border-radius: 50%;"></div>
                        <h3>Verificant pagament...</h3>
                        <p>Estem confirmant la teva reserva amb Bizum.</p>
                    </div>
                `;
                modal.classList.add('active');
            }

            // 2. Verificar estat del PaymentIntent amb Stripe
            if (!stripe && typeof Stripe !== 'undefined') {
                stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            }
            
            if (!stripe) throw new Error('Stripe no s\'ha pogut carregar.');

            const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);
            
            if (error) {
                throw new Error(error.message);
            }
            
            if (paymentIntent.status === 'succeeded') {
                // 3. Pagament confirmat, recuperar dades del PaymentIntent metadata
                const activityId = parseInt(urlParams.get('activity_id'));
                const { 
                    customerName: name, 
                    customerEmail: email, 
                    customerPhone: phone, 
                    customerNotes: notes = '' 
                } = paymentIntent.metadata;
                
                if (!name || !email) {
                    console.error('Metadata missing in PaymentIntent:', paymentIntent.metadata);
                    throw new Error('No s\'han trobat les dades del participant en el pagament.');
                }
                
                // Necessitem esperar que les activitats s'hagin carregat
                let attempts = 0;
                const waitForActivities = setInterval(async () => {
                    attempts++;
                    if (activities.length > 0 || attempts > 20) {
                        clearInterval(waitForActivities);
                        
                        const activity = activities.find(a => a.id === activityId);
                        if (activity) {
                            const participant = {
                                id: Date.now(),
                                name,
                                email,
                                phone,
                                notes,
                                bookedAt: new Date().toISOString(),
                                paymentId: paymentIntent.id,
                                amount: activity.price || 10.00,
                                status: 'paid'
                            };
                            
                            if (!activity.participants) activity.participants = [];
                            
                            // Evitar duplicats si l'usuari recarrega la pàgina
                            const exists = activity.participants.some(p => p.paymentId === paymentIntent.id);
                            
                            if (!exists) {
                                activity.participants.push(participant);
                                activity.enrolled = activity.participants.length;
                                
                                // Actualitzar Supabase
                                if (typeof updateActivity === 'function') {
                                    await updateActivity(activity.id, {
                                        participants: activity.participants,
                                        enrolled: activity.enrolled
                                    });
                                }
                                
                                saveActivities();
                                renderActivities();
                                
                                // Enviar email
                                sendConfirmationEmail(participant, activity);
                            }
                            
                            // Mostrar èxit
                            if (modalBody) {
                                modalBody.innerHTML = `
                                    <div class="booking-success">
                                        <div class="success-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; color: var(--success-color); margin: 0 auto 1.5rem; display: block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                        </div>
                                        <h3>Reserva i Pagament Completats!</h3>
                                        <p>Hem registrat la teva plaça per a <strong>${activity.title}</strong>.</p>
                                        <p>Pagament realitzat correctament via <strong>Bizum</strong>.</p>
                                        <p>ID: <small>${paymentIntent.id}</small></p>
                                        <button class="btn-submit" onclick="window.history.replaceState({}, '', window.location.pathname); document.getElementById('bookingModal').classList.remove('active')">
                                            Tancar
                                        </button>
                                    </div>
                                `;
                            }
                        } else {
                            console.error('Activitat no trobada:', activityId);
                        }
                    }
                }, 500);
            } else {
                throw new Error(`L'estat del pagament és: ${paymentIntent.status}`);
            }
            
        } catch (error) {
            console.error('Error procesant retorn de Bizum:', error);
            const modalBody = document.getElementById('modalBody');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="booking-success">
                        <div class="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; color: var(--error-color); margin: 0 auto 1.5rem; display: block;"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                        </div>
                        <h3>Error en el pagament</h3>
                        <p>${error.message}</p>
                        <button class="btn-submit" onclick="window.history.replaceState({}, '', window.location.pathname); document.getElementById('bookingModal').classList.remove('active')">
                            Tancar
                        </button>
                    </div>
                `;
            }
        }
    }
}

// ============================================
// Authentication System
// ============================================
function initAdminCredentials() {
    const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!stored) {
        // Store default credentials (in production, use proper hashing)
        const credentials = {
            username: DEFAULT_ADMIN.username,
            // Simple encoding (en producción usar bcrypt o similar)
            passwordHash: btoa(DEFAULT_ADMIN.password)
        };
        localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials));
        console.log('Admin credentials initialized');
        console.log('Usuario: admin');
        console.log('Contraseña: WildFitness2024!');
    }
}

function checkAdminAuth() {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
        try {
            const auth = JSON.parse(authData);
            const now = new Date().getTime();
            // Session expires after 24 hours
            if (auth.expiry && auth.expiry > now) {
                isAdminLoggedIn = true;
                console.log('Admin session active');
                return;
            }
        } catch (e) {
            console.error('Error checking auth:', e);
        }
    }
    isAdminLoggedIn = false;
    localStorage.removeItem(AUTH_KEY);
}

function loginAdmin(username, password) {
    const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!stored) {
        return { success: false, message: 'No s\'han trobat credencials d\'administrador' };
    }
    
    try {
        const credentials = JSON.parse(stored);
        const passwordHash = btoa(password);
        
        if (username === credentials.username && passwordHash === credentials.passwordHash) {
            // Create session with 24 hour expiry
            const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
            const authData = {
                username: username,
                expiry: expiry,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
            isAdminLoggedIn = true;
            console.log('Admin login successful');
            return { success: true, message: 'Login correcte' };
        } else {
            console.log('Invalid credentials');
            return { success: false, message: 'Usuari o contrasenya incorrectes' };
        }
    } catch (e) {
        console.error('Login error:', e);
        return { success: false, message: 'Error en el login' };
    }
}

function logoutAdmin() {
    localStorage.removeItem(AUTH_KEY);
    isAdminLoggedIn = false;
    console.log('Admin logged out');
}

function updateUIForAuthState() {
    const adminPanel = document.getElementById('adminPanel');
    const toggleAdminBtn = document.getElementById('toggleAdminBtn');
    
    if (isAdminLoggedIn) {
        // Show admin button
        if (toggleAdminBtn) {
            toggleAdminBtn.style.display = 'flex';
            toggleAdminBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                <span>Admin</span>
            `;
        }
    } else {
        // Show login button
        if (toggleAdminBtn) {
            toggleAdminBtn.style.display = 'flex';
            toggleAdminBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Login Admin</span>
            `;
        }
        // Hide admin panel
        if (adminPanel) {
            adminPanel.style.display = 'none';
        }
    }
    
    // Update delete buttons visibility
    updateDeleteButtonsVisibility();
}

function updateDeleteButtonsVisibility() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.style.display = isAdminLoggedIn ? 'block' : 'none';
    });
}

function showLoginModal() {
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="login-form-container">
            <div class="login-header" style="text-align: center; margin-bottom: 2rem;">
                <div class="login-icon" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary-color);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">Login d'Administrador</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">Introdueix les teves credencials per accedir al panell d'administració</p>
            </div>
            
            <form id="loginForm" class="booking-form">
                <div class="form-group">
                    <label for="adminUsername">
                        <span class="label-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle;"><path d="M19 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </span>
                        <span>Usuari</span>
                        <span class="required">*</span>
                    </label>
                    <input type="text" id="adminUsername" name="username" required placeholder="admin" autocomplete="username">
                </div>
                
                <div class="form-group">
                    <label for="adminPassword">
                        <span class="label-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </span>
                        <span>Contrasenya</span>
                        <span class="required">*</span>
                    </label>
                    <input type="password" id="adminPassword" name="password" required placeholder="••••••••" autocomplete="current-password">
                </div>
                
                <div id="loginError" class="form-error" style="display: none; color: var(--error-color); margin-bottom: 1rem;"></div>
                
                <button type="submit" class="btn-submit">
                    <span class="btn-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span>Iniciar Sessió</span>
                </button>
                
                <div class="login-info" style="margin-top: 1.5rem; padding: 1.25rem; background: var(--bg-light); border-radius: var(--radius-sm); font-size: 0.9rem; border-left: 4px solid var(--secondary-color);">
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; color: var(--secondary-color); flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <strong>Credencials per defecte:</strong>
                    </div>
                    <div style="padding-left: 24px;">
                        <strong>Usuari:</strong> admin<br>
                        <strong>Contrasenya:</strong> WildFitness2024!
                    </div>
                </div>
            </form>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Focus on username field
    setTimeout(() => {
        document.getElementById('adminUsername')?.focus();
    }, 100);
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(e);
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    const result = loginAdmin(username, password);
    
    if (result.success) {
        // Close modal
        document.getElementById('bookingModal').classList.remove('active');
        
        // Update UI
        updateUIForAuthState();
        
        // Show success message
        alert('Login correcte! Ara pots gestionar les activitats.');
        
        // Render activities to show delete buttons
        renderActivities();
    } else {
        // Show error
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = result.message;
            errorDiv.style.display = 'block';
        }
    }
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Admin panel toggle
    const toggleAdminBtn = document.getElementById('toggleAdminBtn');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const adminPanel = document.getElementById('adminPanel');
    
    if (toggleAdminBtn) {
        toggleAdminBtn.addEventListener('click', () => {
            if (!isAdminLoggedIn) {
                // Show login modal
                showLoginModal();
            } else {
                // Toggle admin panel
                const isVisible = adminPanel.style.display !== 'none';
                adminPanel.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    adminPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
    
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
        });
    }
    
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
            document.getElementById('activityForm').reset();
        });
    }
    
    // Activity form submission
    const activityForm = document.getElementById('activityForm');
    if (activityForm) {
        activityForm.addEventListener('submit', handleActivitySubmit);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderActivities();
        });
    });
    
    // Modal close
    const closeModalBtn = document.getElementById('closeModalBtn');
    const bookingModal = document.getElementById('bookingModal');
    
    if (closeModalBtn && bookingModal) {
        closeModalBtn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
        
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.classList.remove('active');
            }
        });
    }
}

// ============================================
// Activity Management
// ============================================
async function loadActivities() {
    try {
        console.log('Cargando actividades desde Supabase...');
        
        // Intentar cargar desde Supabase
        const supabaseActivities = await getActivities();
        
        if (supabaseActivities && supabaseActivities.length > 0) {
            activities = supabaseActivities;
            console.log(`${activities.length} actividades cargadas desde Supabase`);
            renderActivities();
            return;
        }
        
        // Fallback: cargar desde localStorage si Supabase no está configurado
        console.log('Supabase no disponible, usando localStorage como fallback');
        const stored = localStorage.getItem(STORAGE_KEY);
        activities = stored ? JSON.parse(stored) : [];
        console.log('Activities loaded from localStorage:', activities.length);
        renderActivities();
    } catch (error) {
        console.error('Error loading activities:', error);
        activities = [];
        renderActivities();
    }
}

function saveActivities() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        console.log('Activities saved to localStorage');
        
        // Broadcast to other tabs using BroadcastChannel
        try {
            const channel = new BroadcastChannel('wild_fitness_sync');
            channel.postMessage({ type: 'activities_updated', timestamp: Date.now() });
            channel.close();
            console.log('Sync message sent via BroadcastChannel');
        } catch (e) {
            console.warn('BroadcastChannel not available');
        }
        
        // Trigger storage event for same-window synchronization (fallback)
        window.dispatchEvent(new StorageEvent('storage', {
            key: STORAGE_KEY,
            newValue: JSON.stringify(activities),
            url: window.location.href
        }));
        
        // Sincronizar con el servidor (KV Storage) para emails programados
        syncActivitiesToServer();
    } catch (error) {
        console.error('Error saving activities:', error);
    }
}

// Sincronizar actividades con el servidor
async function syncActivitiesToServer() {
    try {
        const apiUrl = '/api/sync-activities';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activities: activities,
                timestamp: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`Activitats sincronitzades amb el servidor: ${result.count}`);
        } else {
            console.warn('No s\'ha pogut sincronitzar amb el servidor:', response.statusText);
        }
    } catch (error) {
        // No mostrar error al usuario, solo log
        console.warn('Sincronització amb servidor no disponible:', error.message);
    }
}

function handleActivitySubmit(e) {
    e.preventDefault();
    
    if (!isAdminLoggedIn) {
        alert('Has d\'estar autenticat per crear activitats');
        return;
    }
    
    const formData = new FormData(e.target);
    const activity = {
        id: Date.now(),
        title: formData.get('title'),
        type: formData.get('type'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        latitude: formData.get('latitude') || '',
        longitude: formData.get('longitude') || '',
        capacity: parseInt(formData.get('capacity')),
        price: parseFloat(formData.get('price')) || 10.00,
        enrolled: 0,
        description: formData.get('description') || '',
        participants: [],
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
    };
    
    activities.push(activity);
    activities.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveActivities();
    renderActivities();
    
    // Reset form and hide admin panel
    e.target.reset();
    document.getElementById('adminPanel').style.display = 'none';
    
    // Show success message
    alert('Activitat creada correctament!');
}

function deleteActivity(id) {
    if (!isAdminLoggedIn) {
        alert('Has d\'estar autenticat per eliminar activitats');
        return;
    }
    
    if (confirm('Segur que vols eliminar aquesta activitat?')) {
        activities = activities.filter(a => a.id !== id);
        saveActivities();
        renderActivities();
    }
}

// ============================================
// Rendering
// ============================================
function renderActivities() {
    const container = document.getElementById('activitiesList');
    if (!container) return;
    
    // Filter activities
    let filtered = activities;
    if (currentFilter !== 'all') {
        filtered = activities.filter(a => a.type === currentFilter);
    }
    
    // Filter only future activities
    const today = new Date().toISOString().split('T')[0];
    filtered = filtered.filter(a => a.date >= today);
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Render
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <h3>No hi ha activitats ${currentFilter !== 'all' ? 'per aquest tipus' : 'programades'}</h3>
                <p>${isAdminLoggedIn ? 'Utilitza el panell d\'administració per crear noves activitats.' : 'De moment no hi ha cap activitat al calendari. Torna aviat per veure les pròximes sortides!'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(activity => createActivityCard(activity)).join('');
    
    // Add event listeners to booking buttons
    container.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('[data-id]').dataset.id);
            openBookingModal(id);
        });
    });
    
    // Add event listeners to delete buttons (only if admin)
    if (isAdminLoggedIn) {
        container.querySelectorAll('.btn-participants').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('[data-id]').dataset.id);
                openParticipantsModal(id);
            });
        });

        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('[data-id]').dataset.id);
                deleteActivity(id);
            });
        });
    }
    
    // Add event listeners to map buttons
    container.querySelectorAll('.btn-map').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('[data-id]').dataset.id);
            const activity = activities.find(a => a.id === id);
            if (activity && activity.latitude && activity.longitude) {
                window.open(`https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`, '_blank');
            }
        });
    });
}

function createActivityCard(activity) {
    const typeInfo = ACTIVITY_TYPES[activity.type];
    const date = new Date(activity.date + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('ca-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const capacityPercent = (activity.enrolled / activity.capacity) * 100;
    let capacityClass = '';
    if (capacityPercent >= 90) capacityClass = 'full';
    else if (capacityPercent >= 70) capacityClass = 'medium';
    
    const isFull = activity.enrolled >= activity.capacity;
    
    return `
        <div class="activity-card" data-id="${activity.id}">
            <div class="activity-header">
                <div class="activity-type-badge">
                    ${typeInfo.icon} ${typeInfo.label}
                </div>
                <h3 class="activity-title">${activity.title}</h3>
            </div>
            
            <div class="activity-body">
                <div class="activity-info">
                    <div class="activity-info-item">
                        <span class="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        </span>
                        <div class="info-content">
                            <span class="info-label">Data</span>
                            <span class="info-value">${formattedDate}</span>
                        </div>
                    </div>
                    
                    <div class="activity-info-item">
                        <span class="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </span>
                        <div class="info-content">
                            <span class="info-label">Hora</span>
                            <span class="info-value">${activity.time}</span>
                        </div>
                    </div>
                    
                    <div class="activity-info-item">
                        <span class="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        </span>
                        <div class="info-content">
                            <span class="info-label">Lloc</span>
                            <span class="info-value">${activity.location}</span>
                        </div>
                    </div>
                    
                    <div class="activity-info-item">
                        <span class="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                        </span>
                        <div class="info-content">
                            <span class="info-label">Preu</span>
                            <span class="info-value">${activity.price ? activity.price.toFixed(2) : '10.00'} €</span>
                        </div>
                    </div>
                </div>
                
                ${activity.description ? `
                    <div class="activity-description">
                        ${activity.description}
                    </div>
                ` : ''}
                
                <div class="capacity-indicator">
                    <div class="capacity-bar">
                        <div class="capacity-fill ${capacityClass}" style="width: ${capacityPercent}%"></div>
                    </div>
                    <span class="capacity-text">${activity.enrolled}/${activity.capacity}</span>
                </div>
            </div>
            
            <div class="activity-footer">
                <button class="btn-book" ${isFull ? 'disabled' : ''}>
                    <span>${isFull ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem; display: inline-block; vertical-align: middle; margin-right: 4px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Complet' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem; display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="20 6 9 17 4 12"/></svg> Reservar plaça'}</span>
                </button>
                ${activity.latitude && activity.longitude ? `
                    <button class="btn-map" title="Veure mapa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                    </button>
                ` : ''}
                ${isAdminLoggedIn ? `
                    <button class="btn-participants" title="Veure participants">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </button>
                    <button class="btn-delete" title="Eliminar activitat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem;"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// ============================================
// Admin: Participants View
// ============================================
function openParticipantsModal(activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    const participants = activity.participants || [];
    
    modalBody.innerHTML = `
        <div class="participants-view">
            <h3>Participants: ${activity.title}</h3>
            <p style="margin-bottom: 1rem;">Total inscrits: <strong>${activity.enrolled}/${activity.capacity}</strong></p>
            
            <div class="participants-container">
                ${participants.length === 0 ? `
                    <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No hi ha cap participant inscrit encara.
                    </div>
                ` : `
                    <table class="participants-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email / Telèfon</th>
                                <th>Estat</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${participants.map(p => `
                                <tr>
                                    <td>
                                        <strong>${p.name}</strong>
                                        ${p.notes ? `<div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">${p.notes}</div>` : ''}
                                    </td>
                                    <td>
                                        <div style="font-size: 0.85rem;">${p.email}</div>
                                        <div style="font-size: 0.85rem;">${p.phone}</div>
                                    </td>
                                    <td>
                                        <span class="payment-badge success">PAID</span>
                                        <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 0.25rem;">${p.paymentId ? p.paymentId.substring(0, 12) + '...' : 'N/A'}</div>
                                    </td>
                                    <td style="font-size: 0.8rem; color: #64748b;">
                                        ${new Date(p.bookedAt).toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit' })}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
            </div>
            
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <button class="btn-secondary" onclick="document.getElementById('bookingModal').classList.remove('active')" style="flex: 1;">
                    Tancar
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// ============================================
// Booking System
// ============================================
function openBookingModal(activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    const typeInfo = ACTIVITY_TYPES[activity.type];
    const date = new Date(activity.date + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('ca-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    modalBody.innerHTML = `
        <div class="booking-summary">
            <h3>Resum de l'activitat</h3>
            <div class="booking-summary-item">
                <strong>${typeInfo.icon} ${typeInfo.label}:</strong> ${activity.title}
            </div>
            <div class="booking-summary-item">
                <strong>Data:</strong> ${formattedDate}
            </div>
            <div class="booking-summary-item">
                <strong>Hora:</strong> ${activity.time}
            </div>
            <div class="booking-summary-item">
                <strong>Lloc:</strong> ${activity.location}
            </div>
            <div class="booking-summary-item">
                <strong>Places disponibles:</strong> ${activity.capacity - activity.enrolled}/${activity.capacity}
            </div>
        </div>
        
        <form id="bookingForm" class="booking-form">
            <div class="form-group">
                <label for="participantName">
                    <span class="label-icon">Nom complet</span>
                    <span class="required">*</span>
                </label>
                <input type="text" id="participantName" name="name" required placeholder="El teu nom">
            </div>
            
            <div class="form-group">
                <label for="participantEmail">
                    <span class="label-icon">Email</span>
                    <span class="required">*</span>
                </label>
                <input type="email" id="participantEmail" name="email" required placeholder="el.teu.email@exemple.com">
            </div>
            
            <div class="form-group">
                <label for="participantPhone">
                    <span class="label-icon">Telèfon</span>
                    <span class="required">*</span>
                </label>
                <input type="tel" id="participantPhone" name="phone" required placeholder="+34 600 000 000">
            </div>
            
            <div class="form-group">
                <label for="participantNotes">
                    <span class="label-icon">Comentaris o necessitats especials</span>
                </label>
                <textarea id="participantNotes" name="notes" rows="3" placeholder="Algun comentari que vulguis compartir..."></textarea>
            </div>
            
            <!-- Payment Section -->
            <div class="payment-container">
                <div class="payment-title">
                    <span>Mètode de Pagament</span>
                </div>
                
                <div class="payment-methods">
                    <label class="payment-method-option active" data-method="card">
                        <input type="radio" name="paymentMethod" value="card" checked style="display: none;">
                        <span class="method-label">Targeta</span>
                    </label>
                    <label class="payment-method-option" data-method="bizum">
                        <input type="radio" name="paymentMethod" value="bizum" style="display: none;">
                        <span class="method-label">Bizum</span>
                    </label>
                </div>

                <div class="price-tag">Total: ${activity.price ? activity.price.toFixed(2).replace('.', ',') : '10,00'} €</div>
                
                <div id="card-element-container">
                    <div id="card-element">
                        <!-- Stripe Element will be inserted here -->
                    </div>
                    <div id="card-errors" role="alert"></div>
                </div>

                <div id="bizum-info" style="display: none; padding: 1rem; background: var(--bg-light); border-radius: var(--radius-sm); margin-bottom: 1rem; border-left: 4px solid #00adef;">
                    <p style="margin: 0; font-size: 0.9rem;">Se't redirigirà a la plataforma de <strong>Bizum</strong> per completar el pagament de forma segura.</p>
                </div>
                
                <div class="payment-info">
                    <span>Pagament segur processat per Stripe</span>
                </div>
            </div>
            
            <button type="submit" class="btn-submit" id="submitBooking">
                <span class="btn-icon">✓</span>
                <span class="btn-text">Pagar i Confirmar Reserva</span>
                <div class="btn-loader" style="display: none;">
                    <div class="spinner"></div>
                    <span>Processant...</span>
                </div>
            </button>
        </form>
    `;
    
    modal.classList.add('active');
    
    // Initialize Stripe Card Element
    if (elements) {
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#1e293b',
                    fontFamily: 'Inter, sans-serif',
                    '::placeholder': {
                        color: '#94a3b8',
                    },
                },
                invalid: {
                    color: '#dc2626',
                },
            },
        });
        cardElement.mount('#card-element');
        
        // Handle real-time validation errors
        cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }

    // Handle payment method switching
    const methodOptions = modalBody.querySelectorAll('.payment-method-option');
    const cardContainer = document.getElementById('card-element-container');
    const bizumInfo = document.getElementById('bizum-info');
    const submitBtnText = modalBody.querySelector('.btn-text');

    methodOptions.forEach(option => {
        option.addEventListener('click', () => {
            const method = option.dataset.method;
            
            // Update active state
            methodOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Check radio button
            option.querySelector('input').checked = true;
            
            // Toggle containers
            if (method === 'card') {
                cardContainer.style.display = 'block';
                bizumInfo.style.display = 'none';
                submitBtnText.textContent = 'Pagar i Confirmar Reserva';
            } else {
                cardContainer.style.display = 'none';
                bizumInfo.style.display = 'block';
                submitBtnText.textContent = 'Continuar amb Bizum';
            }
        });
    });
    
    // Handle booking form submission
    const bookingForm = modalBody.querySelector('#bookingForm');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmit(e, activityId);
    });
}

async function handleBookingSubmit(e, activityId) {
    e.preventDefault();
    
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBooking');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const displayError = document.getElementById('card-errors');
    
    const formData = new FormData(form);
    const paymentMethod = formData.get('paymentMethod');
    const participantData = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notes: formData.get('notes') || '',
        bookedAt: new Date().toISOString()
    };
    
    // 1. Mostrar estat de càrrega
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    try {
        // 2. Crear Payment Intent al worker
        const amount = Math.round((activity.price || 10.00) * 100);
        const workerUrl = '/api/create-payment-intent';
        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
                currency: 'eur',
                paymentMethod: paymentMethod, // 'card' o 'bizum'
                activityId: activity.id,
                customerName: participantData.name,
                customerEmail: participantData.email,
                customerPhone: participantData.phone,
                customerNotes: participantData.notes,
                programName: `Reserva Activitat: ${activity.title}`
            }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error creant el Payment Intent');
        }
        
        const { clientSecret } = await response.json();
        console.log('Client Secret rebut');
        
        // 3. Confirmar pagament segons el mètode
        let paymentResult;
        
        if (paymentMethod === 'bizum') {
            // Confirmació Bizum (Redirecció)
            console.log('Iniciant confirmació Bizum amb return_url...');
            // Solo pasamos el success y el ID de actividad, el resto se recupera del PaymentIntent metadata
            const returnUrl = `${window.location.origin}/calendari.html?booking_success=true&activity_id=${activity.id}`;
            console.log('Return URL:', returnUrl);

            const result = await stripe.confirmBizumPayment(clientSecret, {
                payment_method: {
                    billing_details: {
                        name: participantData.name,
                        email: participantData.email,
                    },
                },
                return_url: returnUrl,
            });
            
            if (result.error) {
                console.error('Error confirmant Bizum:', result.error);
                throw new Error(result.error.message);
            }
            
            // Si no hi ha error, Stripe redirigeix a Bizum
            return;
        } else {
            // Confirmació Targeta
            console.log('Confirmant pagament amb targeta...');
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: participantData.name,
                        email: participantData.email,
                        phone: participantData.phone,
                    },
                },
            });
            
            if (result.error) {
                console.error('Error confirmant Targeta:', result.error);
                throw new Error(result.error.message);
            }
            
            if (result.paymentIntent.status !== 'succeeded') {
                console.warn('Estat del pagament no exitós:', result.paymentIntent.status);
                throw new Error('El pagament no s\'ha completat correctament.');
            }
            
            paymentResult = result.paymentIntent;
            console.log('Pagament amb targeta confirmat');
        }
        
        // 4. Pagament correcte, guardar participant
        const participant = {
            ...participantData,
            paymentId: paymentResult.id,
            amount: activity.price || 10.00,
            status: 'paid'
        };
        
        if (!activity.participants) activity.participants = [];
        
        // Evitar duplicats (per si el webhook ja l'ha registrat)
        const alreadyExists = activity.participants.some(p => p.paymentId === paymentResult.id);
        let emailSent = false;
        
        if (!alreadyExists) {
            activity.participants.push(participant);
            activity.enrolled = activity.participants.length;
            
            // Actualitzar a Supabase si la funció existeix
            if (typeof updateActivity === 'function') {
                await updateActivity(activity.id, {
                    participants: activity.participants,
                    enrolled: activity.enrolled
                });
            }
            
            saveActivities();
            renderActivities();
            
            // 5. Enviar email de confirmació
            emailSent = await sendConfirmationEmail(participant, activity);
        } else {
            console.log('Participant ja registrat pel webhook.');
            emailSent = true;
        }
        
        // 6. Mostrar èxit
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="booking-success">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; color: var(--success-color); margin: 0 auto 1.5rem; display: block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3>Reserva i Pagament Completats!</h3>
                <p>Hem registrat la teva plaça per a <strong>${activity.title}</strong>.</p>
                <p>ID de pagament: <small>${paymentResult.id}</small></p>
                <p>${emailSent ? 
                    `Rebràs un email de confirmació a <strong>${participant.email}</strong>` :
                    'La teva reserva està registrada, però no s\'ha pogut enviar l\'email de confirmació.'
                }</p>
                <button class="btn-submit" onclick="document.getElementById('bookingModal').classList.remove('active')">
                    Tancar
                </button>
            </div>
        `;
        
    } catch (error) {
        console.error('Error en el procés de reserva:', error);
        if (displayError) displayError.textContent = error.message;
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

async function sendConfirmationEmail(participant, activity) {
    try {
        const response = await fetch('/api/send-booking-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                booking: participant,
                activity: activity
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error enviant email de confirmació:', error);
        return false;
    }
}

// ============================================
// Notification System
// ============================================
function showNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.innerHTML = `
        <div class="toast-header">
            <strong>${title}</strong>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    // Add styles if not exist
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #2d7d7d;
            }
            .toast-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 15px 10px;
                border-bottom: 1px solid #f1f5f9;
            }
            .toast-header strong {
                color: #1e293b;
                font-size: 14px;
            }
            .toast-close {
                background: transparent;
                border: none;
                font-size: 24px;
                color: #64748b;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                line-height: 1;
            }
            .toast-close:hover {
                color: #1e293b;
            }
            .toast-body {
                padding: 10px 15px 15px;
                color: #64748b;
                font-size: 13px;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

console.log('Calendar JavaScript loaded');
console.log('Sistema d\'autenticació activat');
console.log('Credencials per defecte: admin / WildFitness2024!');
console.log('Sincronització automàtica activada');
