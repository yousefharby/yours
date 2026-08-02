// YOURS Products Data
window.YOURS_PRODUCTS = [
  // ===== SHAMPOO =====
  {
    id: 'shampoo_1000',
    category: 'shampoo',
    nameAr: 'شامبو YOURS – لتر كامل',
    nameEn: 'YOURS Shampoo – 1000ml',
    descAr: 'شامبو للترميم العميق بالأرجان للشعر الجاف والتالف',
    descEn: 'Deep repair argan shampoo for dry and damaged hair',
    size: '1000 ml',
    price: 550,
    oldPrice: 700,
    image: 'images/products/shampoo_1000ml.jpg',
    inCollection: ['col1'],
    soldAlone: true,
    tag: 'الأكثر مبيعاً'
  },
  {
    id: 'shampoo_500',
    category: 'shampoo',
    nameAr: 'شامبو YOURS – 500 مل',
    nameEn: 'YOURS Shampoo – 500ml',
    descAr: 'شامبو للترميم العميق بالأرجان',
    descEn: 'Deep repair argan shampoo',
    size: '500 ml',
    price: 320,
    oldPrice: 400,
    image: 'images/products/shampoo_500ml.jpg',
    inCollection: ['col2'],
    soldAlone: true,
    tag: null
  },
  // ===== CONDITIONER =====
  {
    id: 'conditioner_500',
    category: 'conditioner',
    nameAr: 'بلسم YOURS – 500 مل',
    nameEn: 'YOURS Conditioner – 500ml',
    descAr: 'بلسم ترميم عميق للشعر الجاف والتالف',
    descEn: 'Deep repair conditioner for dry and damaged hair',
    size: '500 ml',
    price: 320,
    oldPrice: 400,
    image: 'images/products/conditioner_500ml.jpg',
    inCollection: ['col1', 'col2'],
    soldAlone: true,
    tag: null
  },
  // ===== MASK =====
  {
    id: 'mask_500',
    category: 'mask',
    nameAr: 'ماسك الشعر YOURS – 500 جرام',
    nameEn: 'YOURS Hair Mask – 500g',
    descAr: 'تغذية عميقة لجميع أنواع الشعر',
    descEn: 'Deep nourishment for all hair types',
    size: '500 g',
    price: 380,
    oldPrice: 480,
    image: 'images/products/mask_500ml.jpg',
    inCollection: ['col1'],
    soldAlone: true,
    tag: null
  },
  {
    id: 'mask_200',
    category: 'mask',
    nameAr: 'ماسك الشعر YOURS – 200 مل',
    nameEn: 'YOURS Hair Mask – 200ml',
    descAr: 'تغذية عميقة لجميع أنواع الشعر',
    descEn: 'Deep nourishment for all hair types',
    size: '200 ml',
    price: 220,
    oldPrice: 280,
    image: 'images/products/mask_200ml.jpg',
    inCollection: ['col3'],
    soldAlone: false,
    tag: null
  },
  // ===== SERUM =====
  {
    id: 'serum_100',
    category: 'serum',
    nameAr: 'سيروم YOURS – 100 مل',
    nameEn: 'YOURS Hair Serum – 100ml',
    descAr: 'سيروم ترميم وترطيب للشعر التالف',
    descEn: 'Repair and moisture serum for damaged hair',
    size: '100 ml',
    price: 280,
    oldPrice: 350,
    image: 'images/products/serum_100ml.jpg',
    inCollection: ['col1'],
    soldAlone: true,
    tag: null
  },
  {
    id: 'serum_75',
    category: 'serum',
    nameAr: 'سيروم الشعر YOURS – 75 مل',
    nameEn: 'YOURS Hair Serum – 75ml',
    descAr: 'سيروم ترميم وترطيب',
    descEn: 'Repair and moisture serum',
    size: '75 ml',
    price: 200,
    oldPrice: 250,
    image: 'images/products/serum_75ml.jpg',
    inCollection: ['col2', 'col3'],
    soldAlone: true,
    tag: null
  },
  // ===== BODY CARE =====
  {
    id: 'body_polish',
    category: 'body',
    nameAr: 'بودي بوليش YOURS – 300 مل',
    nameEn: 'YOURS Body Polish – 300ml',
    descAr: 'مقشر جسم فاخر لبشرة ناعمة ومشرقة',
    descEn: 'Luxury body scrub for smooth and radiant skin',
    size: '300 ml',
    price: 280,
    oldPrice: 350,
    image: 'images/products/body_polish_300ml.jpg',
    inCollection: [],
    soldAlone: true,
    tag: 'جديد'
  },
  {
    id: 'body_souffle',
    category: 'body',
    nameAr: 'بودي سوفليه YOURS – 300 مل',
    nameEn: 'YOURS Body Soufflé – 300ml',
    descAr: 'مرطب جسم فاخر بقوام سوفليه خفيف',
    descEn: 'Luxury body moisturizer with a light soufflé texture',
    size: '300 ml',
    price: 260,
    oldPrice: 320,
    image: 'images/products/body_souffle_300ml.jpg',
    inCollection: [],
    soldAlone: true,
    tag: null
  }
];

// Collections data
window.YOURS_COLLECTIONS = {
  col1: {
    nameAr: 'مجموعة YOURS الفاخرة – 4 قطع',
    nameEn: 'YOURS Luxury Collection – 4 Pieces',
    products: ['shampoo_1000', 'conditioner_500', 'mask_500', 'serum_100'],
    price: 2200,
    oldPrice: 2800,
    image: 'images/collections/collection1.jpg',
    descAr: 'الطقم الأمثل للعناية الكاملة – شامبو لتر + بلسم لتر + ماسك 500 جرام + سيروم 100 مل',
    badge: 'الأكثر مبيعاً',
    saving: 600
  },
  col2: {
    nameAr: 'مجموعة YOURS المتوسطة – 4 قطع',
    nameEn: 'YOURS Mid Collection – 4 Pieces',
    products: ['shampoo_500', 'conditioner_500', 'mask_200', 'serum_75'],
    price: 1400,
    oldPrice: 1800,
    image: 'images/collections/collection2.jpg',
    descAr: 'طقم متكامل – شامبو 500 مل + بلسم 500 مل + ماسك 200 مل + سيروم 75 مل',
    badge: 'الأكثر شعبية',
    saving: 400
  },
  col3: {
    nameAr: 'مجموعة YOURS الصغيرة – 4 قطع',
    nameEn: 'YOURS Mini Collection – 4 Pieces',
    products: ['shampoo_500', 'conditioner_500', 'mask_200', 'serum_75'],
    price: 950,
    oldPrice: 1200,
    image: 'images/collections/collection3.jpg',
    descAr: 'مثالية للتجربة الأولى – شامبو 250 مل + بلسم 250 مل + ماسك 200 مل + سيروم 75 مل',
    badge: 'للتجربة',
    saving: 250,
    miniOnly: true
  }
};
