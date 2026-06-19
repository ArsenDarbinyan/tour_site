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

document.addEventListener('DOMContentLoaded', () => {
    const burgerToggle = document.getElementById('burger-toggle');
    const navLinks = document.querySelector('.nav-links');
    const allLinks = document.querySelectorAll('.nav-links a');

    // 1. Բուրգեր կոճակի սեղմում (մենյուի բացում/փակում)
    burgerToggle.addEventListener('click', () => {
        burgerToggle.classList.toggle('is-active');
        navLinks.classList.toggle('is-active');
    });

    // 2. Սեկցիայի անվան վրա սեղմելիս մենյուի ավտոմատ փակում (հեռախոսների համար)
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerToggle.classList.remove('is-active');
            navLinks.classList.remove('is-active');
        });
    });
});