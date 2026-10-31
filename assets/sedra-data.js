/* =====================================================================
   Sedra Store — shared data layer
   - Firebase config + Telegram config
   - Default catalog (used until the admin publishes the catalog, or if offline)
   - Lightweight Firestore REST client (no heavy SDK on customer pages)
   - Catalog loading with cache (instant page render)
   - Images stored in Firestore ("media:ID") resolution
   ===================================================================== */
(function (global) {
  'use strict';

  var CONFIG = {
    firebase: {
      apiKey: "AIzaSyD_-u72QCkepRP_w2uYWqN0bBNolNgAWAo",
      authDomain: "yours-b808d.firebaseapp.com",
      projectId: "yours-b808d",
      storageBucket: "yours-b808d.firebasestorage.app",
      messagingSenderId: "871914701657",
      appId: "1:871914701657:web:024c8d09e59fee86ca4248"
    },
    // The bot token is NOT here and must never come back. A static site hands
    // every byte it loads to the public, so a token in this file is a token
    // anyone can take — which is exactly what happened. The relay below holds
    // it instead; see relay/worker.js.
    telegram: {
      relay: 'https://yours-orders.REPLACE-ME.workers.dev'
    },
    defaults: {
      storeName: 'YOURS',
      storeNameEn: 'YOURS',
      whatsapp: '201026212478',
      instapayLink: 'https://ipn.eg/S/monagalal8811/instapay/7m13Kd',
      instapayHandle: 'monagalal8811@instapay',
      walletNumber: '01069000231',
      instagram: 'https://www.instagram.com/monagalal_beauty_treatment/',
      mapLink: 'https://maps.google.com/maps?q=30.081823348999023%2C31.334108352661133&z=17&hl=en',
      address: '٣ شارع محمد الدهان من شمس الدين الذهبي، أرض الجولف، بجوار مسجد حفصة — أقرب محطة مترو: كلية البنات',
      addressEn: '3 Mohamed El-Dahan St., off Shams El-Din El-Zahaby, Ard El-Golf — next to Hafsa Mosque (nearest metro: Kolleyet El-Banat)',
      shipping: 75,
      shippingCompany: ''
    },
    catalogVersion: 3,   // admin applies data updates up to this version
    minLiveVersion: 2    // storefront trusts Firestore from this version
  };

  /* ---------------- Default catalog ---------------- */
  var SEED_CATEGORIES = [
    {
      id: 'luxury', order: 0, visible: true, icon: '🖤',
      name: 'YOURS Luxury',
      nameEn: 'YOURS Luxury',
      shortName: 'Luxury',
      tagline: 'تنظيف · ترميم · لمعان',
      taglineEn: 'Cleanse · Restore · Shine',
      description: 'خط Luxury هو روتين YOURS الكامل في البيت. أربع خطوات متكاملة — شامبو وبلسم وماسك وسيروم — بعبوات 500 مل وتركيبة غنية بزيت الزيتون، تنضّف الشعر وتغذيه وترجّع له نعومته ولمعانه مع الاستخدام المنتظم.',
      descriptionEn: 'Luxury is the complete YOURS routine at home: four steps — shampoo, conditioner, mask and serum — in 500 ml sizes with an olive-oil rich formula that cleanses, nourishes and brings back softness and shine with regular use.',
      bestFor: 'اللي عايز روتين كامل ونتيجة تدوم',
      bestForEn: 'Anyone who wants a full routine with lasting results',
      chooser: 'عايزة روتين كامل وفخم في البيت',
      chooserEn: 'I want a complete, premium routine at home',
      usage: 'اغسلي بالشامبو مرتين، وبعدين البلسم من نص الطول للأطراف دقيقتين. الماسك مرة أو مرتين في الأسبوع من 5 لـ 10 دقايق. السيروم في الآخر على الشعر النص نشفان.',
      usageEn: 'Shampoo twice, then apply conditioner from mid-length to ends for 2 minutes. Use the mask once or twice a week for 5–10 minutes. Finish with the serum on towel-dried hair.',
      price: 1700, oldPrice: null, badge: 'Luxury',
      setName: 'مجموعة YOURS Luxury كاملة',
      setNameEn: 'YOURS Luxury — Complete Set',
      cardRatio: '1/1', imageFit: 'contain',
      coverImg: 'images/collections/luxury.jpg',
      specs: [
        { label: 'الحجم', labelEn: 'Size', value: '500 مل', valueEn: '500 ml' },
        { label: 'التركيبة', labelEn: 'Formula', value: 'زيت زيتون — ترميم', valueEn: 'Olive oil — repair' },
        { label: 'مناسب لـ', labelEn: 'Suitable for', value: 'كل أنواع الشعر', valueEn: 'All hair types' }
      ]
    },
    {
      id: 'hydration', order: 1, visible: true, icon: '🌿',
      name: 'YOURS Hydration',
      nameEn: 'YOURS Hydration',
      shortName: 'Hydration',
      tagline: 'أرچان وترطيب عميق',
      taglineEn: 'Argan & Deep Hydration',
      description: 'خط Hydration بتركيبة الأرچان المخصصة للشعر الجاف والتالف، بعبوات 1 لتر توفر عليكِ وتكفي شهور. نفس اللي بنستخدمه في الصالون، لعائلة كاملة أو لشعر طويل وكثيف.',
      descriptionEn: 'The Hydration line uses an argan formula made for dry and damaged hair, in 1-litre bottles that last for months. The same products we use in the salon — ideal for a whole family or long, thick hair.',
      bestFor: 'الشعر الجاف والتالف والعائلة والصالونات',
      bestForEn: 'Dry or damaged hair, families and salons',
      chooser: 'شعري جاف ومحتاج ترطيب عميق',
      chooserEn: 'My hair is dry and needs deep hydration',
      usage: 'للشعر الجاف جداً: شامبو مرتين، وبلسم من نص الطول للأطراف، والماسك مرتين في الأسبوع. السيروم يومياً على الأطراف.',
      usageEn: 'For very dry hair: shampoo twice, condition from mid-length to ends, and use the mask twice a week. Apply the serum daily on the ends.',
      price: 2800, oldPrice: null, badge: 'Hydration',
      setName: 'مجموعة YOURS Hydration كاملة',
      setNameEn: 'YOURS Hydration — Complete Set',
      cardRatio: '1/1', imageFit: 'contain',
      coverImg: 'images/collections/hydration.jpg',
      specs: [
        { label: 'الحجم', labelEn: 'Size', value: '1000 مل', valueEn: '1000 ml' },
        { label: 'التركيبة', labelEn: 'Formula', value: 'ترطيب عميق', valueEn: 'Deep hydration' },
        { label: 'مناسب لـ', labelEn: 'Suitable for', value: 'الشعر الجاف والتالف', valueEn: 'Dry and damaged hair' }
      ]
    },
    {
      id: 'go', order: 2, visible: true, icon: '✈️',
      name: 'YOURS Go',
      nameEn: 'YOURS Go',
      shortName: 'Go',
      tagline: 'سفر · چيم · سباحة',
      taglineEn: 'Travel · Gym · Swimming',
      description: 'خط Go بأحجام 250 مل تدخل أي شنطة، لعناية كاملة وانتي بره البيت. مثالي كمان لو بتجربي YOURS لأول مرة وعايزة تشوفي النتيجة قبل العبوات الكبيرة.',
      descriptionEn: 'The Go line comes in 250 ml sizes that fit any bag, so your routine travels with you. It is also the easiest way to try YOURS before moving to the bigger bottles.',
      bestFor: 'السفر والچيم وتجربة المنتج لأول مرة',
      bestForEn: 'Travel, the gym, and trying YOURS for the first time',
      chooser: 'عايزة أجرب الأول أو ماخد معايا في السفر',
      chooserEn: 'I want to try it first, or take it travelling',
      usage: 'نفس الروتين بالظبط بأحجام أصغر: شامبو ← بلسم ← ماسك ← سيروم.',
      usageEn: 'Exactly the same routine in smaller sizes: shampoo → conditioner → mask → serum.',
      price: 800, oldPrice: null, badge: 'Go',
      setName: 'مجموعة YOURS Go كاملة',
      setNameEn: 'YOURS Go — Complete Set',
      cardRatio: '1/1', imageFit: 'contain',
      coverImg: 'images/collections/go.jpg',
      specs: [
        { label: 'الحجم', labelEn: 'Size', value: '250 مل', valueEn: '250 ml' },
        { label: 'الاستخدام', labelEn: 'Use', value: 'سفر · جيم · سباحة', valueEn: 'Travel · gym · swimming' },
        { label: 'مناسب لـ', labelEn: 'Suitable for', value: 'كل أنواع الشعر', valueEn: 'All hair types' }
      ]
    }
  ];

  // [id, categoryId, name, nameEn, blurb, blurbEn, order, soloPrice, soloOldPrice]
  // soloPrice is set only for the products that may also be bought on their own.
  // Everything else is sold as part of its collection and carries no price.
  var YOURS_PRODUCTS = [
    ['luxury-shampoo-500', 'luxury', 'شامبو Luxury — 500 مل', 'Luxury Shampoo — 500 ml', 'تنظيف وترميم ولمعان', 'Cleanse · repair · shine', 0],
    ['luxury-conditioner-500', 'luxury', 'بلسم Luxury — 500 مل', 'Luxury Conditioner — 500 ml', 'تغذية ونعومة وترميم', 'Nourish · smooth · repair', 1],
    ['luxury-mask-500', 'luxury', 'ماسك شعر Luxury — 500 مل', 'Luxury Hair Mask — 500 ml', 'تغذية وترميم واستعادة', 'Nourish · repair · restore', 2],
    ['luxury-serum-75', 'luxury', 'سيروم Luxury — 75 مل', 'Luxury Serum — 75 ml', 'نعومة ولمعان وحماية', 'Smooth · shine · protect', 3],

    ['hydration-shampoo-1000', 'hydration', 'شامبو Hydration — 1 لتر', 'Hydration Shampoo — 1 L', 'شامبو أرچان للشعر الجاف والتالف', 'Argan shampoo for dry and damaged hair', 0],
    ['hydration-conditioner-1000', 'hydration', 'بلسم Hydration — 1 لتر', 'Hydration Conditioner — 1 L', 'بلسم ترميم بالأرچان', 'Argan repair conditioner', 1],
    ['hydration-mask-500', 'hydration', 'ماسك Hydration — 500 مل', 'Hydration Hair Mask — 500 ml', 'تغذية مركزة للشعر الجاف', 'Intensive nutrition for dry hair', 2, 450, 750],
    ['hydration-serum-100', 'hydration', 'سيروم Hydration — 100 مل', 'Hydration Serum — 100 ml', 'تغذية وحماية للشعر التالف', 'Nutrition and protection for damaged hair', 3, 450, 750],

    ['go-shampoo-250', 'go', 'شامبو Go — 250 مل', 'Go Shampoo — 250 ml', 'تنظيف وانتعاش وترميم', 'Cleanse · refresh · repair', 0],
    ['go-conditioner-250', 'go', 'بلسم Go — 250 مل', 'Go Conditioner — 250 ml', 'تغذية ونعومة وفك التشابك', 'Nourish · soften · detangle', 1],
    ['go-mask-250', 'go', 'ماسك شعر Go — 250 مل', 'Go Hair Mask — 250 ml', 'تغذية وترميم وتقوية', 'Nourish · repair · strengthen', 2],
    ['go-serum-50', 'go', 'سيروم Go — 50 مل', 'Go Serum — 50 ml', 'نعومة ولمعان وحماية', 'Smooth · shine · protect', 3]
  ];

  var SEED_PRODUCTS = YOURS_PRODUCTS.map(function (p) {
    return {
      id: p[0], categoryId: p[1], name: p[2], nameEn: p[3], color: p[4], colorEn: p[5],
      order: p[6], price: p[7] || null, oldPrice: p[8] || null, solo: !!p[7], visible: true,
      mainImg: 'images/products/' + p[0] + '.jpg', gallery: []
    };
  });

  /* ---------------- Shipping zones ---------------- */
  var GOVERNORATES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الشرقية', 'الدقهلية', 'المنوفية', 'الغربية', 'كفر الشيخ', 'البحيرة',
    'الإسماعيلية', 'السويس', 'بورسعيد', 'دمياط', 'بني سويف', 'الفيوم', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
    'البحر الأحمر', 'الوادي الجديد', 'مطروح', 'شمال سيناء', 'جنوب سيناء'];
  var SEED_SHIPPING = {
    zones: [
      { id: 'cairo', name: 'القاهرة والجيزة', price: 75 },
      { id: 'delta', name: 'الدلتا ومدن القناة', price: 95 },
      { id: 'upper', name: 'الصعيد وشمال سيناء', price: 110 },
      { id: 'redsea', name: 'البحر الأحمر ومطروح (الغردقة والساحل)', price: 125 },
      { id: 'far', name: 'جنوب سيناء والوادي الجديد', price: 150 }
    ],
    govZones: {
      'القاهرة': 'cairo', 'الجيزة': 'cairo',
      'الإسكندرية': 'delta', 'القليوبية': 'delta', 'الشرقية': 'delta', 'الدقهلية': 'delta', 'المنوفية': 'delta', 'الغربية': 'delta',
      'كفر الشيخ': 'delta', 'البحيرة': 'delta', 'دمياط': 'delta', 'الإسماعيلية': 'delta', 'السويس': 'delta', 'بورسعيد': 'delta',
      'بني سويف': 'upper', 'الفيوم': 'upper', 'المنيا': 'upper', 'أسيوط': 'upper', 'سوهاج': 'upper', 'قنا': 'upper', 'الأقصر': 'upper',
      'أسوان': 'upper', 'شمال سيناء': 'upper',
      'البحر الأحمر': 'redsea', 'مطروح': 'redsea',
      'جنوب سيناء': 'far', 'الوادي الجديد': 'far'
    },
    deliveryText: 'القاهرة والجيزة: من 1 إلى 3 أيام عمل\nباقي المحافظات: من 3 إلى 5 أيام عمل\nيوم الجمعة إجازة، وأوردرات المحافظات بتطلع يومي السبت والتلات.'
  };
  var DEFAULT_COVER_RE = /^images\/(product\d+_thumb|masnad\/\d+\/main|memory\/\d+)\.jpg$/;
  // ---- Collection pricing (v2) ----------------------------------------
  // YOURS now sells each line as one complete set, at the set price below.
  // These values are applied over whatever the database holds until the owner
  // saves that category or product in the admin, which stamps priceV3.
  function applyPriceDefaults(rawCats) {
    return rawCats.map(function (c) {
      var sc = SEED_CATEGORIES.filter(function (x) { return x.id === c.id; })[0];
      if (!sc) return c;
      var d = c.data || {};
      if (d.priceV3 === true) return c;                 // the owner set it themselves
      var merged = {};
      Object.keys(d).forEach(function (k) { merged[k] = d[k]; });
      merged.price = sc.price;
      merged.oldPrice = sc.oldPrice || null;
      merged.setOnly = true;
      merged.setName = sc.setName; merged.setNameEn = sc.setNameEn;
      merged.tagline = sc.tagline; merged.taglineEn = sc.taglineEn;
      if (!d.coverImg || /^images\/products\//.test(d.coverImg)) merged.coverImg = sc.coverImg;
      return { id: c.id, data: merged };
    });
  }
  // Same idea for products: only the ones marked solo in the seed carry a price
  // of their own; the rest are sold inside their set and must not show one.
  function applyProductPriceDefaults(rawProds) {
    return rawProds.map(function (p) {
      var sp = SEED_PRODUCTS.filter(function (x) { return x.id === p.id; })[0];
      if (!sp) return p;
      var d = p.data || {};
      if (d.priceV3 === true) return p;
      var merged = {};
      Object.keys(d).forEach(function (k) { merged[k] = d[k]; });
      merged.price = sp.price || null;
      merged.oldPrice = sp.oldPrice || null;
      merged.solo = sp.solo === true;
      return { id: p.id, data: merged };
    });
  }

  /* ---------------- Verified product details (v1) ----------------------
     Supplied by the owner with the product-page brief, and published only as
     far as that brief allows:
       - Hydration conditioner and mask carry the sulfate/paraben/heavy-silicone
         and keratin/protein-treated claims, confirmed as approved by the owner.
       - Luxury carries only the claims written in its own product copy.
       - YOURS Go has NO ingredient or directions data yet. The brief says not to
         copy Luxury's into it without confirmed formula equivalence, so its
         sections stay empty and the owner sees them flagged in the admin.
     Nothing here claims hair growth, permanent repair, bond reconstruction or
     the treatment of any medical condition. */
  var PRODUCT_DETAILS = {
    'luxury-shampoo-500': {
      size: '500 مل', sizeEn: '500 ml',
      description: 'شامبو العناية اليومية من مجموعة Luxury، بيغسل الشعر وفروة الرأس بلطف وبيبدأ بيه الروتين.',
      descriptionEn: 'The daily cleansing step of the Luxury routine: it washes hair and scalp gently and opens the routine.',
      benefits: ['تنظيف لطيف للشعر وفروة الرأس', 'وصف المنتج بيقول إنه بينضّف من غير سلفات', 'بيدعم النعومة وسهولة التسريح'],
      benefitsEn: ['Gentle cleansing for hair and scalp', 'The product copy describes sulfate-free cleansing', 'Supports softness and manageability'],
      ingredients: 'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Caffeine, Biotin, Niacinamide, Hydrolyzed Keratin, Silk Amino Acids, Panthenol, Glycerin, Sodium Chloride, Citric Acid, Fragrance, Natural Preservative System',
      directions: 'دلّكيه على الشعر وفروة الرأس وهما مبلولين، اشطفي كويس، وبعديه استخدمي بلسم Luxury.',
      directionsEn: 'Massage into wet scalp and hair, rinse thoroughly, and follow with the Luxury Conditioner.',
      notes: 'ده منتج عناية تجميلية. مش علاج لتساقط الشعر ولا لأي حالة طبية في فروة الرأس.',
      notesEn: 'This is a cosmetic hair-care product. It is not a treatment for hair loss or any medical scalp condition.'
    },
    'luxury-conditioner-500': {
      size: '500 مل', sizeEn: '500 ml',
      description: 'بلسم Luxury بيترك على الأطوال والأطراف دقيقتين لتلات، بيرطّب وبيسهّل التسريح.',
      descriptionEn: 'The Luxury conditioner sits on mid-lengths and ends for 2–3 minutes to soften and ease detangling.',
      benefits: ['نعومة وترطيب', 'تسريح أسهل', 'تغذية للأطوال والأطراف'],
      benefitsEn: ['Softness and moisture', 'Easier detangling', 'Nourishment for mid-lengths and ends'],
      ingredients: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Argan Oil, Jojoba Oil, Panthenol, Ceramides, Glycerin, Hydrolyzed Vegetable Protein, Citric Acid, Fragrance, Natural Preservative System',
      directions: 'حطيه من نص الطول للأطراف، سيبيه من دقيقتين لـ 3 دقايق، وبعدين اشطفي كويس.',
      directionsEn: 'Apply to mid-lengths and ends, leave for 2–3 minutes, then rinse thoroughly.'
    },
    'luxury-mask-500': {
      size: '500 مل', sizeEn: '500 ml',
      description: 'ماسك Luxury للعناية المركزة بالشعر الجاف أو الضعيف أو اللي شكله تالف.',
      descriptionEn: 'The Luxury mask: intensive care for hair that looks dry, brittle or damaged.',
      benefits: ['عناية مركزة للشعر الجاف والضعيف', 'ترطيب ونعومة', 'لمعان وسهولة في التحكم'],
      benefitsEn: ['Intensive care for dry, brittle hair', 'Hydration and softness', 'Shine and manageability'],
      ingredients: 'Hydrolyzed Vegetable Protein, Shea Butter, Aloe Vera Extract, Vitamin E, Argan Oil',
      directions: 'حطيه على الشعر وسيبيه من 5 لـ 20 دقيقة حسب تعليمات المنتج، وبعدين اشطفي كويس.',
      directionsEn: 'Apply to the hair, leave for 5–20 minutes according to the product directions, then rinse thoroughly.',
      frequency: 'مرة أو مرتين في الأسبوع', frequencyEn: 'Once or twice a week',
      notes: 'بيدي ترطيب ونعومة ولمعان مع الاستخدام المنتظم. مابنوعدش بترميم دائم ولا إعادة بناء روابط البروتين.',
      notesEn: 'It supports hydration, softness and shine with regular use. We do not promise permanent repair or protein-bond reconstruction.'
    },
    'luxury-serum-75': {
      size: '75 مل', sizeEn: '75 ml',
      description: 'سيروم Luxury، آخر خطوة في الروتين، بيتحط وميتشطفش.',
      descriptionEn: 'The Luxury serum: the final, leave-in step of the routine.',
      benefits: ['تحكّم في الهيشان', 'لمعان ونعومة', 'وصف المنتج بيقول حماية حرارية لحد 230 درجة'],
      benefitsEn: ['Frizz control', 'Shine and smoothness', 'The product copy states thermal protection up to 230°C'],
      ingredients: 'Macadamia Oil, Squalane, Vitamin F, Cyclopentasiloxane, Dimethiconol',
      directions: 'ضغطة أو اتنين على شعر نص نشفان أو ناشف، ركّزي على نص الطول والأطراف. من غير شطف.',
      directionsEn: 'Apply 1–2 pumps to damp or dry hair, focusing on mid-lengths and ends. Do not rinse.',
      notes: 'بيحسّن شكل الأطراف المتقصفة، بس مابيصلّحهاش بشكل دائم.',
      notesEn: 'It improves the look of split ends; it does not permanently repair them.'
    },

    'hydration-shampoo-1000': {
      size: '1 لتر', sizeEn: '1 L',
      description: 'شامبو Hydration بتركيبة الأرچان، بينضّف بلطف وبيدي ترطيب أثناء الغسيل.',
      descriptionEn: 'The Hydration shampoo with its argan formula: gentle cleansing with hydration during the wash.',
      benefits: ['تنظيف لطيف', 'ترطيب أثناء الغسيل', 'مناسب للشعر الجاف والتالف'],
      benefitsEn: ['Gentle cleansing', 'Hydration during washing', 'Suited to dry and damaged hair'],
      ingredients: 'Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Panthenol, Hydrolyzed Keratin, Aloe Vera Extract, Argan Oil, Silk Proteins',
      directions: 'حطيه على شعر وفروة مبلولين، دلّكي بلطف، اشطفي كويس، وكرّري لو محتاجة.',
      directionsEn: 'Apply to wet hair and scalp, massage gently, rinse thoroughly, and repeat if needed.'
    },
    'hydration-conditioner-1000': {
      size: '1 لتر', sizeEn: '1 L',
      description: 'بلسم Hydration، ترطيب فوري وتغذية وتسريح أسهل.',
      descriptionEn: 'The Hydration conditioner: instant hydration, nourishment and easier detangling.',
      benefits: ['ترطيب فوري', 'تغذية ونعومة', 'تسريح أسهل'],
      benefitsEn: ['Instant hydration', 'Nourishment and softness', 'Easier detangling'],
      ingredients: 'Behentrimonium Methosulfate, Shea Butter, Avocado Oil, Rice Protein, Vitamin E, Hyaluronic Acid',
      directions: 'حطيه من نص الطول للأطراف، سيبيه من 5 لـ 10 دقايق، وبعدين اشطفي كويس.',
      directionsEn: 'Apply to mid-lengths and ends, leave for 5–10 minutes, then rinse thoroughly.',
      notes: 'معلومات المنتج بتقول إنه خالي من السلفات والبارابين والسيليكون الثقيل، ومناسب لكل أنواع الشعر بما فيها الشعر المعالج بالكيراتين أو البروتين.',
      notesEn: 'The product information states that it is free from sulfates, parabens and heavy silicones, and suitable for all hair types including keratin- or protein-treated hair.',
      afterTreatment: true
    },
    'hydration-mask-500': {
      size: '500 مل', sizeEn: '500 ml',
      description: 'ماسك Hydration للعناية المركزة بالشعر الجاف واللي شكله تالف.',
      descriptionEn: 'The Hydration mask: intensive care for hair that looks dry and damaged.',
      benefits: ['عناية مركزة للشعر الجاف', 'ترطيب عميق', 'نعومة بعد الاستخدام'],
      benefitsEn: ['Intensive care for dry hair', 'Deep hydration', 'Softness after use'],
      ingredients: 'Coconut Oil, Baobab Oil, Hydrolyzed Collagen, Ceramides, Honey Extract, Amino Acids Complex',
      directions: 'حطيه بسخاء على شعر نضيف ونص نشفان من الجذور للأطراف، سيبيه من 10 لـ 15 دقيقة، وبعدين اشطفي كويس.',
      directionsEn: 'Apply generously to clean, towel-dried hair from roots to ends, leave for 10–15 minutes, then rinse thoroughly.',
      frequency: 'مرة أو مرتين في الأسبوع', frequencyEn: 'Once or twice a week',
      notes: 'معلومات المنتج بتقول إنه خالي من السلفات والبارابين والسيليكون الثقيل، ومناسب لكل أنواع الشعر بما فيها الشعر المعالج بالكيراتين أو البروتين.',
      notesEn: 'The product information states that it is free from sulfates, parabens and heavy silicones, and suitable for all hair types including keratin- or protein-treated hair.',
      afterTreatment: true
    },
    'hydration-serum-100': {
      size: '100 مل', sizeEn: '100 ml',
      description: 'سيروم Hydration، بيتحط في الآخر وميتشطفش.',
      descriptionEn: 'The Hydration serum: applied last and left in.',
      benefits: ['لمعان ونعومة', 'تقليل الهيشان', 'حماية حرارية حسب وصف المنتج'],
      benefitsEn: ['Shine and smoothness', 'Less frizz', 'Heat protection as described by the manufacturer'],
      ingredients: 'Cyclopentasiloxane, Dimethicone, Jojoba Oil, Marula Oil, Vitamin C, Ferulic Acid, Black Seed Oil',
      directions: 'كام نقطة على شعر نص نشفان أو ناشف، ركّزي على نص الطول والأطراف. من غير شطف.',
      directionsEn: 'Apply a few drops to damp or dry hair, focusing on mid-lengths and ends. Do not rinse.'
    }
  };
  // Products whose ingredient and directions data the owner has not supplied yet.
  // They render without those sections rather than borrowing another line's.
  var DETAILS_PENDING = ['go-shampoo-250', 'go-conditioner-250', 'go-mask-250', 'go-serum-50'];
  var GO_SIZES = { 'go-shampoo-250': '250 مل', 'go-conditioner-250': '250 مل', 'go-mask-250': '250 مل', 'go-serum-50': '50 مل' };
  var GO_SIZES_EN = { 'go-shampoo-250': '250 ml', 'go-conditioner-250': '250 ml', 'go-mask-250': '250 ml', 'go-serum-50': '50 ml' };
  function detailsOf(id) {
    var d = PRODUCT_DETAILS[id];
    if (d) return d;
    if (GO_SIZES[id]) return { size: GO_SIZES[id], sizeEn: GO_SIZES_EN[id], pending: true };
    return null;
  }
  // Force the verified details onto the stored product unless the owner has
  // edited that product in the admin, which stamps detailsV1.
  function applyProductDetails(rawProds) {
    return rawProds.map(function (p) {
      var det = detailsOf(p.id);
      if (!det) return p;
      var d = p.data || {};
      if (d.detailsV1 === true) return p;
      var merged = {};
      Object.keys(d).forEach(function (k) { merged[k] = d[k]; });
      Object.keys(det).forEach(function (k) { merged[k] = det[k]; });
      if (det.description && !d.description) merged.description = det.description;
      return { id: p.id, data: merged };
    });
  }
  var PRODUCT_RENAMES = {};
  function applyNameFixes(rawProds) { return applyProductDetails(applyProductPriceDefaults(rawProds)); }

  function seedCategoryPatch(id, cur) {
    var sc = SEED_CATEGORIES.filter(function (c) { return c.id === id; })[0];
    if (!sc) return null;
    cur = cur || {};
    var patch = { shortName: sc.shortName, tagline: sc.tagline, description: sc.description, bestFor: sc.bestFor, chooser: sc.chooser, badge: sc.badge, specs: sc.specs };
    if (!cur.coverImg || DEFAULT_COVER_RE.test(cur.coverImg)) patch.coverImg = sc.coverImg;
    return patch;
  }
  // The shop's number changed. Until the owner saves the new one in the admin,
  // a database still holding the old line must not keep sending customers to it.
  var RETIRED_WHATSAPP = ['201069000231'];
  function retiredNumber(n) { return (n && RETIRED_WHATSAPP.indexOf(n) > -1) ? null : n; }

  function normalizeShipping(d) {
    d = d || {};
    var zones = (Array.isArray(d.zones) ? d.zones : []).map(function (z, i) {
      return { id: String((z && z.id) || ('z' + i)), name: String((z && z.name) || ''), price: Math.max(0, Math.round(num(z && z.price, 0))) };
    }).filter(function (z) { return z.name; });
    if (!zones.length) return JSON.parse(JSON.stringify(SEED_SHIPPING));
    var ids = zones.map(function (z) { return z.id; });
    var govZones = {};
    GOVERNORATES.forEach(function (g) {
      var zid = d.govZones && d.govZones[g];
      govZones[g] = ids.indexOf(zid) > -1 ? zid : null;
    });
    return { zones: zones, govZones: govZones, deliveryText: (typeof d.deliveryText === 'string' && d.deliveryText.trim()) ? d.deliveryText : SEED_SHIPPING.deliveryText };
  }


  /* ---------------- Utils ---------------- */
  var LANG_KEY = 'yours_lang';
  function lang() {
    try { var v = localStorage.getItem(LANG_KEY); if (v === 'en' || v === 'ar') return v; } catch (e) {}
    return 'ar';
  }
  function setLang(v) {
    try { localStorage.setItem(LANG_KEY, v === 'en' ? 'en' : 'ar'); } catch (e) {}
  }
  function isEn() { return lang() === 'en'; }
  // pick('name') → name in Arabic, nameEn in English (falls back to Arabic if missing)
  function pick(obj, field) {
    if (!obj) return '';
    if (isEn()) {
      var k = field + 'En';
      if (obj[k]) return obj[k];
    }
    return obj[field] || '';
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function num(v, fallback) {
    var n = typeof v === 'number' ? v : parseFloat(String(v == null ? '' : v).replace(/[^\d.]/g, ''));
    return isFinite(n) ? n : fallback;
  }
  function toLatinDigits(s) {
    return String(s || '').replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); })
      .replace(/[۰-۹]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
  }
  function money(n) { return Math.round(num(n, 0)).toLocaleString('en-US') + (isEn() ? ' EGP' : ' ج'); }
  function randomId(len) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', out = '';
    var arr = (global.crypto && global.crypto.getRandomValues) ? global.crypto.getRandomValues(new Uint8Array(len || 20)) : null;
    for (var i = 0; i < (len || 20); i++) out += chars[arr ? arr[i] % chars.length : Math.floor(Math.random() * chars.length)];
    return out;
  }
  function validRatio(r) { return /^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(String(r || '')) ? r : '1/1'; }

  /* ---------------- Normalizers ---------------- */
  function normalizeCategory(id, d) {
    d = d || {};
    return {
      id: id,
      name: d.name || 'صنف بدون اسم',
      shortName: d.shortName || '',
      nameEn: d.nameEn || '', taglineEn: d.taglineEn || '', descriptionEn: d.descriptionEn || '', bestForEn: d.bestForEn || '', chooserEn: d.chooserEn || '',
      usage: d.usage || '', usageEn: d.usageEn || '',
      icon: d.icon || '🕌',
      tagline: d.tagline || '',
      description: d.description || '',
      bestFor: d.bestFor || '',
      chooser: d.chooser || '',
      price: num(d.price, 0),
      oldPrice: num(d.oldPrice, 0) || null,
      badge: d.badge || '',
      bundle: (function () {
        var bq = num(d.bundleQty, 0), bt = num(d.bundleTotal, 0), be = num(d.bundleExtra, 0);
        if (bq >= 2 && bt > 0) return { minQty: Math.round(bq), total: bt, extraUnit: be > 0 ? be : 0 };
        return null;
      })(),
      cardRatio: validRatio(d.cardRatio),
      imageFit: d.imageFit === 'cover' ? 'cover' : 'contain',
      coverImg: d.coverImg || '',
      // YOURS sells each line as one complete set: the price above is the set price.
      // setOnly false would turn the line back into separately-sold products.
      setOnly: d.setOnly !== false,
      setName: d.setName || '', setNameEn: d.setNameEn || '',
      specs: (Array.isArray(d.specs) ? d.specs.filter(function (s) { return s && (s.label || s.value); }) : []).map(function (sp) {
        return { label: sp.label || '', value: sp.value || '', labelEn: sp.labelEn || '', valueEn: sp.valueEn || '' };
      }),
      order: num(d.order, 999),
      visible: d.visible !== false
    };
  }
  function normalizeProduct(id, d) {
    d = d || {};
    var main = d.mainImg || d.imageUrl || d.img || '';
    var gallery = Array.isArray(d.gallery) ? d.gallery.filter(Boolean) : [];
    return {
      id: id,
      categoryId: d.categoryId || '',
      name: d.name || 'منتج بدون اسم',
      color: d.color || '',
      description: d.description || '',
      nameEn: d.nameEn || '', colorEn: d.colorEn || '', descriptionEn: d.descriptionEn || '',
      price: num(d.price, 0) || null,
      oldPrice: num(d.oldPrice, 0) || null,
      // solo: this product may also be bought on its own, at its own price.
      // Everything else in a set-only line is sold as part of the set.
      solo: d.solo === true && num(d.price, 0) > 0,
      mainImg: main,
      gallery: gallery,
      order: num(d.order, 999),
      visible: d.visible !== false,
      // verified product details (see PRODUCT_DETAILS); every one is optional
      // and a missing field renders as no section rather than as a guess
      size: d.size || '', sizeEn: d.sizeEn || '',
      benefits: Array.isArray(d.benefits) ? d.benefits.filter(Boolean) : [],
      benefitsEn: Array.isArray(d.benefitsEn) ? d.benefitsEn.filter(Boolean) : [],
      ingredients: d.ingredients || '',
      directions: d.directions || '', directionsEn: d.directionsEn || '',
      frequency: d.frequency || '', frequencyEn: d.frequencyEn || '',
      notes: d.notes || '', notesEn: d.notesEn || '',
      faqs: Array.isArray(d.faqs) ? d.faqs.filter(function (f) { return f && f.q; }) : [],
      faqsEn: Array.isArray(d.faqsEn) ? d.faqsEn.filter(function (f) { return f && f.q; }) : [],
      afterTreatment: d.afterTreatment === true,
      detailsPending: d.pending === true,
      detailsV1: d.detailsV1 === true
    };
  }
  function byOrder(a, b) { return (a.order - b.order) || String(a.name).localeCompare(String(b.name), 'ar'); }

  /* ---------------- Firestore REST ---------------- */
  var FS_BASE = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.firebase.projectId + '/databases/(default)/documents';
  var FS_DOC_PREFIX = 'projects/' + CONFIG.firebase.projectId + '/databases/(default)/documents/';

  function decodeValue(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('booleanValue' in v) return v.booleanValue;
    if ('nullValue' in v) return null;
    if ('timestampValue' in v) return v.timestampValue;
    if ('mapValue' in v) return decodeFields(v.mapValue.fields || {});
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(decodeValue);
    if ('referenceValue' in v) return v.referenceValue;
    if ('geoPointValue' in v) return v.geoPointValue;
    return null;
  }
  function decodeFields(fields) {
    var o = {};
    Object.keys(fields || {}).forEach(function (k) { o[k] = decodeValue(fields[k]); });
    return o;
  }
  function encodeValue(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (v instanceof Date) return { timestampValue: v.toISOString() };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(encodeValue) } };
    return { mapValue: { fields: encodeFields(v) } };
  }
  function encodeFields(obj) {
    var f = {};
    Object.keys(obj || {}).forEach(function (k) { if (obj[k] !== undefined) f[k] = encodeValue(obj[k]); });
    return f;
  }
  function docId(name) { return String(name).split('/').pop(); }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
      promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  function fsList(collection, timeoutMs) {
    var docs = [];
    function page(token) {
      var url = FS_BASE + '/' + collection + '?pageSize=300&key=' + CONFIG.firebase.apiKey + (token ? '&pageToken=' + encodeURIComponent(token) : '');
      return fetch(url, { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (j) {
        (j.documents || []).forEach(function (d) { docs.push({ id: docId(d.name), data: decodeFields(d.fields) }); });
        return j.nextPageToken ? page(j.nextPageToken) : docs;
      });
    }
    return withTimeout(page(null), timeoutMs || 6000);
  }
  function fsGet(path, timeoutMs) {
    var url = FS_BASE + '/' + path + '?key=' + CONFIG.firebase.apiKey;
    return withTimeout(fetch(url, { cache: 'no-store' }).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json().then(function (d) { return decodeFields(d.fields); });
    }), timeoutMs || 8000);
  }
  function fsCommit(writes, opts) {
    opts = opts || {};
    return fetch(FS_BASE + ':commit?key=' + CONFIG.firebase.apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes: writes }),
      keepalive: !!opts.keepalive
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error((j && j.error && j.error.message) || ('HTTP ' + r.status));
        return j;
      });
    });
  }
  function writeCreate(path, data, serverTimeFields) {
    return {
      update: { name: FS_DOC_PREFIX + path, fields: encodeFields(data) },
      currentDocument: { exists: false },
      updateTransforms: (serverTimeFields || []).map(function (f) { return { fieldPath: f, setToServerValue: 'REQUEST_TIME' }; })
    };
  }
  function writeIncrement(path, increments, serverTimeFields) {
    var transforms = Object.keys(increments).map(function (k) {
      return { fieldPath: k, increment: encodeValue(Math.round(increments[k])) };
    });
    (serverTimeFields || []).forEach(function (f) { transforms.push({ fieldPath: f, setToServerValue: 'REQUEST_TIME' }); });
    return { update: { name: FS_DOC_PREFIX + path, fields: {} }, updateMask: { fieldPaths: [] }, updateTransforms: transforms };
  }
  function writeMerge(path, data, serverTimeFields) {
    return {
      update: { name: FS_DOC_PREFIX + path, fields: encodeFields(data) },
      updateMask: { fieldPaths: Object.keys(data) },
      updateTransforms: (serverTimeFields || []).map(function (f) { return { fieldPath: f, setToServerValue: 'REQUEST_TIME' }; })
    };
  }

  /* ---------------- Media (images saved inside Firestore) ---------------- */
  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  var mediaCache = {};
  var mediaPending = {};

  function isMedia(ref) { return typeof ref === 'string' && ref.indexOf('media:') === 0; }
  function mediaDocId(ref, variant) { var id = ref.slice(6); return variant === 't' ? id + '_t' : id; }

  function imgTag(ref, o) {
    o = o || {};
    var attrs = ' alt="' + esc(o.alt || '') + '"' + (o.cls ? ' class="' + esc(o.cls) + '"' : '') +
      (o.loading === 'eager' ? '' : ' loading="lazy"') + ' decoding="async"' + (o.extra || '');
    if (!ref) return '<img src="' + BLANK + '"' + attrs + '>';
    if (isMedia(ref)) {
      var key = mediaDocId(ref, o.variant);
      if (mediaCache[key]) return '<img src="' + mediaCache[key] + '"' + attrs + '>';
      return '<img src="' + BLANK + '" data-media="' + esc(ref) + '" data-variant="' + (o.variant || 'f') + '"' + attrs + '>';
    }
    return '<img src="' + esc(ref) + '"' + attrs + '>';
  }

  function fetchMedia(keys) {
    var need = keys.filter(function (k) { return !mediaCache[k] && !mediaPending[k]; });
    if (!need.length) {
      return Promise.all(keys.map(function (k) { return mediaPending[k] || Promise.resolve(); }));
    }
    var p = fetch(FS_BASE + ':batchGet?key=' + CONFIG.firebase.apiKey, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents: need.map(function (k) { return FS_DOC_PREFIX + 'media/' + k; }) })
    }).then(function (r) { return r.json(); }).then(function (arr) {
      (Array.isArray(arr) ? arr : []).forEach(function (item) {
        if (item.found) {
          var d = decodeFields(item.found.fields);
          if (d.data) mediaCache[docId(item.found.name)] = d.data;
        }
      });
    }).catch(function () {}).then(function () { need.forEach(function (k) { delete mediaPending[k]; }); });
    need.forEach(function (k) { mediaPending[k] = p; });
    return Promise.all(keys.map(function (k) { return mediaPending[k] || Promise.resolve(); }));
  }

  // images whose stored data could not be found: flag the card so it never looks empty
  var MISSING_BOXES = '.p-img, .cat-card-media, .line-img, .s-img, .g-main, .g-thumb, .cat-banner, .pa-img, .img-thumb, .single-img-thumb, .design-rank-img, .order-thumb';
  function markUnresolved(imgs) {
    imgs.forEach(function (img) {
      if (!img.getAttribute('data-media')) return;
      var box = (img.closest && img.closest(MISSING_BOXES)) || img.parentElement;
      if (box) box.classList.add('img-missing');
    });
  }

  // Replace placeholder <img data-media> in a container. Thumbs fall back to full image.
  function hydrateMedia(root) {
    root = root || document;
    var imgs = Array.prototype.slice.call(root.querySelectorAll('img[data-media]'));
    if (!imgs.length) return Promise.resolve();
    var keys = {};
    imgs.forEach(function (img) { keys[mediaDocId(img.getAttribute('data-media'), img.getAttribute('data-variant'))] = 1; });
    return fetchMedia(Object.keys(keys)).then(function () {
      var missing = {};
      imgs.forEach(function (img) {
        var ref = img.getAttribute('data-media'), v = img.getAttribute('data-variant');
        var k = mediaDocId(ref, v);
        if (mediaCache[k]) { img.src = mediaCache[k]; img.removeAttribute('data-media'); }
        else if (v === 't') missing[mediaDocId(ref, 'f')] = 1;
      });
      var fullKeys = Object.keys(missing);
      if (!fullKeys.length) return markUnresolved(imgs);
      return fetchMedia(fullKeys).then(function () {
        imgs.forEach(function (img) {
          var ref = img.getAttribute('data-media');
          if (ref && mediaCache[mediaDocId(ref, 'f')]) { img.src = mediaCache[mediaDocId(ref, 'f')]; img.removeAttribute('data-media'); }
        });
        markUnresolved(imgs);
      });
    });
  }

  // Public URL usable outside the site (Telegram); null for Firestore-stored images
  function absoluteUrl(ref) {
    if (!ref || isMedia(ref) || /^data:/.test(ref)) return null;
    if (/^https?:\/\//i.test(ref)) return ref;
    if (location.protocol === 'file:') return null;
    return new URL(ref, location.href).href;
  }

  /* ---------------- Catalog ---------------- */
  var CACHE_KEY = 'yours_catalog_v3';   // bumped with the collection pricing: no visitor keeps an old cached price

  function buildCatalog(rawCats, rawProds, settings, source) {
    var categories = rawCats.map(function (c) { return normalizeCategory(c.id, c.data); }).sort(byOrder);
    var products = rawProds.map(function (p) { return normalizeProduct(p.id, p.data); }).sort(byOrder);
    var s = settings || {};
    // Until the owner saves the offers panel once (which stamps offersV1),
    // the launch offers below are what runs.
    var offers = normalizeOffers(s.offersV1 === true ? s.offers : SEED_OFFERS);
    applyOffers(categories, offers);
    return {
      source: source,
      categories: categories,
      products: products,
      settings: {
        storeName: s.name || CONFIG.defaults.storeName,
        whatsapp: retiredNumber(normalizeWhatsapp(s.whatsapp)) || CONFIG.defaults.whatsapp,
        shipping: num(s.shipping, CONFIG.defaults.shipping),
        shippingCompany: s.shippingCompany || '',
        // Electronic payment is on unless the owner turns it off in the admin.
        // (paymentV2 marks settings saved after this feature shipped.)
        allowTransfer: s.paymentV2 === true ? s.allowTransfer === true : true,
        instapayLink: s.instapayLink || CONFIG.defaults.instapayLink,
        instapayHandle: s.instapayHandle || CONFIG.defaults.instapayHandle,
        walletNumber: s.walletNumber || CONFIG.defaults.walletNumber,
        // Discount codes reach the storefront as hashes only: the snapshot is
        // public, so the codes themselves never leave the admin.
        discounts: normalizeDiscounts(s.discounts),
        offers: offers
      },
      shipping: normalizeShipping(s.__shipping),
      theme: (settings && settings.__theme) || {}
    };
  }
  function normalizeWhatsapp(v) {
    var d = toLatinDigits(v).replace(/\D/g, '');
    if (!d) return '';
    if (d.indexOf('0') === 0) d = '2' + d;           // 010... -> 2010...
    if (d.indexOf('20') !== 0 && d.length === 10) d = '20' + d;
    return d;
  }
  function seedCatalog(source) {
    return buildCatalog(
      SEED_CATEGORIES.map(function (c) { return { id: c.id, data: c }; }),
      // the seed table holds names and prices; the verified ingredients,
      // directions and sizes live in PRODUCT_DETAILS and are merged here too
      applyProductDetails(SEED_PRODUCTS.map(function (p) { return { id: p.id, data: p }; })),
      null, source || 'seed');
  }
  var CACHE_TTL = 45 * 1000; // admin edits reach customers within a minute
  function readCacheEntry() {
    try { var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); return (c && c.data) ? c : null; } catch (e) { return null; }
  }
  function readCache() { var c = readCacheEntry(); return c ? c.data : null; }
  function writeCache(cat) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: cat })); } catch (e) {}
  }

  // Catalog file hosted next to the site (GitHub). Costs nothing, never rate-limited,
  // and keeps the shop working even when Firebase refuses requests.
  function fetchStatic() {
    return withTimeout(fetch('catalog.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !Array.isArray(j.products) || !j.products.length) throw new Error('empty catalog file');
      var store = j.settings || {};
      store.__theme = j.theme || {};
      store.__shipping = j.shipping || null;
      return buildCatalog(
        applyPriceDefaults(j.categories.map(function (c) { return { id: c.id, data: c }; })),
        applyNameFixes(j.products.map(function (p) { return { id: p.id, data: p }; })),
        store, 'static');
    }), 6000);
  }

  // One document holding the whole catalog, published by the admin on every change.
  // Costs a single Firestore read per visitor instead of one per product and image.
  function fetchSnapshot() {
    return fsGet('meta/snapshot', 6000).then(function (snap) {
      if (!snap || !Array.isArray(snap.categories) || !Array.isArray(snap.products) || !snap.products.length) return null;
      var store = snap.settings || {};
      store.__theme = snap.theme || {};
      store.__shipping = snap.shipping || null;
      return buildCatalog(
        applyPriceDefaults(snap.categories.map(function (c) { return { id: c.id, data: c }; })),
        applyNameFixes(snap.products.map(function (p) { return { id: p.id, data: p }; })),
        store, 'live');
    });
  }
  function fetchCollections() {
    return Promise.all([
      fsGet('meta/catalog'),
      fsList('categories'),
      fsList('products'),
      fsList('settings')
    ]).then(function (res) {
      var meta = res[0] || {};
      var settingsDocs = res[3] || [];
      var store = {}, theme = {};
      var shippingDoc = null;
      settingsDocs.forEach(function (d) { if (d.id === 'store') store = d.data; if (d.id === 'theme') theme = d.data; if (d.id === 'shipping') shippingDoc = d.data; });
      store.__theme = theme;
      store.__shipping = shippingDoc;
      // Always trust Firestore when it actually holds a catalog: anything the owner adds
      // in the admin must reach customers, whatever version number is stored.
      var hasLive = (res[1] || []).length > 0 && (res[2] || []).length > 0;
      if (!hasLive) {
        // nothing in Firestore: use the catalog file shipped with the site
        return fetchStatic().catch(function () {
          return buildCatalog(
            SEED_CATEGORIES.map(function (c) { return { id: c.id, data: c }; }),
            applyProductDetails(SEED_PRODUCTS.map(function (p) { return { id: p.id, data: p }; })),
            store, 'seed-live');
        });
      }
      // Very old database (before the 3-category rollout): show its data *plus* the
      // defaults it is missing, so nothing ever disappears from the storefront.
      if (num(meta.version, 0) < 2) {
        var haveCat = {}, haveProd = {};
        res[1].forEach(function (c) { haveCat[c.id] = 1; });
        res[2].forEach(function (p) { haveProd[p.id] = 1; });
        var sameKind = { sponge: /[اإ]سفنج/, masnad: /مسند/, memory: /ميموري/ };
        SEED_CATEGORIES.forEach(function (c) {
          if (haveCat[c.id]) return;
          // the old database may hold the same kind under its own id: don't duplicate it
          var exists = res[1].some(function (x) {
            var n = (x.data && x.data.name) || '';
            return sameKind[c.id] && sameKind[c.id].test(n) && !(c.id === 'sponge' && /مسند|ميموري/.test(n));
          });
          if (!exists) res[1].push({ id: c.id, data: c });
        });
        SEED_PRODUCTS.forEach(function (p) { if (!haveProd[p.id] && !haveCat[p.categoryId]) res[2].push({ id: p.id, data: p }); });
      }
      var cats = res[1], prods = res[2];
      if (num(meta.version, 0) < CONFIG.catalogVersion) {
        // admin hasn't applied v3 yet: show the new details right away (in memory only)
        cats = cats.map(function (c) {
          var patch = seedCategoryPatch(c.id, c.data);
          return patch ? { id: c.id, data: Object.assign({}, c.data, patch) } : c;
        });
        prods = prods.map(function (p) {
          return (p.id === 'memory-2' && p.data.name === 'ميموري فوم — أسود فحمي') ? { id: p.id, data: Object.assign({}, p.data, { name: 'ميموري فوم — رمادي', color: 'رمادي' }) } : p;
        });
      }
      return buildCatalog(applyPriceDefaults(cats), applyNameFixes(prods), store, 'live');
    });
  }
  function fetchLiveCatalog() {
    return fetchSnapshot().then(function (fromSnap) {
      return fromSnap || fetchCollections();
    }, function (e) {
      var msg = (e && e.message) || '';
      console.warn('Snapshot read failed:', msg);
      // quota exhausted (429): don't hammer Firestore with more requests
      if (msg.indexOf('429') > -1) throw e;
      return fetchCollections();
    });
  }

  var catalogPromise = null;
  /**
   * loadCatalog(onUpdate)
   * - Calls onUpdate immediately with cached catalog (if any)
   * - Calls onUpdate again when live data arrives and differs
   * Returns a promise resolving to the freshest catalog.
   */
  // Reload straight from Firestore, ignoring any cached copy. Used before placing an
  // order so a hidden or deleted product can never be ordered from a stale page.
  function refreshCatalog() {
    catalogPromise = fetchLiveCatalog().then(function (live) { writeCache(live); return live; });
    return catalogPromise;
  }
  function loadCatalog(onUpdate) {
    // Always paint instantly from the stored copy, then check Firestore on every page
    // load (one document read) so admin changes show up without waiting.
    var cached = readCache();
    var cachedJson = cached ? JSON.stringify(cached) : '';
    var settled = false;
    if (cached && onUpdate) { try { onUpdate(cached, true); } catch (e) { console.error(e); } }
    // No copy on the device yet: paint from the catalog file hosted with the site.
    // It is instant, costs nothing, and works even when Firebase is refusing requests.
    if (!cached && onUpdate) {
      fetchStatic().then(function (stat) {
        if (settled) return;                     // live data already arrived: ignore
        try { onUpdate(stat, true); } catch (e) { console.error(e); }
      }).catch(function (e) { console.warn('catalog.json unavailable:', e && e.message); });
    }
    if (!catalogPromise) {
      catalogPromise = fetchLiveCatalog().then(function (live) {
        writeCache(live);
        return live;
      }).catch(function (err) {
        console.warn('Catalog live fetch failed:', err && err.message);
        // prefer the copy this visitor already received (it reflects hidden products and
        // admin edits), and only then the file shipped with the site
        if (cached) return cached;
        return fetchStatic().catch(function () { return seedCatalog('seed-offline'); });
      });
    }
    return catalogPromise.then(function (cat) {
      settled = true;
      if (onUpdate && JSON.stringify(cat) !== cachedJson) { try { onUpdate(cat, false); } catch (e) { console.error(e); } }
      return cat;
    });
  }

  /* ---------------- Catalog helpers ---------------- */
  function visibleCategories(cat) { return cat.categories.filter(function (c) { return c.visible; }); }
  function categoryById(cat, id) { return cat.categories.filter(function (c) { return c.id === id; })[0] || null; }
  function productById(cat, id) {
    id = String(id || '');
    if (/^\d+$/.test(id)) id = 'sponge-' + id;          // old links: product.html?id=3
    return cat.products.filter(function (p) { return p.id === id; })[0] || null;
  }
  function productsOf(cat, categoryId, includeHidden) {
    return cat.products.filter(function (p) { return p.categoryId === categoryId && (includeHidden || p.visible); });
  }
  /* ---------------- Collections sold as one set ----------------
     A line like "YOURS Luxury" is bought as a whole, so the thing that goes in
     the cart is the collection itself. It behaves like a product everywhere
     (cart, order, Telegram, pixel) and carries the id "set:<categoryId>".
     Individual products are only buyable when they are marked solo.          */
  var SET_PREFIX = 'set:';
  function isSetId(id) { return String(id || '').indexOf(SET_PREFIX) === 0; }
  function setIdOf(categoryId) { return SET_PREFIX + categoryId; }
  function categoryOfSetId(id) { return String(id || '').slice(SET_PREFIX.length); }
  function isSetCategory(c) { return !!(c && c.setOnly); }
  // The collection as a cart-ready product.
  function setProductOf(cat, c) {
    if (!c) return null;
    var items = productsOf(cat, c.id);
    return {
      id: setIdOf(c.id), categoryId: c.id, isSet: true,
      name: c.setName || (c.name + ' — المجموعة كاملة'),
      nameEn: c.setNameEn || ((c.nameEn || c.name) + ' — Complete Set'),
      color: items.map(function (p) { return p.name; }).join(' + '),
      colorEn: items.map(function (p) { return p.nameEn || p.name; }).join(' + '),
      description: c.description, descriptionEn: c.descriptionEn,
      price: c.price, oldPrice: c.oldPrice, solo: true,
      mainImg: c.coverImg, gallery: [],
      items: items, order: -1, visible: c.visible
    };
  }
  // Anything the cart may hold: a collection set, or a solo product.
  function buyableById(cat, id) {
    if (isSetId(id)) {
      var c = categoryById(cat, categoryOfSetId(id));
      return c ? setProductOf(cat, c) : null;
    }
    return productById(cat, id);
  }
  // Every buyable thing in the shop, in display order.
  function buyables(cat) {
    var out = [];
    visibleCategories(cat).forEach(function (c) {
      if (isSetCategory(c)) out.push(setProductOf(cat, c));
      productsOf(cat, c.id).forEach(function (p) { if (!isSetCategory(c) || p.solo) out.push(p); });
    });
    return out;
  }
  // still on sale at all: its page opens and its card shows
  function isProductAvailable(cat, p) {
    if (!p || !p.visible) return false;
    var c = categoryById(cat, p.categoryId);
    if (!c || !c.visible) return false;
    if (p.isSet) return productsOf(cat, c.id).length > 0;
    return true;
  }
  // may go into the cart on its own: a collection set, or a product marked solo
  function isBuyable(cat, p) {
    if (!isProductAvailable(cat, p)) return false;
    if (p.isSet) return true;
    var c = categoryById(cat, p.categoryId);
    return !isSetCategory(c) || p.solo === true;
  }
  function effectivePrice(cat, p) {
    if (p && p.price) return p.price;
    var c = p ? categoryById(cat, p.categoryId) : null;
    // a product sold only inside its set has no price of its own
    if (c && isSetCategory(c) && p && !p.isSet) return 0;
    return c ? c.price : 0;
  }
  function effectiveOldPrice(cat, p) {
    var price = effectivePrice(cat, p);
    if (!price) return null;
    var c = p ? categoryById(cat, p.categoryId) : null;
    var old = (p && p.oldPrice) || (p && !p.price && c ? c.oldPrice : null);
    return old && old > price ? old : null;
  }
  function shippingZoneFor(cat, gov) {
    var sh = (cat && cat.shipping) || normalizeShipping(null);
    var zid = sh.govZones[gov];
    var z = sh.zones.filter(function (x) { return x.id === zid; })[0];
    if (z) return z;
    // unmapped governorate: charge the highest zone so we never under-charge
    return sh.zones.slice().sort(function (a, b) { return b.price - a.price; })[0] || { id: '', name: '', price: CONFIG.defaults.shipping };
  }
  function minShipping(cat) {
    var sh = (cat && cat.shipping) || normalizeShipping(null);
    return sh.zones.reduce(function (m, z) { return Math.min(m, z.price); }, Infinity);
  }
  function bundleFor(cat, product) {
    var c = product ? categoryById(cat, product.categoryId) : null;
    return (c && c.bundle) ? c.bundle : null;
  }
  // Total for a quantity, applying the category offer (e.g. 2 for 1799, each extra at 900)
  function priceForQty(cat, product, qty) {
    qty = Math.max(0, Math.round(num(qty, 0)));
    var unit = effectivePrice(cat, product);
    var b = bundleFor(cat, product);
    if (!b || qty < b.minQty) return unit * qty;
    var extra = b.extraUnit > 0 ? b.extraUnit : unit;
    return b.total + (qty - b.minQty) * extra;
  }
  function bundleSaving(cat, product) {
    var b = bundleFor(cat, product);
    if (!b) return 0;
    return Math.max(0, effectivePrice(cat, product) * b.minQty - b.total);
  }
