// YOURS — Products & Collections  (single source of truth)
// ─────────────────────────────────────────────────────────
// soldAlone: true  → shown on Hair Care page & homepage grid
// soldAlone: false → bundle-only component, NOT sold individually

window.YOURS_PRODUCTS = [

  // ── SHAMPOO ──────────────────────────────────────────
  {
    id: 'shampoo_250',
    category: 'shampoo',
    nameAr: 'شامبو YOURS – 250 مل',
    nameEn: 'YOURS Shampoo – 250ml',
    descAr: 'شامبو ترميم عميق لجميع أنواع الشعر',
    descEn: 'Deep repair shampoo for all hair types',
    size: '250 ml',
    price: 220, oldPrice: 280,
    image: 'images/products/shampoo_250ml.jpg',
    inCollection: ['col3'], soldAlone: false, tag: null
  },
  {
    id: 'shampoo_500',
    category: 'shampoo',
    nameAr: 'شامبو YOURS – 500 مل',
    nameEn: 'YOURS Shampoo – 500ml',
    descAr: 'شامبو ترميم عميق بالأرجان',
    descEn: 'Deep repair argan shampoo',
    size: '500 ml',
    price: 320, oldPrice: 400,
    image: 'images/products/shampoo_500ml.jpg',
    inCollection: ['col2'], soldAlone: false, tag: null
  },
  {
    id: 'shampoo_1000',
    category: 'shampoo',
    nameAr: 'شامبو YOURS – لتر كامل',
    nameEn: 'YOURS Shampoo – 1000ml',
    descAr: 'شامبو ترميم عميق بالأرجان للشعر الجاف والتالف',
    descEn: 'Deep repair argan shampoo for dry and damaged hair',
    size: '1000 ml',
    price: 550, oldPrice: 700,
    image: 'images/products/shampoo_1000ml.jpg',
    inCollection: ['col1'], soldAlone: true, tag: 'الأكثر مبيعاً'
  },

  // ── CONDITIONER ──────────────────────────────────────
  {
    id: 'conditioner_250',
    category: 'conditioner',
    nameAr: 'بلسم YOURS – 250 مل',
    nameEn: 'YOURS Conditioner – 250ml',
    descAr: 'بلسم ترميم عميق لجميع أنواع الشعر',
    descEn: 'Deep repair conditioner for all hair types',
    size: '250 ml',
    price: 220, oldPrice: 280,
    image: 'images/products/conditioner_250ml.jpg',
    inCollection: ['col3'], soldAlone: false, tag: null
  },
  {
    id: 'conditioner_500',
    category: 'conditioner',
    nameAr: 'بلسم YOURS – 500 مل',
    nameEn: 'YOURS Conditioner – 500ml',
    descAr: 'بلسم ترميم عميق للشعر الجاف والتالف',
    descEn: 'Deep repair conditioner for dry and damaged hair',
    size: '500 ml',
    price: 320, oldPrice: 400,
    image: 'images/products/conditioner_500ml.jpg',
    inCollection: ['col2'], soldAlone: false, tag: null
  },
  {
    id: 'conditioner_1000',
    category: 'conditioner',
    nameAr: 'بلسم YOURS – لتر كامل',
    nameEn: 'YOURS Conditioner – 1000ml',
    descAr: 'بلسم ترميم عميق بالأرجان للشعر الجاف والتالف',
    descEn: 'Deep repair argan conditioner for dry and damaged hair',
    size: '1000 ml',
    price: 550, oldPrice: 700,
    image: 'images/products/conditioner_1000ml.jpg',
    inCollection: ['col1'], soldAlone: true, tag: null
  },

  // ── MASK ─────────────────────────────────────────────
  // 200g → YOURS Go only   |   500g → Gold Repair + Hydration
  {
    id: 'mask_200',
    category: 'mask',
    nameAr: 'ماسك الشعر YOURS – 200 جرام',
    nameEn: 'YOURS Hair Mask – 200g',
    descAr: 'تغذية وترميم لجميع أنواع الشعر',
    descEn: 'Nourish & repair treatment for all hair types',
    size: '200 g',
    price: 220, oldPrice: 280,
    image: 'images/products/mask_200ml.jpg',
    inCollection: ['col3'], soldAlone: false, tag: null
  },
  {
    id: 'mask_500',
    category: 'mask',
    nameAr: 'ماسك الشعر YOURS – 500 جرام',
    nameEn: 'YOURS Hair Mask – 500g',
    descAr: 'تغذية عميقة لجميع أنواع الشعر',
    descEn: 'Deep nourishment for all hair types',
    size: '500 g',
    price: 380, oldPrice: 480,
    image: 'images/products/mask_500ml.jpg',
    inCollection: ['col1', 'col2'], soldAlone: true, tag: null
  },

  // ── SERUM ────────────────────────────────────────────
  {
    id: 'serum_50',
    category: 'serum',
    nameAr: 'سيروم الشعر YOURS – 50 مل',
    nameEn: 'YOURS Hair Serum – 50ml',
    descAr: 'سيروم ترميم وترطيب لجميع أنواع الشعر',
    descEn: 'Repair & moisture serum for all hair types',
    size: '50 ml',
    price: 180, oldPrice: 220,
    image: 'images/products/serum_50ml.jpg',
    inCollection: ['col3'], soldAlone: false, tag: null
  },
  {
    id: 'serum_75',
    category: 'serum',
    nameAr: 'سيروم الشعر YOURS – 75 مل',
    nameEn: 'YOURS Hair Serum – 75ml',
    descAr: 'سيروم ترميم وترطيب',
    descEn: 'Repair and moisture serum',
    size: '75 ml',
    price: 200, oldPrice: 250,
    image: 'images/products/serum_75ml.jpg',
    inCollection: ['col2'], soldAlone: false, tag: null
  },
  {
    id: 'serum_100',
    category: 'serum',
    nameAr: 'سيروم YOURS – 100 مل',
    nameEn: 'YOURS Hair Serum – 100ml',
    descAr: 'سيروم ترميم وترطيب للشعر التالف',
    descEn: 'Repair and moisture serum for damaged hair',
    size: '100 ml',
    price: 280, oldPrice: 350,
    image: 'images/products/serum_100ml.jpg',
    inCollection: ['col1'], soldAlone: true, tag: null
  },

  // ── BODY CARE ────────────────────────────────────────
  {
    id: 'body_polish',
    category: 'body',
    nameAr: 'بودي بوليش YOURS – 300 مل',
    nameEn: 'YOURS Body Polish – 300ml',
    descAr: 'مقشر جسم فاخر لبشرة ناعمة ومشرقة',
    descEn: 'Luxury body scrub for smooth and radiant skin',
    size: '300 ml',
    price: 280, oldPrice: 350,
    image: 'images/products/body_polish_300ml.jpg',
    inCollection: [], soldAlone: true, tag: 'جديد'
  },
  {
    id: 'body_souffle',
    category: 'body',
    nameAr: 'بودي سوفليه YOURS – 300 مل',
    nameEn: 'YOURS Body Soufflé – 300ml',
    descAr: 'مرطب جسم فاخر بقوام سوفليه خفيف',
    descEn: 'Luxury body moisturizer with a light soufflé texture',
    size: '300 ml',
    price: 260, oldPrice: 320,
    image: 'images/products/body_souffle_300ml.jpg',
    inCollection: [], soldAlone: true, tag: null
  }
];

