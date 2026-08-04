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
    id: 113,
    name: "Tiramisu",
    price: 295,
    img: "images/swiggy_items/tiramisu.jpg",
    desc: "Classic Italian tiramisu with espresso & mascarpone cream"
  },
  {
    id: 103,
    name: "Chocolate Noir",
    price: 295,
    img: "images/swiggy_items/chocolate_noir.jpg",
    desc: "Belgian chocolate ganache, 70% dark chocolate cream & cocoa sponge"
  },
  {
    id: 101,
    name: "Basque Cheesecake",
    price: 280,
    img: "images/Basque Cheesecake.jpg",
    desc: "Baked cheesecake with a caramelized exterior &amp; rich, creamy center"
  },
  {
    id: 301,
    name: "Crunchy Chicken Burger",
    price: 440,
    img: "images/swiggy_items/crunchy_chicken_burger.jpg",
    desc: "Crispy fried chicken patty, special mayo & toasted brioche bun"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  init3DShowcase();
  renderMenuPreview('all');
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
    rootMargin: '0px 0px -10px 0px'
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

// ── 3D Full Photo Stage Showcase ──────────────────────────────
function init3DShowcase() {
  const track = document.getElementById('showcase-items-track');
  const dotsContainer = document.getElementById('showcase-dots');
  if (!track) return;

  // Render Full Photo Cards with Pure Real Photos
  track.innerHTML = SHOWCASE_ITEMS_3D.map((item, idx) => `
    <div class="showcase-3d-item" id="showcase-item-${idx}" onclick="set3DIndex(${idx})">
      <div class="showcase-card-inner">
        <div class="showcase-card-img-wrap">
          <img src="${encodeURI(item.img)}" alt="${item.name}" loading="lazy" />
          <span class="card-bestseller-badge">BESTSELLER</span>
        </div>
      </div>
    </div>
  `).join('');

  // Render Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = SHOWCASE_ITEMS_3D.map((_, idx) => `
      <div class="showcase-dot ${idx === 0 ? 'active' : ''}" onclick="set3DIndex(${idx})"></div>
    `).join('');
  }

  update3DStage();
}

function update3DStage() {
  const total = SHOWCASE_ITEMS_3D.length;

  SHOWCASE_ITEMS_3D.forEach((_, idx) => {
    const el = document.getElementById(`showcase-item-${idx}`);
    if (!el) return;

    el.className = 'showcase-3d-item';

    if (idx === current3DIndex) {
      el.classList.add('active');
    } else if (idx === (current3DIndex - 1 + total) % total) {
      el.classList.add('prev');
    } else if (idx === (current3DIndex + 1) % total) {
      el.classList.add('next');
    } else if (idx < current3DIndex) {
      el.classList.add('hidden-left');
    } else {
      el.classList.add('hidden-right');
    }
  });

  // Update Dots
  document.querySelectorAll('.showcase-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === current3DIndex);
  });

  // Update Active Info Bar
  const infoBar = document.getElementById('showcase-info-bar');
  if (infoBar) {
    const activeItem = SHOWCASE_ITEMS_3D[current3DIndex];
    infoBar.innerHTML = `
      <h2 class="showcase-info-title">${activeItem.name}</h2>
      <div class="showcase-info-price">₹${activeItem.price}</div>
      <p style="font-size:0.92rem; color:var(--ink-soft); margin-bottom:14px;">${activeItem.desc}</p>
      <button class="showcase-info-btn" onclick="openOrderModal(); return false;">
        Order this item →
      </button>
    `;
  }
}

function move3DShowcase(direction) {
  if (isTransitioning) return;
  isTransitioning = true;
  setTimeout(() => { isTransitioning = false; }, 350);

  const total = SHOWCASE_ITEMS_3D.length;
  current3DIndex = (current3DIndex + direction + total) % total;
  update3DStage();
}

function set3DIndex(idx) {
  if (isTransitioning) return;
  isTransitioning = true;
  setTimeout(() => { isTransitioning = false; }, 350);

  current3DIndex = idx;
  update3DStage();
}

function start3DAutoSlide() {
  // Disabled as requested
}

function stop3DAutoSlide() {
  // Disabled as requested
}

function reset3DAutoSlide() {
  stop3DAutoSlide();
  start3DAutoSlide();
}

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

  let items = MENU_DATA;
  if (category !== 'all') {
    items = MENU_DATA.filter(i => i.category === category);
  } else {
    const featuredSet = new Set(FEATURED_IDS || [101, 102, 103, 105, 401, 601]);
    items = MENU_DATA.filter(i => featuredSet.has(i.id));
  }

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--ink-soft);">No items found in this category.</div>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="caffeine-item-card">
      <div class="card-img-wrap">
        ${item.image ? `<img src="${encodeURI(item.image)}" alt="${item.name}" loading="lazy" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-weight:700;color:var(--ink);">${item.name}</div>`}
        ${item.popular ? `<span class="card-bestseller-badge">BESTSELLER</span>` : ''}
      </div>

      <div>
        <div class="card-title-row">
          <h3 class="card-title">${item.name}</h3>
          <span class="card-price">₹${item.price}</span>
        </div>
        <p class="card-desc">${item.description}</p>
      </div>

      <button class="card-action-btn" onclick="openOrderModal(); return false;">
        Order Item
      </button>
    </div>
  `).join('');
}

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
