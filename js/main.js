// ============================================================
//  Feranoz Patisserie & Cafe — Main JS
//  Pure Real User Photography in 3D Bestseller Showcase
// ============================================================

let current3DIndex = 0;
let autoSlideTimer = null;
let isTransitioning = false;

// 4 EXCLUSIVE HIGH-RES BESTSELLER CAROUSEL BANNER SLIDES
const SHOWCASE_ITEMS_3D = [
  {
    id: 106,
    name: "Tiramisu",
    price: 210,
    img: "images/menu/Desserts/Tiramisu.png",
    desc: "Coffee infused italian savoiardi biscuit assembled with italian mascarpone cream & cocoa powder",
    isVeg: false
  },
  {
    id: 112,
    name: "Chocolate Noir",
    price: 295,
    img: "images/menu/Desserts/Chocolate Noir.png",
    desc: "Chocolate sponge, 55% Belgian chocolate ganache, 70% chocolate cream, chocolate diplomat cream",
    isVeg: false
  },
  {
    id: 102,
    name: "Basque Cheesecake",
    price: 280,
    img: "images/menu/Desserts/Basque Cheesecake.jpg",
    desc: "Baked cheesecake with a caramelized exterior & rich, soft and creamy center",
    isVeg: false
  },
  {
    id: 147,
    name: "Crunchy Chicken Burger",
    price: 440,
    img: "images/menu/Burger/Crunchy Chicken Burger.jpg",
    desc: "Crispy fried chicken patty, special mayo, lettuce & brioche bun",
    isVeg: false
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  init3DShowcase();
  renderMenuPreview('all');
  initCategoryPillsMouseSwipe();
  initScrollReveal();
  checkTableQueryParam();
});

// ── Scroll Reveal IntersectionObserver ───────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '0px 0px 40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ── Navbar Behavior ──────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
    const isOpen = navMenu?.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.nav-links-middle a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
    });
  });
}

// ── 3D Coverflow Bestseller Carousel ─────────────────────────
let SHOWCASE_DATA = [];
let touchStartX = 0;
let touchEndX = 0;

function init3DShowcase() {
  const track = document.getElementById('showcase-items-track');
  const dotsContainer = document.getElementById('showcase-dots');
  if (!track) return;

  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  let popularItems = allItems.filter(i => i.popular === true);
  
  if (popularItems.length === 0 && typeof SHOWCASE_ITEMS_3D !== 'undefined') {
    popularItems = SHOWCASE_ITEMS_3D.map(i => ({
      name: i.name,
      image: i.img,
      category: i.category || 'bestseller',
      price: i.price,
      description: i.desc
    }));
  }

  SHOWCASE_DATA = popularItems.slice(0, 6);
  if (SHOWCASE_DATA.length === 0 && typeof SHOWCASE_ITEMS_3D !== 'undefined') {
    SHOWCASE_DATA = SHOWCASE_ITEMS_3D;
  }

  track.innerHTML = SHOWCASE_DATA.map((item, idx) => `
    <div class="bestseller-card-col showcase-3d-item" id="showcase-item-${idx}" onclick="handle3DCardClick(${idx})">
      <div class="showcase-card-inner">
        <div class="showcase-card-img-wrap">
          ${item.image || item.img ? `<img src="${encodeURI(item.image || item.img)}" alt="${item.name}" loading="lazy" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-weight:700;color:var(--ink);">${item.name}</div>`}
          <span class="card-bestseller-badge">BESTSELLER</span>
        </div>
        <p class="bestseller-title">${item.name}</p>
      </div>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = SHOWCASE_DATA.map((_, idx) => `
      <div class="showcase-dot ${idx === current3DIndex ? 'active' : ''}" onclick="set3DIndex(${idx})"></div>
    `).join('');
  }

  initTouchAndHoverEvents();
  update3DStage();
  startAutoSlide();
}

function handle3DCardClick(idx) {
  if (idx === current3DIndex) return;
  set3DIndex(idx);
}

function set3DIndex(idx) {
  current3DIndex = idx;
  update3DStage();
}

function move3DShowcase(direction) {
  if (direction > 0) {
    next3DSlide();
  } else {
    prev3DSlide();
  }
}

function next3DSlide() {
  if (SHOWCASE_DATA.length === 0) return;
  current3DIndex = (current3DIndex + 1) % SHOWCASE_DATA.length;
  update3DStage();
}