// ─────────────────────────────────────────────────────────
// COLLECTIONS — official names & fixed bundle prices
// col1 = YOURS Hydration   2500 EGP
// col2 = YOURS Gold Repair 1500 EGP
// col3 = YOURS Go           750 EGP
// ─────────────────────────────────────────────────────────
window.YOURS_COLLECTIONS = {

  col1: {
    active: true,
    nameAr: 'YOURS Hydration',
    nameEn: 'YOURS Hydration',
    products: ['shampoo_1000', 'conditioner_1000', 'mask_500', 'serum_100'],
    price: 2500,
    oldPrice: 3080,
    image: 'images/collections/collection1.jpg',
    descAr: 'طقم 4 قطع – شامبو 1000 مل · بلسم 1000 مل · ماسك 500 جرام · سيروم 100 مل',
    descEn: '4-piece set: Shampoo 1000ml · Conditioner 1000ml · Hair Mask 500g · Hair Serum 100ml',
    badge: 'الأفضل قيمة',
    saving: 580
  },

  col2: {
    active: true,
    nameAr: 'YOURS Gold Repair',
    nameEn: 'YOURS Gold Repair',
    products: ['shampoo_500', 'conditioner_500', 'mask_500', 'serum_75'],
    price: 1500,
    oldPrice: 1870,
    image: 'images/collections/collection2.jpg',
    descAr: 'طقم 4 قطع – شامبو 500 مل · بلسم 500 مل · ماسك 500 جرام · سيروم 75 مل',
    descEn: '4-piece set: Shampoo 500ml · Conditioner 500ml · Hair Mask 500g · Hair Serum 75ml',
    badge: 'الأكثر شعبية',
    saving: 370
  },

  col3: {
    active: true,
    nameAr: 'YOURS Go',
    nameEn: 'YOURS Go',
    products: ['shampoo_250', 'conditioner_250', 'mask_200', 'serum_50'],
    price: 750,
    oldPrice: 940,
    image: 'images/collections/collection3.jpg',
    descAr: 'طقم 4 قطع للتجربة – شامبو 250 مل · بلسم 250 مل · ماسك 200 جرام · سيروم 50 مل',
    descEn: '4-piece starter: Shampoo 250ml · Conditioner 250ml · Hair Mask 200g · Hair Serum 50ml',
    badge: 'للتجربة',
    saving: 190
  }
};




