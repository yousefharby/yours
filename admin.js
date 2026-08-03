// ============================================
// YOURS Admin v5 – Full Admin Logic
// ============================================

const ADMIN_PASS = ['admin', 'ادمن', 'Admin', 'mona', 'Mona', 'MONA'];
let allOrders = [];
let editingProductId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setInterval(() => {
    const d = document.getElementById('admin-date');
    if (d) d.textContent = new Date().toLocaleString('ar-EG');
  }, 1000);
});

// ===== AUTH =====
function checkAuth() {
  // فتح الداشبورد مباشرة بدون login
  localStorage.setItem('yours_admin_auth', '1');
  showDashboard();
}
function showLogin() {
  document.getElementById('login-wrap').style.display = 'flex';
  document.getElementById('admin-wrap').style.display = 'none';
}
function showDashboard() {
  document.getElementById('login-wrap').style.display = 'none';
  document.getElementById('admin-wrap').style.display = 'grid';
  loadDashboard();
}
function doLogin() {
  localStorage.setItem('yours_admin_auth', '1');
  showDashboard();
}
function doLogout() {
  showDashboard();
}

// ===== DASHBOARD LOAD =====
async function loadDashboard() {
  // Load from localStorage first (instant)
  allOrders = JSON.parse(localStorage.getItem('yours_orders') || '[]');
  updateStats();
  renderOrdersTable(allOrders);
  renderProductsAdmin();
  renderCollectionsAdmin();
  renderStatsTab();
  loadAdminTheme();
  showTab('orders', document.querySelector('.nav-item'));

  // Then sync from Firestore (cloud)
  try {
    if (window._firebaseDB && window._firebaseLib) {
      const { collection, query, orderBy, onSnapshot } = window._firebaseLib;
      const q = query(collection(window._firebaseDB, 'orders'), orderBy('date', 'desc'));
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;
      const firestoreOrders = snapshot.docs.map(d => ({ ...d.data(), _docId: d.id }));
      const localIds = new Set(allOrders.map(o => o.id));
      firestoreOrders.forEach(fo => {
        if (!localIds.has(fo.id)) allOrders.unshift(fo);
        else {
          const idx = allOrders.findIndex(o => o.id === fo.id);
          if (idx !== -1) allOrders[idx] = { ...allOrders[idx], ...fo };
        }
      });
      allOrders.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
      localStorage.setItem('yours_orders', JSON.stringify(allOrders));
      updateStats();
      renderOrdersTable(allOrders);
      renderStatsTab();
    });
    }
  } catch (err) {
    console.warn('Firestore sync failed, using localStorage:', err);
  }
}

// ===== STATS =====
function updateStats() {
  const total = allOrders.length;
  const newOrders = allOrders.filter(o => o.status === 'جديد').length;
  const revenue = allOrders.filter(o => o.status !== 'ملغي').reduce((s, o) => s + (o.total || 0), 0);
  const completed = allOrders.filter(o => o.status === 'مكتمل').length;
  document.getElementById('stat-total-orders').textContent = total;
  document.getElementById('stat-new-orders').textContent = newOrders;
  document.getElementById('stat-revenue').textContent = revenue.toLocaleString() + ' ج';
  document.getElementById('stat-completed').textContent = completed;
}

// ===== TABS =====
function showTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + name)?.classList.add('active');
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const titles = {
    orders: ['الطلبات', 'إدارة ومتابعة الطلبات الواردة'],
    products: ['المنتجات', 'عرض وإدارة المنتجات'],
    'add-product': ['إضافة / تعديل منتج', 'أضيفي أو عدلي منتجاً'],
    collections: ['المجموعات', 'تعديل أسعار المجموعات'],
    stats: ['الإحصائيات', 'تقارير المبيعات والأداء'],
    theme: ['إعدادات الثيم', 'تغيير ثيم الموقع للزوار'],
  };
  const info = titles[name] || ['لوحة الإدارة', ''];
  document.getElementById('tab-title').textContent = info[0];
  document.getElementById('tab-sub').textContent = info[1];
  if (name === 'stats') renderStatsTab();
  if (name === 'products') renderProductsAdmin();
  if (name === 'collections') renderCollectionsAdmin();
}

