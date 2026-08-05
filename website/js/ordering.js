// ============================================================
//  Feranoz — Ordering System JS (Emoji-Free & Clean)
// ============================================================

let cart          = [];
let selectedTable = null;
let locationStatus = 'idle';
let userDistMeters = null;
let preSelectedTable = null;

let mobileOrderStep = 1; // 1 = Table selection, 2 = Menu list

// ── Open / Close Modal ────────────────────────────────────────
function openOrderModal(preTable) {
  if (preTable) preSelectedTable = preTable;

  const overlay = document.getElementById('order-overlay');
  if (!overlay) return;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  renderCategoryTabs();
  renderMenuItems('all');
  renderCart();
  renderTableGrid();

  if (preSelectedTable) {
    selectTable(preSelectedTable);
    mobileOrderStep = 2;
  } else if (selectedTable) {
    mobileOrderStep = 2;
  } else {
    mobileOrderStep = 1;
  }

  checkLocation();
  updateMobileOrderFlow();
}

function closeOrderModal() {
  const overlay = document.getElementById('order-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeOrderModal);

  const overlay = document.getElementById('order-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeOrderModal();
    });
  }

  const searchInput = document.getElementById('menu-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      renderMenuItems(activeCat, q);
    });
  }
});

// ── Geolocation Check ────────────────────────────────────────
function checkLocation() {
  const banner = document.getElementById('location-banner');
  if (!banner) return;

  setBanner('checking', 'Verifying location…');

  if (CAFE_CONFIG.testModeEnabled) {
    setTimeout(() => {
      setBanner('allowed', `Location Verified (Test Mode: ${CAFE_CONFIG.testLocationName || 'Secunderabad'})`);
      locationStatus = 'allowed';
      updatePlaceOrderBtn();
    }, 300);
    return;
  }

  if (!navigator.geolocation) {
    setBanner('allowed', 'Location check bypassed for testing.');
    locationStatus = 'allowed';
    updatePlaceOrderBtn();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const distBanjara = getDistanceMeters(pos.coords.latitude, pos.coords.longitude, CAFE_CONFIG.lat, CAFE_CONFIG.lng);
      const distTest = getDistanceMeters(pos.coords.latitude, pos.coords.longitude, CAFE_CONFIG.testLat, CAFE_CONFIG.testLng);

      const minDist = Math.min(distBanjara, distTest);
      userDistMeters = Math.round(minDist);

      if (minDist <= CAFE_CONFIG.radiusMeters || distTest <= 5000 || CAFE_CONFIG.testModeEnabled) {
        setBanner('allowed', `Location Verified! Ready to order.`);
        locationStatus = 'allowed';
      } else {
        const distText = minDist < 1000 ? `${Math.round(minDist)}m` : `${(minDist / 1000).toFixed(1)}km`;
        setBanner('denied', `You are ${distText} from cafe. <button onclick="enableTestMode()" style="background:#2C1810;color:#fff;border:none;padding:3px 10px;border-radius:50px;font-size:.75rem;cursor:pointer;margin-left:8px;">Enable Test Mode</button>`);
        locationStatus = 'denied';
      }
      updatePlaceOrderBtn();
    },
    err => {
      setBanner('allowed', `Location Check Bypassed (Testing Mode active).`);
      locationStatus = 'allowed';
      updatePlaceOrderBtn();
    },
    { timeout: 8000, enableHighAccuracy: true, maximumAge: 30000 }
  );
}

function enableTestMode() {
  CAFE_CONFIG.testModeEnabled = true;
  locationStatus = 'allowed';
  setBanner('allowed', 'Test Mode Enabled! You can place orders now.');
  updatePlaceOrderBtn();
}
window.enableTestMode = enableTestMode;

function setBanner(type, text) {
  const banner = document.getElementById('location-banner');
  if (!banner) return;
  banner.className = `${type}`;
  banner.innerHTML = text;
}

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function toRad(deg) { return deg * Math.PI / 180; }

// ── Category Tabs ─────────────────────────────────────────────
let activeCat = 'all';

function renderCategoryTabs() {
  const container = document.getElementById('category-tabs');
  if (!container || typeof CATEGORIES === 'undefined') return;

  container.innerHTML = CATEGORIES.map(cat => `
    <button class="cat-tab ${cat.id === activeCat ? 'active' : ''}"
            data-cat-id="${cat.id}"
            onclick="switchCategory('${cat.id}')">
      ${cat.label}
    </button>
  `).join('');

  enableTabsMouseSwipe(container);
}

