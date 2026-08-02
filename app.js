// ============================================
// YOURS – App Logic v5 (Full Language + Checkout)
// ============================================

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('yours_cart') || '[]');
let currentLang = localStorage.getItem('yours_lang') || 'ar';
let currentTheme = localStorage.getItem('yours_theme') || 'rosegold';
let heroIndex = 0, heroTimer;
let selectedDelivery = { type: 'standard', price: 35, label: '2-4 أيام' };
let selectedPayment = 'cash';
let currentOrderNum = '';
let checkoutStep = 1;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLang(currentLang);
  renderCollections();
  renderProducts();
  updateCart();
  startHeroAuto();
  initReveal();
  startTimer();
  animateLiveStats();
  initThemePanel();
  setTimeout(showVWPopup, 2800);
  applyStoredOverrides();
});

// ===== THEME =====
const THEMES = [
  { id:'rosegold', name:'Rose Gold', sub:'الثيم الافتراضي', colors:['#FDF6F4','#B5777A','#2D1F1F'] },
  { id:'dark',     name:'Dark Gold', sub:'الكلاسيكي الداكن', colors:['#0A0A0A','#C9A84C','#1E1E1E'] },
  { id:'champagne',name:'Champagne', sub:'شامبانيا فاتح',   colors:['#F8F6F2','#C9A45A','#2D2D2D'] },
  { id:'quiet',    name:'Quiet Lux', sub:'بيج هادئ',        colors:['#EDE9E3','#B88A3B','#2A2A2A'] },
  { id:'spa',      name:'Spa Green', sub:'أخضر طبيعي',      colors:['#F0F4F2','#6E7D4F','#1E2E24'] },
];

function initThemePanel() {
  const panel = document.getElementById('theme-panel');
  if (!panel) return;
  panel.innerHTML = `<div class="theme-panel-title">اختاري الثيم</div><div class="theme-options">` +
    THEMES.map(t => `
      <div class="theme-option ${t.id===currentTheme?'active':''}" onclick="applyTheme('${t.id}')">
        <div class="theme-swatch">${t.colors.map(c=>`<span style="background:${c}"></span>`).join('')}</div>
        <div><div class="theme-option-name">${t.name}</div><div class="theme-option-sub">${t.sub}</div></div>
      </div>`).join('') + `</div>`;
}

function applyTheme(id) {
  currentTheme = id;
  document.documentElement.setAttribute('data-theme', id);
  localStorage.setItem('yours_theme', id);
  // Save for user-side (admin can change it)
  localStorage.setItem('yours_theme_user', id);
  document.querySelectorAll('.theme-option').forEach(el => {
    el.classList.toggle('active', el.getAttribute('onclick').includes(`'${id}'`));
  });
}

function toggleThemePanel() {
  document.getElementById('theme-panel')?.classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.theme-toggle-btn') && !e.target.closest('.theme-panel')) {
    document.getElementById('theme-panel')?.classList.remove('open');
  }
});

// ===== LANGUAGE =====
function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('yours_lang', lang);
  applyLang(lang);
}

function applyLang(lang) {
  const isAr = lang === 'ar';
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

  // Switch all data-ar / data-en elements
  document.querySelectorAll('[data-ar]').forEach(el => {
    const val = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (val !== null) {
      if (el.tagName === 'INPUT') el.placeholder = val;
      else el.innerHTML = val;
    }
  });

  // UGC title special case (contains HTML)
  const ugcTitle = document.getElementById('ugc-title');
  if (ugcTitle) {
    ugcTitle.innerHTML = isAr
      ? 'النتيجة تتكلم عن <span>نفسها</span>'
      : 'Results Speak <span>for Themselves</span>';
  }

  // Active lang button
  document.getElementById('btn-ar')?.classList.toggle('active', isAr);
  document.getElementById('btn-en')?.classList.toggle('active', !isAr);

  // Re-render dynamic content with new lang
  renderCollections();
  renderProducts();
  updateCart();
}

function t(arText, enText) {
  return currentLang === 'ar' ? arText : (enText || arText);
}