// ===== ORDERS TABLE =====
function renderOrdersTable(orders) {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#555">لا توجد طلبات بعد</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(o => {
    const items = (o.items || []).map(i => `${i.name} ×${i.qty}`).join(', ');
    const statusClass = {
      'جديد': 'status-new', 'قيد التجهيز': 'status-processing',
      'تم الشحن': 'status-shipped', 'مكتمل': 'status-done', 'ملغي': 'status-cancelled'
    }[o.status] || 'status-new';
    return `<tr>
      <td style="font-family:monospace;font-size:12px">${o.id}</td>
      <td>${o.name || '—'}</td>
      <td dir="ltr">${o.phone || '—'}</td>
      <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${items}</td>
      <td style="color:var(--gold);font-weight:700">${(o.total||0).toLocaleString()} ج</td>
      <td>${o.date || '—'}</td>
      <td><span class="status-badge ${statusClass}">${o.status || 'جديد'}</span></td>
      <td>
        <button class="action-btn" onclick="viewOrder('${o.id}')">عرض</button>
        <select class="admin-select" style="font-size:11px;padding:4px 8px;border-radius:8px" onchange="updateOrderStatus('${o.id}',this.value)">
          <option ${o.status==='جديد'?'selected':''}>جديد</option>
          <option ${o.status==='قيد التجهيز'?'selected':''}>قيد التجهيز</option>
          <option ${o.status==='تم الشحن'?'selected':''}>تم الشحن</option>
          <option ${o.status==='مكتمل'?'selected':''}>مكتمل</option>
          <option ${o.status==='ملغي'?'selected':''}>ملغي</option>
        </select>
        <button class="action-btn danger" onclick="deleteOrder('${o.id}')">حذف</button>
      </td>
    </tr>`;
  }).join('');
}

