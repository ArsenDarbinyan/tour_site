import { initHero } from './hero.js';
import { initAccordion } from './accordion.js';
import { initAchievements } from './achievements.js';
import { initFooter } from './footer.js';

import { DEFAULT_TOUR, initToursCarousel, initFilters } from './tours.js';
import { initTourDetails } from './tour-details.js';

window.addEventListener('DOMContentLoaded', () => {
    initHero();
    initToursCarousel();
    initFilters();
    initTourDetails(DEFAULT_TOUR);
    initAccordion();
    initAchievements();
    initFooter();
});
// ================== ՆԱՎԲԱՐԻ ԿԱՏԱՐԵԼԱԳՈՐԾՎԱԾ ՖՈՒՆԿՑԻՈՆԱԼՈՒԹՅՈՒՆ ==================
document.addEventListener('DOMContentLoaded', () => {
    const burgerToggle = document.getElementById('burger-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.getElementById('nav-overlay');
    const allLinks = document.querySelectorAll('.nav-links a');

    if (burgerToggle && navLinks && navOverlay) {
        
        // Մենյուն բացելու/փակելու ֆունկցիա
        const toggleMenu = () => {
            burgerToggle.classList.toggle('is-active');
            navLinks.classList.toggle('is-active');
            navOverlay.classList.toggle('is-active'); // Միացնում/անջատում է մութ ֆոնը
        };

        // Մենյուն միայն փակելու ֆունկցիա
        const closeMenu = () => {
            burgerToggle.classList.remove('is-active');
            navLinks.classList.remove('is-active');
            navOverlay.classList.remove('is-active');
        };

        // 1. Բուրգեր կոճակի սեղմում
        burgerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // 2. Հղման վրա սեղմելիս փակում
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // 3. Սեղմում մութ ֆոնի (Overlay) վրա՝ մենյուի փակում
        navOverlay.addEventListener('click', () => {
            closeMenu();
        });
    }
});
// ================== ԻՍԿԱԿԱՆ ԱՍԻՆԽՐՈՆ ԹՎԵՐԻ ԱՆԻՄԱՑԻԱ ==================
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');

    const startCountingAsynchronous = (counter) => {
        const target = +counter.getAttribute('data-target');
        let current = 0;

        // Յուրաքանչյուր թվի համար հաշվարկում ենք իր անհատական քայլի չափսը
        // Մեծ թվերը կունենան մեծ քայլեր (արագ կաճեն), փոքրերը՝ 1-ական քայլ
        const step = target > 100 ? Math.ceil(target / 60) : 1;

        // Յուրաքանչյուր թվի համար սահմանում ենք անհատական արագություն (միլիվայրկյաններով)
        // Փոքր թվերը (օրինակ՝ 15-ը) կունենան ավելի մեծ դադար քայլերի միջև, որպեսզի էֆեկտը գեղեցիկ լինի
        const speed = target < 50 ? 60 : 20;

        const timer = setInterval(() => {
            current += step;

            if (current >= target) {
                counter.innerText = target.toLocaleString(); // Ապահովում ենք վերջնական ճշգրիտ թիվը (օր. 15 կամ 1,500)
                clearInterval(timer); // Կանգնեցնում ենք միայն ԱՅՍ թվի անիմացիան, մյուսները շարունակում են
            } else {
                counter.innerText = current.toLocaleString();
            }
        }, speed);
    };

    // Էֆեկտը միանում է միայն այն ժամանակ, երբ սեկցիան երևում է էկրանին
    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                startCountingAsynchronous(counter);
                observer.unobserve(counter); // Անջատում ենք, որ երկրորդ անգամ էջը բարձրացնելիս չկրկնվի
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
});
