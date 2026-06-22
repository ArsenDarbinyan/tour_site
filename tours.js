// ==========================================
// 1. МАССИВ ДАННЫХ — УПРАВЛЯЙТЕ ЗДЕСЬ ВСЕМ
// ==========================================
// Раздел 2 (карусель): берёт из каждого тура → title, price, cover
// Раздел 3 (маршрут): берёт из points каждого тура →
//    title, desc, img (большая картинка), thumb (маленькая | null = скрыть), thumbTitle
// Количество точек в тайм-лайне = points.length (автоматически)

const toursData = [
    {
        id: 't1',
        title: 'Դասական Հայաստան',       // Название в карусели (Раздел 2)
        price: 45000,                     // Цена в карусели (Раздел 2)
        region: 'Կենտրոնական',
        duration: '1 օր',
        cover: 'images.jpg',             // Картинка карточки в карусели (Раздел 2)
        points: [
            // Каждый объект = одна точка маршрута в Разделе 3
            // Количество точек = количество dots на тайм-лайне
            {
                id: 1,
                title: 'Գառնու տաճար',                                           // Заголовок точки
                desc: 'Միակ պահպանված հեթանոսական տաճարը Հայաստանում, նվիրված արևի աստված Միհրին։', // Описание точки
                img: 'images.jpg',           // Большая картинка точки
                thumb: 'images.jpg',         // Маленькая превью-картинка (null = скрыть блок)
                thumbTitle: 'Տաճարի տեսքը'  // Подпись под маленькой картинкой
            },
            {
                id: 2,
                title: 'Գեղարդի վանք',
                desc: 'Ժայռափոր հրաշք վանական համալիր, որն ընդգրկված է ՅՈՒՆԵՍԿՕ-ի ցանկում։',
                img: 'images.jpg',
                thumb: null,                 // null → маленькая картинка скроется
                thumbTitle: ''
            },
            {
                id: 3,
                title: 'Սևանա լիճ',
                desc: 'Հայաստանի կապուտակ աչքը՝ հիանալի բնությամբ և հինավուրց վանքով։',
                img: 'images.jpg',
                thumb: 'images.jpg',
                thumbTitle: 'Սևանավանք'
            }
        ]
    },
    {
        id: 't2',
        title: 'Հարավային Հրաշքներ',
        price: 120000,
        region: 'Հարավային',
        duration: '3 օր',
        cover: 'images.jpg',
        points: [
            {
                id: 1,
                title: 'Խոր Վիրապ',
                desc: 'Վայր, որտեղից բացվում է Արարատ լեռան ամենագեղեցիկ տեսարանը։',
                img: 'images.jpg',
                thumb: null,
                thumbTitle: ''
            },
            {
                id: 2,
                title: 'Նորավանք',
                desc: 'Կարմիր ժայռերի մեջ թաքնված միջնադարյան ճարտարապետության գլուխգործոց։',
                img: 'images.jpg',
                thumb: 'images.jpg',
                thumbTitle: 'Կարմիր ժայռեր'
            },
            {
                id: 3,
                title: 'Տաթևի վանք',
                desc: 'Ճախրեք աշխարհի ամենաերկար ճոպանուղով դեպի 9-րդ դարի վանական համալիր։',
                img: 'images.jpg',
                thumb: 'images.jpg',
                thumbTitle: 'Ճոպանուղի'
            },
            {
                id: 4,
                title: 'Ջերմուկ',
                desc: 'Հայտնի բնական հանքային ջրի աղբյուրները և Ջերմուկի ջրվեժը։',
                img: 'images.jpg',
                thumb: 'images.jpg',
                thumbTitle: 'Ջրվեժ'
            }
        ]
    },
    {
        id: 't3',
        title: 'Հյուսիսային Անտառներ',
        price: 75000,
        region: 'Հյուսիսային',
        duration: '2 օր',
        cover: 'images.jpg',
        points: [
            {
                id: 1,
                title: 'Դիլիջան',
                desc: 'Հայկական Շվեյցարիան՝ իր խիտ անտառներով և մաքուր օդով։',
                img: 'images.jpg',
                thumb: 'images.jpg',
                thumbTitle: 'Հին քաղաք'
            },
            {
                id: 2,
                title: 'Պարզ լիճ',
                desc: 'Անտառի սրտում թաքնված գողտրիկ լիճ՝ իդեալական հանգստի համար։',
                img: 'images.jpg',
                thumb: null,
                thumbTitle: ''
            }
        ]
    }
];

// ==========================================
// 2. ЭКСПОРТ И ФИЛЬТРАЦИЯ
// ==========================================
export const DEFAULT_TOUR = toursData[0];
export let filteredTours = [...toursData];

// ==========================================
// 3. КАРУСЕЛЬ — РЕНДЕР (Раздел 2)
// ==========================================
export function initToursCarousel() {
    renderCarousel();
}

export function renderCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    track.innerHTML = '';
    if (filteredTours.length === 0) return;

    const fragment = document.createDocumentFragment();

    // Создаем карточки дважды для бесшовного marquee-эффекта
    const buildCards = () => {
        filteredTours.forEach(tour => {
            const card = document.createElement('div');
            card.className = 'tour-card';
            // Раздел 2: отображает tour.cover (картинка), tour.title (название), tour.price (цена)
            card.innerHTML = `
                <div class="tour-card-img" style="background-image: url('${tour.cover}')"></div>
                <div class="tour-card-content">
                    <h3 class="tour-card-title">${tour.title}</h3>
                    <div class="tour-card-price">${tour.price.toLocaleString('hy-AM')} ֏</div>
                </div>
            `;
            card.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('selectTour', { detail: tour }));
            });
            fragment.appendChild(card);
        });
    };

    buildCards();
    buildCards(); // дублируем для бесшовной анимации

    track.appendChild(fragment);
}

// ==========================================
// 4. ФИЛЬТРЫ
// ==========================================
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

            // После фильтрации открываем первый тур
            if (filteredTours.length) {
                document.dispatchEvent(new CustomEvent('selectTour', { detail: filteredTours[0] }));
            }
        });
    });
}