function enableTabsMouseSwipe(bar) {
  if (bar.dataset.swipeEnabled) return;
  bar.dataset.swipeEnabled = 'true';

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

function switchCategory(catId) {
  activeCat = catId;
  document.querySelectorAll('.cat-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-cat-id') === catId);
  });
  renderMenuItems(catId, document.getElementById('menu-search')?.value || '');
}

// ── Menu Items Render ─────────────────────────────────────────
function renderMenuItems(catId = 'all', search = '') {
  const container = document.getElementById('menu-items-container');
  if (!container) return;

  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  let items = allItems;
  if (catId === 'bestseller') {
    items = allItems.filter(m => m.popular === true);
  } else if (catId !== 'all') {
    items = allItems.filter(m => m.category === catId);
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  }

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:30px;color:#6B5B52;">No items found matching search.</div>`;
    return;
  }

  container.innerHTML = items.map(item => {
    const cartItem = cart.find(c => c.id === item.id);
    const qty = cartItem ? cartItem.qty : 0;
    const inCart = qty > 0;
    const isAvailable = item.available !== false;

    const imgThumb = item.image
      ? `<div style="position:relative;flex-shrink:0;"><img src="${encodeURI(item.image)}" alt="${item.name}" style="width:52px;height:52px;border-radius:8px;object-fit:cover;display:block;${!isAvailable ? 'filter:grayscale(100%);opacity:0.6;' : ''}" /><span class="card-veg-badge ${item.isVeg ? 'veg' : 'non-veg'}" style="top:2px;left:2px;width:14px;height:14px;"></span></div>`
      : `<div style="position:relative;flex-shrink:0;width:52px;height:52px;border-radius:8px;background:#FAF7F2;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;color:#2C1810;"><span class="card-veg-badge ${item.isVeg ? 'veg' : 'non-veg'}" style="top:2px;left:2px;width:14px;height:14px;"></span>FRZ</div>`;

    return `
      <div class="menu-item-row ${inCart ? 'in-cart' : ''} ${!isAvailable ? 'item-unavailable' : ''}" id="menu-item-row-${item.id}" style="${!isAvailable ? 'opacity:0.65; background:#FAFAFA;' : ''}">
        ${imgThumb}
        <div class="menu-item-info">
          <div class="menu-item-name" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span>${item.name}</span>
            ${!isAvailable ? '<span class="badge-popular" style="background:#C62828;">UNAVAILABLE</span>' : (item.popular ? '<span class="badge-popular">BESTSELLER</span>' : '')}
          </div>
          <div class="menu-item-desc">${item.description}</div>
        </div>
        <div class="menu-item-right">
          <div class="menu-item-price">₹${item.price}</div>
          ${!isAvailable ? `
            <button class="btn-add-cart" disabled style="opacity:0.5; background:#8D6E63; cursor:not-allowed; padding:4px 10px; font-size:0.75rem;">Unavailable</button>
          ` : (inCart ? `
            <div class="qty-control">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
              <span class="qty-display">${qty}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
          ` : `
            <button class="btn-add-cart" onclick="addToCart(${item.id})">+ Add</button>
          `)}
        </div>
      </div>
    `;
  }).join('');
}

// ── Cart Operations ───────────────────────────────────────────
function addToCart(itemId) {
  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  const item = allItems.find(m => m.id === itemId);
  if (!item || item.available === false) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }

  renderMenuItems(activeCat, document.getElementById('menu-search')?.value || '');
  renderCart();
}

function updateQty(itemId, delta) {
  const idx = cart.findIndex(c => c.id === itemId);
  if (idx === -1) return;

  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);

  renderMenuItems(activeCat, document.getElementById('menu-search')?.value || '');
  renderCart();
}

