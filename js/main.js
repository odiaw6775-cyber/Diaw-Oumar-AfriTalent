// ==================== COMMIT 6 ====================
// 1. DARK MODE avec localStorage
// 2. NAVBAR DYNAMIQUE au scroll
// 3. BOUTON RETOUR EN HAUT

// 1. DARK MODE

const initDarkMode = () => {
    // Création du bouton
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn-outline-secondary btn-sm ms-2';
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

    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
    }

    // Vérifier les préférences système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!savedTheme && prefersDark) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
    }

    // Action au clic
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="bi bi-moon"></i>' : '<i class="bi bi-sun"></i>';
    });
};

// 2. NAVBAR DYNAMIQUE AU SCROLL
const initNavbarScroll = () => {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
};
// 3. BOUTON RETOUR EN HAUT
const initBackToTop = () => {
    // Création du bouton
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(btn);

    // Afficher/masquer selon le scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    // Action au clic
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};



// ==================== COMMIT 7 ====================
// 4. COMPTEURS ANIMÉS au scroll
// 5. FADE-IN des sections au scroll

// 4. COMPTEURS ANIMÉS

const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
        hasAnimated = true;
    };

    // Observer pour déclencher quand les compteurs apparaissent
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    if (counters.length > 0) {
        observer.observe(counters[0].parentElement.parentElement);
    }
};

// 5. ANIMATIONS FADE-IN AU SCROLL
const initFadeIn = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
};
// ==================== COMMIT 8 ====================
// 6. FILTRAGE DES FREELANCES
// 7. VALIDATION FORMULAIRE CONTACT


// 6. FILTRAGE DYNAMIQUE
const initFilters = () => {
    const filterSelect = document.getElementById('categoryFilter');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.freelancer-card');

    if (!filterSelect && filterButtons.length === 0) return;

    const filterCards = (category) => {
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterCards(e.target.value);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter');
            filterCards(category);
        });
    });
};


// 7. VALIDATION FORMULAIRE DE CONTACT
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Vérifier chaque champ
        const nom = document.getElementById('nom');
        const prenom = document.getElementById('prenom');
        const email = document.getElementById('email');
        const sujet = document.getElementById('sujet');
        const message = document.getElementById('message');
        
        // Validation Nom
        if (!nom.value.trim()) {
            showError(nom, 'Le nom est requis');
            isValid = false;
        } else {
            clearError(nom);
        }
        
        // Validation Prénom
        if (!prenom.value.trim()) {
            showError(prenom, 'Le prénom est requis');
            isValid = false;
        } else {
            clearError(prenom);
        }
        
        // Validation Email (regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            showError(email, 'Email valide requis');
            isValid = false;
        } else {
            clearError(email);
        }
        
        // Validation Sujet
        if (!sujet.value) {
            showError(sujet, 'Veuillez choisir un sujet');
            isValid = false;
        } else {
            clearError(sujet);
        }
        
        // Validation Message (20 caractères minimum)
        if (!message.value.trim() || message.value.trim().length < 20) {
            showError(message, 'Le message doit contenir au moins 20 caractères');
            isValid = false;
        } else {
            clearError(message);
        }
        
        // Affichage du message de succès
        if (isValid) {
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.style.display = 'block';
                successMsg.textContent = '✅ Message envoyé avec succès ! Nous vous répondrons rapidement.';
            }
            form.reset();
        }
    });
};

// Fonctions helpers pour les erreurs
function showError(input, message) {
    input.classList.add('is-invalid');
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    errorDiv.textContent = message;
}

function clearError(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.textContent = '';
    }
}
// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initNavbarScroll();
    initBackToTop();
    initCounters();
    initFadeIn();
    initFilters();
    initContactForm();
});