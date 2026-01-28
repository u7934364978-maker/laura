// Checkout.js - Payment Processing with Stripe

// ============================================
// ✅ CONFIGURACIÓN DE STRIPE - LIVE MODE
// ============================================
// 
// Cuenta Stripe: ACTIVADA ✅
// Modo: LIVE (Pagos Reales)
// Última actualización: 2026-01-28
//
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SrimkKOKBlj0PU4E0Hwmgo6GmX9BwUVlskqk3CoTKj2jlJx32V8Bs1oMhSv4RdSXfMzxSHphXgtQ6rGYZdKqjlw00L6KLhGIf';

if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === 'PONER_TU_PK_TEST_AQUI') {
    console.error('❌ ERROR: Stripe Publishable Key no configurada');
    console.error('📝 Contacta al administrador del sitio');
    alert('⚠️ Error de configuración de pagos. Por favor, contacta con el administrador.');
}

const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
const elements = stripe.elements();

// Configurar el elemento de tarjeta de Stripe
const cardElement = elements.create('card', {
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

// Manejar errores de validación de tarjeta
cardElement.on('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
        displayError.classList.add('show');
    } else {
        displayError.textContent = '';
        displayError.classList.remove('show');
    }
});

// Programas disponibles
const programs = {
    'grup-fonteta': {
        name: 'Grup Fonteta',
        description: 'Entrenament en grup - Dilluns i dimecres 17:15-18:15h',
        price: 35,
        period: '/mes',
        sessions: 2
    },
    'trail-runners-mensual': {
        name: 'Trail Runners - Mensual',
        description: 'Seguiment personalitzat online amb entrenaments progressius',
        price: 55,
        period: '/mes',
        sessions: 0
    },
    'trail-runners-trimestral': {
        name: 'Trail Runners - Trimestral',
        description: 'Seguiment personalitzat online - Pack trimestral (estalvia 15€)',
        price: 150,
        period: '/trimestre',
        sessions: 0
    },
    'pla-basic': {
        name: 'Pla Bàsic',
        description: 'Entrevista inicial + avaluació + pla mensual personalitzat',
        price: 70,
        period: '/mes',
        sessions: 0
    },
    'sessio-presencial': {
        name: 'Sessió Presencial',
        description: 'Sortida trail running o entrenament de força personalitzat',
        price: 45,
        period: '/sessió',
        sessions: 1
    },
    'acompanyament-online': {
        name: 'Acompanyament Online',
        description: 'Entrenament de força en directe per videocall',
        price: 25,
        period: '/hora',
        sessions: 1
    },
    'prova-gratuita': {
        name: 'Prova Gratuïta',
        description: 'Primera sessió d\'avaluació gratuïta',
        price: 0,
        period: '',
        sessions: 1
    }
};

// Variables globales
let currentPaymentMethod = 'card';
let selectedProgram = null;

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedProgram();
    setupPaymentMethods();
    setupForm();
});

// Cargar programa seleccionado desde URL
function loadSelectedProgram() {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = urlParams.get('program') || 'pla-basic';
    
    selectedProgram = programs[programId];
    
    if (!selectedProgram) {
        console.error('❌ Error: Programa no encontrado:', programId);
        console.error('❌ Programas disponibles:', Object.keys(programs).join(', '));
        
        // Deshabilitar el formulario
        const submitBtn = document.getElementById('submit-payment');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Programa no vàlid';
        }
        
        // Mostrar error
        showErrorModal('Programa no vàlid. Si us plau, torna a la pàgina principal i selecciona un programa.');
        return;
    }
    
    displayProgramInfo(selectedProgram);
    calculateTotal(selectedProgram.price);
}

// Mostrar información del programa
function displayProgramInfo(program) {
    document.getElementById('programName').textContent = program.name;
    document.getElementById('programDescription').textContent = program.description;
    document.getElementById('programPrice').textContent = `€${program.price}`;
    document.getElementById('programPeriod').textContent = program.period;
}

// Calcular totales (precios con IVA incluido)
function calculateTotal(price) {
    const total = price; // El precio ya incluye IVA
    
    document.getElementById('total').textContent = `€${total.toFixed(2)}`;
}

// Configurar métodos de pago
function setupPaymentMethods() {
    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    
    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos
            paymentMethodBtns.forEach(b => b.classList.remove('active'));
            
            // Añadir clase active al seleccionado
            btn.classList.add('active');
            
            // Cambiar método de pago
            currentPaymentMethod = btn.dataset.method;
            togglePaymentElements(currentPaymentMethod);
        });
    });
}

// Alternar elementos de pago
function togglePaymentElements(method) {
    const cardPayment = document.getElementById('card-payment');
    const bizumPayment = document.getElementById('bizum-payment');
    
    if (method === 'card') {
        cardPayment.style.display = 'block';
        bizumPayment.style.display = 'none';
    } else if (method === 'bizum') {
        cardPayment.style.display = 'none';
        bizumPayment.style.display = 'block';
    }
}

