const IMAGES = [
    'images.jpg'
];

function generatePoints(baseName, count) {
    const points = [];
    for (let i = 1; i <= count; i++) {
        points.push({
            id: i,
            title: `${baseName} - Կանգառ ${i}`,
            desc: `Հիանալի վայր, որտեղ դուք կվայելեք բնությունը և պատմությունը: Մաս ${i}`,
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
        points: generatePoints('Գառնի, Գեղարդ, Սևան', 8)
    },
    {
        id: 't2',
        title: 'Հարավային Հրաշքներ',
        price: 120000,
        region: 'Հարավային',
        duration: '3 օր',
        cover: IMAGES[0],
        points: generatePoints('Տաթև, Նորավանք', 8)
    },
    {
        id: 't3',
        title: 'Հյուսիսային Անտառներ',
        price: 75000,
        region: 'Հյուսիսային',
        duration: '2 օր',
        cover: IMAGES[0],
        points: generatePoints('Դիլիջան, Հաղարծին', 8)
    }
];

const adjectives = ['Գեղեցիկ', 'Անմոռանալի', 'Արկածային', 'Գաղտնի', 'Պատմական'];
const regions = ['Լոռի', 'Շիրակ', 'Տավուշ', 'Սյունիք', 'Արագածոտն'];

for (let i = 4; i <= 15; i++) {
    const price = Math.floor(Math.random() * 120000) + 30000;
    const region = regions[i % regions.length];
    toursData.push({
        id: `t${i}`,
        title: `${adjectives[i % adjectives.length]} ${region}`,
        price,
        region,
        duration: `${(i % 3) + 1} օր`,
        cover: IMAGES[0],
        points: generatePoints(`${region} Մարզ`, 8)
    });
}

export const DEFAULT_TOUR = toursData[0];
export let filteredTours = [...toursData];

export function initToursCarousel() {
    renderCarousel();
}

export function renderCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    track.innerHTML = '';
    if (filteredTours.length === 0) return;

    const fragment = document.createDocumentFragment();

    // Создаем внутреннюю функцию, чтобы легко вызвать ее дважды
    const buildCards = () => {
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
            card.addEventListener('click', () => {
                const event = new CustomEvent('selectTour', { detail: tour });
                document.dispatchEvent(event);
            });
            fragment.appendChild(card);
        });
    };

    // Вызываем два раза! Это создаст идеальный бесшовный цикл.
    buildCards();
    buildCards();

    track.appendChild(fragment);
}

export function initFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    if (!chips.length) return;

    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            chips.forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');

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
            if (filteredTours.length) {
                document.dispatchEvent(new CustomEvent('selectTour', { detail: filteredTours[0] }));
            }
        });
    });
}