function filterOrders(q) {
  const filtered = allOrders.filter(o =>
    (o.name||'').includes(q) || (o.id||'').includes(q) || (o.phone||'').includes(q)
  );
  renderOrdersTable(filtered);
}
function filterByStatus(status) {
  const filtered = status ? allOrders.filter(o => o.status === status) : allOrders;
  renderOrdersTable(filtered);
}
async function updateOrderStatus(id, status) {
  const idx = allOrders.findIndex(o => o.id === id);
  if (idx !== -1) {
    allOrders[idx].status = status;
    localStorage.setItem('yours_orders', JSON.stringify(allOrders));
    updateStats();
    // Sync to Firestore
    try {
      if (window._firebaseDB && window._firebaseLib) {
        const { collection, getDocs, doc, updateDoc } = window._firebaseLib;
        const snap = await getDocs(collection(window._firebaseDB, 'orders'));
        const docRef = snap.docs.find(d => d.data().id === id);
        if (docRef) await updateDoc(doc(window._firebaseDB, 'orders', docRef.id), { status });
      }
    } catch (err) { console.warn('Firestore status update failed:', err); }
  }
}
async function deleteOrder(id) {
  if (!confirm('حذف هذا الطلب نهائياً؟')) return;
  allOrders = allOrders.filter(o => o.id !== id);
  localStorage.setItem('yours_orders', JSON.stringify(allOrders));
  renderOrdersTable(allOrders);
  updateStats();
  // Sync to Firestore
  try {
    if (window._firebaseDB && window._firebaseLib) {
      const { collection, getDocs, doc, deleteDoc } = window._firebaseLib;
      const snap = await getDocs(collection(window._firebaseDB, 'orders'));
      const docRef = snap.docs.find(d => d.data().id === id);
      if (docRef) await deleteDoc(doc(window._firebaseDB, 'orders', docRef.id));
    }
  } catch (err) { console.warn('Firestore delete failed:', err); }
}
function viewOrder(id) {
  const o = allOrders.find(x => x.id === id);
  if (!o) return;
  const items = (o.items || []).map(i => `<div class="order-detail-row"><span>${i.name} ×${i.qty}</span><span>${(i.price * i.qty)} ج</span></div>`).join('');
  document.getElementById('order-modal-content').innerHTML = `
    <h2 style="color:var(--gold);font-size:20px;margin-bottom:18px">تفاصيل الطلب</h2>
    <div class="order-detail-row"><span>رقم الطلب</span><span style="font-family:monospace">${o.id}</span></div>
    <div class="order-detail-row"><span>الاسم</span><span>${o.name}</span></div>
    <div class="order-detail-row"><span>الموبايل</span><span dir="ltr">${o.phone}</span></div>
    <div class="order-detail-row"><span>المحافظة</span><span>${o.gov||'—'}</span></div>
    <div class="order-detail-row"><span>العنوان</span><span>${o.address||'—'}</span></div>
    <div class="order-detail-row"><span>طريقة الشحن</span><span>${o.delivery?.label||'عادي'}</span></div>
    <div class="order-detail-row"><span>طريقة الدفع</span><span>${o.payment||'—'}</span></div>
    <div class="order-detail-row"><span>تغليف هدية</span><span>${o.giftWrap?'نعم':'لا'}</span></div>
    <div class="order-detail-row"><span>ملاحظات</span><span>${o.notes||'—'}</span></div>
    <div style="border-top:1px solid var(--border);margin:14px 0 10px"></div>
    ${items}
    <div class="order-detail-row" style="font-size:16px;font-weight:700"><span>الإجمالي</span><span style="color:var(--gold)">${o.total} ج</span></div>
    <div class="order-detail-row"><span>الحالة</span><span>${o.status}</span></div>
    <a href="https://wa.me/${o.phone?.replace(/^0/,'2')}?text=${encodeURIComponent(`مرحباً ${o.name}، طلبك رقم ${o.id} في YOURS`)}" target="_blank" class="btn-gold-admin" style="display:block;text-align:center;margin-top:18px">تواصل واتساب</a>`;
  document.getElementById('order-modal').style.display = 'flex';
}
function closeOrderModal() {
  document.getElementById('order-modal').style.display = 'none';
}