// ===== HERO SLIDER =====
function slideHero(dir) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  slides[heroIndex].classList.remove('active');
  dots[heroIndex].classList.remove('active');
  heroIndex = (heroIndex + dir + slides.length) % slides.length;
  slides[heroIndex].classList.add('active');
  dots[heroIndex].classList.add('active');
}
function goToSlide(i) {
  const diff = i - heroIndex;
  if (diff !== 0) slideHero(diff);
}
function startHeroAuto() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => slideHero(1), 5000);
}

// ===== SEARCH =====
function toggleSearch() {
  document.getElementById('search-overlay')?.classList.toggle('active');
  if (document.getElementById('search-overlay')?.classList.contains('active')) {
    setTimeout(() => document.getElementById('search-input')?.focus(), 200);
  }
}
function searchProducts(q) {
  const res = document.getElementById('search-results');
  if (!res) return;
  if (!q.trim()) { res.innerHTML = ''; return; }
  const products = getProducts();
  const matches = products.filter(p =>
    (p.nameAr||'').includes(q) || (p.nameEn||'').toLowerCase().includes(q.toLowerCase()) ||
    (p.descAr||'').includes(q) || (p.descEn||'').toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6);
  res.innerHTML = matches.length ? matches.map(p => `
    <div class="search-result-item" onclick="openFPP('${p.id}');toggleSearch()">
      <img src="${p.image}" alt="${p.nameAr}" onerror="this.src='images/logo.jpg'"/>
      <div style="flex:1">
        <h4>${currentLang==='ar'?p.nameAr:p.nameEn}</h4>
        <p style="font-size:12px;color:var(--text-m)">${currentLang==='ar'?p.descAr:p.descEn}</p>
      </div>
      <span>${p.price} ${t('ج','EGP')}</span>
    </div>`).join('') :
    `<p style="color:var(--text-m);padding:16px 0">${t('لا توجد نتائج','No results found')}</p>`;
}

// ===== PRODUCTS DATA =====
function getProducts() {
  const override = localStorage.getItem('yours_products_override');
  if (override) { try { return JSON.parse(override); } catch(e) {} }
  return window.YOURS_PRODUCTS || [];
}
function getCollections() {
  applyStoredOverrides();
  return window.YOURS_COLLECTIONS || {};
}
function applyStoredOverrides() {
  const overrides = JSON.parse(localStorage.getItem('yours_col_overrides') || '{}');
  Object.entries(overrides).forEach(([id, data]) => {
    if (window.YOURS_COLLECTIONS?.[id]) {
      window.YOURS_COLLECTIONS[id].price = data.price;
      window.YOURS_COLLECTIONS[id].oldPrice = data.oldPrice;
    }
  });
  const prodOverride = localStorage.getItem('yours_products_override');
  if (prodOverride) { try { window.YOURS_PRODUCTS = JSON.parse(prodOverride); } catch(e) {} }
  const themeOverride = localStorage.getItem('yours_theme_user');
  if (themeOverride && themeOverride !== currentTheme) {
    applyTheme(themeOverride);
  }
}

// ===== RENDER COLLECTIONS =====
function renderCollections() {
  const grid = document.getElementById('collections-grid');
  if (!grid) return;
  const cols = getCollections();
  grid.innerHTML = Object.entries(cols).map(([id, col]) => {
    const name = currentLang === 'ar' ? col.nameAr : col.nameEn;
    const desc = currentLang === 'ar' ? col.descAr : (col.descEn || col.descAr);
    const saving = t(`وفري ${col.saving} ج`, `Save ${col.saving} EGP`);
    return `
    <div class="collection-card reveal" onclick="openCollectionModal('${id}')">
      <div class="collection-img-wrap">
        <div class="collection-circle">
          <img src="${col.image}" alt="${name}" class="collection-img" onerror="this.src='images/logo.jpg'"/>
        </div>
        <span class="collection-badge">${col.badge || ''}</span>
      </div>
      <div class="collection-info">
        <h3>${name}</h3>
        <p>${desc}</p>
        <div class="collection-price">
          <span class="price-new">${col.price} ${t('ج','EGP')}</span>
          <span class="price-old">${col.oldPrice} ${t('ج','EGP')}</span>
        </div>
        <div class="collection-bundle-offer">🎁 ${saving}</div>
        <button class="btn-gold-sm">${t('اطلبي الآن','Order Now')}</button>
      </div>
    </div>`;
  }).join('');
  initReveal();
}