function clearCart() {
  cart = [];
  renderMenuItems(activeCat, document.getElementById('menu-search')?.value || '');
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function renderCart() {
  const countBadge  = document.getElementById('cart-count-badge');
  const listEl      = document.getElementById('cart-items-list');
  const totalEl     = document.getElementById('cart-total');
  const countMobile = document.getElementById('mobile-cart-items-count');
  const priceMobile = document.getElementById('mobile-cart-total-price');
  const btnProceed  = document.getElementById('btn-proceed-step3');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartTotal();

  if (countBadge) countBadge.textContent = totalQty;
  if (countMobile) countMobile.textContent = `${totalQty} ${totalQty === 1 ? 'Item' : 'Items'}`;
  if (priceMobile) priceMobile.textContent = `₹${totalPrice}`;

  if (btnProceed) {
    btnProceed.disabled = totalQty === 0 || !selectedTable;
    btnProceed.textContent = totalQty > 0 ? `Proceed to Order (₹${totalPrice}) →` : 'Proceed to Order →';
  }

  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = `<div class="cart-empty"><p>Your cart is empty.<br>Add items from the menu!</p></div>`;
  } else {
    listEl.innerHTML = cart.map(item => `
      <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-top">
          <span class="cart-item-name">${item.name}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">✕</button>
        </div>
        <div class="cart-item-bottom">
          <div class="cart-item-qty">
            <button class="cart-qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
            <span class="cart-item-num">${item.qty}</span>
            <button class="cart-qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
          <span class="cart-item-price">₹${item.price * item.qty}</span>
        </div>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = `₹${totalPrice}`;
  updatePlaceOrderBtn();
}

function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  renderMenuItems(activeCat, document.getElementById('menu-search')?.value || '');
  renderCart();
}

// ── Table Selection ───────────────────────────────────────────
function renderTableGrid() {
  const grid = document.getElementById('table-grid');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: CAFE_CONFIG.totalTables }, (_, i) => {
    const num = i + 1;
    return `<button class="table-btn ${selectedTable === num ? 'selected' : ''}"
                    id="table-btn-${num}"
                    onclick="selectTable(${num})"
                    aria-label="Table ${num}">
              Table ${num}
            </button>`;
  }).join('');
}

function selectTable(num) {
  selectedTable = num;
  mobileOrderStep = 2; // Automatically proceed to Step 2 when table is selected on mobile
  document.querySelectorAll('.table-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i + 1 === num);
  });
  updatePlaceOrderBtn();
  updateMobileOrderFlow();
}

function resetTableSelectionMobile() {
  selectedTable = null;
  mobileOrderStep = 1;
  document.querySelectorAll('.table-btn').forEach(btn => btn.classList.remove('selected'));
  updatePlaceOrderBtn();
  updateMobileOrderFlow();
}

function updateMobileOrderFlow() {
  const isMobile = window.innerWidth <= 1024;
  const modalLeft = document.querySelector('.modal-left');
  const step1Box = document.getElementById('step-1-table-box');
  const step2Box = document.getElementById('step-2-menu-box');
  const step3Box = document.getElementById('step-3-checkout-box');
  const changeTableBtn = document.getElementById('btn-change-table');
  const step1Label = document.getElementById('step-1-label');
  const backBtn = document.getElementById('modal-back-step-btn');
  const stepTitle = document.getElementById('modal-step-title');

  if (!isMobile) {
    // Desktop View: Show all sections simultaneously
    if (modalLeft) modalLeft.style.display = 'flex';
    if (step1Box) step1Box.style.display = 'block';
    if (step2Box) step2Box.style.display = 'block';
    if (step3Box) step3Box.style.display = 'flex';
    if (changeTableBtn) changeTableBtn.style.display = 'none';
    if (step1Label) step1Label.textContent = '1. Select Your Table Number:';
    if (backBtn) backBtn.innerHTML = '← Back to Menu';
    if (stepTitle) stepTitle.textContent = 'Feranoz Table Ordering';
    return;
  }

  // Mobile 3-Step View (up to 1024px screen width)
  if (mobileOrderStep === 1 || !selectedTable) {
    // Step 1: Table Selection
    mobileOrderStep = 1;
    if (modalLeft) modalLeft.style.display = 'flex';
    if (step1Box) step1Box.style.display = 'block';
    if (step2Box) step2Box.style.display = 'none';
    if (step3Box) step3Box.style.display = 'none';
    if (changeTableBtn) changeTableBtn.style.display = 'none';
    if (step1Label) step1Label.textContent = '1. Select Your Table Number:';
    if (backBtn) backBtn.innerHTML = '← Exit to Site';
    if (stepTitle) stepTitle.textContent = 'Step 1: Pick Table';
  } else if (mobileOrderStep === 2) {
    // Step 2: Dish Selection & Search
    if (modalLeft) modalLeft.style.display = 'flex';
    if (step1Box) step1Box.style.display = 'block';
    if (step2Box) step2Box.style.display = 'block';
    if (step3Box) step3Box.style.display = 'none';
    if (changeTableBtn) changeTableBtn.style.display = 'inline-block';
    if (step1Label) step1Label.textContent = `✓ Table ${selectedTable} Selected`;
    if (backBtn) backBtn.innerHTML = '← Change Table';
    if (stepTitle) stepTitle.textContent = 'Step 2: Choose Dishes';
  } else if (mobileOrderStep === 3) {
    // Step 3: Final Order Place & Checkout (Hide modalLeft completely so checkout renders at top)
    if (modalLeft) modalLeft.style.display = 'none';
    if (step1Box) step1Box.style.display = 'none';
    if (step2Box) step2Box.style.display = 'none';
    if (step3Box) {
      step3Box.style.display = 'flex';
      step3Box.style.width = '100%';
    }
    if (backBtn) backBtn.innerHTML = '← Add More Items';
    if (stepTitle) stepTitle.textContent = `Step 3: Table ${selectedTable} Checkout`;
  }
}

function handleModalBackStep() {
  const isMobile = window.innerWidth <= 1024;
  if (!isMobile || mobileOrderStep === 1) {
    closeOrderModal();
  } else if (mobileOrderStep === 2) {
    resetTableSelectionMobile();
  } else if (mobileOrderStep === 3) {
    goToStep2Mobile();
  }
}

function goToStep2Mobile() {
  mobileOrderStep = 2;
  updateMobileOrderFlow();
  const body = document.querySelector('.modal-body');
  if (body) body.scrollTop = 0;
}

function goToStep3Mobile() {
  if (cart.length === 0 || !selectedTable) return;
  mobileOrderStep = 3;
  updateMobileOrderFlow();
  const body = document.querySelector('.modal-body');
  if (body) body.scrollTop = 0;
}

window.addEventListener('resize', updateMobileOrderFlow);

// ── Place Order Button State ───────────────────────────────────
function updatePlaceOrderBtn() {
  const btn = document.getElementById('btn-place-order');
  if (!btn) return;

  const canOrder = locationStatus === 'allowed' && cart.length > 0 && selectedTable !== null;
  btn.disabled = !canOrder;

  if (locationStatus === 'denied') {
    btn.textContent = 'Must be at Feranoz to order';
  } else if (cart.length === 0) {
    btn.textContent = 'Add items to order';
  } else if (!selectedTable) {
    btn.textContent = 'Select your table';
  } else {
    btn.innerHTML = `Place Order • ₹${cartTotal()}`;
  }
}

// ── Place Order ───────────────────────────────────────────────
function placeOrder() {
  if (locationStatus !== 'allowed' || cart.length === 0 || !selectedTable) return;

  const customerName = document.getElementById('customer-name')?.value.trim() || '';
  const customerPhone = document.getElementById('customer-phone')?.value.trim() || '';
  const specialNotes = document.getElementById('special-instructions')?.value.trim() || '';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const order = {
    id: generateOrderId(),
    tableNumber: selectedTable,
    items: [...cart],
    total: cartTotal(),
    customerName,
    customerPhone,
    specialNotes,
    status: 'new',
    timestamp: now.toISOString(),
    placedAt: `${dateStr}, ${timeStr}`,
  };

  saveOrder(order);
  showOrderConfirmation(order);

  cart = [];
  selectedTable = null;
  preSelectedTable = null;
  renderCart();
  renderTableGrid();
}

function generateOrderId() {
  return 'FRZ-' + Date.now().toString(36).toUpperCase().slice(-5);
}

function saveOrder(order) {
  const existing = JSON.parse(localStorage.getItem('feranoz_orders') || '[]');
  existing.unshift(order);
  if (existing.length > 200) existing.splice(200);
  localStorage.setItem('feranoz_orders', JSON.stringify(existing));

  try {
    const bc = new BroadcastChannel('feranoz_orders_channel');
    bc.postMessage({ type: 'NEW_ORDER', order });
    bc.close();
  } catch(e) {}
}

function showOrderConfirmation(order) {
  closeOrderModal();

  const overlay = document.getElementById('order-confirm-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="confirm-box">
      <h2>Order Confirmed!</h2>
      <p>Order #${order.id} for Table ${order.tableNumber} has been sent directly to the kitchen.</p>
      <div style="font-family:var(--font-mono);font-size:1.1rem;font-weight:700;color:#2C1810;margin-bottom:16px;">Total: ₹${order.total}</div>
      <button onclick="closeOrderConfirm()" class="btn-primary" style="width:100%;">Done</button>
    </div>
  `;
  overlay.classList.add('open');
}

function closeOrderConfirm() {
  const overlay = document.getElementById('order-confirm-overlay');
  if (overlay) overlay.classList.remove('open');
}
