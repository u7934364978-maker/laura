// ============================================
// WILD FITNESS - ENHANCED UX JAVASCRIPT
// ============================================

// ============================================
// Smooth Animations on Load
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Add scroll indicator to hero
    const hero = document.querySelector('.hero');
    if (hero && !document.querySelector('.scroll-indicator')) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.setAttribute('aria-label', 'Scroll down');
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
        hero.appendChild(scrollIndicator);
    }
});

// ============================================
// Enhanced Header Scroll Effect
// ============================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for styling
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Keep header always visible (sticky)
    // Removed hide/show behavior to maintain sticky header at all times
    
    lastScroll = currentScroll;
});

// ============================================
// Mobile Navigation Toggle - Side Drawer Push Effect
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    const navList = mainNav?.querySelector('.nav-list');
    
    // Create overlay element
    let menuOverlay = document.querySelector('.menu-overlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }

    console.log('Navigation elements:', { navToggle, mainNav, navList, menuOverlay }); // Debug

    function toggleMenu(isActive) {
        navList.classList.toggle('active', isActive);
        menuOverlay.classList.toggle('active', isActive);
        document.body.classList.toggle('menu-active', isActive);
        navToggle.setAttribute('aria-expanded', isActive);
        
        console.log('Menu toggled:', isActive); // Debug
    }

    if (navToggle && navList) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = !navList.classList.contains('active');
            toggleMenu(isActive);
        });

        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', () => {
            toggleMenu(false);
        });

        // Close menu when clicking on a link
        const navLinks = navList.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close menu when clicking outside (on the pushed content)
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && 
                !e.target.classList.contains('menu-overlay') &&
                navList.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    } else {
        console.error('Navigation elements not found!'); // Debug
    }
});

// ============================================
// Enhanced Smooth Scroll
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        
        // Only prevent default and smooth scroll if target exists on current page
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        // If target doesn't exist (e.g., blog.html#article-1 from index.html), let default behavior happen
    });
});

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
    '.schedule-content, .pricing, .gallery-grid, .contact-wrapper, .blog-grid, .feature-item'
);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ============================================
// Enhanced Button Interactions
// ============================================
document.querySelectorAll('.btn-primary, .btn-whatsapp, .contact-button').forEach(btn => {
    // Ripple effect on click
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// WhatsApp button tracking
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('WhatsApp link clicked');
    });
});

// Email button tracking
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Email link clicked');
    });
});

// Gallery lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-item img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ENHANCED CONTACT FORM HANDLING
// ============================================