function prev3DSlide() {
  if (SHOWCASE_DATA.length === 0) return;
  current3DIndex = (current3DIndex - 1 + SHOWCASE_DATA.length) % SHOWCASE_DATA.length;
  update3DStage();
}

function update3DStage() {
  const total = SHOWCASE_DATA.length;
  if (total === 0) return;

  const isMobile = window.innerWidth <= 768;
  const spacing = isMobile ? 130 : 210;

  SHOWCASE_DATA.forEach((_, idx) => {
    const el = document.getElementById(`showcase-item-${idx}`);
    if (!el) return;

    let diff = (idx - current3DIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    el.classList.remove('pos-center', 'pos-left', 'pos-right', 'pos-hidden-left', 'pos-hidden-right');

    if (diff === 0) {
      el.classList.add('pos-center');
      el.style.transform = `translate(-50%, -50%) scale(${isMobile ? 1.12 : 1.2}) rotateY(0deg) translateZ(0px)`;
      el.style.zIndex = '10';
      el.style.opacity = '1';
      el.style.filter = 'none';
      el.style.pointerEvents = 'auto';
    } else if (diff === -1) {
      el.classList.add('pos-left');
      el.style.transform = `translate(calc(-50% - ${spacing}px), -50%) scale(0.85) rotateY(25deg) translateZ(-80px)`;
      el.style.zIndex = '5';
      el.style.opacity = '0.7';
      el.style.filter = 'brightness(0.88)';
      el.style.pointerEvents = 'auto';
    } else if (diff === 1) {
      el.classList.add('pos-right');
      el.style.transform = `translate(calc(-50% + ${spacing}px), -50%) scale(0.85) rotateY(-25deg) translateZ(-80px)`;
      el.style.zIndex = '5';
      el.style.opacity = '0.7';
      el.style.filter = 'brightness(0.88)';
      el.style.pointerEvents = 'auto';
    } else if (diff < -1) {
      el.classList.add('pos-hidden-left');
      el.style.transform = `translate(calc(-50% - ${spacing * 1.6}px), -50%) scale(0.65) rotateY(40deg) translateZ(-160px)`;
      el.style.zIndex = '1';
      el.style.opacity = '0';
      el.style.filter = 'brightness(0.7)';
      el.style.pointerEvents = 'none';
    } else {
      el.classList.add('pos-hidden-right');
      el.style.transform = `translate(calc(-50% + ${spacing * 1.6}px), -50%) scale(0.65) rotateY(-40deg) translateZ(-160px)`;
      el.style.zIndex = '1';
      el.style.opacity = '0';
      el.style.filter = 'brightness(0.7)';
      el.style.pointerEvents = 'none';
    }
  });

  const dots = document.querySelectorAll('.showcase-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current3DIndex);
  });

  const activeItem = SHOWCASE_DATA[current3DIndex];
  const infoBar = document.getElementById('showcase-info-bar');
  if (infoBar && activeItem) {
    infoBar.style.opacity = '0';
    setTimeout(() => {
      infoBar.innerHTML = `
        <h3 class="showcase-info-title">${activeItem.name}</h3>
        <div class="showcase-info-price">₹${activeItem.price || 250}</div>
        ${activeItem.description || activeItem.desc ? `<p style="font-size:0.88rem; color:var(--ink-soft); max-width:440px; margin:0 auto 12px; line-height:1.4;">${activeItem.description || activeItem.desc}</p>` : ''}
        <button class="btn-primary showcase-info-btn" onclick="openOrderModal(); return false;">
          Order This Bestseller →
        </button>
      `;
      infoBar.style.opacity = '1';
    }, 120);
  }
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(() => {
    next3DSlide();
  }, 4000);
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
}

function initTouchAndHoverEvents() {
  const stage = document.querySelector('.showcase-stage-viewport');
  if (!stage || stage.dataset.eventsInitialized) return;
  stage.dataset.eventsInitialized = 'true';

  stage.addEventListener('mouseenter', stopAutoSlide);
  stage.addEventListener('mouseleave', startAutoSlide);

  stage.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  stage.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) next3DSlide();
      else prev3DSlide();
    }
    startAutoSlide();
  }, { passive: true });
}

window.addEventListener('resize', () => {
  update3DStage();
});

