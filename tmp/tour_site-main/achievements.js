export function initAchievements() {
    const section = document.getElementById('achievements');
    if (!section) return;

    if (!('IntersectionObserver' in window)) {
        startCounters();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(section);

    if (section.getBoundingClientRect().top < window.innerHeight) {
        startCounters();
        observer.disconnect();
    }
}

function startCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2000;

    counters.forEach(counter => {
        const target = parseFloat(counter.dataset.target) || 0;
        const isDecimal = counter.hasAttribute('data-decimal');
        const startTime = performance.now();

        function updateCounter(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = target * ease;

            if (isDecimal) {
                counter.innerText = current.toFixed(1);
            } else {
                counter.innerText = Math.floor(current).toLocaleString('hy-AM');
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (isDecimal) {
                    counter.innerText = target.toFixed(1);
                } else {
                    counter.innerText = target.toLocaleString('hy-AM');
                }
            }
        }

        requestAnimationFrame(updateCounter);
    });
}
