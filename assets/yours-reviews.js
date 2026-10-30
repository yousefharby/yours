/* =====================================================================
   YOURS — آراء العملاء

   كل كلمة هنا اتكتبت من عميلة حقيقية، منقولة من رسايل واتساب وإنستجرام
   وبوستات فيسبوك. مفيش ولا رأي متكتوب من عندنا، ومفيش تقييم بالنجوم ولا
   أرقام متحسوبة — بس كلام الناس زي ما قالوه.

   لو هتزوّدي رأي جديد: ضيفي عنصر في القايمة تحت بكلام العميلة الحقيقي،
   و `en` ترجمته. متكتبيش رأي من عندك.

   اللي اتشال عمداً:
   - أي رأي بيسمّي صاحبة المتجر، لأن الاسم اتشال من الموقع كله.
   - أي رأي بيربط المنتجات بالبروتين أو الكيراتين أو التريتمنت، لأننا لسه
     ماعندناش تأكيد مكتوب عن التوافق ده، والاختبار نفسه بيحوّل الحالات دي
     على الواتس. رأي زي ده على الموقع بيتقري كأنه وعد من البراند.
   ===================================================================== */
(function (global) {
  'use strict';

  var REVIEWS = [
    {
      ar: 'طبعاً مش أول مرة، دي تالت مرة. أحلى مجموعة في الدنيا بصراحة، بتطرّي وبتغذّي شعري جداً. الشامبو بيطرّي بجد أوي، والسيروم بيخلّي مفيش هيشان.',
      en: 'This is not my first time — it is my third. Honestly the best set there is. It softens and nourishes my hair so much. The shampoo really does soften it, and the serum leaves no frizz at all.',
      name: '', source: 'واتساب', sourceEn: 'WhatsApp', set: 'YOURS Go'
    },
    {
      ar: 'استلمت الأوردر وشكراً لذوقك ومعاملتك المحترمة. والمجموعة التحفة، والله أحلى مجموعة للشعر. أنا مش عارفة أستخدم أي منتج تاني.',
      en: 'My order arrived — thank you for your taste and the way you deal with people. And the set is beautiful; honestly the best hair set there is. I cannot use anything else now.',
      name: '', source: 'واتساب', sourceEn: 'WhatsApp', set: 'YOURS Luxury'
    },
    {
      ar: 'كنت طالبة أوردرين والصراحة مكنتش متخيلة إنهم هيكونوا كده. شكراً جداً، الباكدج تحفة والريحة والعبوات تجنّن. وحقيقي شكراً على سرعة التوصيل.',
      en: 'I had ordered two sets and honestly I never imagined they would arrive like this. Thank you so much — the packaging is beautiful, and the scent and the bottles are gorgeous. And thank you for how fast the delivery was.',
      name: '', source: 'واتساب', sourceEn: 'WhatsApp', set: ''
    },
    {
      ar: 'أول مرة أستخدم شامبو بيعمل تنضيف عميق لفروة الشعر وفي نفس الوقت بيسيب الشعر طري مش ناشف… والماسك بيعمل ترميم للشعر ومن أول مرة، لدرجة إنك فعلاً مش هتحتاجي تستخدميه غير مرة أو مرتين في الشهر.',
      en: 'It is the first time I use a shampoo that deep-cleans the scalp and still leaves the hair soft rather than dry… And the mask repairs the hair from the very first use, to the point that you will honestly only need it once or twice a month.',
      name: 'سارة', nameEn: 'Sara', source: 'فيسبوك', sourceEn: 'Facebook', set: ''
    },
    {
      ar: 'السيروم بالنسبالي عايز بوست لوحده. أنا من الناس اللي جرّبت سيروم كتير جداً، وللأسف أي سيروم بحطه بيودّي الهيشان وبيطرّي الشعر لكن بيخليه ملزق في بعضه. أول مرة أستخدم سيروم ينعّملي ويطرّيلي الشعر ويودّي الهيشان وفي نفس الوقت يعمل volume.',
      en: 'The serum deserves a post of its own. I am someone who has tried a great many serums, and sadly any serum I put on would take the frizz away and soften the hair but leave it stuck together. This is the first serum that smooths and softens my hair, takes the frizz away, and still gives it volume.',
      name: 'سارة', nameEn: 'Sara', source: 'فيسبوك', sourceEn: 'Facebook', set: ''
    },
    {
      ar: 'المجموعة مش طبيعية بجد. استخدمتها إمبارح، والله متتقارنش بالتانية نهائي. مخلّية الشعر طرررري وفلافي خالص ولمعته تحفة… السيروم بقى مجرم بجد، مخلّي ريحة شعري تحفة، وملمسه خفيف مش تقيل، الشعر اتشربه بسرعة.',
      en: 'This set is something else. I used it yesterday and honestly nothing compares to it. It leaves the hair so soft and so fluffy, and the shine is beautiful… The serum is criminal, it makes my hair smell wonderful, and it feels light rather than heavy — my hair drank it up straight away.',
      name: '', source: 'إنستجرام', sourceEn: 'Instagram', set: ''
    },
    {
      ar: 'الشامبو خطير، ريحته حلوة أوي أوي وبيطرّي الشعر وبينظّفه وأحسن من ماركات كتير معروفة وكبيرة مليون مرة. والبلسم والسيروم بجد تسلم إيدك، والريحة شيك وثابتة.',
      en: 'The shampoo is incredible — it smells so lovely, it softens the hair and cleans it, and it is a million times better than big, well-known brands. The conditioner and the serum are wonderful too, and the scent is elegant and it lasts.',
      name: '', source: 'إنستجرام', sourceEn: 'Instagram', set: ''
    },
    {
      ar: 'المجموعة اللي تجنّن دي بجد تحفة، فرقت مع شعري من أول مرة. ريحتها تجنّن، وبجد خلّت شعري طري. تسلم إيدك على المنتج الرائع ده.',
      en: 'This set is wonderful — it made a difference to my hair from the very first use. It smells amazing, and it really did leave my hair soft. Thank you for this lovely product.',
      name: '', source: 'واتساب', sourceEn: 'WhatsApp', set: ''
    },
    {
      ar: 'إيه الجمال والحلاوة والشياكة دي بجد. اتفاجئت من العلب وشكلها الشيك وكأنها ماركة كبيرة معروفة، وبإذن الله أكيد هتبقي في يوم من الأيام كده.',
      en: 'The beauty and the elegance of it, honestly. I was taken aback by the bottles and how smart they look, as though they belonged to a big, well-known brand — and one day, God willing, you will be exactly that.',
      name: '', source: 'واتساب', sourceEn: 'WhatsApp', set: ''
    },
    {
      ar: 'دي أحلى products وأحلى استقبال حقيقي. واثقة بجد إن منتجاتك هايلة وهتجيب نتيجة ممتازة لأنك بتشتغلي بضمير وبتستخدمي أعلى خامات دايماً، وكمان الكميات كبيرة جداً جداً.',
      en: 'These are the loveliest products and, honestly, the loveliest welcome. I am confident your products are excellent and will give a great result, because you work with a conscience and always use the best materials — and the bottles are so generous.',
      name: 'فاطمة', nameEn: 'Fatma', source: 'فيسبوك', sourceEn: 'Facebook', set: ''
    },
    {
      ar: 'عجبني ذوقك، مش كروته ولا شغل تجاري. واضح إنك عاملة كل حاجة بضمير… كنت هندم فعلاً لو مجرّبتش.',
      en: 'I liked your taste — none of it feels cheap or purely commercial. It is clear you have put real care into everything… I would genuinely have regretted it if I had not tried.',
      name: 'رشا', nameEn: 'Rasha', source: 'إنستجرام', sourceEn: 'Instagram', set: ''
    },
    {
      ar: 'شكراً بجد على المجموعة الجامدة دي. متوقّعتش إن الكمية كبيرة كده، ومتأكدة إن نتيجتها حلوة.',
      en: 'Thank you for this great set. I did not expect the bottles to be this generous, and I am sure the result will be lovely.',
      name: '', source: 'إنستجرام', sourceEn: 'Instagram', set: ''
    }
  ];

  global.YoursReviews = REVIEWS;
})(window);
