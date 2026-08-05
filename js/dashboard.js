// ============================================================
//  Feranoz Owner Dashboard — Live Sync, Passcode Auth & Audio Chime
// ============================================================

let orders = [];
let activeFilter = 'all';
const OWNER_PASSCODE = (typeof CAFE_CONFIG !== 'undefined' && CAFE_CONFIG.dashboardPassword) ? CAFE_CONFIG.dashboardPassword : "feranoz2024";

document.addEventListener('DOMContentLoaded', () => {
  checkAuthSession();
  loadOrders();
  initLiveSync();
});

// ── Passcode Protection Logic ───────────────────────────────
function checkAuthSession() {
  const isAuthed = sessionStorage.getItem('feranoz_owner_authed') === 'true';
  if (isAuthed) {
    revealDashboard();
  }
}

function verifyOwnerPasscode(event) {
  if (event) event.preventDefault();
  const inputEl = document.getElementById('owner-passcode-input');
  const errorEl = document.getElementById('auth-error-msg');
  if (!inputEl) return;

  const entered = inputEl.value.trim();
  if (entered === OWNER_PASSCODE) {
    sessionStorage.setItem('feranoz_owner_authed', 'true');
    revealDashboard();
  } else {
    if (errorEl) errorEl.textContent = 'Incorrect PIN, try again';
    inputEl.value = '';
    inputEl.focus();
  }
}

function logoutOwner() {
  sessionStorage.removeItem('feranoz_owner_authed');
  location.reload();
}

function revealDashboard() {
  const overlay = document.getElementById('auth-modal-overlay');
  const mainContent = document.getElementById('dashboard-main-content');
  if (overlay) overlay.style.display = 'none';
  if (mainContent) {
    mainContent.style.opacity = '1';
    mainContent.style.pointerEvents = 'all';
  }
}

// ── Web Audio Chime Sound Generator ──────────────────────────
function playChimeNotification() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.15);
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

// ── Load & Save Orders ────────────────────────────────────────
function loadOrders() {
  orders = JSON.parse(localStorage.getItem('feranoz_orders') || '[]');
  renderDashboard();
}

function saveOrders() {
  localStorage.setItem('feranoz_orders', JSON.stringify(orders));
  renderDashboard();
}

// ── Real-Time Sync Listeners ─────────────────────────────────
function initLiveSync() {
  try {
    const bc = new BroadcastChannel('feranoz_orders_channel');
    bc.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_ORDER') {
        playChimeNotification();
        loadOrders();
      }
    };
  } catch(e) {}

  window.addEventListener('storage', (e) => {
    if (e.key === 'feranoz_orders') {
      playChimeNotification();
      loadOrders();
    }
  });
}

// ── Dashboard Rendering ───────────────────────────────────────
function renderDashboard() {
  updateStats();
  renderOrdersGrid();
}

function updateStats() {
  const totalEl     = document.getElementById('stat-total-orders');
  const pendingEl   = document.getElementById('stat-pending-orders');
  const completedEl = document.getElementById('stat-completed-orders');
  const revenueEl   = document.getElementById('stat-total-revenue');

  const pending = orders.filter(o => o.status === 'new' || o.status === 'preparing').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0);

  if (totalEl) totalEl.textContent = orders.length;
  if (pendingEl) pendingEl.textContent = pending;
  if (completedEl) completedEl.textContent = completed;
  if (revenueEl) revenueEl.textContent = `₹${revenue}`;
}