// Configurar formulario
function setupForm() {
    const form = document.getElementById('payment-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar que hay un programa seleccionado
        if (!selectedProgram) {
            showErrorModal('No s\'ha seleccionat cap programa. Si us plau, torna a la pàgina principal.');
            return;
        }
        
        // Validar términos y condiciones
        const acceptTerms = document.getElementById('acceptTerms').checked;
        if (!acceptTerms) {
            showErrorModal('Si us plau, accepta els termes i condicions per continuar.');
            return;
        }
        
        // Validar datos del cliente
        const customerName = document.getElementById('customerName').value.trim();
        const customerEmail = document.getElementById('customerEmail').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        
        if (!customerName || !customerEmail || !customerPhone) {
            showErrorModal('Si us plau, omple tots els camps obligatoris.');
            return;
        }
        
        // Mostrar loader
        setLoading(true);
        
        try {
            if (currentPaymentMethod === 'card') {
                await processCardPayment(customerName, customerEmail, customerPhone);
            } else if (currentPaymentMethod === 'bizum') {
                await processBizumPayment(customerName, customerEmail, customerPhone);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorModal(error.message || 'Hi ha hagut un error processant el pagament.');
            setLoading(false);
        }
    });
}

// Procesar pago con tarjeta
async function processCardPayment(name, email, phone) {
    try {
        if (!selectedProgram) {
            throw new Error('No s\'ha seleccionat cap programa');
        }
        
        // 1. Crear Payment Intent en el servidor
        const paymentIntent = await createPaymentIntent({
            amount: calculateTotalAmount(),
            currency: 'eur',
            paymentMethod: 'card',
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            programName: selectedProgram.name
        });
        
        // 2. Confirmar el pago con Stripe
        const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
            paymentIntent.clientSecret,
            {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: name,
                        email: email,
                        phone: phone,
                    },
                },
            }
        );
        
        if (error) {
            throw new Error(error.message);
        }
        
        if (confirmedPayment.status === 'succeeded') {
            showSuccessModal(confirmedPayment.id);
        }
        
    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
}

// Procesar pago con Bizum
async function processBizumPayment(name, email, phone) {
    const bizumPhone = document.getElementById('bizum-phone').value.trim();
    
    if (!bizumPhone) {
        throw new Error('Si us plau, introdueix el teu número de telèfon Bizum.');
    }
    
    if (!selectedProgram) {
        throw new Error('No s\'ha seleccionat cap programa');
    }
    
    try {
        // Bizum en Stripe se maneja mediante payment_method_types: ['card', 'bizum']
        // Nota: Bizum requiere configuración adicional con tu banco en España
        
        const paymentIntent = await createPaymentIntent({
            amount: calculateTotalAmount(),
            currency: 'eur',
            paymentMethod: 'bizum',
            customerName: name,
            customerEmail: email,
            customerPhone: bizumPhone,
            programName: selectedProgram.name
        });
        
        // Para Bizum, necesitarías redirigir al usuario a la página de autenticación
        // Esto es un ejemplo simplificado
        alert('Funcionalitat Bizum: Rebràs una notificació al teu telèfon per confirmar el pagament.\n\n' +
              'Nota: Per activar Bizum amb Stripe, contacta amb el teu banc i configura la integració.');
        
        // Simulación para demo (eliminar en producción)
        setTimeout(() => {
            showSuccessModal('bizum_demo_' + Date.now());
        }, 2000);
        
    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
}

// Crear Payment Intent en el servidor
async function createPaymentIntent(data) {
    // IMPORTANTE: En producción, esto debería llamar a tu Cloudflare Worker
    // Por ahora usamos Stripe directamente desde el cliente (solo para testing)
    
    // ⚠️ NOTA: Esta NO es la forma recomendada en producción
    // En producción deberías usar el worker: payment-worker.js
    
    try {
        // Llamar al Cloudflare Worker para crear el Payment Intent
        // El worker maneja la clave secreta de forma segura
        const workerUrl = '/api/create-payment-intent';
        
        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Response Status:', response.status);
            console.error('❌ Response Body:', errorText);
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                throw new Error(`Server error (${response.status}): ${errorText}`);
            }
            
            const errorMessage = errorData.error?.message || errorData.error || errorData.message || 'Error creant el Payment Intent';
            throw new Error(errorMessage);
        }
        
        const paymentIntent = await response.json();
        
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
        
    } catch (error) {
        console.error('❌ Error creant Payment Intent:', error);
        console.error('❌ Error details:', error.message);
        throw error;
    }
}

// Calcular monto total en centavos (precio con IVA incluido)
function calculateTotalAmount() {
    if (!selectedProgram) {
        console.error('❌ Error: No hay programa seleccionado');
        throw new Error('No s\'ha seleccionat cap programa');
    }
    const total = selectedProgram.price; // El precio ya incluye IVA
    return Math.round(total * 100); // Convertir a centavos
}

// Mostrar/ocultar loader
function setLoading(isLoading) {
    const btn = document.getElementById('submit-payment');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    
    if (isLoading) {
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
    } else {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Mostrar modal de éxito
function showSuccessModal(paymentId) {
    document.getElementById('payment-id').textContent = paymentId;
    document.getElementById('success-modal').style.display = 'flex';
}

// Mostrar modal de error
function showErrorModal(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').style.display = 'flex';
}

// Cerrar modal de error
function closeErrorModal() {
    document.getElementById('error-modal').style.display = 'none';
}

// Cerrar modales al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