// ── Menu Preview Rendering ───────────────────────────────────
function filterMenuPreview(category, btnElement) {
  if (btnElement) {
    document.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  renderMenuPreview(category);
}

function renderMenuPreview(category = 'all') {
  const container = document.getElementById('menu-preview-grid');
  if (!container || typeof MENU_DATA === 'undefined') return;

  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  let items = allItems;
  if (category !== 'all') {
    items = allItems.filter(i => i.category === category);
  } else {
    // Only show items explicitly marked as bestseller by the owner
    const popularItems = allItems.filter(i => i.popular === true);
    if (popularItems.length > 0) {
      items = popularItems;
    } else {
      // Fallback: show hardcoded featured set if owner hasn't set any bestsellers yet
      const featuredSet = new Set(FEATURED_IDS || [101, 102, 103, 105, 401, 601]);
      items = allItems.filter(i => featuredSet.has(i.id));
    }
  }

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--ink-soft);">No items found in this category.</div>`;
    return;
  }

  container.innerHTML = items.map(item => {
    const isAvailable = item.available !== false;
    return `
      <div class="caffeine-item-card ${!isAvailable ? 'item-unavailable' : ''}" data-category="${item.category}" data-id="${item.id}">
        <div class="card-img-wrap" style="${!isAvailable ? 'filter: grayscale(80%); opacity:0.8;' : ''}">
          <span class="card-veg-badge ${item.isVeg ? 'veg' : 'non-veg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
          ${item.image ? `<img src="${encodeURI(item.image)}" alt="${item.name}" data-name="${item.name}" loading="lazy" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-weight:700;color:var(--ink);">${item.name}</div>`}
          ${item.popular ? `<span class="card-bestseller-badge">BESTSELLER</span>` : ''}
          <span class="card-avail-badge ${!isAvailable ? 'unavail' : ''}">${isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}</span>
        </div>

        <div>
          <div class="card-title-row">
            <h3 class="card-title">${item.name}</h3>
            <span class="card-price">₹${item.price}</span>
          </div>
          <p class="card-desc">${item.description}</p>
        </div>

        <button class="card-action-btn" ${!isAvailable ? 'disabled style="opacity:0.55; cursor:not-allowed; background:#8D6E63;"' : 'onclick="openOrderModal(); return false;"'}>
          ${isAvailable ? 'Order Item' : 'Currently Unavailable'}
        </button>
      </div>
    `;
  }).join('');
}

// ── Real-Time Menu Sync Listener ──────────────────────────────
try {
  const menuBc = new BroadcastChannel('feranoz_menu_channel');
  menuBc.onmessage = (e) => {
    if (e.data && e.data.type === 'MENU_UPDATED') {
      renderMenuPreview();
      init3DShowcase();
    }
  };
} catch(err) {}

window.addEventListener('storage', (e) => {
  if (e.key === 'feranoz_custom_menu') {
    renderMenuPreview();
    // Also refresh the 3D bestseller carousel when menu data changes
    current3DIndex = 0;
    init3DShowcase();
  }
});

function checkTableQueryParam() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get('table');
  if (table) {
    const tableNum = parseInt(table, 10);
    if (!isNaN(tableNum) && tableNum >= 1 && tableNum <= 10) {
      setTimeout(() => {
        if (typeof openOrderModal === 'function') {
          openOrderModal(tableNum);
        }
      }, 400);
    }
  }
}

function initCategoryPillsMouseSwipe() {
  const bar = document.getElementById('category-pills-bar');
  if (!bar) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  bar.style.cursor = 'grab';
  bar.style.userSelect = 'none';

  bar.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    bar.style.cursor = 'grabbing';
    startX = e.pageX - bar.offsetLeft;
    scrollLeft = bar.scrollLeft;
  });

  bar.addEventListener('mouseleave', () => {
    isDown = false;
    bar.style.cursor = 'grab';
  });

  bar.addEventListener('mouseup', () => {
    isDown = false;
    bar.style.cursor = 'grab';
    setTimeout(() => { isDragging = false; }, 50);
  });

  bar.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - bar.offsetLeft;
    const walk = (x - startX) * 1.8;
    if (Math.abs(walk) > 5) {
      isDragging = true;
    }
    bar.scrollLeft = scrollLeft - walk;
  });

  bar.addEventListener('click', (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  bar.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      bar.scrollLeft += e.deltaY * 0.8;
    }
  }, { passive: false });
}

