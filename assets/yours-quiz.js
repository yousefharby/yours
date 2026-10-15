/* =====================================================================
   YOURS — Smart Hair Routine Quiz
   Four short questions, then the collection that fits. It scores against
   the real catalog (no invented products, sizes, prices or claims) and
   only ever recommends collections that are actually on sale.
   ===================================================================== */
(function (global) {
  'use strict';
  var D = global.SedraData;

  // Each answer adds points to collections and may flag a solo add-on.
  // Points are editorial judgement about fit, never a product claim.
  var QUESTIONS = [
    {
      id: 'concern',
      q: 'إيه أكتر حاجة بتضايقك في شعرك؟',
      qEn: 'What bothers you most about your hair?',
      a: [
        { t: 'جاف ومحتاج ترطيب', tEn: 'Dry, needs moisture', ico: '🌵', s: { hydration: 3, luxury: 1 } },
        { t: 'تالف أو مصبوغ', tEn: 'Damaged or coloured', ico: '🔥', s: { luxury: 3, hydration: 2 }, addon: 'hydration-mask-500' },
        { t: 'هايش ومتشابك', tEn: 'Frizzy and tangled', ico: '🌀', s: { luxury: 3, hydration: 1 }, addon: 'hydration-serum-100' },
        { t: 'أطرافه متقصفة', tEn: 'Split ends', ico: '✂️', s: { luxury: 2, hydration: 2 }, addon: 'hydration-serum-100' },
        { t: 'كويس وعايزة أحافظ عليه', tEn: 'Healthy — I want to keep it that way', ico: '✨', s: { luxury: 2, go: 1 } }
      ]
    },
    {
      id: 'hair',
      q: 'شعرك طوله وكثافته إيه؟',
      qEn: 'How long and thick is your hair?',
      a: [
        { t: 'طويل وكثيف', tEn: 'Long and thick', ico: '👩‍🦱', s: { hydration: 3, luxury: 1 } },
        { t: 'متوسط', tEn: 'Medium', ico: '💇‍♀️', s: { luxury: 3, hydration: 1 } },
        { t: 'قصير أو خفيف', tEn: 'Short or fine', ico: '💁‍♀️', s: { go: 2, luxury: 2 } }
      ]
    },
    {
      id: 'who',
      q: 'المنتجات هتستخدمها مين؟',
      qEn: 'Who will be using the products?',
      a: [
        { t: 'أنا بس', tEn: 'Just me', ico: '🙋‍♀️', s: { luxury: 2, go: 1 } },
        { t: 'أنا والعيلة', tEn: 'Me and my family', ico: '👨‍👩‍👧', s: { hydration: 3 } },
        { t: 'بشتغل في مجال الشعر', tEn: "I work with hair", ico: '💈', s: { hydration: 3 } }
      ]
    },
    {
      id: 'use',
      q: 'بتسافري أو بتروحي چيم كتير؟',
      qEn: 'Do you travel or hit the gym often?',
      a: [
        { t: 'أيوه، كتير', tEn: 'Yes, often', ico: '✈️', s: { go: 3 } },
        { t: 'أحياناً', tEn: 'Sometimes', ico: '🚶‍♀️', s: { go: 1, luxury: 1 } },
        { t: 'لأ، في البيت غالباً', tEn: 'No, mostly at home', ico: '🏠', s: { luxury: 2, hydration: 1 } }
      ]
    }
  ];

  // Why each line came out on top — written from the collection's own
  // description, so nothing here is a claim the packaging does not make.
  var WHY = {
    luxury:    'الروتين الكامل بحجم 500 مل — مناسب لشعرك ولاستخدامك اليومي في البيت.',
    hydration: 'تركيبة الأرچان بعبوات 1 لتر — أنسب للشعر الجاف أو الكثيف أو لأكتر من شخص.',
    go:        'أحجام 250 مل تدخل أي شنطة — أنسب للسفر والچيم ولو بتجربي YOURS لأول مرة.'
  };
  var WHY_EN = {
    luxury:    'The complete 500 ml routine — suits your hair and daily use at home.',
    hydration: 'The argan line in 1 L bottles — best for dry or thick hair, or more than one person.',
    go:        '250 ml sizes that fit any bag — best for travel, the gym, or a first try.'
  };

  var state = { step: -1, answers: {}, scores: {}, addons: {}, started: false };
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return D.esc(s); }
  function en() { return D.isEn(); }
  function pickT(o) { return en() ? (o.tEn || o.t) : o.t; }
  function pickQ(o) { return en() ? (o.qEn || o.q) : o.q; }

  function emit(key) { try { if (global.Sedra && Sedra.track) Sedra.track(key); } catch (e) {} }

  function open() {
    state = { step: 0, answers: {}, scores: {}, addons: {}, started: true };
    emit('quizStarts');
    $('#quizOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    render();
  }
  function close() {
    $('#quizOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function answer(qi, ai) {
    var q = QUESTIONS[qi], a = q.a[ai];
    state.answers[q.id] = pickT(a);
    Object.keys(a.s).forEach(function (k) { state.scores[k] = (state.scores[k] || 0) + a.s[k]; });
    if (a.addon) state.addons[a.addon] = true;
    state.step = qi + 1;
    render();
  }

  function winner() {
    var cat = Sedra.state.catalog;
    var live = {};
    D.visibleCategories(cat).forEach(function (c) { live[c.id] = true; });
    var best = null, bestScore = -1;
    Object.keys(state.scores).forEach(function (k) {
      if (!live[k]) return;                       // never recommend a hidden line
      if (state.scores[k] > bestScore) { bestScore = state.scores[k]; best = k; }
    });
    if (!best) { var first = D.visibleCategories(cat)[0]; best = first && first.id; }
    return best ? D.categoryById(cat, best) : null;
  }

  function progressHTML() {
    return '<div class="quiz-progress" aria-hidden="true">' + QUESTIONS.map(function (_, i) {
      return '<span class="' + (i < state.step ? 'done' : (i === state.step ? 'now' : '')) + '"></span>';
    }).join('') + '</div>';
  }

  function render() {
    var body = $('#quizBody'), head = $('#quizTitle');
    if (state.step < QUESTIONS.length) {
      var qi = state.step, q = QUESTIONS[qi];
      head.textContent = en() ? ('Question ' + (qi + 1) + ' of ' + QUESTIONS.length)
                              : ('سؤال ' + (qi + 1) + ' من ' + QUESTIONS.length);
      body.innerHTML = progressHTML() +
        '<h4 class="quiz-q">' + esc(pickQ(q)) + '</h4>' +
        '<div class="quiz-options">' + q.a.map(function (a, ai) {
          return '<button type="button" class="quiz-opt" data-q="' + qi + '" data-a="' + ai + '">' +
            '<span class="quiz-opt-ico" aria-hidden="true">' + a.ico + '</span>' +
            '<span class="quiz-opt-t">' + esc(pickT(a)) + '</span></button>';
        }).join('') + '</div>' +
        (qi > 0 ? '<button type="button" class="quiz-back" data-back>‹ ' + (en() ? 'Back' : 'رجوع') + '</button>' : '');
      return;
    }
    renderResult();
  }

  function renderResult() {
    var cat = Sedra.state.catalog, c = winner();
    var head = $('#quizTitle'), body = $('#quizBody');
    if (!c) { body.innerHTML = '<p class="quiz-q">' + (en() ? 'No collections available right now.' : 'مفيش مجموعات متاحة حالياً.') + '</p>'; return; }
    emit('quizCompletes');
    emit('quizPick_' + c.id);

    var items = D.productsOf(cat, c.id);
    var save = (c.oldPrice && c.oldPrice > c.price) ? c.oldPrice - c.price : 0;
    var addons = Object.keys(state.addons)
      .map(function (id) { return D.productById(cat, id); })
      .filter(function (p) { return p && p.solo && D.isBuyable(cat, p); });

    head.textContent = en() ? 'Your routine' : 'روتينك';
    body.innerHTML =
      '<div class="quiz-result">' +
        '<div class="quiz-result-kicker">' + (en() ? 'Best match for you' : 'الأنسب لشعرك') + '</div>' +
        '<a class="quiz-result-media" href="category.html?c=' + encodeURIComponent(c.id) + '">' +
          D.imgTag(c.coverImg, { alt: D.pick(c, 'name'), variant: 't' }) + '</a>' +
        '<h3 class="quiz-result-name">' + esc(c.icon) + ' ' + esc(D.pick(c, 'name')) + '</h3>' +
        '<p class="quiz-result-why">' + esc((en() ? WHY_EN : WHY)[c.id] || D.pick(c, 'tagline')) + '</p>' +
        (items.length ? '<ul class="set-contents">' + items.map(function (p) {
            return '<li>' + esc(D.pick(p, 'name')) + '</li>'; }).join('') + '</ul>' : '') +
        '<div class="price-line quiz-result-price"><span class="price-now">' + D.money(c.price) + '</span>' +
          (save ? '<span class="price-was">' + D.money(c.oldPrice) + '</span>' : '') + '</div>' +
        '<button type="button" class="btn btn-gold btn-block p-add" data-keep-label="1" data-add="' + esc(D.setIdOf(c.id)) + '">' +
          (en() ? '+ Add the set to cart' : '+ أضف المجموعة للطلب') + '</button>' +
        (addons.length
          ? '<div class="quiz-addons"><div class="quiz-addons-head">' +
              (en() ? 'Worth adding for your case' : 'ويفرق معاكِ كمان') + '</div>' +
              addons.map(function (p) {
                return '<button type="button" class="quiz-addon p-add" data-keep-label="1" data-add="' + esc(p.id) + '">' +
                  '<span>' + esc(D.pick(p, 'name')) + '</span><b>' + D.money(D.effectivePrice(cat, p)) + '</b></button>';
              }).join('') + '</div>'
          : '') +
        '<a class="btn btn-gold-outline btn-block quiz-wa" data-wa-link target="_blank" rel="noopener" href="#">' +
          (en() ? 'Ask our hair care experts' : 'استشيري خبراء العناية بشعرك') + '</a>' +
        '<button type="button" class="quiz-back" data-restart>↺ ' + (en() ? 'Start over' : 'اعملي الاختبار تاني') + '</button>' +
      '</div>';

    // a WhatsApp message built only from the answers she picked — no name,
    // no phone, nothing she did not type herself
    var lines = QUESTIONS.map(function (q) {
      return state.answers[q.id] ? ('• ' + (en() ? (q.qEn || q.q) : q.q) + ' ' + state.answers[q.id]) : '';
    }).filter(Boolean).join('\n');
    var msg = (en() ? 'Hi! The quiz suggested ' : 'السلام عليكم، الاختبار رشّحلي ') + D.pick(c, 'name') +
      (en() ? '.\nMy answers:\n' : '.\nإجاباتي:\n') + lines;
    var wa = body.querySelector('.quiz-wa');
    if (wa) wa.setAttribute('data-wa-text', msg);
    if (global.Sedra && Sedra.refreshWaLinks) Sedra.refreshWaLinks();
    D.hydrateMedia(body);
    if (global.Sedra && Sedra.refreshAddButtons) Sedra.refreshAddButtons();
  }

  function mount() {
    if ($('#quizOverlay')) return;
    var html =
      '<div class="sheet-overlay quiz-overlay" id="quizOverlay">' +
        '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="quizTitle">' +
          '<div class="sheet-head"><h3 id="quizTitle">روتينك</h3>' +
            '<button class="round-close" type="button" data-close-quiz aria-label="إغلاق">✕</button></div>' +
          '<div class="sheet-body" id="quizBody"></div>' +
        '</div></div>';
    var holder = document.createElement('div');
    holder.innerHTML = html;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);

    document.addEventListener('click', function (e) {
      var t = e.target, el;
      if ((el = t.closest('[data-open-quiz]'))) { e.preventDefault(); return open(); }
      if (t.closest('[data-close-quiz]')) { e.preventDefault(); return close(); }
      if (t.id === 'quizOverlay') return close();
      if ((el = t.closest('.quiz-opt'))) {
        return answer(parseInt(el.getAttribute('data-q'), 10), parseInt(el.getAttribute('data-a'), 10));
      }
      if (t.closest('[data-back]')) { state.step = Math.max(0, state.step - 1); return render(); }
      if (t.closest('[data-restart]')) { emit('quizRestarts'); state = { step: 0, answers: {}, scores: {}, addons: {}, started: true }; return render(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#quizOverlay').classList.contains('open')) close();
    });
  }

  global.YoursQuiz = { mount: mount, open: open, close: close, QUESTIONS: QUESTIONS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window);
