/* =====================================================================
   YOURS — آراء العملاء

   دي سكرين شوتس حقيقية من رسايل العملاء على واتساب وإنستجرام وفيسبوك،
   زي ما وصلت بالظبط. الصورة هي الدليل، مش كلام متكتوب من عندنا.

   الملفات في images/reviews/ وبتتحط هنا بالترتيب اللي هتظهر بيه.

   كل صورة ليها `alt` بخلاصة الكلام اللي فيها — ده مش بديل عن الصورة،
   ده عشان جوجل يقرا الريفيوهات (الصور مالهاش كلام عند محركات البحث)
   وعشان اللي بيستخدم قارئ شاشة يعرف الصورة بتقول إيه.

   لو هتزوّدي صورة: حطيها في images/reviews/ وضيفي سطر هنا بكلامها
   الحقيقي. متكتبيش رأي من عندك.

   اتعدّل في الصور حاجة واحدة بس: رقم تليفون قديم كان ظاهر في صورة
   وقت ما العميلة كانت بترد على ستوري — اتغطى عشان محدش يتصل بيه بالغلط.
   ===================================================================== */
(function (global) {
  'use strict';

  var REVIEWS = [
    { img: 'r01.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: 'YOURS Go',
      alt: 'عميلة بتقول إنها بتطلب للمرة التالتة، والشامبو بيطرّي الشعر والسيروم بيخلّي مفيش هيشان',
      altEn: 'A customer says this is her third order, that the shampoo softens her hair and the serum leaves no frizz' },
    { img: 'r02.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: 'YOURS Luxury',
      alt: 'عميلة استلمت الأوردر وبتقول إنها أحلى مجموعة للشعر ومش عارفة تستخدم أي منتج تاني',
      altEn: 'A customer who received her order says it is the best hair set and she cannot use anything else now' },
    { img: 'r03.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: '',
      alt: 'عميلة بتوصف المجموعة والفرق اللي حسّته في شعرها بعد الاستخدام',
      altEn: 'A customer describing the set and the difference she felt in her hair after using it' },
    { img: 'r04.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: '',
      alt: 'عميلة طلبت أوردرين وبتشكر على الباكدج وريحة العبوات وسرعة التوصيل',
      altEn: 'A customer who ordered two sets, thanking us for the packaging, the scent and the fast delivery' },
    { img: 'r05.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: '',
      alt: 'عميلة بتقول إن الباكدجنج والديزاين رهيبين والريحة تحفة',
      altEn: 'A customer saying the packaging and the design are wonderful and the scent is lovely' },
    { img: 'r06.jpg', src: 'فيسبوك', srcEn: 'Facebook', set: '',
      alt: 'بوست فيسبوك مطوّل بيشرح الشامبو والماسك والسيروم واحد واحد والفرق اللي عملوه',
      altEn: 'A long Facebook post going through the shampoo, the mask and the serum one by one and the difference they made' },
    { img: 'r07.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: '',
      alt: 'رد عميلة على متابعة الأوردر، وبتقول إن بنت خالتها طلبت بعدها',
      altEn: 'A customer replying to an order follow-up, saying her cousin ordered after her' },
    { img: 'r08.jpg', src: 'إنستجرام', srcEn: 'Instagram', set: '',
      alt: 'نفس رد العميلة متنشور على ستوري إنستجرام',
      altEn: 'The same customer reply, reposted on an Instagram story' },
    { img: 'r09.jpg', src: 'فيسبوك', srcEn: 'Facebook', set: 'YOURS Hydration',
      alt: 'آخر البوست مع صورة مجموعة Hydration عند العميلة',
      altEn: 'The end of the post, with a photo of the Hydration set at the customer’s home' },
    { img: 'r10.jpg', src: 'إنستجرام', srcEn: 'Instagram', set: '',
      alt: 'رسايل إنستجرام من عميلة بتقول إن الشغل كله بضمير ومش شغل تجاري',
      altEn: 'Instagram messages from a customer saying the work is done with real care, not just commercially' },
    { img: 'r11.jpg', src: 'فيسبوك', srcEn: 'Facebook', set: 'YOURS Hydration',
      alt: 'بوست فيسبوك بصور العبوات، وبيقول إن الكميات كبيرة والخامات عالية',
      altEn: 'A Facebook post with photos of the bottles, saying they are generous and the materials are high quality' },
    { img: 'r12.jpg', src: 'إنستجرام', srcEn: 'Instagram', set: '',
      alt: 'عميلة بتشكر على المجموعة وبتقول إنها متوقعتش الكمية تكون كبيرة كده',
      altEn: 'A customer thanking us for the set and saying she did not expect the bottles to be this generous' },
    { img: 'r13.jpg', src: 'إنستجرام', srcEn: 'Instagram', set: '',
      alt: 'عميلة بتقول إن الشامبو أحسن من ماركات كبيرة معروفة، وطالبة إن كلامها يتنشر',
      altEn: 'A customer saying the shampoo beats big well-known brands, and asking for her words to be published' },
    { img: 'r14.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: '',
      alt: 'عميلة بتقول إن المجموعة فرقت مع شعرها من أول مرة وخلّته طري',
      altEn: 'A customer saying the set made a difference from the first use and left her hair soft' },
    { img: 'r15.jpg', src: 'إنستجرام', srcEn: 'Instagram', set: '',
      alt: 'ستوري مطوّل بيوصف نعومة الشعر بعد البلسم وخفة السيروم',
      altEn: 'A long story describing how soft the hair was after the conditioner and how light the serum felt' },
    { img: 'r16.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: '',
      alt: 'عميلة اتفاجئت بشكل العلب وبتقول إنها شبه ماركة كبيرة معروفة',
      altEn: 'A customer taken aback by the bottles, saying they look like a big well-known brand' },
    { img: 'r17.jpg', src: 'فيسبوك', srcEn: 'Facebook', set: 'YOURS Hydration',
      alt: 'بوست فيسبوك بصورة مجموعة Hydration كاملة',
      altEn: 'A Facebook post with a photo of the complete Hydration set' },
    { img: 'r18.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: '',
      alt: 'عميلة وصاحبتها بيشكروا على شكل المجموعة',
      altEn: 'A customer and her friend thanking us for how the set looks' },
    { img: 'r19.jpg', src: 'واتساب', srcEn: 'WhatsApp', set: 'YOURS Hydration',
      alt: 'عميلة باعتة صور المجموعة عندها وبتقول إنها تحفة وحجمها أكبر مما كانت متخيلة',
      altEn: 'A customer sending photos of her set at home, saying it is lovely and the bottles are bigger than she expected' }
  ];

  global.YoursReviews = REVIEWS;
})(window);
