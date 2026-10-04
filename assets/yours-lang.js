/* =====================================================================
   YOURS — language switch (العربية / English)
   Arabic is the source of truth; this maps every UI phrase to English and
   flips the page direction. Product and category text comes from the
   catalog's own English fields.
   ===================================================================== */
(function (global) {
  'use strict';
  var D = global.SedraData;

  var DICT = {
    // header & menu
    'الرئيسية': 'Home', 'الأصناف': 'Collections', 'معلومات تهمك': 'Useful info',
    'القائمة الرئيسية': 'Main menu', 'سلة الطلب': 'Cart', 'القائمة': 'Menu',
    'الشحن والتوصيل': 'Shipping & delivery', 'الاستبدال والاسترجاع': 'Returns & exchange',
    'استفسر على واتساب': 'Ask us on WhatsApp', 'زورنا في المحل': 'Visit our store',
    'المصاريف حسب المحافظة ومدة التوصيل': 'Fees by governorate and delivery time',
    'عاين قبل ما تستلم': 'Inspect before you pay',
    // cart
    'طلبك': 'Your order', 'طلبك فاضي لسه': 'Your cart is empty',
    'المنتجات': 'Products', 'الشحن': 'Shipping', 'الإجمالي': 'Total',
    'إتمام الطلب': 'Checkout', 'كمّل تسوق': 'Continue shopping',
    'إزالة': 'Remove', 'للقطعة': 'each', 'الكمية': 'Quantity',
    'حسب المحافظة': 'By governorate', 'اختار تصميم': 'Choose a product',
    'أضف للطلب': 'Add to cart', 'في الطلب': 'In cart', 'عرض الطلب': 'View cart',
    'أضف تصميم للطلب': 'Add another product', 'تم': 'Done',
    'أضف تصميم تاني من أي صنف': 'Add another product from any collection',
    'اتضاف': 'Added', 'اختار تصميم الأول': 'Pick a product first',
    // checkout
    'تفاصيل طلبك': 'Your order details', 'طريقة الدفع': 'Payment method',
    'الدفع عند الاستلام': 'Cash on delivery', 'كاش مع المندوب': 'Cash with the courier',
    'عاين قبل ما تدفع': 'Inspect before paying', 'تحويل إلكتروني': 'Online transfer',
    'إنستاباي / فودافون كاش': 'InstaPay / Vodafone Cash', 'شحن بدون تحصيل': 'Prepaid shipping',
    'الاسم الكامل': 'Full name', 'اكتب اسمك بالكامل': 'Write your full name',
    'رقم الموبايل': 'Mobile number', 'رقم موبايل تاني': 'Second mobile',
    'المحافظة': 'Governorate', 'المدينة / المركز': 'City / district',
    'العنوان بالتفصيل': 'Full address', 'ملاحظات': 'Notes',
    'اختياري': 'optional', 'تأكيد الطلب': 'Confirm order',
    'المبلغ المطلوب تحويله': 'Amount to transfer', 'الحساب': 'Account',
    'نسخ': 'Copy', 'إنستاباي': 'InstaPay', 'فودافون كاش / محفظة': 'Vodafone Cash / wallet',
    'حوّل على الرقم ده': 'Transfer to this number',
    '📷 ارفع صورة إيصال التحويل': '📷 Upload the transfer receipt',
    'تم استلام طلبك!': 'Order received!', 'كود طلبك': 'Your order code',
    'أكد طلبك على واتساب': 'Confirm on WhatsApp', 'العودة للمتجر': 'Back to the store',
    'تعديل الطلب أو إضافة تصميم': 'Edit cart or add a product',
    // product page
    'المواصفات': 'Details', 'عن المنتج': 'About this product',
    'اطلب الآن': 'Order now', 'أضف للطلب وكمّل تسوق': 'Add to cart and keep shopping',
    'استفسر عن التصميم ده': 'Ask about this product',
    'دوس على الصورة لتكبيرها': 'Tap the image to enlarge',
    'المنتج ده مش متاح حالياً': 'This product is not available right now',
    'كل التصاميم': 'All products', 'تصميم متاح': 'products available',
    'مش متأكد أي نوع يناسبك؟': 'Not sure which line suits you?',
    'انت هنا': 'You are here', 'مناسبة لـ': 'Best for',
    // home
    'خطوط YOURS': 'YOURS lines', 'تصاميمنا': 'Our products',
    'آراء عملائنا': 'What our clients say',
    'عاين قبل ما تستلم': 'Inspect before you pay',
    'شحن لكل المحافظات': 'Delivery nationwide',
    'مش عاجبك؟ رجّعه': 'Not happy? Return it',
    'وتدفع الشحن بس': 'You only pay shipping',
    'بعد ما تتطمن على المنتج': 'After you check the product',
    // generic
    'جاري التحميل...': 'Loading...', 'ج': 'EGP', 'من': 'from', 'قطعة': 'items'
  };

  var ATTR_DICT = { 'اكتب اسمك بالكامل': 'Write your full name', 'الشارع، علامة مميزة، رقم العمارة والدور': 'Street, landmark, building and floor number', 'مثلاً: ميعاد مناسب للتوصيل': 'e.g. a convenient delivery time' };

  function translateNode(node) {
    var t = node.nodeValue;
    if (!t) return;
    var key = t.trim();
    if (!key || !DICT[key]) return;
    node.nodeValue = t.replace(key, DICT[key]);
  }
  function translateTree(root) {
    if (!D.isEn()) return;
    root = root || document.body;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) translateNode(n);
    Array.prototype.forEach.call(root.querySelectorAll('[placeholder]'), function (el) {
      var v = el.getAttribute('placeholder');
      if (ATTR_DICT[v]) el.setAttribute('placeholder', ATTR_DICT[v]);
      else if (DICT[v]) el.setAttribute('placeholder', DICT[v]);
    });
  }

  function applyDirection() {
    var en = D.isEn();
    document.documentElement.lang = en ? 'en' : 'ar';
    document.documentElement.dir = en ? 'ltr' : 'rtl';
    document.body && document.body.classList.toggle('lang-en', en);
  }

  function injectToggle() {
    var slot = document.querySelector('.header-side.right');
    if (!slot || document.getElementById('langBtn')) return;
    var btn = document.createElement('button');
    btn.id = 'langBtn';
    btn.type = 'button';
    btn.className = 'icon-btn lang-btn';
    btn.setAttribute('aria-label', D.isEn() ? 'التبديل للعربية' : 'Switch to English');
    btn.textContent = D.isEn() ? 'ع' : 'EN';
    btn.addEventListener('click', function () {
      D.setLang(D.isEn() ? 'ar' : 'en');
      location.reload();   // simplest and safest: re-render everything in the new language
    });
    slot.appendChild(btn);
  }

  function init() {
    applyDirection();
    injectToggle();
    translateTree(document.body);
    // translate anything rendered later (cards, cart, checkout)
    if (D.isEn() && window.MutationObserver) {
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          Array.prototype.forEach.call(m.addedNodes, function (node) {
            if (node.nodeType === 1) translateTree(node);
            else if (node.nodeType === 3) translateNode(node);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.YoursLang = { translate: translateTree, dict: DICT };
})(window);