// ===== RENDER PRODUCTS (homepage featured – max 6) =====
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const products = getProducts().filter(p => p.soldAlone).slice(0, 6);
  grid.innerHTML = products.map((p, i) => {
    const name = currentLang === 'ar' ? p.nameAr : p.nameEn;
    const desc = currentLang === 'ar' ? p.descAr : p.descEn;
    return `
    <div class="product-card" style="transition-delay:${i * 0.08}s" onclick="openFPP('${p.id}')">
      ${p.tag ? `<div class="product-tag">${p.tag}</div>` : ''}
      <div class="product-img-wrap">
        <img class="product-full-img" src="${p.image}" alt="${name}" onerror="this.src='images/logo.jpg'"/>
        <button class="product-hover-btn" onclick="event.stopPropagation();addToCart('${p.id}')">${t('أضيفي للسلة','Add to Cart')}</button>
      </div>
      <div class="product-info">
        <h4>${name}</h4>
        <p class="product-desc">${desc}</p>
        <p class="product-size">${p.size}</p>
        <div class="product-price">
          <span class="price-new">${p.price} ${t('ج','EGP')}</span>
          ${p.oldPrice ? `<span class="price-old">${p.oldPrice} ${t('ج','EGP')}</span>` : ''}
        </div>
        <button class="btn-gold-sm" onclick="event.stopPropagation();addToCart('${p.id}')">${t('أضيفي للسلة','Add to Cart')}</button>
      </div>
    </div>`;
  }).join('');
  // Trigger reveal
  setTimeout(() => {
    document.querySelectorAll('.product-card').forEach(el => el.classList.add('revealed'));
  }, 100);
}

// ===== FPP (Floating Product Panel) =====
function openFPP(id) {
  const p = getProducts().find(x => x.id === id);
  if (!p) return;
  const name = currentLang === 'ar' ? p.nameAr : p.nameEn;
  const desc = currentLang === 'ar' ? p.descAr : p.descEn;
  document.getElementById('fpp-name').textContent = name;
  document.getElementById('fpp-img').src = p.image;
  document.getElementById('fpp-desc').textContent = desc;
  document.getElementById('fpp-size').textContent = p.size;
  document.getElementById('fpp-price').textContent = `${p.price} ${t('ج','EGP')}`;
  document.getElementById('fpp-old').textContent = p.oldPrice ? `${p.oldPrice} ${t('ج','EGP')}` : '';
  document.getElementById('fpp-benefits-list').innerHTML = [
    t('مكونات طبيعية 100%','100% Natural Ingredients'),
    t('خالٍ من البارابين','Paraben Free'),
    t('مناسب لجميع أنواع الشعر','Suitable for All Hair Types'),
    t('نتائج مرئية من أول استخدام','Visible Results from First Use'),
  ].map(b => `<li>${b}</li>`).join('');
  document.getElementById('fpp-add-btn').onclick = () => { addToCart(id); closeFPP(); };
  document.getElementById('fpp-add-btn').textContent = t('أضيفي للسلة','Add to Cart');
  document.getElementById('fpp-overlay').classList.add('open');
  document.getElementById('floating-product-panel').classList.add('open');
}
function closeFPP() {
  document.getElementById('fpp-overlay').classList.remove('open');
  document.getElementById('floating-product-panel').classList.remove('open');
}

