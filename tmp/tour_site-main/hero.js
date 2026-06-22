export function initHero() {
    const cta = document.querySelector('.cta-button');
    const toursSection = document.getElementById('tours-carousel');
    if (!cta || !toursSection) return;

    cta.addEventListener('click', () => {
        toursSection.scrollIntoView({ behavior: 'smooth' });
    });
}
