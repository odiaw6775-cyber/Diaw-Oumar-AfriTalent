/**
 * ================================================================
 * AfriTalent - main.js
 * Projet : Plateforme de freelances tech en Afrique
 * Auteur : Robert DIASSÉ
 * Description : 7 fonctionnalités JavaScript obligatoires
 * ================================================================
 * 1. Dark Mode avec localStorage
 * 2. Navbar dynamique au scroll
 * 3. Bouton Retour en haut
 * 4. Compteurs animés au scroll (IntersectionObserver)
 * 5. Fade-in des sections (IntersectionObserver)
 * 6. Filtrage dynamique des freelances
 * 7. Validation du formulaire de contact
 * ================================================================
 */

// ================================================================
// UTILITY : Throttle pour optimiser les performances
// ================================================================
const throttle = (fn, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            fn(...args);
            lastCall = now;
        }
    };
};

// ================================================================
// FONCTION 1 : DARK MODE (COMMIT 6)
// ================================================================
const initDarkMode = () => {
    // Création du bouton de toggle
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn-outline-secondary btn-sm ms-2 theme-toggle';
    themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
    themeToggle.setAttribute('aria-label', 'Changer de thème');

    // Insérer le bouton dans la navbar
    const navbarNav = document.querySelector('#navbarContent .navbar-nav');
    if (navbarNav) {
        const lastLi = navbarNav.querySelector('li:last-child');
        if (lastLi) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(themeToggle);
            lastLi.insertAdjacentElement('afterend', li);
        }
    }

    // Appliquer le thème
    const applyTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        themeToggle.innerHTML = isDark ? '<i class="bi bi-moon"></i>' : '<i class="bi bi-sun"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Vérifier le thème sauvegardé ou les préférences système
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme === 'dark');
    } else {
        applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Écouteur d'événement au clic
    themeToggle.addEventListener('click', () => {
        applyTheme(!document.body.classList.contains('dark-mode'));
    });
};

// ================================================================
// FONCTION 2 : NAVBAR DYNAMIQUE (COMMIT 6)
// ================================================================
const initNavbarScroll = () => {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const handleScroll = throttle(() => {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
};

// ================================================================
// FONCTION 3 : BOUTON RETOUR EN HAUT (COMMIT 6)
// ================================================================
const initBackToTop = () => {
    // Création du bouton
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(btn);

    // Gestion de l'affichage
    const handleScroll = throttle(() => {
        btn.classList.toggle('show', window.scrollY > 300);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Action au clic : remonte en haut avec animation smooth
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// ================================================================
// FONCTION 4 : COMPTEURS ANIMÉS (COMMIT 7)
// ================================================================
const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const animated = new Set();

    const animateCounter = (counter) => {
        if (animated.has(counter)) return;
        animated.add(counter);

        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target) || target <= 0) return;

        let current = 0;
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing easeOutQuart : ralentit vers la fin
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            current = Math.floor(easeOutQuart * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        requestAnimationFrame(updateCounter);
    };

    // Observer les conteneurs de compteurs
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.counter');
                if (counter) animateCounter(counter);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Cibler les conteneurs .counter-container et .stat-card
    document.querySelectorAll('.counter-container, .stat-card, .stat-card-bento').forEach(container => {
        if (container.querySelector('.counter')) {
            observer.observe(container);
        }
    });
};

// ================================================================
// FONCTION 5 : FADE-IN DES SECTIONS (COMMIT 7)
// ================================================================
const initFadeIn = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.classList.add('fade-in-section');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
};

// ================================================================
// FONCTION 6 : FILTRAGE DYNAMIQUE (COMMIT 8)
// ================================================================
const initFilters = () => {
    const filterSelect = document.getElementById('categoryFilter');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.freelance-card');
    const visibleCount = document.getElementById('visibleCount');

    if (!filterSelect && filterButtons.length === 0) return;
    if (cards.length === 0) return;

    const filterCards = (category) => {
        let count = 0;
        
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const isVisible = category === 'all' || cardCategory === category;
            
            if (isVisible) {
                card.style.display = 'block';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
                count++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => { 
                    card.style.display = 'none'; 
                }, 300);
            }
        });

        // Mettre à jour le compteur visible
        if (visibleCount) {
            visibleCount.textContent = count;
        }
    };

    // Filtrer via le select
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterCards(e.target.value);
            // Synchroniser les boutons
            filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === e.target.value);
            });
        });
    }

    // Filtrer via les boutons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter');
            
            // Mettre à jour les classes actives
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Synchroniser le select
            if (filterSelect) {
                filterSelect.value = category;
            }
            
            filterCards(category);
        });
    });

    // Initialiser avec "Tous"
    filterCards('all');
};