// ===== COLLECTION MODAL =====
function openCollectionModal(id) {
  const col = getCollections()[id];
  if (!col) return;
  const name = currentLang === 'ar' ? col.nameAr : col.nameEn;
  const desc = currentLang === 'ar' ? col.descAr : (col.descEn || col.descAr);
  const products = getProducts();
  const items = (col.products || []).map(pid => products.find(p => p.id === pid)).filter(Boolean);
  const content = document.getElementById('collection-modal-content');
  if (!content) return;
  content.innerHTML = `
    <h2 style="font-family:'Playfair Display',serif;font-size:24px;color:var(--gold);margin-bottom:6px">${name}</h2>
    <p style="color:var(--text-m);font-size:13px;margin-bottom:20px">${desc}</p>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px">
      ${items.map(p => `
        <div style="display:flex;align-items:center;gap:10px;background:var(--bg-hover);border-radius:10px;padding:10px">
          <img src="${p.image}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:1px solid var(--border)" onerror="this.src='images/logo.jpg'"/>
          <div>
            <div style="font-size:13px;font-weight:700">${currentLang==='ar'?p.nameAr:p.nameEn}</div>
            <div style="font-size:12px;color:var(--gold)">${p.price} ${t('ج','EGP')}</div>
          </div>
        </div>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <span style="font-size:28px;font-weight:700;color:var(--gold);font-family:'Playfair Display',serif">${col.price} ${t('ج','EGP')}</span>
      <span style="font-size:14px;color:var(--text-m);text-decoration:line-through">${col.oldPrice} ${t('ج','EGP')}</span>
    </div>
    <div style="font-size:13px;color:#4CAF50;margin-bottom:20px">🎁 ${t(`وفري ${col.saving} ج`,`Save ${col.saving} EGP`)}</div>
    <button class="btn-gold" style="width:100%;font-size:15px;padding:14px" onclick="addCollectionToCart('${id}');closeCollectionModal()">${t('أضيفي للسلة','Add to Cart')}</button>`;
  document.getElementById('collection-modal').style.display = 'flex';
}
function closeCollectionModal() {
  document.getElementById('collection-modal').style.display = 'none';
}

// ===== CART =====
function addToCart(id) {
  const p = getProducts().find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name: p.nameAr, nameEn: p.nameEn, price: p.price, image: p.image, qty: 1 });
  saveCart();
  updateCart();
  showToast(t('✓ أُضيف للسلة!','✓ Added to Cart!'));
  document.getElementById('cart-overlay').classList.add('active');
  document.getElementById('cart-sidebar').classList.add('active');
}
function addCollectionToCart(colId) {
  const col = getCollections()[colId];
  if (!col) return;
  const name = currentLang === 'ar' ? col.nameAr : col.nameEn;
  const existing = cart.find(i => i.id === colId);
  if (existing) existing.qty++;
  else cart.push({ id: colId, name: col.nameAr, nameEn: col.nameEn, price: col.price, image: col.image, qty: 1, isCollection: true });
  saveCart();
  updateCart();
  showToast(t('✓ المجموعة أُضيفت!','✓ Collection Added!'));
}
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateCart();
}
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCart(); }
}
function saveCart() {
  localStorage.setItem('yours_cart', JSON.stringify(cart));
}
function updateCart() {
  const badge = document.getElementById('cart-badge');
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const emptyEl = document.getElementById('cart-empty');
  const totalEl = document.getElementById('cart-total');
  const discountRow = document.getElementById('cart-discount-row');
  const discountAmt = document.getElementById('discount-amount');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  if (badge) badge.textContent = totalQty;

  if (!itemsEl) return;
  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (footerEl) footerEl.style.display = 'none';
    itemsEl.innerHTML = '';
    itemsEl.appendChild(emptyEl || document.createElement('div'));
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  itemsEl.innerHTML = cart.map(item => {
    const name = currentLang === 'ar' ? item.name : (item.nameEn || item.name);
    return `
    <div class="cart-item">
      <img src="${item.image}" alt="${name}" onerror="this.src='images/logo.jpg'"/>
      <div class="cart-item-info">
        <h4>${name}</h4>
        <span>${item.price * item.qty} ${t('ج','EGP')}</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
        <button class="qty-btn" style="font-size:12px;color:#f44336" onclick="removeFromCart('${item.id}')">✕</button>
      </div>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = calcDiscount(subtotal);
  const total = subtotal - discount;
  if (totalEl) totalEl.textContent = `${total} ${t('ج','EGP')}`;
  if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';
  if (discountAmt) discountAmt.textContent = `- ${discount} ${t('ج','EGP')}`;
}
function calcDiscount(subtotal) {
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  if (qty >= 3) return Math.round(subtotal * 0.15);
  if (qty === 2) return Math.round(subtotal * 0.10);
  return 0;
}
function toggleCart() {
  document.getElementById('cart-overlay')?.classList.toggle('active');
  document.getElementById('cart-sidebar')?.classList.toggle('active');
}

