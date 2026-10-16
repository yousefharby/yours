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
    /* ---- localization pass: every string the English audit found ---- */
    "عرض السلة": "View cart",
    "الاسم بالكامل": "Full name",
    "موبايل تاني": "Second mobile",
    "كاش مع المندوب": "Cash with the courier",
    "شحن مدفوع": "Prepaid shipping",
    "الدفع عند الاستلام": "Cash on delivery",
    "تحويل إلكتروني": "Online transfer",
    "تم استلام طلبك!": "We have your order!",
    "رقم طلبك": "Your order code",
    "تفاصيل طلبك": "Your order details",
    "تعديل الطلب أو إضافة منتج": "Edit your order or add a product",
    "💳 طريقة الدفع": "💳 Payment method",
    "عاين قبل ما تدفعي": "Inspect before you pay",
    "المبلغ المطلوب تحويله:": "Amount to transfer:",
    "↗ افتح لينك إنستاباي وحوّل": "↗ Open the InstaPay link and transfer",
    "الحساب:": "Account:",
    "حوّل على الرقم ده:": "Transfer to this number:",
    "فودافون كاش أو أي محفظة إلكترونية.": "Vodafone Cash or any mobile wallet.",
    "بعد ما تحوّل، ارفع صورة التحويل. هنراجعها ونتواصل معاك لتأكيد الطلب، وهيتشحن": "After you transfer, upload a photo of the receipt. We will check it and contact you to confirm the order, and it ships",
    "بدون تحصيل": "with nothing to collect",
    "قابلتك مشكلة في التحويل؟ كلمينا واتساب": "Having trouble with the transfer? Message us on WhatsApp",
    "اكتبي اسمك": "Please enter your name",
    "اكتبي رقم موبايل مصري صحيح من 11 رقم يبدأ بـ 01": "Please enter a valid 11-digit Egyptian mobile number starting with 01",
    "اكتبي العنوان بالتفصيل": "Please enter your full address",
    "راجعي الخانات المعلّمة باللون الأحمر.": "Please check the fields marked in red.",
    "(اختياري)": "(optional)",
    "موقعك على الخريطة": "Your location on the map",
    "📍 حددي موقعي تلقائياً": "📍 Detect my location",
    "👀 معاينة قبل الاستلام:": "👀 Inspect before you accept:",
    "من حقك تفتحي الشحنة وتعايني المنتجات قدام المندوب قبل ما تدفعي. لو مش عاجباك ترجّعها وتدفع مصاريف الشحن بس.": "You may open the parcel and inspect the products in front of the courier before you pay. If you are not happy with them you can return them and pay only the shipping fee.",
    "✅ تأكيد الطلب": "✅ Order confirmed",
    "فريقنا هيتواصل معاك خلال 24 ساعة لتأكيد الطلب وميعاد التوصيل.": "Our team will contact you within 24 hours to confirm your order and the delivery time.",
    "احتفظي بالكود ده لمتابعة طلبك": "Keep this code to follow up on your order",
    "أكدي طلبك على واتساب": "Confirm your order on WhatsApp",
    "المنتج ده مش متاح حالياً": "This product is not available right now",
    "أضف منتج للطلب": "Add a product to your order",
    "المحافظة": "Governorate",
    "المدينة / المركز": "City / district",
    "— اختر المحافظة —": "— Choose a governorate —",
    "— اختر المحافظة الأول —": "— Choose a governorate first —",
    "اختاري المحافظة": "Please choose your governorate",
    "اختاري المدينة": "Please choose your city",
    "تخطي للمحتوى": "Skip to content",
    "ع": "AR",
    "التبديل للعربية": "Switch to Arabic",
    "إغلاق القائمة": "Close menu",
    "إغلاق السلة": "Close cart",
    "إغلاق": "Close",
    "مسار الصفحة": "Breadcrumb",
    "تواصل عبر واتساب": "Contact us on WhatsApp",
    "YOURS — الرئيسية": "YOURS — Home",
    "واتساب": "WhatsApp",
    "واتساب:": "WhatsApp:",
    "استفسري على واتساب": "Ask us on WhatsApp",
    "YOURS — جميع الحقوق محفوظة": "YOURS — All rights reserved",
    "التفاصيل": "Details",
    "الاسترجاع": "Returns",
    "الشحن والتوصيل (": "Shipping and delivery (",
    "منتجات العناية بالشعر من YOURS — شامبو وبلسم وماسك وسيروم بخطوط Luxury و Hydration و Go.": "YOURS hair care — shampoo, conditioner, mask and serum across the Luxury, Hydration and Go lines.",
    "🛒 طلبك": "🛒 Your order",
    "+ اختاري منتج": "+ Choose a product",
    "+ أضف للطلب": "+ Add to cart",
    "✦ يتباع لوحده": "✦ Sold on its own",
    "🛍️ اطلبي الآن": "🛍️ Order now",
    "🛍️ اطلبي المجموعة": "🛍️ Order the set",
    "➕ أضف للطلب وكمّلي تسوق": "➕ Add to cart and keep shopping",
    "➕ أضف المجموعة وكمّلي تسوق": "➕ Add the set and keep shopping",
    "+ أضيفي منتج تاني أو صنف تاني لنفس الطلب": "+ Add another product or collection to this order",
    "الكمية": "Quantity",
    "زيادة": "Increase",
    "تقليل": "Decrease",
    "اكتبي اسمك بالكامل": "Enter your full name",
    "مناسبة لـ:": "Best for:",
    "🚚 الشحن حسب المحافظة (": "🚚 Shipping by governorate (",
    "👀 عاين قبل ما تستلم والدفع عند الاستلام —": "👀 Inspect before you accept, and pay on delivery —",
    "📦 منتجات المجموعة دي بتتباع مع بعض كمجموعة كاملة.": "The products in this collection are sold together as one complete set.",
    "📦 المنتج ده جزء من": "📦 This product is part of",
    "💡 من المجموعة دي،": "💡 From this collection,",
    "و": "and",
    "ينفع تاخديهم لوحدهم كمان.": "can also be bought on their own.",
    "اللون": "Colour",
    "طريقة الاستخدام:": "How to use:",
    "صور المنتج": "Product images",
    "الصورة السابقة": "Previous image",
    "الصورة التالية": "Next image",
    "دوسي على الصورة لتكبيرها": "Tap the image to enlarge it",
    "بيتفرجوا على المنتج ده دلوقتي": "are viewing this product right now",
    "+ الشحن": "+ Shipping",
    "حسب المحافظة —": "by governorate —",
    "استفسري عن المنتج ده": "Ask about this product",
    "أنواع تانية ممكن تعجبك": "Other collections you may like",
    "👀 عاين قبل ما تستلم": "👀 Inspect before you accept",
    "من حقك تفتحي الشحنة وتعايني المنتجات قدام المندوب قبل ما تدفعي. لو مش عاجباك ترجّعها وتدفع مصاريف الشحن بس، ولو فيها عيب إحنا بنتحمل الشحن كله.": "You may open the parcel and inspect the products in front of the courier before you pay. If you are not happy with them you can return them and pay only the shipping fee; if anything is faulty, we cover the shipping in full.",
    "تنظيف · ترميم · لمعان": "Cleanse · Restore · Shine",
    "أرچان وترطيب عميق": "Argan & Deep Hydration",
    "سفر · چيم · سباحة": "Travel · Gym · Swimming",
    "تنظيف وترميم ولمعان": "Cleanse, restore and shine",
    "تغذية مركزة للشعر الجاف": "Intensive nourishment for dry hair",
    "نعومة ولمعان وحماية": "Softness, shine and protection",
    "اختار اللي بتحسه": "Pick what you are feeling",
    "دوسي على اللي بتحسه، وهنقولك النوع المناسب ليك": "Tap what bothers you and we will point you to the right collection",
    "شعر جاف": "Dry hair",
    "ترطيب عميق": "Deep hydration",
    "شعر تالف": "Damaged hair",
    "ترميم وتغذية": "Repair and nourishment",
    "تقصف الأطراف": "Split ends",
    "ماسك + سيروم": "Mask + serum",
    "هيشان وتشابك": "Frizz and tangles",
    "بلسم + سيروم": "Conditioner + serum",
    "فروة محتاجة عناية": "A scalp that needs care",
    "تنظيف لطيف ومنتظم": "Gentle, regular cleansing",
    "شعر ضعيف وخفيف": "Fine, fragile hair",
    "تغذية وتقوية": "Nourish and strengthen",
    "هيشان": "Frizz",
    "شعر ضعيف": "Fragile hair",
    "لو مش عارفة تختاري،": "If you are not sure which to pick,",
    "أو كلمينا على واتساب.": "or message us on WhatsApp.",
    "روتين الأربع خطوات": "The four-step routine",
    "الترتيب ده هو اللي بيفرق في النتيجة — وكل مجموعة فيها الأربع خطوات": "The order is what makes the difference — and every collection has all four steps",
    "شامبو": "Shampoo",
    "بلسم": "Conditioner",
    "ماسك": "Hair mask",
    "سيروم": "Serum",
    "نظّفي شعرك وفروة الرأس مرتين، وركّزي على الجذور.": "Wash your hair and scalp twice, concentrating on the roots.",
    "من نص الطول للأطراف، سيبيه دقيقتين وبعدين اشطفيه.": "From mid-lengths to ends, leave for two minutes, then rinse.",
    "مرة أو مرتين في الأسبوع من 5 لـ 10 دقايق للشعر الجاف والتالف.": "Once or twice a week, 5 to 10 minutes, for dry and damaged hair.",
    "على الشعر النص نشفان، وركّزي على الأطراف من غير الجذور.": "On towel-dried hair, concentrating on the ends and avoiding the roots.",
    "عن YOURS": "About YOURS",
    "من خبرة الصالون لبيتك": "From our salon to your home",
    "YOURS اتولدت جوه Mona Galal Beauty Treatment، من شغل يومي مع شعر عميلات بيعاني من الجفاف والتلف. اخترنا تركيبات بزيت الزيتون والأرچان وجربناها في الصالون الأول، وبعدين نزلناها بثلاث أحجام عشان تكمّلي نفس العناية في بيتك.": "YOURS was born inside Mona Galal Beauty Treatment, out of daily work with clients whose hair was dry and damaged. We chose olive oil and argan formulas, tried them in the salon first, and then released them in three sizes so you can continue the same care at home.",
    "ليه تشتري مننا": "Why buy from us",
    "محل YOURS من الداخل": "Inside the YOURS store",
    "زورينا في العيادة": "Visit us at the clinic",
    "تعالي جربي المنتجات في العيادة": "Come and try the products at the clinic",
    "أرض الجولف — مصر الجديدة": "Ard El Golf — Heliopolis",
    "٣ شارع محمد الدهان، من شمس الدين الذهبي، أرض الجولف — بجوار مسجد حفصة.": "3 Mohamed El Dahan Street, off Shams El Din El Zahabi, Ard El Golf — next to Hafsa Mosque.",
    "أقرب محطة مترو: كلية البنات.": "Nearest metro station: Kolleyet El Banat.",
    "لو حابة استشارة قبل ما تختاري، كلمينا على واتساب أو عدّي علينا وإحنا نرشّحلك المناسب لشعرك.": "If you would like advice before choosing, message us on WhatsApp or drop by and we will help you pick what suits your hair.",
    "📍 افتح الموقع على الخريطة": "📍 Open the location on the map",
    "شوفي آراء العملاء على إنستجرام": "See what customers say on Instagram",
    "إنستجرام: monagalal_beauty_treatment": "Instagram: monagalal_beauty_treatment",
    "بنشحن لكل محافظات مصر. المصاريف بتتحسب حسب المحافظة وتبدأ من": "We ship to every governorate in Egypt. Fees are calculated by governorate and start from",
    "القاهرة والجيزة من 1 لـ 3 أيام عمل، وباقي المحافظات من 3 لـ 5 أيام عمل.": "Cairo and Giza take 1 to 3 working days; all other governorates take 3 to 5 working days.",
    "الدفع عند الاستلام بعد المعاينة، أو تحويل إلكتروني على إنستاباي أو محفظة وساعتها الشحنة توصلك مدفوعة.": "Cash on delivery after you inspect the order, or an online transfer via InstaPay or a mobile wallet, in which case the parcel arrives already paid.",
    "من حقك تفتحي الشحنة وتعايني المنتجات قدام المندوب قبل ما تدفعي.": "You may open the parcel and inspect the products in front of the courier before you pay.",
    "معاينة قبل الاستلام، والدفع عند الاستلام": "Inspect before you accept, and pay on delivery",
    "الدفع عند الاستلام أو تحويل إلكتروني": "Cash on delivery or online transfer",
    "👀 معاينة قبل الاستلام": "👀 Inspect before you accept",
    "عايني قبل ما تستلمي": "Inspect before you accept",
    "افتحي الشحنة قدام المندوب": "Open the parcel in front of the courier",
    "أو تحويل إلكتروني": "or an online transfer",
    "أسئلة بتتسأل كتير": "Frequently asked questions",
    "المنتجات دي مناسبة لأنهي نوع شعر؟": "Which hair types are these products for?",
    "كل أنواع الشعر، والتركيبات مخصصة بالذات للشعر الجاف والتالف زي ما هو مكتوب على العبوات. لو شعرك مصبوغ أو معالج، الماسك والسيروم هيفرقوا معاكي أكتر.": "All hair types. The formulas are described for dry and damaged hair, as stated on the packaging. If your hair is coloured or treated, the mask and the serum will make the most difference.",
    "أبدأ بأنهي خط؟": "Which line should I start with?",
    "لو بتجربي لأول مرة ابدئي بـ": "If this is your first time, start with",
    "(250 مل). لو عايزة روتين كامل في البيت اختاري": "(250 ml). For a complete routine at home, choose",
    "(500 مل). لو شعرك جاف جداً أو البيت فيه أكتر من شخص،": "(500 ml). If your hair is very dry, or more than one person uses it,",
    "(لتر) هيوفر عليكِ.": "(1 L) will go further.",
    "الشحن بيوصل في قد إيه وبكام؟": "How long does shipping take, and what does it cost?",
    "بنشحن لكل محافظات مصر. القاهرة والجيزة من 1 لـ 3 أيام عمل، وباقي المحافظات من 3 لـ 5 أيام. المصاريف بتتحسب حسب المحافظة وتبدأ من": "We ship to every governorate in Egypt. Cairo and Giza take 1 to 3 working days, other governorates 3 to 5 days. Fees are calculated by governorate and start from",
    "تفاصيل الشحن": "Shipping details",
    "أقدر أدفع إزاي؟": "How can I pay?",
    "الدفع عند الاستلام بعد المعاينة، أو تحويل إلكتروني على إنستاباي أو محفظة، وساعتها الشحنة بتوصلك مدفوعة من غير تحصيل.": "Cash on delivery after you inspect the order, or an online transfer via InstaPay or a mobile wallet, in which case the parcel arrives already paid with nothing to collect.",
    "بنوصّل لكل محافظات مصر.": "We deliver to every governorate in Egypt.",
    "📦 مناطق التوصيل ومصاريف الشحن": "📦 Delivery areas and shipping fees",
    "بنوصّل لكل محافظات مصر، والمصاريف بتتحسب حسب المنطقة:": "We deliver to every governorate in Egypt, and the fee depends on the area:",
    "القاهرة والجيزة": "Cairo and Giza",
    "الدلتا ومدن القناة": "The Delta and the Canal cities",
    "الصعيد وشمال سيناء": "Upper Egypt and North Sinai",
    "البحر الأحمر ومطروح (الغردقة والساحل)": "Red Sea and Matrouh (Hurghada and the North Coast)",
    "جنوب سيناء والوادي الجديد": "South Sinai and the New Valley",
    "احسب شحن محافظتك:": "Work out the fee for your governorate:",
    "⏱️ مدة التوصيل": "⏱️ Delivery time",
    "القاهرة والجيزة: من 1 إلى 3 أيام عمل": "Cairo and Giza: 1 to 3 working days",
    "باقي المحافظات: من 3 إلى 5 أيام عمل": "Other governorates: 3 to 5 working days",
    "يوم الجمعة إجازة، وأوردرات المحافظات بتطلع يومي السبت والتلات.": "Friday is a holiday, and orders outside Cairo go out on Saturdays and Tuesdays.",
    "من حقك تفتحي الشحنة وتعايني المنتجات قدام مندوب الشحن قبل ما تستلمي وتدفعي. لو مش عاجباك ترجّعها وتدفع مصاريف الشحن بس. تفاصيل أكتر في": "You may open the parcel and inspect the products in front of the courier before you accept and pay. If you are not happy with them you can return them and pay only the shipping fee. More details on the",
    "صفحة الاستبدال والاسترجاع": "returns and exchange page",
    "💵 طرق الدفع": "💵 Payment methods",
    "الدفع عند الاستلام بعد المعاينة": "Cash on delivery, after you inspect the order",
    "تحويل إلكتروني (فودافون كاش / إنستاباي)": "Online transfer (Vodafone Cash / InstaPay)",
    "📍 تتبع الطلب": "📍 Tracking your order",
    "هتوصلك رسالة فيها تفاصيل الطلب بعد التأكيد، ولأي استفسار كلمينا على": "You will receive a message with your order details once it is confirmed. For anything else, message us on",
    "اطلبي وانتي مطمّنة: بتعايني المنتج بنفسك قبل ما تدفعيي.": "Order with confidence: you inspect the products yourself before you pay.",
    "من حقك تفتحي الشحنة وتعايني المنتجات قدام مندوب الشحن قبل ما تستلمي وتدفعي، وتتأكد من العبوات والأحجام وإنها سليمة ومقفولة.": "You may open the parcel and inspect the products in front of the courier before you accept and pay, and check that the bottles, the sizes and the seals are all as they should be.",
    "🙁 لو المنتج مش عاجبك": "🙁 If you are not happy with a product",
    "تقدري ترجّعيه على طول، ومش هتدفع غير مصاريف الشحن فقط — من غير أي خصم تاني.": "You can return it straight away and pay only the shipping fee — nothing else is deducted.",
    "⚠️ لو وصلك منتج به عيب أو غير اللي طلبته": "⚠️ If a product arrives faulty or is not what you ordered",
    "بنستبدله أو نسترجعه، وإحنا اللي بنتحمّل مصاريف الشحن بالكامل في الحالة دي.": "We will exchange or refund it, and we cover the shipping in full in that case.",
    "📋 شروط الإرجاع": "📋 Return conditions",
    "العبوة تكون مقفولة وما اتفتحتش وما اتستعملتش": "The bottle must still be sealed, unopened and unused",
    "تكون في تغليفها الأصلي وبكامل محتوياتها": "It must be in its original packaging with everything that came with it",
    "الإرجاع بيتم وقت المعاينة عند الاستلام": "Returns are made at the moment of inspection, on delivery",
    "💵 استرداد المبلغ": "💵 Refunds",
    "لو الدفع كان عند الاستلام فمش هيتخصم منك غير مصاريف الشحن.": "If you were paying on delivery, only the shipping fee is deducted.",
    "💬 إزاي تطلب استبدال أو استرجاع": "💬 How to request an exchange or a return",
    "كلمينا": "Message us",
    "على واتساب وقوللنا رقم الطلب.": "on WhatsApp with your order number.",
    "YOURS — منتجات العناية بالشعر من خبرة الصالون | شحن لكل مصر": "YOURS — salon-grade hair care | Delivery across Egypt",
    "YOURS: شامبو وبلسم وماسك وسيروم بتركيبات زيت الزيتون والأرچان. مجموعات Luxury و Hydration و Go كاملة بأسعار المجموعة. شحن لكل محافظات مصر والدفع عند الاستلام.": "YOURS: shampoo, conditioner, mask and serum with olive oil and argan formulas. The Luxury, Hydration and Go collections, complete, at one set price. Delivery across Egypt with cash on delivery.",
    "مجموعات YOURS كاملة: شامبو وبلسم وماسك وسيروم. اختاري Luxury أو Hydration أو Go بسعر المجموعة، وشحن لكل محافظات مصر.": "Complete YOURS collections: shampoo, conditioner, mask and serum. Choose Luxury, Hydration or Go at one set price, with delivery across Egypt.",
    "تفاصيل منتجات YOURS للعناية بالشعر: المقاسات والتركيبة وطريقة الاستخدام، وشحن لكل محافظات مصر والدفع عند الاستلام.": "YOURS hair care product details: sizes, formula and how to use, with delivery across Egypt and cash on delivery.",
    "الشحن والتوصيل — YOURS": "Shipping and delivery — YOURS",
    "مصاريف الشحن حسب المحافظة ومدة التوصيل وطرق الدفع في YOURS. شحن لكل محافظات مصر والدفع عند الاستلام أو تحويل إلكتروني.": "YOURS shipping fees by governorate, delivery times and payment methods. Delivery across Egypt with cash on delivery or online transfer.",
    "الاستبدال والاسترجاع — YOURS": "Returns and exchange — YOURS",
    "سياسة الاستبدال والاسترجاع في YOURS: عايني الشحنة قدام المندوب قبل ما تدفعي، ولو مش عاجباكي ترجّعيها.": "The YOURS returns and exchange policy: inspect the parcel in front of the courier before you pay, and return it if you are not happy with it.",
    // homepage redesign
    'لاقي روتين شعرك': 'Find your hair routine',
    'اختاري اللي بيضايقك في شعرك وهنوصّلك للمجموعة المناسبة': 'Tell us what bothers you most and we will point you to the right collection',
    'منتجات تتباع لوحدها': 'Sold on their own',
    'دول بس اللي ينفع تاخديهم من غير المجموعة كاملة': 'These are the only products available outside a full set',
    'الشحن والدفع والتوصيل': 'Shipping, payment and delivery',
    'كل اللي محتاجة تعرفيه قبل ما تطلبي': 'Everything you need to know before you order',
    'مدة التوصيل': 'Delivery time', 'الدفع': 'Payment', 'المعاينة والاسترجاع': 'Inspection and returns',
    'مصاريف كل محافظة': 'Fees by governorate', 'تفاصيل التوصيل': 'Delivery details',
    'سياسة الاسترجاع': 'Returns policy',
    'اكتشفي مجموعات YOURS': 'Discover the YOURS collections',
    'استشيري خبراء العناية بشعرك': 'Ask our hair care experts',
    'عناية احترافية بشعرك، من خبرة الصالون لبيتك.': 'Professional hair care, from our salon to your home.',
    // routine quiz
    'مش عارفة تختاري؟': "Not sure which to pick?", 'اعملي الاختبار': 'Take the quiz',
    'أسئلة قصيرة عن شعرك واحتياجه، ونقولك المجموعة اللي تناسبك ليه بالظبط — ولو إجاباتك محتاجة رأي حد من الفريق، هنقولك.': 'A few short questions about your hair and what it needs, and we will tell you which collection fits — and why. If your answers call for a person, we will say so.',
    'تفاصيل المنتج': 'Product details', 'فوايد المنتج': 'Key benefits', 'المكونات': 'Ingredients',
    'طريقة الاستخدام': 'How to use', 'الروتين المقترح': 'Recommended routine', 'ملاحظات مهمة': 'Important notes',
    'أسئلة شائعة': 'FAQs', 'عدد المرات:': 'How often:', 'تفاصيل المنتج ›': 'Product details ›',
    'مش لازم تستخدمي الأربعة في كل غسلة — كل منتج ليه طريقته وعدد مراته.': 'You do not need all four at every wash — each product has its own method and frequency.',
    'اللي جوه روتينك': 'What\u2019s inside your routine',
    'الأربع خطوات بترتيب استخدامها': 'The four steps, in the order you use them',
    'ابدئي الاختبار': 'Start the quiz', 'اعملي اختبار الروتين': 'take the routine quiz', 'صورة إيصال التحويل': 'Transfer receipt photo',
    'أقل من دقيقة · من غير تسجيل ولا بيانات': 'Under a minute · no sign-up, no personal details',
    'روتينك': 'Your routine', 'رجوع': 'Back', 'اعملي الاختبار تاني': 'Start over',
    // collections sold as one set
    'مجموعات YOURS': 'YOURS collections',
    'كل مجموعة روتين كامل — شامبو وبلسم وماسك وسيروم — بسعر المجموعة': 'Each collection is a complete routine — shampoo, conditioner, mask and serum — at one set price',
    '+ أضف المجموعة للطلب': '+ Add the set to cart', '✓ المجموعة في الطلب': '✓ Set in cart',
    '+ أضف المجموعة': '+ Add the set', 'شوفي تفاصيل المجموعة': 'See the full set',
    'اللي جوه المجموعة': 'What is in the set', 'المجموعة كاملة': 'Complete set',
    'ينفع كمان تاخديهم لوحدهم': 'Also available on their own',
    'المنتجات دي بس هي اللي بتتباع من غير المجموعة': 'These are the only products sold outside a set',
    'يتباع لوحده': 'Sold on its own', 'للمجموعة': 'per set',
    'اطلبي المجموعة': 'Order the set', 'اطلبي الآن': 'Order now',
    'أضف المجموعة وكمّلي تسوق': 'Add the set and keep shopping',
    'من المجموعة دي': 'of this set', 'شوفي المجموعات': 'Shop the collections',
    'مفيش مجموعات متاحة حالياً': 'No collections available right now',
    'منتجات المجموعة دي بتتباع مع بعض كمجموعة كاملة.': 'The products in this collection are sold together as one complete set.',
    // header & menu
    'الرئيسية': 'Home', 'الأصناف': 'Collections', 'معلومات تهمك': 'Useful info',
    'القائمة الرئيسية': 'Main menu', 'سلة الطلب': 'Cart', 'القائمة': 'Menu',
    'الشحن والتوصيل': 'Shipping & delivery', 'الاستبدال والاسترجاع': 'Returns & exchange',
    'استفسر على واتساب': 'Ask us on WhatsApp', 'زورنا في العيادة': 'Visit our store',
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

