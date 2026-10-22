'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // =======================================================================
    // 1. DARK MODE TOGGLE (Com persistência e ícone dinâmico)
    // =======================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('medmais_theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('medmais_theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('medmais_theme', 'dark');
            }
        });
    }

    // =======================================================================
    // 2. HEADER SCROLL EFFECT
    // =======================================================================
    const header = document.getElementById('main-header');
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
            scrollTopBtn?.classList.add('visible');
        } else {
            header?.classList.remove('scrolled');
            scrollTopBtn?.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =======================================================================
    // 3. MOBILE MENU (Com bloqueio de scroll no body)
    // =======================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMenu(show) {
        if (!mobileMenu) return;
        if (show) {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            mobileMenuBtn?.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        }
    }

    mobileMenuBtn?.addEventListener('click', () => toggleMenu(true));
    closeMenuBtn?.addEventListener('click', () => toggleMenu(false));
    
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // =======================================================================
    // 4. INTERSECTION OBSERVER (Animações de Scroll performáticas)
    // =======================================================================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // =======================================================================
    // 5. FAQ ACCORDION (Animação suave com grid-template-rows)
    // =======================================================================
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');
            const answer = button.nextElementSibling;
            
            // Fecha todos os outros
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Abre o clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // =======================================================================
    // 6. UTM TRACKING & WHATSAPP INJECTION (Robusto)
    // =======================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
        source: urlParams.get('utm_source'),
        medium: urlParams.get('utm_medium'),
        campaign: urlParams.get('utm_campaign')
    };

    if (utmData.source) {
        localStorage.setItem('medmais_utm', JSON.stringify(utmData));
    }

    function updateWhatsAppLinks() {
        const savedUtm = JSON.parse(localStorage.getItem('medmais_utm'));
        if (!savedUtm) return;

        const utmText = `\n\n*(Origem: ${savedUtm.source || 'site'}${savedUtm.campaign ? ' / ' + savedUtm.campaign : ''})*`;
        const waLinks = document.querySelectorAll('a[href*="wa.me"]');
        
        waLinks.forEach(link => {
            try {
                const url = new URL(link.href);
                let text = url.searchParams.get('text') || '';
                
                if (!text.includes('(Origem:')) {
                    text += utmText;
                    url.searchParams.set('text', text);
                    link.href = url.toString();
                }
            } catch (e) {
                console.warn('URL de WhatsApp inválida', link.href);
            }
        });
    }
    updateWhatsAppLinks();

    // =======================================================================
    // 7. FORMULÁRIO INTELIGENTE (Com Honeypot e Fallback)
    // =======================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Recupera rascunho
        const savedDraft = localStorage.getItem('medmais_form_draft');
        if (savedDraft) {
            const data = JSON.parse(savedDraft);
            document.getElementById('name').value = data.name || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('message').value = data.message || '';
        }

        // Salva rascunho ao digitar (debounce simples)
        let timeout;
        ['name', 'email', 'phone', 'message'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const draft = {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        message: document.getElementById('message').value
                    };
                    localStorage.setItem('medmais_form_draft', JSON.stringify(draft));
                }, 300);
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 1. Verifica Honeypot (Anti-spam)
            const honeypot = contactForm.querySelector('.honeypot').value;
            if (honeypot) {
                console.warn('Spam detectado via honeypot');
                return; // Silenciosamente ignora
            }

            // 2. Validação básica
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            const consent = document.getElementById('lgpd-consent').checked;

            if (!name || !phone || !message || !consent) {
                alert('Por favor, preencha todos os campos obrigatórios e aceite a política de privacidade.');
                return;
            }
            
            // 3. Limpa rascunho e dispara evento
            localStorage.removeItem('medmais_form_draft');
            trackEvent('form_submit', 'contact_section');
            
            // 4. Gera link WhatsApp formatado
            const waMessage = `Olá! Meu nome é *${name}*.\n\n${message}\n\nMeu telefone: ${phone}`;
            const waUrl = `https://wa.me/5511939592955?text=${encodeURIComponent(waMessage)}`;
            
            // 5. Feedback visual e redirecionamento
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Redirecionando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                window.open(waUrl, '_blank');
                alert('Obrigado! Redirecionando você para o WhatsApp para finalizar o atendimento.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 800);
        });
    }

    // =======================================================================
    // 8. BANNER DE COOKIES LGPD (Com Consent Mode V2)
    // =======================================================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    if (!localStorage.getItem('medmais_cookie_consent')) {
        setTimeout(() => {
            cookieBanner?.classList.add('show');
        }, 2000);
    }

    function updateConsent(granted) {
        const status = granted ? 'granted' : 'denied';
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': status,
                'analytics_storage': status,
                'ad_user_data': status,
                'ad_personalization': status
            });
        }
        console.log(`Consentimento atualizado: ${status}`);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('medmais_cookie_consent', 'accepted');
            cookieBanner?.classList.remove('show');
            updateConsent(true);
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('medmais_cookie_consent', 'rejected');
            cookieBanner?.classList.remove('show');
            updateConsent(false);
        });
    }
});

// =======================================================================
// 9. FUNÇÃO DE RASTREAMENTO GLOBAL
// =======================================================================
function trackEvent(eventName, category) {
    const consent = localStorage.getItem('medmais_cookie_consent');
    
    // Permite eventos de conversão essenciais mesmo com cookie rejeitado (para o dono do site saber),
    // mas respeita o denied do Consent Mode para o Google.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': category,
            'transport_type': 'beacon'
        });
    }
    if (typeof fbq !== 'undefined' && consent === 'accepted') {
        fbq('trackCustom', eventName, { category: category });
    }
}