// ===== CHECKOUT =====
function proceedToCheckout() {
  if (cart.length === 0) return;
  toggleCart();
  checkoutStep = 1;
  showCheckoutStep(1);
  renderCheckoutSummary();
  document.getElementById('checkout-modal').style.display = 'flex';
}
function closeCheckout() {
  document.getElementById('checkout-modal').style.display = 'none';
  checkoutStep = 1;
}

function goToStep(step) {
  if (step === 2 && !validateStep1()) return;
  checkoutStep = step;
  showCheckoutStep(step);
  if (step === 2) renderCheckoutSummary();
  if (step === 3) renderFinalSummary();
}

function showCheckoutStep(step) {
  [1,2,3].forEach(s => {
    const el = document.getElementById(`checkout-step-${s}`);
    if (el) el.style.display = s === step ? 'block' : 'none';
    const tab = document.getElementById(`step-${s}-tab`);
    if (tab) {
      tab.classList.toggle('active', s === step);
      tab.classList.toggle('done', s < step);
    }
    const line = document.getElementById(`step-line-${s}`);
    if (line) line.classList.toggle('done', s < step);
  });
  document.getElementById('checkout-step-success')?.style &&
    (document.getElementById('checkout-step-success').style.display = 'none');
}

function validateStep1() {
  let ok = true;
  const name = document.getElementById('order-name')?.value.trim();
  const phone = document.getElementById('order-phone')?.value.trim();
  const gov = document.getElementById('order-gov')?.value;
  const addr = document.getElementById('order-address')?.value.trim();

  setErr('err-name', !name ? t('الاسم مطلوب','Name is required') : '');
  setErr('err-phone', !phone || !/^01[0-9]{9}$/.test(phone) ? t('رقم موبايل غير صحيح','Invalid phone number') : '');
  setErr('err-gov', !gov ? t('اختاري المحافظة','Select governorate') : '');
  setErr('err-address', !addr ? t('العنوان مطلوب','Address is required') : '');

  if (!name || !/^01[0-9]{9}$/.test(phone) || !gov || !addr) ok = false;
  return ok;
}
function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function validateField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const wrap = el.closest('.input-valid');
  if (id === 'order-name') wrap?.classList.toggle('valid', el.value.trim().length > 1);
  if (id === 'order-phone') wrap?.classList.toggle('valid', /^01[0-9]{9}$/.test(el.value.trim()));
}

function updateDeliveryByGov() {
  const gov = document.getElementById('order-gov')?.value;
  const samedayEl = document.getElementById('sameday-option');
  if (samedayEl) samedayEl.style.display = (gov === 'cairo' || gov === 'giza') ? 'flex' : 'none';
}