function exportOrders() {
  const headers = ['رقم الطلب', 'الاسم', 'الموبايل', 'المحافظة', 'العنوان', 'الإجمالي', 'الشحن', 'الدفع', 'الحالة', 'التاريخ'];
  const rows = allOrders.map(o => [
    o.id, o.name, o.phone, o.gov, o.address, o.total,
    o.delivery?.label || 'عادي', o.payment, o.status, o.date
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c||''}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `yours_orders_${Date.now()}.csv`; a.click();
}

// ===== PRODUCTS ADMIN =====
function renderProductsAdmin() {
  const grid = document.getElementById('products-admin-grid');
  if (!grid) return;
  const override = localStorage.getItem('yours_products_override');
  const products = override ? JSON.parse(override) : (window.YOURS_PRODUCTS || []);
  if (!products.length) { grid.innerHTML = '<p style="color:var(--text-muted);padding:20px">لا توجد منتجات بعد</p>'; return; }
  grid.innerHTML = products.map(p => `
    <div class="product-admin-card">
      <img src="${p.image}" alt="${p.nameAr}" class="product-admin-img" onerror="this.src='images/logo.jpg'"/>
      <div class="product-admin-body">
        <h4>${p.nameAr}</h4>
        <div class="price-row">
          <span class="new">${p.price} ج</span>
          ${p.oldPrice ? `<span class="old">${p.oldPrice} ج</span>` : ''}
        </div>
        <div class="product-admin-actions">
          <button class="edit-btn" onclick="editProduct('${p.id}')">تعديل</button>
          <button class="del-btn" onclick="deleteProduct('${p.id}')">حذف</button>
        </div>
      </div>
    </div>`).join('');
}

// ===== IMAGE UPLOAD PREVIEW =====
function previewProductImage(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    document.getElementById('p-image').value = base64;
    const preview = document.getElementById('p-image-preview');
    if (preview) { preview.src = base64; preview.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
}

function editProduct(id) {
  const override = localStorage.getItem('yours_products_override');
  const products = override ? JSON.parse(override) : (window.YOURS_PRODUCTS || []);
  const p = products.find(x => x.id === id);
  if (!p) return;
  editingProductId = id;
  document.getElementById('p-name-ar').value = p.nameAr || '';
  document.getElementById('p-name-en').value = p.nameEn || '';
  document.getElementById('p-desc-ar').value = p.descAr || '';
  document.getElementById('p-desc-en').value = p.descEn || '';
  document.getElementById('p-size').value = p.size || '';
  document.getElementById('p-category').value = p.category || 'shampoo';
  document.getElementById('p-price').value = p.price || '';
  document.getElementById('p-old-price').value = p.oldPrice || '';
  document.getElementById('p-image').value = p.image || '';
  document.getElementById('p-tag').value = p.tag || '';
  document.getElementById('p-sold-alone').value = p.soldAlone ? 'true' : 'false';
  document.getElementById('p-image').value = p.image || '';
  const preview = document.getElementById('p-image-preview');
  if (preview && p.image) { preview.src = p.image; preview.style.display = 'block'; }
  showTab('add-product', document.querySelector('[onclick*="add-product"]'));
}

function deleteProduct(id) {
  if (!confirm('حذف هذا المنتج نهائياً؟')) return;
  const override = localStorage.getItem('yours_products_override');
  let products = override ? JSON.parse(override) : JSON.parse(JSON.stringify(window.YOURS_PRODUCTS || []));
  products = products.filter(p => p.id !== id);
  localStorage.setItem('yours_products_override', JSON.stringify(products));
  renderProductsAdmin();
}

async function saveProduct() {
  const nameAr = document.getElementById('p-name-ar').value.trim();
  const nameEn = document.getElementById('p-name-en').value.trim();
  if (!nameAr) { document.getElementById('product-save-msg').textContent = '⚠ الاسم مطلوب'; return; }

  const override = localStorage.getItem('yours_products_override');
  let products = override ? JSON.parse(override) : JSON.parse(JSON.stringify(window.YOURS_PRODUCTS || []));

  const newProduct = {
    id: editingProductId || 'prod_' + Date.now(),
    nameAr, nameEn,
    descAr: document.getElementById('p-desc-ar').value.trim(),
    descEn: document.getElementById('p-desc-en').value.trim(),
    size: document.getElementById('p-size').value.trim(),
    category: document.getElementById('p-category').value,
    price: parseFloat(document.getElementById('p-price').value) || 0,
    oldPrice: parseFloat(document.getElementById('p-old-price').value) || null,
    image: document.getElementById('p-image').value.trim() || 'images/logo.jpg',
    tag: document.getElementById('p-tag').value.trim() || null,
    soldAlone: document.getElementById('p-sold-alone').value === 'true',
    inCollection: [],
  };

  if (editingProductId) {
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx !== -1) products[idx] = newProduct;
  } else {
    products.push(newProduct);
  }

  localStorage.setItem('yours_products_override', JSON.stringify(products));
  window.YOURS_PRODUCTS = products;
  editingProductId = null;

  // Save to Firestore
  try {
    if (window._firebaseDB && window._firebaseLib) {
      const { doc, setDoc } = window._firebaseLib;
      await setDoc(doc(window._firebaseDB, 'siteSettings', 'products'), { list: products });
    }
  } catch(err) { console.warn('Firestore products save failed:', err); }

  // Reset form
  ['p-name-ar','p-name-en','p-desc-ar','p-desc-en','p-size','p-price','p-old-price','p-image','p-tag'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('p-sold-alone').value = 'true';
  const preview = document.getElementById('p-image-preview');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  const fileInput = document.getElementById('p-image-file');
  if (fileInput) fileInput.value = '';

  const msg = document.getElementById('product-save-msg');
  msg.textContent = '✓ تم الحفظ بنجاح!';
  msg.style.color = '#4CAF50';
  setTimeout(() => msg.textContent = '', 3000);
  renderProductsAdmin();
}

// ===== COLLECTIONS ADMIN =====
function renderCollectionsAdmin() {
  const grid = document.getElementById('collections-admin-grid');
  if (!grid) return;
  const overrides = JSON.parse(localStorage.getItem('yours_col_overrides') || '{}');
  const cols = window.YOURS_COLLECTIONS || {};
  grid.innerHTML = Object.entries(cols).map(([id, col]) => {
    const curPrice = overrides[id]?.price ?? col.price;
    const curOld = overrides[id]?.oldPrice ?? col.oldPrice;
    return `
    <div class="col-admin-card">
      <h3>${col.nameAr}</h3>
      <p>${col.descAr}</p>
      <div class="price-edit-row">
        <label>السعر الحالي (ج)</label>
        <input type="number" class="price-edit-input" id="col-price-${id}" value="${curPrice}"/>
      </div>
      <div class="price-edit-row">
        <label>السعر القديم (ج)</label>
        <input type="number" class="price-edit-input" id="col-oldprice-${id}" value="${curOld}"/>
      </div>
      <button class="btn-gold-admin sm" onclick="saveCollectionPrice('${id}')">💾 حفظ السعر</button>
      <p class="save-msg" id="col-msg-${id}"></p>
    </div>`;
  }).join('');
}

function saveCollectionPrice(id) {
  const price = parseFloat(document.getElementById(`col-price-${id}`)?.value);
  const oldPrice = parseFloat(document.getElementById(`col-oldprice-${id}`)?.value);
  if (isNaN(price)) { alert('رقم غير صحيح'); return; }
  const overrides = JSON.parse(localStorage.getItem('yours_col_overrides') || '{}');
  overrides[id] = { price, oldPrice };
  localStorage.setItem('yours_col_overrides', JSON.stringify(overrides));
  if (window.YOURS_COLLECTIONS?.[id]) {
    window.YOURS_COLLECTIONS[id].price = price;
    window.YOURS_COLLECTIONS[id].oldPrice = oldPrice;
  }
  const msg = document.getElementById(`col-msg-${id}`);
  if (msg) { msg.textContent = '✓ تم الحفظ!'; setTimeout(() => msg.textContent = '', 2500); }
}

// ===== THEME TAB (Admin controls user theme) =====
async function loadAdminTheme() {
  const tab = document.getElementById('theme-admin-content') || document.getElementById('tab-theme');
  if (!tab) return;

  // اقرأ الثيم من Firebase أولاً عشان يكون متزامن
  let current = localStorage.getItem('yours_theme_user') || 'rosegold';
  try {
    if (window._firebaseDB && window._firebaseLib) {
      const { doc, getDoc } = window._firebaseLib;
      const snap = await getDoc(doc(window._firebaseDB, 'siteSettings', 'theme'));
      if (snap.exists() && snap.data().name) {
        current = snap.data().name;
        localStorage.setItem('yours_theme_user', current);
        localStorage.setItem('yours_theme', current);
      }
    }
  } catch (err) { /* استخدم localStorage كـ fallback */ }
  const THEMES = [
    { id:'rosegold', name:'Rose Gold', desc:'ثيم روز جولد الافتراضي – فاتح وأنثوي', colors:['#FDF6F4','#B5777A','#2D1F1F'] },
    { id:'dark',     name:'Dark Gold', desc:'الكلاسيكي الداكن – أسود وذهبي', colors:['#0A0A0A','#C9A84C','#1E1E1E'] },
    { id:'champagne',name:'Champagne', desc:'شامبانيا فاتح – ذهبي دافئ', colors:['#F8F6F2','#C9A45A','#FFFFFF'] },
    { id:'quiet',    name:'Quiet Lux', desc:'بيج هادئ – هادئ وراقي', colors:['#EDE9E3','#B88A3B','#2A2A2A'] },
    { id:'spa',      name:'Spa Green', desc:'أخضر طبيعي – منعش', colors:['#F0F4F2','#6E7D4F','#1E2E24'] },
  ];
  tab.innerHTML = `
    <div style="max-width:700px">
      <div class="form-card">
        <h3>🎨 ثيم الموقع</h3>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px">اختاري الثيم الذي سيظهر لجميع الزوار. التغيير فوري.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
          ${THEMES.map(t => `
            <div onclick="applyUserTheme('${t.id}')" style="background:var(--black-card);border:2px solid ${t.id===current?'var(--gold)':'var(--border)'};border-radius:14px;padding:18px;cursor:pointer;transition:0.3s;text-align:center" id="admin-theme-${t.id}">
              <div style="display:flex;justify-content:center;gap:6px;margin-bottom:12px">
                ${t.colors.map(c=>`<span style="width:24px;height:24px;border-radius:50%;background:${c};border:1px solid rgba(128,128,128,0.2);display:inline-block"></span>`).join('')}
              </div>
              <div style="font-weight:700;color:var(--white);margin-bottom:4px">${t.name}</div>
              <div style="font-size:11px;color:var(--text-muted)">${t.desc}</div>
              ${t.id===current?'<div style="margin-top:8px;font-size:11px;color:var(--gold);font-weight:700">✓ مفعّل</div>':''}
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

async function applyUserTheme(id) {
  localStorage.setItem('yours_theme_user', id);
  localStorage.setItem('yours_theme', id);
  loadAdminTheme();

  // حفظ الثيم في Firebase عشان يظهر على كل الأجهزة
  try {
    if (window._firebaseDB && window._firebaseLib) {
      const { doc, setDoc } = window._firebaseLib;
      await setDoc(doc(window._firebaseDB, 'siteSettings', 'theme'), {
        name: id,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Firebase theme save failed:', err);
  }

  const msg = document.createElement('div');
  msg.textContent = '✓ تم تغيير ثيم الموقع للزوار!';
  msg.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--gold);color:#000;padding:10px 24px;border-radius:50px;font-weight:700;font-size:13px;z-index:9999';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2500);
}

// ===== STATS TAB =====
function renderStatsTab() {
  const topEl = document.getElementById('top-products-list');
  if (!topEl) return;
  const orders = JSON.parse(localStorage.getItem('yours_orders') || '[]');
  const productCounts = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      productCounts[item.name] = (productCounts[item.name] || 0) + (item.qty || 1);
    });
  });
  const sorted = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (!sorted.length) {
    topEl.innerHTML = '<p style="color:var(--text-muted);padding:20px 0">لا توجد بيانات بعد</p>';
    return;
  }
  topEl.innerHTML = sorted.map(([name, qty]) => `
    <div class="top-product-item">
      <div style="width:44px;height:44px;border-radius:50%;background:rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📦</div>
      <h4>${name}</h4>
      <span>${qty} مبيعاً</span>
    </div>`).join('');

  // Simple daily revenue chart using canvas
  const canvas = document.getElementById('chart-daily');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const days = {};
  orders.forEach(o => {
    const d = o.date || 'غير محدد';
    days[d] = (days[d] || 0) + (o.total || 0);
  });
  const labels = Object.keys(days).slice(-7);
  const values = labels.map(l => days[l]);
  const max = Math.max(...values, 1);
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const barW = Math.floor((W - 60) / Math.max(labels.length, 1)) - 10;
  labels.forEach((label, i) => {
    const barH = Math.floor((values[i] / max) * (H - 50));
    const x = 30 + i * (barW + 10);
    const y = H - barH - 30;
    // Bar gradient
    const grad = ctx.createLinearGradient(0, y, 0, H - 30);
    grad.addColorStop(0, '#C9A84C');
    grad.addColorStop(1, 'rgba(201,168,76,0.2)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();
    // Value label
    ctx.fillStyle = '#C9A84C';
    ctx.font = '10px Cairo';
    ctx.textAlign = 'center';
    ctx.fillText(values[i] + ' ج', x + barW / 2, y - 5);
    // Date label
    ctx.fillStyle = '#888';
    ctx.fillText(label.slice(0, 6), x + barW / 2, H - 10);
  });
}

// end of admin.js
