// ============================================================
//  Feranoz — Ordering System JS (Emoji-Free & Clean)
// ============================================================

let cart          = [];
let selectedTable = null;
let locationStatus = 'idle';
let userDistMeters = null;
let preSelectedTable = null;

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
  }

  checkLocation();
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
  banner.textContent = text;
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
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <button class="cat-tab ${cat.id === activeCat ? 'active' : ''}"
            onclick="switchCategory('${cat.id}')">
      ${cat.label}
    </button>
  `).join('');
}

function switchCategory(catId) {
  activeCat = catId;
  document.querySelectorAll('.cat-tab').forEach(t => {
    t.classList.toggle('active', t.textContent.trim() === (CATEGORIES.find(c => c.id === catId)?.label || ''));
  });
  renderMenuItems(catId, document.getElementById('menu-search')?.value || '');
}

// ── Menu Items Render ─────────────────────────────────────────
function renderMenuItems(catId = 'all', search = '') {
  const container = document.getElementById('menu-items-container');
  if (!container) return;

  let items = catId === 'all' ? MENU_DATA : MENU_DATA.filter(m => m.category === catId);

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

    const imgThumb = item.image
      ? `<img src="${encodeURI(item.image)}" alt="${item.name}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0;" />`
      : `<div style="width:48px;height:48px;border-radius:8px;background:#FAF7F2;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;color:#2C1810;flex-shrink:0;">FRZ</div>`;

    return `
      <div class="menu-item-row ${inCart ? 'in-cart' : ''}" id="menu-item-row-${item.id}">
        ${imgThumb}
        <div class="menu-item-info">
          <div class="menu-item-name">
            ${item.name}
            ${item.popular ? '<span class="badge-popular">BESTSELLER</span>' : ''}
            ${item.rating ? `<span style="font-size:.72rem;color:#C9A84C;font-weight:600;">(${item.rating})</span>` : ''}
          </div>
          <div class="menu-item-desc">${item.description}</div>
        </div>
        <div class="menu-item-right">
          <div class="menu-item-price">₹${item.price}</div>
          ${inCart ? `
            <div class="qty-control">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
              <span class="qty-display">${qty}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
          ` : `
            <button class="btn-add-cart" onclick="addToCart(${item.id})">+ Add</button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// ── Cart Operations ───────────────────────────────────────────
function addToCart(itemId) {
  const item = MENU_DATA.find(m => m.id === itemId);
  if (!item) return;

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

function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  renderMenuItems(activeCat, document.getElementById('menu-search')?.value || '');
  renderCart();
}

function clearCart() {
  cart = [];
  renderMenuItems(activeCat, '');
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}
function cartItemCount() {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

// ── Render Cart ───────────────────────────────────────────────
function renderCart() {
  const listEl   = document.getElementById('cart-items-list');
  const totalEl  = document.getElementById('cart-total');
  const countBadge = document.getElementById('cart-count-badge');

  if (countBadge) countBadge.textContent = cartItemCount();

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

  if (totalEl) totalEl.textContent = `₹${cartTotal()}`;
  updatePlaceOrderBtn();
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
              ${num}
            </button>`;
  }).join('');
}

function selectTable(num) {
  selectedTable = num;
  document.querySelectorAll('.table-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i + 1 === num);
  });
  updatePlaceOrderBtn();
}

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
  const specialNotes = document.getElementById('special-instructions')?.value.trim() || '';

  const order = {
    id: generateOrderId(),
    tableNumber: selectedTable,
    items: [...cart],
    total: cartTotal(),
    customerName,
    specialNotes,
    status: 'new',
    timestamp: new Date().toISOString(),
    placedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
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