function selectDelivery(el, type, price, labelAr, labelEn) {
  document.querySelectorAll('.delivery-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedDelivery = { type, price, label: currentLang === 'ar' ? labelAr : labelEn };
  renderFinalSummary();
}

function selectPayment(el, method) {
  document.querySelectorAll('.payment-method').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedPayment = method;
}

function renderCheckoutSummary() {
  const el = document.getElementById('checkout-summary-card');
  if (!el) return;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = calcDiscount(subtotal);
  el.innerHTML = cart.map(item => {
    const name = currentLang === 'ar' ? item.name : (item.nameEn || item.name);
    return `<div class="summary-item"><span>${name} ×${item.qty}</span><span>${item.price * item.qty} ${t('ج','EGP')}</span></div>`;
  }).join('') +
  (discount > 0 ? `<div class="summary-item" style="color:#4CAF50"><span>${t('خصم الكمية','Quantity Discount')}</span><span>- ${discount} ${t('ج','EGP')}</span></div>` : '') +
  `<div class="summary-total-row"><span>${t('الإجمالي','Total')}</span><span class="summary-total-price">${subtotal - discount} ${t('ج','EGP')}</span></div>`;
}

function renderFinalSummary() {
  const el = document.getElementById('checkout-final-summary');
  if (!el) return;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = calcDiscount(subtotal);
  const giftWrap = document.getElementById('extra-gift')?.checked ? 25 : 0;
  const total = subtotal - discount + selectedDelivery.price + giftWrap;
  el.innerHTML = cart.map(item => {
    const name = currentLang === 'ar' ? item.name : (item.nameEn || item.name);
    return `<div class="summary-item"><span>${name} ×${item.qty}</span><span>${item.price * item.qty} ${t('ج','EGP')}</span></div>`;
  }).join('') +
  (discount > 0 ? `<div class="summary-item" style="color:#4CAF50"><span>${t('خصم الكمية','Qty Discount')}</span><span>- ${discount} ${t('ج','EGP')}</span></div>` : '') +
  `<div class="summary-item"><span>${t('الشحن','Shipping')} (${selectedDelivery.label})</span><span>${selectedDelivery.price} ${t('ج','EGP')}</span></div>` +
  (giftWrap ? `<div class="summary-item"><span>${t('تغليف هدية','Gift Wrap')}</span><span>25 ${t('ج','EGP')}</span></div>` : '') +
  `<div class="summary-total-row"><span>${t('الإجمالي النهائي','Grand Total')}</span><span class="summary-total-price">${total} ${t('ج','EGP')}</span></div>`;
}

function updateCheckoutTotal() {
  renderFinalSummary();
}

async function submitOrder() {
  const btn = document.getElementById('submit-order-btn');
  if (btn) { btn.textContent = t('⏳ جارٍ الإرسال...','⏳ Placing Order...'); btn.disabled = true; }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = calcDiscount(subtotal);
  const giftWrap = document.getElementById('extra-gift')?.checked ? 25 : 0;
  const total = subtotal - discount + selectedDelivery.price + giftWrap;
  currentOrderNum = 'YOURS-' + Date.now().toString().slice(-6);

  const order = {
    id: currentOrderNum,
    name: document.getElementById('order-name')?.value.trim(),
    phone: document.getElementById('order-phone')?.value.trim(),
    gov: document.getElementById('order-gov')?.value,
    address: document.getElementById('order-address')?.value.trim(),
    notes: document.getElementById('order-notes')?.value.trim(),
    delivery: selectedDelivery,
    payment: selectedPayment,
    giftWrap: giftWrap > 0,
    wantsInvoice: document.getElementById('extra-invoice')?.checked,
    newsletter: document.getElementById('extra-newsletter')?.checked,
    items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
    discount, total,
    date: new Date().toLocaleDateString('ar-EG'),
    status: 'جديد'
  };

  // ===== 1) SAVE TO LOCALSTORAGE (backup always works) =====
  const orders = JSON.parse(localStorage.getItem('yours_orders') || '[]');
  orders.unshift(order);
  localStorage.setItem('yours_orders', JSON.stringify(orders));

  // ===== 2) SAVE TO FIRESTORE (cloud - doesn't break app if fails) =====
  try {
    if (window._firebaseDB && window._firebaseLib) {
      const { collection, addDoc } = window._firebaseLib;
      await addDoc(collection(window._firebaseDB, 'orders'), order);
    }
  } catch (err) {
    console.warn('Firestore save failed (order already in localStorage):', err);
  }

  // ===== 3) TELEGRAM NOTIFICATION =====
  sendTelegramNotification(order);

  setTimeout(() => {
    // Show success
    [1,2,3].forEach(s => {
      const el = document.getElementById(`checkout-step-${s}`);
      if (el) el.style.display = 'none';
    });
    document.querySelectorAll('.checkout-step').forEach(el => el.classList.add('done'));
    const successEl = document.getElementById('checkout-step-success');
    if (successEl) successEl.style.display = 'block';
    document.getElementById('success-order-num').textContent = currentOrderNum;

    const days = selectedDelivery.type === 'sameday' ? t('اليوم','Today') :
                 selectedDelivery.type === 'express' ? t('خلال 24 ساعة','within 24 hours') :
                 t('خلال 2-4 أيام','within 2-4 days');
    document.getElementById('delivery-countdown').innerHTML =
      `🚚 ${t('التوصيل المتوقع:','Expected Delivery:')} <strong>${days}</strong>`;

    // Clear cart
    cart = [];
    saveCart();
    updateCart();
    if (btn) { btn.textContent = t('اطلبي الآن 🛍','Place Order 🛍'); btn.disabled = false; }
  }, 1500);
}

// ===== TELEGRAM BOT NOTIFICATION =====
async function sendTelegramNotification(order) {
  const BOT_TOKEN = '8736241035:AAFmE1STMmJTHpCFjtjrJrDnmQKjXMU5iU4';
  const CHAT_ID = '1306486719';

  const itemsList = order.items.map(i => `  • ${i.name} × ${i.qty} — ${(i.price * i.qty).toLocaleString()} ج`).join('\n');
  const discountLine = order.discount > 0 ? `\n💸 خصم: -${order.discount.toLocaleString()} ج` : '';
  const giftLine = order.giftWrap ? '\n🎁 تغليف هدية: +25 ج' : '';

  const message = `🛍 *طلب جديد من YOURS!*

🔖 رقم الطلب: \`${order.id}\`
📅 التاريخ: ${order.date}

👤 *بيانات العميل:*
الاسم: ${order.name}
📱 الهاتف: ${order.phone}
📍 المحافظة: ${order.gov}
🏠 العنوان: ${order.address}
${order.notes ? '📝 ملاحظات: ' + order.notes : ''}

🛒 *المنتجات:*
${itemsList}

💰 *الإجمالي:*
المجموع الفرعي: ${order.items.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString()} ج${discountLine}${giftLine}
🚚 التوصيل (${order.delivery.label}): ${order.delivery.price} ج
✅ *الإجمالي النهائي: ${order.total.toLocaleString()} ج*

💳 طريقة الدفع: ${order.payment === 'cash' ? 'كاش عند الاستلام' : order.payment === 'instapay' ? 'InstaPay' : 'بطاقة بنكية'}`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }
}

