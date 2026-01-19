// ============================================
// WILD FITNESS - JavaScript
// Entrenamiento de Montaña Profesional
// ============================================

// ============================================
// Mobile Navigation Toggle
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ============================================
// Header Scroll Effect
// ============================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Contact Form Handling
// ============================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    // Simulate form submission (replace with actual API call)
    try {
        // In production, replace this with your actual form submission endpoint
        // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
        
        await simulateFormSubmission(data);

        // Show success message
        showMessage('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
        
        // Reset form
        contactForm.reset();

    } catch (error) {
        // Show error message
        showMessage('Error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
        console.error('Form submission error:', error);
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
});

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Form data:', data);
        setTimeout(resolve, 1500);
    });
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    // Insert after form
    contactForm.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ============================================
// Animate Elements on Scroll
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
    '.feature-card, .program-card, .testimonial-card, .about-content, .contact-content'
);

animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// Program Card Hover Effects
// ============================================
const programCards = document.querySelectorAll('.program-card');

programCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        programCards.forEach(otherCard => {
            if (otherCard !== card && !otherCard.classList.contains('featured')) {
                otherCard.style.opacity = '0.7';
            }
        });
    });

    card.addEventListener('mouseleave', () => {
        programCards.forEach(otherCard => {
            otherCard.style.opacity = '1';
        });
    });
});

// ============================================
// Dynamic Year in Footer
// ============================================
const updateFooterYear = () => {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} Wild Fitness. Todos los derechos reservados.`;
    }
};

updateFooterYear();

// ============================================
// Testimonial Slider (Optional Enhancement)
// ============================================
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    // Add subtle pulse effect to testimonials
    testimonialCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.5s ease';
        }, index * 200);
    });
}

// Run testimonial animation when section is visible
const testimonialsSection = document.querySelector('.testimonials');
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            rotateTestimonials();
            testimonialObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (testimonialsSection) {
    testimonialObserver.observe(testimonialsSection);
}

// ============================================
// Stats Counter Animation
// ============================================
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + '+';
            }
        };

        updateCounter();
    });
}

// Trigger stats animation when about section is visible
const aboutSection = document.querySelector('.about');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// ============================================
// Email and WhatsApp Click Tracking (Analytics)
// ============================================
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Email link clicked:', link.href);
        // Add analytics tracking here
        // Example: gtag('event', 'email_click', { email: link.href });
    });
});

document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('WhatsApp link clicked:', link.href);
        // Add analytics tracking here
        // Example: gtag('event', 'whatsapp_click', { phone: link.href });
    });
});

// ============================================
// Prevent Form Resubmission on Refresh
// ============================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ============================================
// Loading Screen (Optional)
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// Console Welcome Message
// ============================================
console.log('%c🏔️ Wild Fitness', 'font-size: 24px; font-weight: bold; color: #2D5016;');
console.log('%cEntrenamiento de Montaña Profesional', 'font-size: 14px; color: #757575;');
console.log('%c¿Interesado en colaborar? Contáctanos en info@wild-fitness.com', 'font-size: 12px; color: #D84315;');

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Wild Fitness website initialized successfully! 🏔️');
    
    // Add any initialization code here
    // Example: Load external data, setup third-party integrations, etc.
});

// ============================================
// Service Worker Registration (PWA - Optional)
// ============================================
// Uncomment if you want to make this a Progressive Web App
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}
*/

// ============================================
// Performance Monitoring (Optional)
// ============================================
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            // Log performance metrics
            console.log('Performance metric:', entry.name, entry.duration);
        }
    });
    
    observer.observe({ entryTypes: ['navigation', 'resource'] });
}
