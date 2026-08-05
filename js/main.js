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
    threshold: 0.12,
    rootMargin: '-30px 0px -30px 0px'
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

  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  let items = allItems;
  if (category !== 'all') {
    items = allItems.filter(i => i.category === category);
  } else {
    const featuredSet = new Set(FEATURED_IDS || [101, 102, 103, 105, 401, 601]);
    items = allItems.filter(i => featuredSet.has(i.id));
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
    }
  };
} catch(err) {}

window.addEventListener('storage', (e) => {
  if (e.key === 'feranoz_custom_menu') {
    renderMenuPreview();
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

