let currentTour = null;
let currentRouteIndex = 0;
let routeAutoplayTimer = null;
let autoplayProgress = 0;
let isAutoplayPaused = false;
let lastFrameTime = 0;

export function initTourDetails(defaultTour = null) {
    initBookingButtons();

    const closeBtn = document.getElementById('close-details-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const details = document.getElementById('tour-details');
            if (details) details.style.display = 'none';
            stopRouteAutoplay();
        });
    }

    document.addEventListener('selectTour', (event) => {
        openTourDetails(event.detail, true);
    });

    if (defaultTour) {
        openTourDetails(defaultTour, false);
    }
}

function openTourDetails(tour, shouldScroll = true) {
    currentTour = tour;
    currentRouteIndex = 0;

    const details = document.getElementById('tour-details');
    if (!details) return;

    const title = document.getElementById('details-tour-title');
    if (title) title.innerText = tour.title;

    const placeholder = document.querySelector('.details-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    details.style.display = 'block';
    if (shouldScroll) {
        details.scrollIntoView({ behavior: 'smooth' });
    }

    renderTimeline();
    updateRoutePoint();
    updateBookingLinks(tour);
    startRouteAutoplay();
}

function renderTimeline() {
    const container = document.getElementById('route-timeline');
    if (!container || !currentTour) return;

    container.innerHTML = '<div class="timeline-line"></div>';

    const progressLine = document.createElement('div');
    progressLine.className = 'timeline-progress';
    progressLine.id = 'timeline-progress';
    container.appendChild(progressLine);

    const pointsCount = currentTour.points.length;
    currentTour.points.forEach((pt, index) => {
        const dot = document.createElement('div');
        dot.className = 'timeline-dot';
        dot.id = `dot-${index}`;
        const leftPerc = pointsCount > 1 ? (index / (pointsCount - 1)) * 100 : 0;
        dot.style.position = 'absolute';
        dot.style.left = `${leftPerc}%`;

        const timerRing = document.createElement('div');
        timerRing.className = 'timeline-dot-timer';
        timerRing.id = `timer-${index}`;
        dot.appendChild(timerRing);

        dot.addEventListener('click', () => {
            currentRouteIndex = index;
            isAutoplayPaused = true;
            updateRoutePoint();
        });

        container.appendChild(dot);
    });

    const prev = document.getElementById('route-prev');
    const next = document.getElementById('route-next');

    if (prev) prev.onclick = () => {
        if (currentRouteIndex > 0) currentRouteIndex--;
        isAutoplayPaused = true;
        updateRoutePoint();
    };
    if (next) next.onclick = () => {
        if (currentRouteIndex < currentTour.points.length - 1) currentRouteIndex++;
        isAutoplayPaused = true;
        updateRoutePoint();
    };
}

function updateRoutePoint() {
    if (!currentTour) return;
    const point = currentTour.points[currentRouteIndex];
    if (!point) return;

    const mainImg = document.getElementById('route-main-image');
    if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = point.img;
            mainImg.style.opacity = '1';
        }, 200);
    }

    const title = document.getElementById('route-point-title');
    const desc = document.getElementById('route-point-desc');
    if (title) title.innerText = point.title;
    if (desc) desc.innerText = point.desc;

    const thumb = document.getElementById('route-thumbnail');
    if (thumb && point.thumb) {
        const thumbImg = document.getElementById('route-thumb-img');
        const thumbTitle = document.getElementById('route-thumb-title');
        if (thumbImg) thumbImg.src = point.thumb;
        if (thumbTitle) thumbTitle.innerText = point.thumbTitle;
        thumb.style.opacity = '1';
    } else if (thumb) {
        thumb.style.opacity = '0';
    }

    document.querySelectorAll('.timeline-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentRouteIndex);
    });

    const progress = document.getElementById('timeline-progress');
    if (progress && currentTour.points.length > 1) {
        const width = (currentRouteIndex / (currentTour.points.length - 1)) * 100;
        progress.style.width = `${width}%`;
    }

    autoplayProgress = 0;
}

function updateBookingLinks(tour) {
    const whatsapp = document.getElementById('btn-whatsapp');
    const telegram = document.getElementById('btn-telegram');
    if (whatsapp) whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`Բարև, ուզում եմ գրանցվել ${tour.title} տուրի համար`)}`;
    if (telegram) telegram.href = `https://t.me/share/url?url=&text=${encodeURIComponent(`Բարև, ուզում եմ գրանցվել ${tour.title} տուրի համար`)}`;
}

function initBookingButtons() {
    const btn = document.getElementById('booking-btn');
    const options = document.getElementById('booking-options');
    if (!btn || !options || btn.dataset.bookingInit === 'true') return;

    btn.dataset.bookingInit = 'true';
    btn.addEventListener('click', () => {
        options.classList.toggle('expanded');
    });
}

function startRouteAutoplay() {
    stopRouteAutoplay();
    isAutoplayPaused = false;
    autoplayProgress = 0;
    lastFrameTime = performance.now();
    routeAutoplayTimer = requestAnimationFrame(autoplayLoop);
}

function stopRouteAutoplay() {
    if (routeAutoplayTimer) {
        cancelAnimationFrame(routeAutoplayTimer);
        routeAutoplayTimer = null;
    }
}

function autoplayLoop(time) {
    if (isAutoplayPaused || !currentTour) return;
    const delta = time - lastFrameTime;
    lastFrameTime = time;
    autoplayProgress += delta / 5000;

    const activeTimer = document.getElementById(`timer-${currentRouteIndex}`);
    if (activeTimer) {
        activeTimer.style.transform = `scale(${1 + autoplayProgress * 0.5})`;
        activeTimer.style.opacity = `${1 - autoplayProgress * 0.5}`;
    }

    if (autoplayProgress >= 1) {
        if (currentRouteIndex < currentTour.points.length - 1) {
            currentRouteIndex++;
            updateRoutePoint();
        } else {
            stopRouteAutoplay();
            return;
        }
    }

    routeAutoplayTimer = requestAnimationFrame(autoplayLoop);
}
