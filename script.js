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
const scrollProgress = document.getElementById('scrollProgress');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            // Header sticky effect
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Scroll progress bar
            if (scrollProgress) {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (currentScroll / windowHeight) * 100;
                scrollProgress.style.width = scrolled + '%';
            }

            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
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


    function toggleMenu(isActive) {
        navList.classList.toggle('active', isActive);
        menuOverlay.classList.toggle('active', isActive);
        document.body.classList.toggle('menu-active', isActive);
        navToggle.setAttribute('aria-expanded', isActive);
        
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
    rootMargin: '0px 0px -50px 0px' // Reduït de -100px per a millor UX en mòbil
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
    '.schedule-content, .pricing, .gallery-grid, .contact-wrapper, .blog-grid, .feature-item, .about-content, .experience-section'
);

animateElements.forEach(el => {
    // Si l'element ja és visible (per exemple, per sobre del fold)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    }
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
    
    // Image Observer for fade-in effect
    const imageFadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.complete && img.naturalHeight !== 0) {
                    img.classList.add('image-loaded');
                }
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.01 });

    images.forEach((img) => {
        // Skip if already processed
        if (img.dataset.processed) return;
        img.dataset.processed = 'true';
        
        // Add loading state if not already loaded
        if (!img.complete || img.naturalHeight === 0) {
            img.classList.add('image-loading');
        } else {
            img.classList.add('image-loaded');
        }
        
        // Observe for fade-in
        imageFadeObserver.observe(img);
        
        // Determine image category
        let category = 'gallery';
        if (img.closest('.hero-image')) category = 'hero';
        else if (img.closest('.blog-image')) category = 'blog';
        
        // Handle successful load
        const handleLoad = () => {
            img.classList.remove('image-loading');
            img.classList.add('image-loaded');
            loadedImages++;
        };
        
        // Handle loading errors with retry mechanism
        const handleError = () => {
            failedImages++;
            const retries = parseInt(img.dataset.retries || '0');
            
            if (retries === 0) {
                img.dataset.retries = '1';
                // Solo reintentar si es una URL externa o tiene parámetros que podamos limpiar
                if (img.src.includes('unsplash.com') || img.src.includes('?')) {
                    const newSrc = img.src.split('?')[0] + '?auto=format&w=800';
                    setTimeout(() => { img.src = newSrc; }, 500);
                } else {
                    // Si es local y falla, ir directo al fallback
                    handleError(); 
                }
            } else if (retries === 1) {
                img.dataset.retries = '2';
                setTimeout(() => {
                    img.src = fallbackImages[category];
                    img.classList.remove('image-loading');
                    img.classList.add('image-loaded', 'image-fallback');
                }, 500);
            } else {
                img.classList.remove('image-loading');
                img.classList.add('image-error');
            }
        };
        
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);
        
        // If image is already cached and loaded
        if (img.complete && img.naturalHeight !== 0) {
            handleLoad();
        }
    });

    // Log summary after 5 seconds (only if there are errors)
    setTimeout(() => {
        if (failedImages > 0) {
            const total = images.length;
            const pending = total - loadedImages - failedImages;
            console.warn(`⚠️ Image Loading: ${failedImages} failed, ${loadedImages} loaded, ${pending} pending of ${total} total.`);
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

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const statusDiv = document.getElementById('formStatus');
            const originalBtnText = submitBtn.querySelector('.btn-text')?.textContent || 'Enviar';
            
            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                contactForm.classList.add('loading');
                if (submitBtn.querySelector('.btn-text')) {
                    submitBtn.querySelector('.btn-text').textContent = 'Enviant...';
                }
            }
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                location: formData.get('location'),
                level: formData.get('level'),
                message: formData.get('message')
            };
            
            try {
                // 1. Guardar en Supabase vía API (bypasea RLS)
                const saveResponse = await fetch('/api/save-contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const saveResult = await saveResponse.json();
                
                if (!saveResult.success) {
                    console.error('❌ Error al guardar contacto:', saveResult);
                    throw new Error(saveResult.error || 'Error guardando el contacto');
                }
                
                console.log('✅ Contacto guardado exitosamente');
                
                // 2. Enviar emails vía Vercel API
                const emailResponse = await fetch('/api/send-welcome-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const emailResult = await emailResponse.json();
                
                if (emailResult.success) {
                    // Success state
                    statusDiv.textContent = '✅ Missatge enviat correctament! Et contactaré aviat.';
                    statusDiv.className = 'form-status success show';
                    contactForm.reset();
                } else {
                    console.error('❌ Error enviando email:', emailResult.details || emailResult.error);
                    // Aunque el email falle, el contacto se guardó, así que mostramos éxito parcial
                    statusDiv.textContent = '✅ Missatge rebut! (Email pendent de configuració)';
                    statusDiv.className = 'form-status success show';
                    contactForm.reset();
                }
            } catch (error) {
                console.error('Error:', error);
                statusDiv.textContent = '❌ Hi ha hagut un error. Si us plau, intenta-ho de nou o escriu-me per WhatsApp.';
                statusDiv.className = 'form-status error show';
            } finally {
                // Reset loading state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    contactForm.classList.remove('loading');
                    if (submitBtn.querySelector('.btn-text')) {
                        submitBtn.querySelector('.btn-text').textContent = originalBtnText;
                    }
                }
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    statusDiv.classList.remove('show');
                }, 5000);
            }
        });
    }
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