/* Strings the site builds at runtime. Each rule rebuilds the English from the
     same parts, so a new product or a changed price needs no new entry. */
  var PATTERNS = [
    [/^اتضاف "(.+)" للطلب$/, function (m) { return '"' + m[1] + '" added to your order'; }],
    [/^اتشال "(.+)" من الطلب$/, function (m) { return '"' + m[1] + '" removed from your order'; }],
    [/^تم استلام طلبك يا (.+)! 🎉$/, function (m) { return 'Thank you, ' + m[1] + ' — we have your order! 🎉'; }],
    [/^المنتجات \((\d+) (?:قطعة|قطع)\)$/, function (m) { return 'Products (' + m[1] + (m[1] === '1' ? ' item)' : ' items)'); }],
    [/^اختاري المحافظة تحت \((.+)\)$/, function (m) { return 'Choose below (' + (phrase(m[1]) || m[1]) + ')'; }],
    [/^حسب المحافظة \((.+)\)$/, function (m) { return 'By governorate (' + (phrase(m[1]) || m[1]) + ')'; }],
    [/^(.+) \+ الشحن$/, function (m) { return m[1] + ' + shipping'; }],
    [/^✓ في الطلب \((\d+)\)$/, function (m) { return '✓ In your order (' + m[1] + ')'; }],
    [/^(\d+) منتجات?$/, function (m) { return m[1] + (m[1] === '1' ? ' product' : ' products'); }],
    [/^(\d+) منتج — (.+)$/, function (m) { return m[1] + ' products — ' + (DICT[m[2]] || m[2]); }],
    [/^وفّري (.+?) لما تاخدي المجموعة كاملة$/, function (m) { return 'Save ' + m[1] + ' with the complete set'; }],
    [/^وفّري (.+)$/, function (m) { return 'Save ' + m[1]; }],
    [/^من ([\d,]+ (?:EGP|ج))$/, function (m) { return 'From ' + m[1]; }],
    [/^شوفي الـ (\d+) منتجات تحت$/, function (m) { return 'See the ' + m[1] + ' products below'; }],
    [/^شوفي الـ (\d+) منتجات$/, function (m) { return 'See the ' + m[1] + ' products'; }],
    [/^📦 المجموعة كاملة — (\d+) منتجات$/, function (m) { return '📦 Complete set — ' + m[1] + ' products'; }],
    [/^المجموعة بتتباع كاملة: (\d+) منتجات مع بعض\.$/, function (m) { return 'The set is sold complete: all ' + m[1] + ' products together.'; }],
    [/^ضمن مجموعة (.+)$/, function (m) { return 'Part of ' + m[1]; }],
    [/^منتجات تانية من (.+)$/, function (m) { return 'More from ' + m[1]; }],
    [/^(\d[\d,]*) جنيه$/, function (m) { return m[1] + ' EGP'; }],
    [/^المحافظات: (.+)$/, function (m) { return 'Governorates: ' + govs(m[1]); }],
    [/^(.+) — YOURS$/, function (m) { var h = DICT[m[1]]; return h ? h + ' — YOURS' : null; }]
  ];
  // governorate names, used in the shipping table and the checkout dropdown
  var GOV_EN = {
    'القاهرة': 'Cairo', 'الجيزة': 'Giza', 'الإسكندرية': 'Alexandria', 'القليوبية': 'Qalyubia',
    'الشرقية': 'Sharqia', 'الدقهلية': 'Dakahlia', 'المنوفية': 'Monufia', 'الغربية': 'Gharbia',
    'كفر الشيخ': 'Kafr El Sheikh', 'البحيرة': 'Beheira', 'الإسماعيلية': 'Ismailia', 'السويس': 'Suez',
    'بورسعيد': 'Port Said', 'دمياط': 'Damietta', 'بني سويف': 'Beni Suef', 'الفيوم': 'Faiyum',
    'المنيا': 'Minya', 'أسيوط': 'Asyut', 'سوهاج': 'Sohag', 'قنا': 'Qena', 'الأقصر': 'Luxor',
    'أسوان': 'Aswan', 'البحر الأحمر': 'Red Sea', 'الوادي الجديد': 'New Valley', 'مطروح': 'Matrouh',
    'شمال سيناء': 'North Sinai', 'جنوب سيناء': 'South Sinai'
  };
  // every governorate name on its own, as the dropdown renders them
  Object.keys(GOV_EN).forEach(function (g) { if (!DICT[g]) DICT[g] = GOV_EN[g]; });
  function govs(list) {
    return list.split('، ').map(function (g) { return GOV_EN[g.trim()] || g.trim(); }).join(', ');
  }
    var ATTR_DICT = { 'اكتب اسمك بالكامل': 'Write your full name', 'الشارع، علامة مميزة، رقم العمارة والدور': 'Street, landmark, building and floor number', 'مثلاً: ميعاد مناسب للتوصيل': 'e.g. a convenient delivery time' };

  /* ---- the engine -------------------------------------------------------
     Three layers, in order:
       DICT      exact phrases, the bulk of the UI
       PATTERNS  strings the code builds at runtime ("4 منتجات", "وفّري 850 EGP"),
                 matched by shape and rebuilt in English
       ATTRS     the attributes a customer actually reads or hears
     Anything that matches none of the three is left alone and shows up in the
     localization test, which fails on any Arabic left in the English page. */
  var ATTRS = ['placeholder', 'aria-label', 'alt', 'title', 'data-wa-text'];
  var AR_RE = /[\u0600-\u06FF]/;

  function phrase(key) {
    if (!key) return null;
    if (DICT[key]) return DICT[key];
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = key.match(PATTERNS[i][0]);
      if (m) return PATTERNS[i][1](m);
    }
    return null;
  }
  // Whole strings only. Replacing known fragments inside a longer Arabic
  // sentence produces half-translated nonsense ("From حقك تفتحي الشحنة"), which
  // reads worse than leaving the sentence alone, so a sentence we do not have
  // in full is left untouched and the localization test reports it.
  function deep(v) { return phrase(v); }
  function translateNode(node) {
    var t = node.nodeValue;
    if (!t || !AR_RE.test(t)) return;
    var key = t.trim();
    var out = deep(key);
    if (out === null) return;
    node.nodeValue = t.replace(key, out);
  }
  function translateAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute && el.getAttribute(ATTRS[i]);
      if (!v || !AR_RE.test(v)) continue;
      var out = (ATTR_DICT && ATTR_DICT[v]) || deep(v);
      if (out !== null && out !== undefined) el.setAttribute(ATTRS[i], out);
    }
  }
  function translateTree(root) {
    if (!D.isEn()) return;
    root = root || document.body;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) translateNode(n);
    if (root.nodeType === 1) translateAttrs(root);
    Array.prototype.forEach.call(root.querySelectorAll ? root.querySelectorAll('*') : [], translateAttrs);
  }
  // the page's own title and description, which search results and tabs show
  function translateHead() {
    if (!D.isEn()) return;
    var t = deep(document.title);
    if (t !== null) document.title = t;
    var md = document.querySelector('meta[name="description"]');
    if (md && AR_RE.test(md.content || '')) { var d = deep(md.content); if (d !== null) md.content = d; }
    var og = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]');
    Array.prototype.forEach.call(og, function (m) {
      var v = m.getAttribute('content');
      if (v && AR_RE.test(v)) { var o = deep(v); if (o !== null) m.setAttribute('content', o); }
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
    translateHead();
    // translate anything rendered later (cards, cart, checkout)
    if (D.isEn() && window.MutationObserver) {
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          if (m.type === 'attributes') return translateAttrs(m.target);
          Array.prototype.forEach.call(m.addedNodes, function (node) {
            if (node.nodeType === 1) translateTree(node);
            else if (node.nodeType === 3) translateNode(node);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true,
        attributes: true, attributeFilter: ATTRS });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.YoursLang = { translate: translateTree, dict: DICT, phrase: phrase, patterns: PATTERNS };
})(window);