function filterOrders(status, btnEl) {
  activeFilter = status;
  if (btnEl) {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderOrdersGrid();
}

function formatOrderDateTime(order) {
  if (order.timestamp) {
    const d = new Date(order.timestamp);
    if (!isNaN(d.getTime())) {
      const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${dateStr}, ${timeStr}`;
    }
  }
  return order.placedAt || 'Just now';
}

function renderOrdersGrid() {
  const container = document.getElementById('orders-grid');
  const countText = document.getElementById('order-count-text');
  if (!container) return;

  let filtered = orders;
  if (activeFilter === 'new') {
    filtered = orders.filter(o => o.status === 'new');
  } else if (activeFilter === 'preparing') {
    filtered = orders.filter(o => o.status === 'preparing');
  } else if (activeFilter === 'completed') {
    filtered = orders.filter(o => o.status === 'completed');
  }

  if (countText) {
    countText.textContent = `Showing ${filtered.length} of ${orders.length} orders`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; background:#FFFFFF; border:1px solid #EFEAE3; border-radius:var(--radius-lg);">
        <h3 style="font-family:var(--font-serif); color:var(--ink); margin-bottom:8px;">No orders found</h3>
        <p style="color:var(--ink-soft); font-size:0.9rem;">Customer table orders will appear here automatically in real time.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(order => `
    <div class="order-card ${order.status === 'new' ? 'new-order' : ''}" id="order-card-${order.id}">
      
      <!-- Card Header -->
      <div class="order-card-header">
        <div>
          <span class="table-badge">TABLE ${order.tableNumber || '?'}</span>
          <div class="order-id" style="margin-top:6px;">Order #${order.id}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:var(--ink);">${formatOrderDateTime(order)}</div>
          ${order.customerName ? `<div style="font-size:0.84rem; color:var(--ink-soft); font-weight:600; margin-top:2px;">Guest: ${order.customerName}</div>` : ''}
        </div>
      </div>

      <!-- PROMINENT ORDERED ITEMS LIST -->
      <div style="background:#FAF7F2; padding:14px 16px; border-radius:14px; border:1px solid #EFEAE3;">
        <div style="font-family:var(--font-mono); font-size:0.74rem; font-weight:700; color:var(--gold); text-transform:uppercase; margin-bottom:10px; letter-spacing:0.08em;">
          ORDERED ITEMS (${(order.items || []).reduce((s, i) => s + i.qty, 0)})
        </div>
        
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(order.items || []).map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:6px; border-bottom:1px dashed #E5DFD6;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:var(--ink); background:#EFEAE3; padding:2px 8px; border-radius:6px;">${item.qty}x</span>
                <span style="font-weight:600; font-size:0.92rem; color:var(--ink);">${item.name}</span>
              </div>
              <span style="font-family:var(--font-mono); font-weight:700; font-size:0.9rem; color:#6B3A2A;">₹${item.price * item.qty}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Special Notes -->
      ${order.specialNotes ? `
        <div style="font-size:0.82rem; background:#FFF8E1; padding:8px 12px; border-radius:8px; border-left:3px solid var(--gold); color:#5D4037;">
          <strong>Special Request:</strong> ${order.specialNotes}
        </div>
      ` : ''}

      <!-- Card Footer -->
      <div class="order-card-footer">
        <div>
          <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-soft); display:block; font-weight:700;">TOTAL AMOUNT</span>
          <span class="order-total-val">₹${order.total}</span>
        </div>

        <div class="order-actions">
          <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
            <option value="new" ${order.status === 'new' ? 'selected' : ''}>New Order</option>
            <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>

          <button onclick="printReceipt('${order.id}')" style="padding:6px 14px; border-radius:9999px; background:#FFFFFF; border:1px solid #EFEAE3; font-size:0.82rem; font-weight:600; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
            Print
          </button>
        </div>
      </div>

    </div>
  `).join('');
}

// ── Action Handlers ───────────────────────────────────────────
function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrders();
  }
}

function triggerTestOrder() {
  const sampleItems = [
    { name: 'Basque Cheesecake', price: 280, qty: 2 },
    { name: 'Belgian Hot Chocolate', price: 375, qty: 1 },
    { name: 'BBQ Chicken Pizza', price: 580, qty: 1 }
  ];
  const newOrder = {
    id: 'FRZ-' + Date.now().toString(36).toUpperCase().slice(-5),
    tableNumber: Math.floor(Math.random() * 10) + 1,
    items: sampleItems,
    total: 1515,
    customerName: 'Banjara Hills Guest',
    specialNotes: 'Extra hot chocolate topping',
    status: 'new',
    timestamp: new Date().toISOString(),
    placedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };

  orders.unshift(newOrder);
  saveOrders();
  playChimeNotification();
}

function clearAllOrders() {
  if (confirm('Are you sure you want to clear all orders?')) {
    orders = [];
    saveOrders();
  }
}

function printReceipt(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const win = window.open('', '_blank', 'width=400,height=600');
  win.document.write(`
    <html>
      <head>
        <title>Receipt #${order.id}</title>
        <style>
          body { font-family: monospace; padding: 20px; text-align: center; }
          .title { font-size: 1.4rem; font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 12px 0; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="title">FERANOZ CAFE</div>
        <div>Banjara Hills, Hyderabad</div>
        <div class="divider"></div>
        <div class="row"><span>Order ID:</span><span>#${order.id}</span></div>
        <div class="row"><span>Table:</span><span>Table ${order.tableNumber}</span></div>
        <div class="row"><span>Time:</span><span>${order.placedAt}</span></div>
        <div class="divider"></div>
        ${(order.items || []).map(i => `<div class="row"><span>${i.qty}x ${i.name}</span><span>₹${i.price * i.qty}</span></div>`).join('')}
        <div class="divider"></div>
        <div class="row" style="font-weight:bold; font-size:1.1rem;"><span>TOTAL:</span><span>₹${order.total}</span></div>
        <div class="divider"></div>
        <div>Thank you for visiting Feranoz!</div>
        <script>window.print(); setTimeout(() => window.close(), 1000);</script>
      </body>
    </html>
  `);
}

// ── Inline Owner Menu Management System ────────────────────────
let ownerActiveCat = 'all';
let ownerSearchQuery = '';

function showDashboardView(view) {
  const ordersSec = document.getElementById('view-orders-section');
  const menuSec = document.getElementById('view-menu-section');
  if (!ordersSec || !menuSec) return;

  if (view === 'menu') {
    ordersSec.style.display = 'none';
    menuSec.style.display = 'block';
    renderOwnerMenuCatTabs();
    renderOwnerMenuManagement();
  } else {
    menuSec.style.display = 'none';
    ordersSec.style.display = 'block';
  }
}

function renderOwnerMenuCatTabs() {
  const container = document.getElementById('owner-menu-cat-tabs');
  if (!container || typeof CATEGORIES === 'undefined') return;

  const activeCategories = typeof getMenuCategories === 'function' ? getMenuCategories() : CATEGORIES;

  container.innerHTML = activeCategories.map(cat => `
    <button class="filter-tab-btn ${cat.id === ownerActiveCat ? 'active' : ''}" 
            onclick="selectOwnerMenuCat('${cat.id}', this)">
      ${cat.label}
    </button>
  `).join('');
}

function selectOwnerMenuCat(catId, btnEl) {
  ownerActiveCat = catId;
  if (btnEl) {
    document.querySelectorAll('#owner-menu-cat-tabs .filter-tab-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderOwnerMenuManagement();
}

function filterOwnerMenu(query) {
  ownerSearchQuery = query;
  renderOwnerMenuManagement();
}

function renderOwnerMenuManagement() {
  const container = document.getElementById('owner-menu-grid');
  if (!container || typeof MENU_DATA === 'undefined') return;

  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  let filtered = allItems;

  if (ownerActiveCat !== 'all') {
    filtered = filtered.filter(i => i.category === ownerActiveCat);
  }

  if (ownerSearchQuery.trim()) {
    const q = ownerSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(i => i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:50px; background:#FFFFFF; border:1px solid #EFEAE3; border-radius:16px;">
        <h3 style="font-family:var(--font-serif); color:var(--ink);">No items found</h3>
        <p style="color:var(--ink-soft); font-size:0.9rem;">Try selecting a different category or search term.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isAvailable = item.available !== false;
    return `
      <div style="background:#FFFFFF; border:1px solid #EFEAE3; border-radius:14px; padding:10px 14px; display:flex; flex-direction:column; justify-content:space-between; gap:8px; box-shadow:0 3px 10px rgba(0,0,0,0.03); ${!isAvailable ? 'background:#FAF8F5; opacity:0.88;' : ''}">
        
        <div style="display:flex; gap:10px; align-items:flex-start;">
          <div style="width:50px; height:50px; border-radius:10px; overflow:hidden; background:#FAF7F2; flex-shrink:0; position:relative;">
            ${item.image ? `<img src="${encodeURI(item.image)}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-weight:700;color:var(--ink);font-size:0.75rem;">FRZ</div>`}
            <span class="card-veg-badge ${item.isVeg ? 'veg' : 'non-veg'}" style="top:2px; left:2px; width:12px; height:12px;"></span>
          </div>

          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
              <span style="font-family:var(--font-mono); font-size:0.65rem; font-weight:700; color:var(--gold); text-transform:uppercase;">${item.category}</span>
              <button onclick="toggleItemVeg(${item.id})" title="Click to toggle Veg/Non-Veg" style="border:none; background:transparent; cursor:pointer; font-size:0.75rem; padding:0;">
                ${item.isVeg ? '● Veg' : '▲ Non-Veg'}
              </button>
            </div>
            <div style="font-family:var(--font-serif); font-size:0.92rem; font-weight:700; color:var(--ink); margin:1px 0;">${item.name}</div>
            <div style="font-size:0.75rem; color:var(--ink-soft); line-height:1.2; max-height:2.4em; overflow:hidden; text-overflow:ellipsis;">${item.description || 'No description'}</div>
          </div>
        </div>

        <!-- CONTROLS ROW: STATIC PRICE, AVAILABILITY TOGGLE, EDIT & DELETE -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #EFEAE3; padding-top:8px; gap:6px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <div style="font-family:var(--font-mono); font-size:0.9rem; font-weight:700; color:#6B3A2A;">
              ₹${item.price}
            </div>
            ${item.popular ? `<span style="font-family:var(--font-mono); font-size:0.62rem; font-weight:700; background:#FFF8E1; color:#D84315; border:1px solid #FFE0B2; padding:2px 8px; border-radius:9999px; letter-spacing:0.04em;">⭐ BESTSELLER</span>` : ''}
          </div>

          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <button onclick="toggleItemAvailability(${item.id})" 
                    style="padding:4px 10px; border-radius:9999px; font-family:var(--font-sans); font-size:0.74rem; font-weight:700; border:none; cursor:pointer; transition:all 0.2s ease; ${isAvailable ? 'background:#E8F5E9; color:#2E7D32; border:1px solid #C8E6C9;' : 'background:#FFEBEE; color:#C62828; border:1px solid #FFCDD2;'}">
              ${isAvailable ? 'Available' : 'Unavailable'}
            </button>

            <button onclick="openEditItemModal(${item.id})" title="Edit full details & Bestseller tag"
                    style="padding:4px 10px; border-radius:9999px; font-family:var(--font-sans); font-size:0.74rem; font-weight:700; background:#E3F2FD; color:#1565C0; border:1px solid #BBDEFB; cursor:pointer; transition:all 0.2s ease;">
              Edit
            </button>

            <button onclick="deleteMenuItem(${item.id})" title="Delete item"
                    style="padding:4px 10px; border-radius:9999px; font-family:var(--font-sans); font-size:0.74rem; font-weight:700; background:#FFF3E0; color:#E65100; border:1px solid #FFE0B2; cursor:pointer; transition:all 0.2s ease;">
              Delete
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

// ── Item Actions: Toggle Availability, Update Price, Toggle Veg & Delete ──
function toggleItemAvailability(itemId) {
  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  const target = allItems.find(i => i.id === itemId);
  if (target) {
    target.available = target.available === false ? true : false;
    saveActiveMenuData(allItems);
    renderOwnerMenuManagement();
  }
}

function updateItemPrice(itemId, newPrice) {
  const priceVal = parseInt(newPrice, 10);
  if (isNaN(priceVal) || priceVal <= 0) return;
  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  const target = allItems.find(i => i.id === itemId);
  if (target) {
    target.price = priceVal;
    saveActiveMenuData(allItems);
  }
}

function toggleItemVeg(itemId) {
  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  const target = allItems.find(i => i.id === itemId);
  if (target) {
    target.isVeg = !target.isVeg;
    saveActiveMenuData(allItems);
    renderOwnerMenuManagement();
  }
}

function deleteMenuItem(itemId) {
  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  const target = allItems.find(i => i.id === itemId);
  if (!target) return;

  if (confirm(`Are you sure you want to delete "${target.name}" from the menu?`)) {
    const updated = allItems.filter(i => i.id !== itemId);
    saveActiveMenuData(updated);
    renderOwnerMenuCatTabs();
    renderOwnerMenuManagement();
  }
}

// ── Add New Item Modal Actions ────────────────────────────────
function openAddItemModal() {
  const overlay = document.getElementById('add-item-modal-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function closeAddItemModal() {
  const overlay = document.getElementById('add-item-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function submitNewMenuItem(event) {
  if (event) event.preventDefault();

  const nameEl = document.getElementById('new-item-name');
  const catEl  = document.getElementById('new-item-category');
  const priceEl = document.getElementById('new-item-price');
  const isVegEl = document.getElementById('new-item-isveg');
  const descEl  = document.getElementById('new-item-desc');
  const fileEl  = document.getElementById('new-item-image-file');

  if (!nameEl || !priceEl) return;

  const categoryVal = catEl ? catEl.value : 'desserts';
  const nameVal = nameEl.value.trim();

  function commitNewItem(imageDataUrl) {
    const newItem = {
      id: Date.now(),
      name: nameVal,
      category: categoryVal,
      price: parseInt(priceEl.value, 10) || 100,
      isVeg: isVegEl ? isVegEl.value === 'true' : true,
      description: descEl ? descEl.value.trim() : '',
      image: imageDataUrl || '',
      popular: false,
      available: true
    };

    const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
    allItems.unshift(newItem);
    saveActiveMenuData(allItems);

    closeAddItemModal();
    renderOwnerMenuCatTabs();
    renderOwnerMenuManagement();

    // Reset form
    nameEl.value = '';
    priceEl.value = '';
    if (descEl) descEl.value = '';
    if (fileEl) fileEl.value = '';
  }

  if (fileEl && fileEl.files && fileEl.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      commitNewItem(e.target.result);
    };
    reader.readAsDataURL(fileEl.files[0]);
  } else {
    commitNewItem('');
  }
}

// ── Edit Item Modal Actions ───────────────────────────────────
function openEditItemModal(itemId) {
  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const idEl      = document.getElementById('edit-item-id');
  const nameEl    = document.getElementById('edit-item-name');
  const catEl     = document.getElementById('edit-item-category');
  const priceEl   = document.getElementById('edit-item-price');
  const isVegEl   = document.getElementById('edit-item-isveg');
  const popEl     = document.getElementById('edit-item-popular');
  const availEl   = document.getElementById('edit-item-available');
  const descEl    = document.getElementById('edit-item-desc');
  const fileEl    = document.getElementById('edit-item-image-file');

  if (idEl) idEl.value = item.id;
  if (nameEl) nameEl.value = item.name;
  if (catEl) catEl.value = item.category;
  if (priceEl) priceEl.value = item.price;
  if (isVegEl) isVegEl.value = item.isVeg ? 'true' : 'false';
  if (popEl) popEl.value = item.popular ? 'true' : 'false';
  if (availEl) availEl.value = item.available !== false ? 'true' : 'false';
  if (descEl) descEl.value = item.description || '';
  if (fileEl) fileEl.value = '';

  const overlay = document.getElementById('edit-item-modal-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function closeEditItemModal() {
  const overlay = document.getElementById('edit-item-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function submitEditMenuItem(event) {
  if (event) event.preventDefault();

  const idEl      = document.getElementById('edit-item-id');
  const nameEl    = document.getElementById('edit-item-name');
  const catEl     = document.getElementById('edit-item-category');
  const priceEl   = document.getElementById('edit-item-price');
  const isVegEl   = document.getElementById('edit-item-isveg');
  const popEl     = document.getElementById('edit-item-popular');
  const availEl   = document.getElementById('edit-item-available');
  const descEl    = document.getElementById('edit-item-desc');
  const fileEl    = document.getElementById('edit-item-image-file');

  if (!idEl || !idEl.value) return;

  const itemId = parseInt(idEl.value, 10);
  const allItems = typeof getActiveMenuData === 'function' ? getActiveMenuData() : MENU_DATA;
  const target = allItems.find(i => i.id === itemId);
  if (!target) return;

  function commitEdit(imageDataUrl) {
    if (nameEl) target.name = nameEl.value.trim();
    if (catEl) target.category = catEl.value;
    if (priceEl) target.price = parseInt(priceEl.value, 10) || target.price;
    if (isVegEl) target.isVeg = isVegEl.value === 'true';
    if (popEl) target.popular = popEl.value === 'true';
    if (availEl) target.available = availEl.value === 'true';
    if (descEl) target.description = descEl.value.trim();
    if (imageDataUrl) target.image = imageDataUrl;

    saveActiveMenuData(allItems);
    closeEditItemModal();
    renderOwnerMenuCatTabs();
    renderOwnerMenuManagement();
  }

  if (fileEl && fileEl.files && fileEl.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      commitEdit(e.target.result);
    };
    reader.readAsDataURL(fileEl.files[0]);
  } else {
    commitEdit(null);
  }
}
