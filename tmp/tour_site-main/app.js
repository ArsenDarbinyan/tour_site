// app.js

// --- DATA SOURCE ---
const IMAGES = [
    "images.jpg",
        
];

function generatePoints(baseName, count) {
    let points = [];
    for (let i = 1; i <= count; i++) {
        points.push({
            id: i,
            title: `${baseName} - Կանգառ ${i}`,
            desc: `Հիանալի վայր, որտեղ դուք կվայելեք բնությունը և պատմությունը: Մաս ${i}:`,
            img: IMAGES[i % IMAGES.length],
            thumb: IMAGES[(i + 1) % IMAGES.length],
            thumbTitle: `Տեսարան ${i}`
        });
    }
    return points;
}

const toursData = [
    {
        id: 't1',
        title: 'Դասական Հայաստան',
        price: 45000,
        region: 'Կենտրոնական',
        duration: '1 օր',
        cover: IMAGES[0],
        points: generatePoints('Գառնի, Գեղարդ, Սևան', 15)
    },
    {
        id: 't2',
        title: 'Հարավային Հրաշքներ',
        price: 120000,
        region: 'Հարավային',
        duration: '3 օր',
        cover: IMAGES[0],
        points: generatePoints('Տաթև, Նորավանք', 15)
    },
    {
        id: 't3',
        title: 'Հյուսիսային Անտառներ',
        price: 75000,
        region: 'Հյուսիսային',
        duration: '2 օր',
        cover: IMAGES[0],
        points: generatePoints('Դիլիջան, Հաղարծին', 15)
    }
];

// Generate remaining 15 tours reusing templates
const adjectives = ['Գեղեցիկ', 'Անմոռանալի', 'Արկածային', 'Գաղտնի', 'Պատմական'];
const regions = ['Լոռի', 'Շիրակ', 'Տավուշ', 'Սյունիք', 'Արագածոտն'];

for (let i = 4; i <= 18; i++) {
    const price = Math.floor(Math.random() * 120000) + 30000;
    const template = toursData[i % 3].points; // reuse points
    toursData.push({
        id: `t${i}`,
        title: `${adjectives[i % adjectives.length]} ${regions[i % regions.length]}`,
        price: price,
        region: regions[i % regions.length],
        duration: `${(i % 3) + 1} օր`,
        cover: IMAGES[i % IMAGES.length],
        points: template
    });
}

// --- DOM ELEMENTS & STATE ---
let currentTour = null;
let currentRouteIndex = 0;
let routeAutoplayTimer = null;
let autoplayProgress = 0;
let isAutoplayPaused = false;
let lastFrameTime = 0;

// Carousel State
let carouselPos = 0;
let carouselSpeed = 1; // pixels per frame
let isCarouselHovered = false;
let carouselAnimFrame = null;
let filteredTours = [...toursData];

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initFilters();
    initAccordion();
    initCounters();
    initBookingButtons();
    
    // Close details
    document.getElementById('close-details-btn').addEventListener('click', () => {
        document.getElementById('tour-details').style.display = 'none';
        stopRouteAutoplay();
    });
});

// --- CAROUSEL LOGIC (60FPS with requestAnimationFrame & transform) ---
function initCarousel() {
    renderCarousel();
    
    const track = document.getElementById('carousel-track');
    
    track.addEventListener('mouseenter', () => isCarouselHovered = true);
    track.addEventListener('mouseleave', () => isCarouselHovered = false);
    track.addEventListener('touchstart', () => isCarouselHovered = true, {passive: true});
    track.addEventListener('touchend', () => {
        setTimeout(() => isCarouselHovered = false, 1000);
    }, {passive: true});
    
    if (!carouselAnimFrame) {
        carouselLoop();
    }
}

function renderCarousel() {
    const track = document.getElementById('carousel-track');
    track.innerHTML = '';
    
    if (filteredTours.length === 0) return;
    
    // Create elements (duplicate for infinite effect)
    // To make it truly infinite without layout thrashing, we append enough cards
    const fragment = document.createDocumentFragment();
    
    // Add 3 sets of the filtered tours to ensure enough width for seamless loop
    for (let loop = 0; loop < 3; loop++) {
        filteredTours.forEach(tour => {
            const card = document.createElement('div');
            card.className = 'tour-card';
            card.innerHTML = `
                <div class="tour-card-img" style="background-image: url('${tour.cover}')"></div>
                <div class="tour-card-content">
                    <h3 class="tour-card-title">${tour.title}</h3>
                    <div class="tour-card-price">${tour.price.toLocaleString('hy-AM')} ֏</div>
                </div>
            `;
            card.addEventListener('click', () => openTourDetails(tour));
            fragment.appendChild(card);
        });
    }
    
    track.appendChild(fragment);
    carouselPos = 0; // reset position on render
}

function carouselLoop() {
    if (!isCarouselHovered && filteredTours.length > 0) {
        carouselPos -= carouselSpeed;
        
        // Assuming each card is ~300px (280 + 20 gap)
        const singleSetWidth = filteredTours.length * 300;
        
        if (Math.abs(carouselPos) >= singleSetWidth) {
            // Reset position seamlessly
            carouselPos += singleSetWidth;
        }
        
        const track = document.getElementById('carousel-track');
        track.style.transform = `translate3d(${carouselPos}px, 0, 0)`;
    }
    carouselAnimFrame = requestAnimationFrame(carouselLoop);
}