// Helper function to get level text
function getLevelText(level) {
    const levels = {
        'beginner': '🌱 Principiant - Primera vegada',
        'intermediate': '🚀 Intermedi - Tinc experiència',
        'advanced': '⭐ Avançat - Trail runner'
    };
    return levels[level] || 'No especificat';
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    // Add placeholder animations
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Float label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Real-time validation with visual feedback
    const emailInput = contactForm.querySelector('#email');
    const phoneInput = contactForm.querySelector('#phone');
    const nameInput = contactForm.querySelector('#name');
    const messageInput = contactForm.querySelector('#message');
    
    // Email validation
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && emailRegex.test(this.value)) {
                this.style.borderColor = 'var(--success-color)';
                showValidationIcon(this, true);
            } else if (this.value) {
                this.style.borderColor = 'var(--error-color)';
                showValidationIcon(this, false);
            } else {
                this.style.borderColor = '';
                removeValidationIcon(this);
            }
        });
    }
    
    // Phone validation and formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Allow only numbers, spaces, +, and -
            this.value = this.value.replace(/[^0-9\s\+\-]/g, '');
            
            // Simple validation: at least 9 digits
            const digitsOnly = this.value.replace(/[^\d]/g, '');
            if (digitsOnly.length >= 9) {
                this.style.borderColor = 'var(--success-color)';
                showValidationIcon(this, true);
            } else if (this.value) {
                this.style.borderColor = '';
                removeValidationIcon(this);
            }
        });
    }
    
    // Name validation (at least 2 characters)
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.length >= 2) {
                this.style.borderColor = 'var(--success-color)';
                showValidationIcon(this, true);
            } else if (this.value) {
                this.style.borderColor = '';
                removeValidationIcon(this);
            }
        });
    }
    
    // Message character counter
    if (messageInput) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        messageInput.parentElement.appendChild(charCounter);
        
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            const max = 500; // Optional max length
            charCounter.textContent = `${length} caràcters`;
            
            if (length >= max) {
                charCounter.style.color = 'var(--warning-color)';
            } else {
                charCounter.style.color = 'var(--text-secondary)';
            }
            
            if (length >= 10) {
                this.style.borderColor = 'var(--success-color)';
            }
        });
    }
    
    // Form submission with enhanced UX
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;
        
        // Add loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = '';
        
        // Hide previous status messages
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
        
        // Add subtle shake animation to form
        contactForm.style.animation = 'none';
        setTimeout(() => {
            contactForm.style.animation = '';
        }, 10);
        
        try {
            const formData = new FormData(contactForm);
            
            // Preparar datos para envío
            const emailData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                level: formData.get('level'),
                message: formData.get('message')
            };
            
            // Simulate minimum loading time for better UX
            const minLoadingTime = 1200;
            const startTime = Date.now();
            
            // 📊 GUARDAR EN SUPABASE (deshabilitado temporalmente)
            // Si quieres guardar contactos en Supabase, crea la tabla 'contact_submissions'
            // if (typeof saveContactSubmission === 'function') {
            //     try {
            //         await saveContactSubmission(emailData);
            //         console.log('✅ Contacto guardado en Supabase');
            //     } catch (supabaseError) {
            //         console.warn('⚠️ Error guardando en Supabase:', supabaseError);
            //         // Continuar aunque falle Supabase
            //     }
            // }
            
            // Preparar datos para email con texto legible del nivel
            const emailDataWithLevel = {
                ...emailData,
                level: getLevelText(emailData.level)
            };
            
            // Enviar a Cloudflare Worker para email automático
            const emailResponse = await fetch('/api/send-welcome-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailDataWithLevel)
            }).catch(err => {
                console.warn('Email service unavailable:', err);
                return { ok: false };
            });
            
            // Ensure minimum loading time
            const elapsed = Date.now() - startTime;
            if (elapsed < minLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
            }
            
            // Mostrar siempre éxito
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `
                <strong>✅ Missatge enviat correctament!</strong><br>
                ${emailResponse.ok ? 'Rebràs un email de confirmació a ' + emailData.email : 'Et respondrem en menys de 24h'}
            `;
            formStatus.style.display = 'block';
                
            // Confetti effect (optional)
            createConfetti();
            
            // Reset form
            contactForm.reset();
            
            // Remove validation icons
            inputs.forEach(input => {
                input.style.borderColor = '';
                removeValidationIcon(input);
            });
            
            // Track conversion (if using analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form',
                    'value': 1
                });
            }
            
            // Smooth scroll to success message
            setTimeout(() => {
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
            
            console.log('✓ Contact form submitted successfully');
            
        } catch (error) {
            // Error with helpful message
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Error enviant el missatge. Prova-ho de nou o contacta per WhatsApp.';
            formStatus.style.display = 'block';
            
            // Shake animation on error
            formStatus.style.animation = 'shake 0.5s';
            
            console.error('✗ Form submission error:', error);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Helper function to show validation icon
function showValidationIcon(input, isValid) {
    removeValidationIcon(input);
    
    const icon = document.createElement('span');
    icon.className = 'validation-icon';
    icon.textContent = isValid ? '✓' : '✗';
    icon.style.cssText = `
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: ${isValid ? 'var(--success-color)' : 'var(--error-color)'};
        font-weight: bold;
        font-size: 1.2rem;
        pointer-events: none;
    `;
    
    const parent = input.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(icon);
}

// Helper function to remove validation icon
function removeValidationIcon(input) {
    const existingIcon = input.parentElement.querySelector('.validation-icon');
    if (existingIcon) {
        existingIcon.remove();
    }
}

// Simple confetti effect
function createConfetti() {
    const colors = ['#3fb5b5', '#5fcaca', '#2d7d7d', '#10b981'];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            border-radius: 50%;
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);


// ============================================
// Tracking & Analytics
// ============================================
// WhatsApp button tracking
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('📱 WhatsApp link clicked');
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'WhatsApp Button'
            });
        }
    });
});

// Email button tracking
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('📧 Email link clicked');
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'Email Button'
            });
        }
    });
});

// ============================================
// Image Lazy Loading with Fade In
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-item img, .blog-image img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Keyboard Navigation Enhancement
// ============================================
// Tab trap for modal/menu (if needed)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Improve focus visibility
        const currentElement = document.activeElement;
        if (currentElement) {
            currentElement.style.outline = '2px solid var(--secondary-color)';
            currentElement.style.outlineOffset = '2px';
        }
    }
});

