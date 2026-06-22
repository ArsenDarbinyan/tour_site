export function initAccordion() {
    const cards = document.querySelectorAll('.accordion-card');
    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });

        card.addEventListener('touchstart', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        }, { passive: true });
    });
}
