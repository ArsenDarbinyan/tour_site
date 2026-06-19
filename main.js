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