/* ---------------- Discount codes -------------------------------------
     The owner adds codes in the admin, each with its own percentage. Only a
     SHA-256 hash of each code travels to the storefront, because the snapshot
     every visitor reads is public; the code itself stays in settings/store.
     A customer types a code, the page hashes it the same way and compares. */
  function normalizeDiscounts(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (d) {
      if (!d) return null;
      var pct = num(d.percent, 0);
      if (!d.hash || !(pct > 0 && pct <= 100)) return null;
      return { hash: String(d.hash), percent: Math.round(pct), active: d.active !== false, label: d.label || '' };
    }).filter(Boolean);
  }
/* ---------------- Timed offers ---------------------------------------
     A collection can run at an offer price with a deadline the customer can
     see ticking. Two shapes, both with a REAL end moment:

       mode 'daily'  the price runs until midnight tonight, Cairo time, and
                     renews by itself for the next day. The page says
                     "today's offer price — until 12 tonight", which is true
                     whenever it is read, and the clock is the same for every
                     visitor. It never says this is the last chance, because
                     the offer comes back tomorrow.

       mode 'once'   the owner picks a date and time. When it passes the
                     price goes back to normal on its own and the offer is
                     over for good. This is the one to use for a real
                     last-chance sale.

     What this never does is restart the clock per visitor, or per page view,
     so that everybody sees "24 hours left" forever. A deadline that moves
     with the viewer is a false statement about the price, it is what the
     consumer-protection law and the ad platforms actually go after, and the
     first customer who comes back the next day can see it for herself.

     The deadline is resolved at catalog build time and checked again by the
     ticking clock on the page, so a price can never outlive its offer.      */
  // The offers running now. The owner changes these in the admin; the moment
  // he saves that panel these stop being used.
  var SEED_OFFERS = [
    { categoryId: 'go',        price: 499,  mode: 'daily', active: true },
    { categoryId: 'luxury',    price: 1199, mode: 'daily', active: true },
    { categoryId: 'hydration', price: 1999, mode: 'daily', active: true }
  ];
  var CAIRO_OFFSET_MIN = 120;              // Egypt sits on UTC+2 all year
  function endOfCairoDay(now) {
    var ms = (now == null ? Date.now() : now);
    var shifted = ms + CAIRO_OFFSET_MIN * 60000;         // into Cairo wall-clock
    var day = Math.floor(shifted / 86400000);
    return (day + 1) * 86400000 - CAIRO_OFFSET_MIN * 60000;   // midnight Cairo, back in UTC
  }
  function offerEndsAt(o, now) {
    if (!o) return 0;
    if (o.mode === 'daily') return endOfCairoDay(now);
    return num(o.endsAt, 0);
  }
  function normalizeOffers(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (o) {
      if (!o || !o.categoryId) return null;
      var price = num(o.price, 0);
      if (!(price > 0)) return null;
      var mode = o.mode === 'once' ? 'once' : 'daily';
      var endsAt = mode === 'once' ? num(o.endsAt, 0) : 0;
      if (mode === 'once' && !(endsAt > 0)) return null;
      return {
        categoryId: String(o.categoryId), price: Math.round(price),
        mode: mode, endsAt: endsAt, active: o.active !== false,
        label: o.label || '', labelEn: o.labelEn || ''
      };
    }).filter(Boolean);
  }
  // Puts the live offer price on the collection and keeps the normal price as
  // oldPrice, so every price on the site — cards, pages, cart, order, Telegram
  // — follows from one place and reverts by itself the moment the offer ends.
  function applyOffers(categories, offers, now) {
    if (!offers || !offers.length) return categories;
    var t = (now == null ? Date.now() : now);
    categories.forEach(function (c) {
      var o = offers.filter(function (x) { return x.active && x.categoryId === c.id; })[0];
      if (!o) return;
      var ends = offerEndsAt(o, t);
      if (!(ends > t)) return;                     // the offer is over
      if (!(o.price > 0 && o.price < c.price)) return;   // never raises a price
      c.oldPrice = c.price;
      c.price = o.price;
      c.offer = { price: o.price, was: c.oldPrice, endsAt: ends, mode: o.mode,
                  label: o.label, labelEn: o.labelEn };
    });
    return categories;
  }
  // The live offer on whatever is being priced (a collection, or a product
  // priced by its collection). Returns null once the deadline has passed.
  function offerFor(cat, thing) {
    if (!cat || !thing) return null;
    var c = thing.categoryId ? categoryById(cat, thing.categoryId) : thing;
    if (!c || !c.offer) return null;
    if (thing.categoryId && thing.price) return null;   // priced on its own, not by the set
    return c.offer.endsAt > Date.now() ? c.offer : null;
  }
  function anyOffer(cat) {
    return (cat && cat.categories || []).filter(function (c) {
      return c.offer && c.offer.endsAt > Date.now();
    });
  }
  function normalizeCode(code) { return String(code || '').trim().toUpperCase().replace(/\s+/g, ''); }
  function hashCode(code) {
    var clean = normalizeCode(code);
    if (!clean) return Promise.resolve('');
    var c = global.crypto && global.crypto.subtle;
    if (!c) return Promise.reject(new Error('no-crypto'));
    var bytes = new TextEncoder().encode('yours:' + clean);
    return c.digest('SHA-256', bytes).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }
  // Resolves to { percent, hash } when the code is live, or null.
  function lookupDiscount(cat, code) {
    var list = (cat && cat.settings && cat.settings.discounts) || [];
    if (!list.length) return Promise.resolve(null);
    return hashCode(code).then(function (h) {
      if (!h) return null;
      var hit = list.filter(function (d) { return d.active && d.hash === h; })[0];
      return hit ? { percent: hit.percent, hash: h } : null;
    });
  }
    function productImages(p) {
    var list = [];
    [p.mainImg].concat(p.gallery || []).forEach(function (src) { if (src && list.indexOf(src) === -1) list.push(src); });
    return list;
  }

  global.SedraData = {
    CONFIG: CONFIG,
    SEED_CATEGORIES: SEED_CATEGORIES,
    SEED_PRODUCTS: SEED_PRODUCTS,
    seedCategoryPatch: seedCategoryPatch, PRODUCT_RENAMES: PRODUCT_RENAMES,
    GOVERNORATES: GOVERNORATES, SEED_SHIPPING: SEED_SHIPPING, normalizeShipping: normalizeShipping, shippingZoneFor: shippingZoneFor, minShipping: minShipping,
    lang: lang, setLang: setLang, isEn: isEn, pick: pick,
    esc: esc, num: num, money: money, toLatinDigits: toLatinDigits, randomId: randomId, validRatio: validRatio,
    applyPriceDefaults: applyPriceDefaults, applyProductPriceDefaults: applyProductPriceDefaults,
    applyProductDetails: applyProductDetails, PRODUCT_DETAILS: PRODUCT_DETAILS, DETAILS_PENDING: DETAILS_PENDING,
    normalizeCategory: normalizeCategory, normalizeProduct: normalizeProduct, normalizeWhatsapp: normalizeWhatsapp, byOrder: byOrder,
    fs: { list: fsList, get: fsGet, commit: fsCommit, writeCreate: writeCreate, writeIncrement: writeIncrement, writeMerge: writeMerge, encodeFields: encodeFields, decodeFields: decodeFields },
    isMedia: isMedia, imgTag: imgTag, hydrateMedia: hydrateMedia,
    primeMedia: function (key, dataUrl) { mediaCache[key] = dataUrl; }, mediaDocId: mediaDocId, absoluteUrl: absoluteUrl, BLANK: BLANK,
    loadCatalog: loadCatalog, refreshCatalog: refreshCatalog, seedCatalog: seedCatalog,
    visibleCategories: visibleCategories, categoryById: categoryById, productById: productById, productsOf: productsOf,
    isProductAvailable: isProductAvailable, isBuyable: isBuyable, effectivePrice: effectivePrice, effectiveOldPrice: effectiveOldPrice, productImages: productImages,
    isSetId: isSetId, setIdOf: setIdOf, categoryOfSetId: categoryOfSetId, isSetCategory: isSetCategory,
    setProductOf: setProductOf, buyableById: buyableById, buyables: buyables,
    bundleFor: bundleFor, priceForQty: priceForQty, bundleSaving: bundleSaving,
    normalizeDiscounts: normalizeDiscounts, normalizeCode: normalizeCode, hashCode: hashCode, lookupDiscount: lookupDiscount,
    SEED_OFFERS: SEED_OFFERS,
    normalizeOffers: normalizeOffers, applyOffers: applyOffers, offerFor: offerFor, anyOffer: anyOffer,
    offerEndsAt: offerEndsAt, endOfCairoDay: endOfCairoDay
  };
})(window);