// --- FILTERS ---
function initFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            // Update UI
            chips.forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter logic
            const filter = e.target.dataset.filter;
            if (filter === 'all') {
                filteredTours = [...toursData];
            } else if (filter === 'low') {
                filteredTours = toursData.filter(t => t.price <= 50000);
            } else if (filter === 'mid') {
                filteredTours = toursData.filter(t => t.price > 50000 && t.price <= 100000);
            } else if (filter === 'high') {
                filteredTours = toursData.filter(t => t.price > 100000);
            }
            
            renderCarousel();
        });
    });
}

// --- TOUR DETAILS & ROUTE (Section 3) ---
function openTourDetails(tour) {
    currentTour = tour;
    currentRouteIndex = 0;
    
    document.getElementById('details-tour-title').innerText = tour.title;
    document.getElementById('tour-details').style.display = 'block';
    
    document.getElementById('tour-details').scrollIntoView({ behavior: 'smooth' });
    
    renderTimeline();
    updateRoutePoint();
    
    // Setup social links
    document.getElementById('btn-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`Բարև, ուզում եմ գրանցվել ${tour.title} տուրի համար`)}`;
    document.getElementById('btn-telegram').href = `https://t.me/share/url?url=&text=${encodeURIComponent(`Բարև, ուզում եմ գրանցվել ${tour.title} տուրի համար`)}`;
    
    startRouteAutoplay();
}

function renderTimeline() {
    const container = document.getElementById('route-timeline');
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
        // Position percentage (10% to 90% space)
        const leftPerc = (index / (pointsCount - 1)) * 100;
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
    
    // Bind prev/next
    document.getElementById('route-prev').onclick = () => {
        if (currentRouteIndex > 0) currentRouteIndex--;
        isAutoplayPaused = true;
        updateRoutePoint();
    };
    
    document.getElementById('route-next').onclick = () => {
        if (currentRouteIndex < currentTour.points.length - 1) currentRouteIndex++;
        isAutoplayPaused = true;
        updateRoutePoint();
    };
}

function updateRoutePoint() {
    const point = currentTour.points[currentRouteIndex];
    
    // Image transitions
    const mainImg = document.getElementById('route-main-image');
    mainImg.style.opacity = 0;
    setTimeout(() => {
        mainImg.src = point.img;
        mainImg.style.opacity = 1;
    }, 200); // sync with css transition
    
    document.getElementById('route-point-title').innerText = point.title;
    document.getElementById('route-point-desc').innerText = point.desc;
    
    const thumb = document.getElementById('route-thumbnail');
    if (point.thumb) {
        document.getElementById('route-thumb-img').src = point.thumb;
        document.getElementById('route-thumb-title').innerText = point.thumbTitle;
        thumb.style.opacity = 1;
    } else {
        thumb.style.opacity = 0;
    }
    
    // Update dots
    document.querySelectorAll('.timeline-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentRouteIndex);
    });
    
    // Update progress line
    const progressPerc = (currentRouteIndex / (currentTour.points.length - 1)) * 100;
    document.getElementById('timeline-progress').style.width = `${progressPerc}%`;
    
    // Reset autoplay visual timer
    autoplayProgress = 0;
}

// 60FPS Timeline Auto-advance
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
    if (isAutoplayPaused) return; // Wait if user interacted
    
    const deltaTime = time - lastFrameTime;
    lastFrameTime = time;
    
    // 5000ms = 5 seconds per point
    autoplayProgress += (deltaTime / 5000); 
    
    // Visual timer update on active dot
    const activeTimerRing = document.getElementById(`timer-${currentRouteIndex}`);
    if (activeTimerRing) {
        // Simple scale effect or opacity depending on design, here we use scale
        activeTimerRing.style.transform = `scale(${1 + autoplayProgress * 0.5})`;
        activeTimerRing.style.opacity = 1 - (autoplayProgress * 0.5);
    }
    
    if (autoplayProgress >= 1) {
        if (currentRouteIndex < currentTour.points.length - 1) {
            currentRouteIndex++;
            updateRoutePoint();
        } else {
            // Reached end
            stopRouteAutoplay();
            return;
        }
    }
    
    routeAutoplayTimer = requestAnimationFrame(autoplayLoop);
}


// --- ACCORDION (Section 4) ---
function initAccordion() {
    const cards = document.querySelectorAll('.accordion-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
        // For mobile tap
        card.addEventListener('touchstart', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        }, {passive: true});
    });
}


// --- ACHIEVEMENTS COUNTER (Section 5) ---
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.disconnect(); // run once
            }
        });
    }, { threshold: 0.5 });
    
    const section = document.getElementById('achievements');
    if (section) observer.observe(section);
}

function startCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2000; // 2 seconds
    
    counters.forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const isDecimal = counter.hasAttribute('data-decimal');
        const start = performance.now();
        
        function updateCounter(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuart
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


// --- BOOKING BUTTON ---
function initBookingButtons() {
    const btn = document.getElementById('booking-btn');
    const options = document.getElementById('booking-options');
    
    btn.addEventListener('click', () => {
        options.classList.toggle('expanded');
    });
}