// ================================================================
// FONCTION 7 : VALIDATION FORMULAIRE (COMMIT 8)
// ================================================================
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const formMessage = document.getElementById('formMessage');

    const showError = (input, message) => {
        input.classList.add('is-invalid');
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }
        feedback.textContent = message;
    };

    const clearError = (input) => {
        input.classList.remove('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }
    };

    const validateField = (input) => {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (input.id) {
            case 'nom':
                if (!value) { isValid = false; errorMessage = 'Le nom est requis'; }
                break;
            case 'prenom':
                if (!value) { isValid = false; errorMessage = 'Le prénom est requis'; }
                break;
            case 'email':
                if (!value) { isValid = false; errorMessage = "L'email est requis"; }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Format email invalide (ex: nom@domaine.com)';
                }
                break;
            case 'sujet':
                if (!value) { isValid = false; errorMessage = 'Veuillez choisir un sujet'; }
                break;
            case 'message':
                if (!value) { isValid = false; errorMessage = 'Le message est requis'; }
                else if (value.length < 20) {
                    isValid = false;
                    errorMessage = 'Le message doit contenir au moins 20 caractères';
                }
                break;
            default:
                break;
        }

        if (!isValid) {
            showError(input, errorMessage);
        } else {
            clearError(input);
        }
        return isValid;
    };

    // Validation en temps réel au blur
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        // Validation à la saisie (si déjà invalide)
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateField(input);
            }
        });
    });

    // Soumission du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fields = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (formMessage) {
            formMessage.classList.remove('d-none', 'alert-success', 'alert-danger');

            if (isValid) {
                formMessage.className = 'alert alert-success';
                formMessage.textContent = '✅ Message envoyé avec succès ! Nous vous répondrons rapidement.';
                form.reset();

                // Réinitialiser les états de validation
                fields.forEach(field => {
                    field.classList.remove('is-invalid', 'is-valid');
                });

                // Masquer le message après 5 secondes
                setTimeout(() => {
                    formMessage.classList.add('d-none');
                }, 5000);
            } else {
                formMessage.className = 'alert alert-danger';
                formMessage.textContent = '❌ Veuillez corriger les erreurs ci-dessous.';
            }
        }
    });
};

// ================================================================
// FONCTION SUPPLÉMENTAIRE : ANNÉE DYNAMIQUE
// ================================================================
const initCopyrightYear = () => {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

// ================================================================
// FONCTION SUPPLÉMENTAIRE : MODAL PROFIL
// ================================================================
const initProfileModal = () => {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    const modalName = document.getElementById('modalName');
    const modalRole = document.getElementById('modalRole');
    const modalCategory = document.getElementById('modalCategory');
    const modalRate = document.getElementById('modalRate');
    const modalBio = document.getElementById('modalBio');

    // Utiliser la délégation d'événements pour les boutons dynamiques
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-profile-btn');
        if (!btn) return;

        // Récupérer les données du bouton
        const name = btn.getAttribute('data-name') || '-';
        const role = btn.getAttribute('data-role') || '-';
        const category = btn.getAttribute('data-category-label') || '-';
        const rate = btn.getAttribute('data-rate') || '-';
        const bio = btn.getAttribute('data-bio') || 'Aucune description disponible.';

        // Mettre à jour la modal
        if (modalName) modalName.textContent = name;
        if (modalRole) modalRole.textContent = role;
        if (modalCategory) modalCategory.textContent = category;
        if (modalRate) modalRate.textContent = rate;
        if (modalBio) modalBio.textContent = bio;
    });
};

// ================================================================
// INITIALISATION
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // COMMIT 6 - Fonctionnalités 1, 2, 3
    initDarkMode();
    initNavbarScroll();
    initBackToTop();

    // COMMIT 7 - Fonctionnalités 4, 5
    initCounters();
    initFadeIn();

    // COMMIT 8 - Fonctionnalités 6, 7
    initFilters();
    initContactForm();

    // Fonctionnalités supplémentaires
    initCopyrightYear();
    initProfileModal();

    console.log('🚀 AfriTalent - Toutes les fonctionnalités sont initialisées !');
    console.log('📋 7 fonctionnalités obligatoires :');
    console.log('  1. ✅ Dark Mode avec localStorage');
    console.log('  2. ✅ Navbar dynamique au scroll');
    console.log('  3. ✅ Bouton Retour en haut');
    console.log('  4. ✅ Compteurs animés au scroll');
    console.log('  5. ✅ Fade-in des sections');
    console.log('  6. ✅ Filtrage dynamique des freelances');
    console.log('  7. ✅ Validation du formulaire de contact');
});