function openWhatsApp() {
  const name = document.getElementById('order-name')?.value || '';
  const msg = encodeURIComponent(`مرحباً YOURS 💛\nطلب جديد: ${currentOrderNum}\nالاسم: ${name}\nإجمالي الطلب: ${cart.length} منتج`);
  window.open(`https://wa.me/201003884148?text=${msg}`, '_blank');
}
function copyOrderNum() {
  navigator.clipboard.writeText(currentOrderNum).then(() => showToast(t('✓ تم النسخ!','✓ Copied!')));
}

// ===== OFFERS TIMER =====
function startTimer() {
  const end = new Date();
  end.setHours(end.getHours() + 12, 0, 0, 0);
  function tick() {
    const now = new Date();
    let diff = Math.max(0, Math.floor((end - now) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const pad = n => String(n).padStart(2, '0');
    const th = document.getElementById('t-h');
    const tm = document.getElementById('t-m');
    const ts = document.getElementById('t-s');
    if (th) th.textContent = pad(h);
    if (tm) tm.textContent = pad(m);
    if (ts) ts.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

// ===== OFFERS CODES =====
function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => showToast(t(`✓ تم نسخ ${code}!`,`✓ ${code} Copied!`)));
}

// ===== LIVE STATS ANIMATION =====
function animateLiveStats() {
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function update() {
    const v = document.getElementById('live-visitors');
    const o = document.getElementById('live-orders');
    const p = document.getElementById('popup-visitors-count');
    if (v) v.textContent = rand(280, 380);
    if (o) o.textContent = rand(40, 80);
    if (p) p.textContent = rand(200, 300);
  }
  update();
  setInterval(update, 7000);
}

// ===== REVEAL ANIMATION =====
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
}

// ===== VIVIENNE WESTWOOD POPUP =====
function showVWPopup() {
  if (sessionStorage.getItem('vw_popup_shown')) return;
  document.getElementById('vw-popup-overlay')?.classList.add('active');
  sessionStorage.setItem('vw_popup_shown', '1');
}
function closeVWPopup() {
  document.getElementById('vw-popup-overlay')?.classList.remove('active');
}
function copyVWCode() {
  navigator.clipboard.writeText('YOURS15').then(() => {
    const box = document.querySelector('.vw-popup-code-box');
    if (box) { box.style.background = 'rgba(181,119,122,0.15)'; setTimeout(() => box.style.background = '', 600); }
    showToast(t('✓ تم نسخ YOURS15!','✓ YOURS15 Copied!'));
  });
}

// ===== CHATBOT =====
const chatReplies = {
  'الأسعار': t => `الأسعار تبدأ من 89 ج للإكسسوارات، وتصل الطقم الكامل لتر بـ2200 ج! 💛`,
  'الشحن': t => `شحن لكل مصر 35-90 ج حسب المحافظة والسرعة. طلبات فوق 500 ج الشحن بفلوس زهيدة جداً 🚚`,
  'كود خصم': t => `استخدمي كود YOURS15 للحصول على خصم 15% على أول طلب! 🎁`,
  'admin': t => { setTimeout(() => { window.location.href = window.location.pathname.replace('index.html','').replace(/\/$/,'') + '/admin.html'; }, 800); return '🔐 جارٍ التوجيه للوحة الإدارة...'; },
  'مرحبا': t => 'أهلاً! أنا هنا أساعدك 💛 تقدري تسأليني عن أي حاجة!',
  'prices': t => `Prices start from 89 EGP for accessories to 2200 EGP for the full 1L collection! 💛`,
  'shipping': t => `Shipping across Egypt 35-90 EGP. Orders over 500 EGP get discounted shipping 🚚`,
  'discount': t => `Use code YOURS15 for 15% off your first order! 🎁`,
};
function toggleChatbot() {
  document.getElementById('chatbot-panel')?.classList.toggle('active');
}
function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const msg = input?.value.trim();
  if (!msg) return;
  appendChat(msg, 'user');
  input.value = '';
  setTimeout(() => {
    let reply = currentLang === 'ar' ?
      'عندي أي سؤال تاني؟ 😊 أنا هنا!' :
      'Any other questions? 😊 I\'m here!';
    for (const [key, fn] of Object.entries(chatReplies)) {
      if (msg.toLowerCase().includes(key.toLowerCase())) { reply = fn(currentLang); break; }
    }
    appendChat(reply, 'bot');
  }, 600);
}
function quickReply(msg) { document.getElementById('chatbot-input').value = msg; sendChatMessage(); }
function chatEnterKey(e) { if (e.key === 'Enter') sendChatMessage(); }
function appendChat(text, role) {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<p>${text}</p>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ===== HEADER SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('copy-toast');
  if (!t) return;
  t.innerHTML = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== CIRCLE POPUP (mobile) =====
function openCirclePopup(id) {
  const p = getProducts().find(x => x.id === id);
  if (!p) return;
  document.getElementById('cp-img').src = p.image;
  document.getElementById('cp-name').textContent = currentLang==='ar'?p.nameAr:p.nameEn;
  document.getElementById('cp-desc').textContent = currentLang==='ar'?p.descAr:p.descEn;
  document.getElementById('cp-price').textContent = `${p.price} ${t('ج','EGP')}`;
  document.getElementById('cp-add').onclick = () => { addToCart(id); closeCirclePopup(); };
  document.getElementById('circle-popup')?.classList.add('open');
}
function closeCirclePopup() {
  document.getElementById('circle-popup')?.classList.remove('open');
}

// ===== OFFERS PARTICLES =====
(function initParticles() {
  const container = document.getElementById('offers-particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'offers-particle';
    p.style.setProperty('--x', Math.random() * 100 + '%');
    p.style.setProperty('--dur', (3 + Math.random() * 4) + 's');
    p.style.setProperty('--delay', (Math.random() * 4) + 's');
    container.appendChild(p);
  }
})();

// ===== VIDEO SOUND TOGGLE =====
function toggleVideoSound() {
  const video = document.getElementById('ugc-video');
  const btn = document.getElementById('ugc-sound-btn');
  if (!video || !btn) return;
  video.muted = !video.muted;
  btn.textContent = video.muted ? '🔇' : '🔊';
}

// Mute video when scrolled out of view
(function initVideoScrollMute() {
  window.addEventListener('scroll', () => {
    const video = document.getElementById('ugc-video');
    const btn = document.getElementById('ugc-sound-btn');
    if (!video || video.muted) return;
    const rect = video.getBoundingClientRect();
    const inView = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!inView) {
      video.muted = true;
      if (btn) btn.textContent = '🔇';
    }
  }, { passive: true });
})();

// end of app.js