// ============================================
// Image Loading Optimization and Error Handling
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    let failedImages = 0;
    
    // Fallback images for each category
    const fallbackImages = {
        hero: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"%3E%3Crect fill="%23e0e0e0" width="1920" height="1080"/%3E%3Ctext fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="48" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ETrail Running%3C/text%3E%3C/svg%3E',
        gallery: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="800"%3E%3Crect fill="%23f5f5f5" width="800" height="800"/%3E%3Ctext fill="rgba(0,0,0,0.3)" font-family="sans-serif" font-size="32" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3E%F0%9F%8F%94%EF%B8%8F%3C/text%3E%3C/svg%3E',
        blog: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23eeeeee" width="600" height="400"/%3E%3Ctext fill="rgba(0,0,0,0.3)" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3E%F0%9F%93%B8%3C/text%3E%3C/svg%3E'
    };
    
    images.forEach((img, index) => {
        // Skip if already processed
        if (img.dataset.processed) return;
        img.dataset.processed = 'true';
        
        // Add loading state
        img.classList.add('image-loading');
        
        // Determine image category
        let category = 'gallery';
        if (img.closest('.hero-image')) category = 'hero';
        else if (img.closest('.blog-image')) category = 'blog';
        
        // Handle successful load
        const handleLoad = () => {
            img.classList.remove('image-loading');
            img.classList.add('image-loaded');
            loadedImages++;
            console.log(`✓ Image ${loadedImages} loaded: ${img.alt || 'unnamed'}`);
        };
        
        // Handle loading errors with retry mechanism
        const handleError = () => {
            failedImages++;
            console.warn(`✗ Failed to load image (attempt ${img.dataset.retries || 0}): ${img.src}`);
            
            const retries = parseInt(img.dataset.retries || '0');
            
            if (retries === 0) {
                // First retry: try without srcset
                img.dataset.retries = '1';
                img.removeAttribute('srcset');
                const newSrc = img.src.replace('&fm=jpg&fit=crop', '').replace('?w=', '?auto=format&w=');
                console.log(`🔄 Retry 1: Removing srcset and updating URL`);
                setTimeout(() => {
                    img.src = newSrc;
                }, 500);
            } else if (retries === 1) {
                // Second retry: use data URI fallback
                img.dataset.retries = '2';
                console.log(`🔄 Retry 2: Using fallback placeholder`);
                setTimeout(() => {
                    img.src = fallbackImages[category];
                    img.classList.remove('image-loading');
                    img.classList.add('image-loaded', 'image-fallback');
                }, 500);
            } else {
                // Final fallback
                img.classList.remove('image-loading');
                img.classList.add('image-error');
                console.error(`❌ All retries failed for: ${img.alt || 'unnamed'}`);
            }
        };
        
        // Attach event listeners
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);
        
        // If image is already cached and loaded
        if (img.complete) {
            if (img.naturalHeight !== 0) {
                handleLoad();
            } else {
                handleError();
            }
        }
    });
    
    // Log summary after 5 seconds
    setTimeout(() => {
        const total = images.length;
        const pending = total - loadedImages - failedImages;
        console.log(`📊 Image Loading Summary: ${loadedImages} loaded, ${failedImages} failed, ${pending} pending, ${total} total`);
        
        if (failedImages > 0) {
            console.warn(`⚠️ Some images failed to load. This might be due to network issues or CORS restrictions.`);
        }
    }, 5000);
});

// ============================================
// Performance Monitoring
// ============================================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log(`⚡ LCP: ${entry.renderTime || entry.loadTime}ms`);
            }
        }
    });
    
    try {
        perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        // Browser doesn't support LCP
    }
}

// ============================================
// Console Welcome Message
// ============================================
console.log('%c🏔️ Wild Fitness', 'font-size: 24px; font-weight: bold; color: #2d7d7d; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);');
console.log('%cEntrenament Funcional Trail - Fonteta', 'font-size: 14px; color: #3fb5b5; font-weight: 600;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #b8e0e0;');
console.log('%c✓ Enhanced UX & Animations loaded', 'color: #10b981; font-weight: bold;');
console.log('%c✓ Form validation active', 'color: #10b981; font-weight: bold;');
console.log('%c✓ Smooth scroll enabled', 'color: #10b981; font-weight: bold;');
console.log('%c✓ Responsive interactions ready', 'color: #10b981; font-weight: bold;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #b8e0e0;');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 Wild Fitness website loaded successfully!', 'color: #2d7d7d; font-size: 12px; font-weight: bold;');
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ============================================
// Service Worker Registration (Optional PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA features
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('✓ Service Worker registered'))
        //     .catch(err => console.log('✗ SW registration failed'));
    });
}
