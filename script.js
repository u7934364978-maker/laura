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

    // Hide/show header on scroll (optional)
    if (currentScroll > lastScroll && currentScroll > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// ============================================
// Mobile Navigation Toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navList = mainNav?.querySelector('.nav-list');

if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        const isActive = navList.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

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
            
            // Simulate minimum loading time for better UX
            const minLoadingTime = 800;
            const startTime = Date.now();
            
            // Send to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Ensure minimum loading time
            const elapsed = Date.now() - startTime;
            if (elapsed < minLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
            }
            
            if (response.ok) {
                // Success with celebration effect
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Missatge enviat correctament! Et respondrem en menys de 24h.';
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
            } else {
                throw new Error('Form submission failed');
            }
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
