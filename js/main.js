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

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initNavbarScroll();
    initBackToTop();
    initCounters();
    initFadeIn();
});

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
