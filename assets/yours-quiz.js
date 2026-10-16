/* =====================================================================
   YOURS — hair routine quiz and recommendation engine

   WHAT THIS ENGINE MAY AND MAY NOT SAY
   Every recommendation is drawn from what the catalog itself documents:
     · Hydration — argan formula described for dry and damaged hair, 1 L
     · Luxury    — the complete four-step routine, olive-oil rich, 500 ml
     · Go        — the same routine in 250 ml, for travel and for a first try
   Nothing here claims an ingredient, a benefit or a compatibility that the
   product information does not already state, and nothing diagnoses.

   SALON TREATMENT AFTERCARE
   The catalog says nothing about protein, keratin, smoothing, bleaching or
   relaxing aftercare. So the engine never guesses it: anyone who reports a
   recent treatment is routed to the YOURS team instead. When the owner
   confirms compatibility in writing, set AFTERCARE_VERIFIED to true and fill
   AFTERCARE_RULES — that is the only change needed.
   ===================================================================== */
(function (global) {
  'use strict';
  var D = global.SedraData;

  var AFTERCARE_VERIFIED = false;   // ← flip only on written confirmation
  var AFTERCARE_RULES = null;

  /* ---------------- questions ---------------- */
  var Q = [
    {
      id: 'concerns', multi: true, max: 3,
      q: 'إيه أكتر حاجة نفسك تتحسن في شعرك؟',
      qEn: 'What would you most like to improve about your hair?',
      hint: 'تقدري تختاري لحد ٣',
      hintEn: 'Pick up to 3',
      a: [
        { v: 'dry',      t: 'جفاف وقلة ترطيب',            tEn: 'Dryness and lack of moisture', ico: '🌵' },
        { v: 'frizz',    t: 'هيشان وصعوبة في التحكم',      tEn: 'Frizz and hard to manage', ico: '🌀' },
        { v: 'tangle',   t: 'تشابك وصعوبة في التسريح',     tEn: 'Tangling and hard to comb', ico: '🪮' },
        { v: 'fragile',  t: 'تقصف وشعر ضعيف',             tEn: 'Breakage and fragile strands', ico: '✂️' },
        { v: 'dull',     t: 'بهتان وقلة نعومة',            tEn: 'Dullness and lack of softness', ico: '🪞' },
        { v: 'chem',     t: 'خشونة بعد صبغة أو معالجة',    tEn: 'Rough after colouring or chemicals', ico: '🎨' },
        { v: 'salon',    t: 'عملت بروتين/كيراتين وعايزة عناية بعده', tEn: 'I had a protein or keratin treatment and need aftercare', ico: '💈' },
        { v: 'routine',  t: 'عايزة روتين كامل ومنتظم',     tEn: 'A complete, regular routine', ico: '✨' },
        { v: 'unsure',   t: 'مش عارفة شعري محتاج إيه',      tEn: "I'm not sure what my hair needs", ico: '🤷‍♀️', exclusive: true }
      ]
    },
    {
      id: 'texture',
      q: 'شعرك طبيعته إيه؟',
      qEn: 'How would you describe your natural hair texture?',
      note: 'بنستخدمها كمعلومة مساعدة بس',
      noteEn: 'Used as supporting information only',
      a: [
        { v: 'straight', t: 'ناعم', tEn: 'Straight', ico: '💁‍♀️' },
        { v: 'wavy',     t: 'مموج', tEn: 'Wavy', ico: '🌊' },
        { v: 'curly',    t: 'كيرلي', tEn: 'Curly', ico: '🌀' },
        { v: 'coily',    t: 'كيرلي جداً', tEn: 'Coily', ico: '🧬' },
        { v: 'unsure',   t: 'مش متأكدة', tEn: "I'm not sure", ico: '🤷‍♀️' }
      ]
    },
    {
      id: 'treatment',
      q: 'عملتي أي معالجة في الصالون مؤخراً؟',
      qEn: 'Have you recently had any salon treatment?',
      a: [
        { v: 'protein',   t: 'بروتين', tEn: 'Protein treatment', ico: '💈' },
        { v: 'keratin',   t: 'كيراتين', tEn: 'Keratin treatment', ico: '💈' },
        { v: 'smoothing', t: 'فرد أو تنعيم', tEn: 'Smoothing treatment', ico: '💈' },
        { v: 'colour',    t: 'صبغة أو سحب لون', tEn: 'Colouring or bleaching', ico: '🎨' },
        { v: 'relax',     t: 'معالجة كيميائية تانية', tEn: 'Another chemical treatment', ico: '🧪' },
        { v: 'multi',     t: 'أكتر من واحدة من دول', tEn: 'More than one of these', ico: '➕' },
        { v: 'none',      t: 'ولا واحدة', tEn: 'None of these', ico: '🚫' },
        { v: 'unsure',    t: 'مش عارفة اتعمل إيه بالظبط', tEn: "I'm not sure what was used", ico: '🤷‍♀️' }
      ]
    },
    {
      id: 'since', when: function (ans) { return isTreated(ans.treatment); },
      q: 'آخر معالجة كانت إمتى؟',
      qEn: 'When was your most recent treatment?',
      a: [
        { v: 'week',   t: 'خلال آخر ٧ أيام', tEn: 'Within the last 7 days', ico: '📅' },
        { v: 'month',  t: 'من أسبوع لشهر',   tEn: '1–4 weeks ago', ico: '🗓️' },
        { v: 'older',  t: 'أكتر من شهر',     tEn: 'More than a month ago', ico: '📆' },
        { v: 'unsure', t: 'مش فاكرة',        tEn: "I'm not sure", ico: '🤷‍♀️' }
      ]
    },
    {
      id: 'after', when: function (ans) { return isTreated(ans.treatment); },
      q: 'عايزة عناية إيه بعد المعالجة؟',
      qEn: 'What kind of care are you looking for after your treatment?',
      a: [
        { v: 'maintain', t: 'أحافظ على نتيجة المعالجة', tEn: 'Maintain my treatment results', ico: '🛡️' },
        { v: 'moisture', t: 'ترطيب ونعومة بعدها',       tEn: 'Moisture and softness', ico: '💧' },
        { v: 'detangle', t: 'تسريح أسهل كل يوم',        tEn: 'Easier detangling', ico: '🪮' },
        { v: 'full',     t: 'روتين عناية كامل بعد المعالجة', tEn: 'A complete aftercare routine', ico: '✨' },
        { v: 'safe',     t: 'مش عارفة إيه الآمن استخدامه بعدها', tEn: "I'm unsure what is safe to use", ico: '❓' },
        { v: 'reaction', t: 'عندي رد فعل غريب أو مشكلة في فروة الرأس', tEn: 'An unusual reaction or scalp problem', ico: '⚠️' }
      ]
    },
    {
      id: 'goal',
      q: 'إيه أهم نتيجة بالنسبالك؟',
      qEn: 'What result matters most to you?',
      a: [
        { v: 'moisture', t: 'ترطيب ونعومة',        tEn: 'Moisture and softness', ico: '💧' },
        { v: 'detangle', t: 'تسريح أسهل',          tEn: 'Easier detangling', ico: '🪮' },
        { v: 'smooth',   t: 'مظهر أنعم وأسهل في التحكم', tEn: 'A smoother, more manageable look', ico: '✨' },
        { v: 'fragile',  t: 'عناية بالشعر الضعيف',  tEn: 'Care for fragile strands', ico: '🧵' },
        { v: 'maintain', t: 'أحافظ على معالجة الصالون', tEn: 'Maintain a salon treatment', ico: '🛡️' },
        { v: 'routine',  t: 'روتين يومي كامل',      tEn: 'A complete everyday routine', ico: '🗓️' },
        { v: 'unsure',   t: 'مش متأكدة',            tEn: "I'm not sure", ico: '🤷‍♀️' }
      ]
    },
    {
      id: 'size',
      q: 'تفضّلي تبدئي بإيه؟',
      qEn: 'What kind of routine are you looking for?',
      a: [
        { v: 'small', t: 'حجم صغير أجربه الأول',   tEn: 'A smaller collection to try', ico: '🧳' },
        { v: 'full',  t: 'مجموعة كاملة',           tEn: 'A complete collection', ico: '📦' },
        { v: 'large', t: 'حجم كبير للاستخدام المنتظم', tEn: 'A larger size for regular use', ico: '🏺' },
        { v: 'help',  t: 'عايزة حد من YOURS يساعدني', tEn: 'Help from the YOURS team', ico: '💬' }
      ]
    }
  ];

  function isTreated(v) { return v && v !== 'none' && v !== 'unsure'; }

  /* ---------------- suitability matrix ----------------
     The catalog documents two formula families, not three unrelated products:
       argan   → Hydration, "المخصصة للشعر الجاف والتالف", 1 L
       routine → the four-step YOURS routine, which Luxury carries at 500 ml and
                 Go carries at 250 ml ("نفس الروتين بالظبط بأحجام أصغر")
     So the concerns and the goal choose the FORMULA, and the size question
     chooses which bottle of that formula. A blank below is a deliberate "the
     product information does not support this", not a zero score. */
  var FAMILY = { argan: ['hydration'], routine: ['luxury', 'go'] };
  var CONCERN_FIT = {
    dry:     { argan: 3, routine: 1 },      // "المخصصة للشعر الجاف"
    fragile: { argan: 2, routine: 2 },      // "والتالف" / "ترميم"
    chem:    { argan: 2, routine: 1 },
    dull:    { routine: 3 },                // "ترجّع له نعومته ولمعانه"
    frizz:   { routine: 2, argan: 1 },      // serum: نعومة ولمعان
    tangle:  { routine: 2 },                // conditioner: فك التشابك
    routine: { routine: 3 },                // "روتين YOURS الكامل"
    unsure:  {}
  };
  var GOAL_FIT = {
    moisture: { argan: 3, routine: 1 },
    detangle: { routine: 2 },
    smooth:   { routine: 2, argan: 1 },
    fragile:  { argan: 2, routine: 2 },
    routine:  { routine: 3 },
    maintain: {},                           // handled by the aftercare path
    unsure:   {}
  };
  // Which bottle of the chosen formula, by what she said she wants to start with.
  // Hydration exists in one size only, so the size answer cannot move it.
  var SIZE_LINE = { small: 'go', full: 'luxury', large: 'luxury' };

  var WHY = {
    hydration: { ar: 'تركيبة الأرچان، والوصف بتاعها مكتوب للشعر الجاف والتالف، وبعبوات 1 لتر تكفي استخدام منتظم أو أكتر من شخص.',
                 en: 'The argan formula, described for dry and damaged hair, in 1 L bottles that suit regular use or more than one person.' },
    luxury:    { ar: 'الروتين الكامل بأربع خطوات بحجم 500 مل — تنظيف وتغذية ونعومة ولمعان مع الاستخدام المنتظم.',
                 en: 'The complete four-step routine in 500 ml — cleanse, nourish, softness and shine with regular use.' },
    go:        { ar: 'نفس الروتين بالظبط بأحجام 250 مل تدخل أي شنطة — الأنسب للتجربة الأولى وللسفر والچيم.',
                 en: 'Exactly the same routine in 250 ml sizes that fit any bag — best for a first try, travel and the gym.' }
  };

  /* ---------------- engine ---------------- */
  // Returns { path, picks:[{cat,score}], addons:[product], assist:bool, note }
  function recommend(ans) {
    var cat = global.Sedra.state.catalog;
    var live = D.visibleCategories(cat);
    var liveIds = {}; live.forEach(function (c) { liveIds[c.id] = true; });
    var concerns = ans.concerns || [];

    // 1 — anything that belongs with a professional, not with a shampoo
    if (ans.after === 'reaction') {
      return { path: 'care', assist: true,
        note: { ar: 'اللي بتوصفيه محتاج رأي متخصص — كلّمي الصالون اللي عمللك المعالجة أو دكتور جلدية. إحنا مش بديل عن الاستشارة الطبية.',
                en: 'What you describe needs a professional opinion — please contact the salon that did your treatment, or a dermatologist. We are not a substitute for medical advice.' } };
    }

    // 2 — salon treatment aftercare: the catalog does not document compatibility
    var treated = isTreated(ans.treatment) || concerns.indexOf('salon') > -1;
    if (treated && !AFTERCARE_VERIFIED) {
      return { path: 'aftercare', assist: true,
        note: { ar: 'نحب نساعدك تختاري العناية المناسبة بعد المعالجة. معلومات منتجاتنا المتاحة مش بتحدد التوافق مع البروتين والكيراتين وأنواع الفرد، وماينفعش نخمّن في حاجة زي دي — كلّمي فريق YOURS ونرشّحلك صح.',
                en: "We'd love to help you choose the right aftercare routine. Our available product information does not state compatibility with protein, keratin or smoothing treatments, and that is not something to guess — please contact the YOURS team and we'll help you choose." } };
    }

    // 3 — she asked for a person
    if (ans.size === 'help') {
      return { path: 'assist', assist: true,
        note: { ar: 'تحت أمرك — كلّمي فريق YOURS وهنساعدك تختاري في دقيقتين.',
                en: "Of course — message the YOURS team and we'll help you choose in a couple of minutes." } };
    }

    // 4 — score the two documented formula families
    var fam = { argan: 0, routine: 0 };
    function add(table, key) {
      var fit = table[key]; if (!fit) return;
      Object.keys(fit).forEach(function (f) { fam[f] += fit[f]; });
    }
    concerns.forEach(function (c) { add(CONCERN_FIT, c); });
    add(GOAL_FIT, ans.goal);

    // 5 — nothing in the answers points anywhere: say so instead of guessing
    if (!fam.argan && !fam.routine) {
      return { path: 'assist', assist: true,
        note: { ar: 'إجاباتك مش كفاية عشان نرشّح بثقة، ومش عايزين نخمّن. كلّمي فريق YOURS وهنساعدك تختاري في دقيقتين.',
                en: "Your answers aren't enough for us to recommend with confidence, and we'd rather not guess. Message the YOURS team and we'll help you choose." } };
    }

    // 6 — the formula first, then the bottle she said she wants to start with
    function lineOf(family) {
      var ids = FAMILY[family].slice();
      if (family === 'routine') {
        var want = SIZE_LINE[ans.size];
        ids.sort(function (a, b) { return (b === want) - (a === want); });
      }
      for (var k = 0; k < ids.length; k++) if (liveIds[ids[k]]) return ids[k];
      return null;
    }
    var order = fam.argan === fam.routine
      // a tie is broken by size, because that is the only thing left she told us:
      // a small start means the 250 ml routine, a large one means the 1 L bottles
      ? (ans.size === 'small' ? ['routine', 'argan'] : ans.size === 'large' ? ['argan', 'routine'] : ['routine', 'argan'])
      : (fam.argan > fam.routine ? ['argan', 'routine'] : ['routine', 'argan']);

    var picks = [];
    order.forEach(function (f) {
      var id = lineOf(f);
      if (id) picks.push({ cat: D.categoryById(cat, id), score: fam[f], family: f });
    });
    // the other bottle of the winning routine family is a real alternative too
    if (order[0] === 'routine') {
      var other = SIZE_LINE[ans.size] === 'go' ? 'luxury' : 'go';
      if (liveIds[other]) picks.push({ cat: D.categoryById(cat, other), score: fam.routine - 1, family: 'routine' });
    }
    picks = picks.filter(function (x) { return x.cat; }).slice(0, 3);
    if (!picks.length) {
      return { path: 'assist', assist: true,
        note: { ar: 'المجموعات مش متاحة دلوقتي — كلّمي فريق YOURS ونقولك المتاح.',
                en: 'The collections are not available right now — message the YOURS team and we will tell you what is in stock.' } };
    }

    // solo products worth adding, only the ones actually sold on their own
    var addons = [];
    function maybe(id) {
      var p = D.productById(cat, id);
      if (p && p.solo && D.isBuyable(cat, p) && addons.indexOf(p) === -1) addons.push(p);
    }
    if (concerns.indexOf('fragile') > -1 || concerns.indexOf('chem') > -1 || ans.goal === 'fragile') maybe('hydration-mask-500');
    if (concerns.indexOf('frizz') > -1 || concerns.indexOf('tangle') > -1 || ans.goal === 'detangle' || ans.goal === 'smooth') maybe('hydration-serum-100');

    return { path: 'match', picks: picks, addons: addons, families: fam };
  }

  /* ---------------- state + UI ---------------- */
  var S = { i: 0, ans: {}, open: false };
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return D.esc(s); }
  function en() { return D.isEn(); }
  function tx(o, k) { return en() ? (o[k + 'En'] || o[k]) : o[k]; }
  function emit(k) { try { if (global.Sedra && Sedra.track) Sedra.track(k); } catch (e) {} }

  function steps() { return Q.filter(function (q) { return !q.when || q.when(S.ans); }); }
  function cur() { return steps()[S.i]; }

  function answered(q) {
    var v = S.ans[q.id];
    return q.multi ? (v && v.length > 0) : !!v;
  }

  function open() {
    S = { i: 0, ans: {}, open: true };
    emit('quizStarts');
    $('#quizOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    render();
  }
  function close() { S.open = false; $('#quizOverlay').classList.remove('open'); document.body.style.overflow = ''; }

  function choose(val) {
    var q = cur();
    if (q.multi) {
      var list = S.ans[q.id] ? S.ans[q.id].slice() : [];
      var opt = q.a.filter(function (o) { return o.v === val; })[0];
      if (opt && opt.exclusive) list = list.indexOf(val) > -1 ? [] : [val];
      else {
        list = list.filter(function (v) { return !(q.a.filter(function (o) { return o.v === v; })[0] || {}).exclusive; });
        var at = list.indexOf(val);
        if (at > -1) list.splice(at, 1);
        else if (list.length < (q.max || 99)) list.push(val);
      }
      S.ans[q.id] = list;
      render();
      return;
    }
    S.ans[q.id] = val;
    // a changed answer must not leave a stale answer to a question that no
    // longer applies — e.g. aftercare answers after switching to "none"
    Q.forEach(function (x) { if (x.when && !x.when(S.ans)) delete S.ans[x.id]; });
    next();
  }

  function next() {
    var list = steps();
    if (S.i < list.length - 1) { S.i++; render(); }
    else { S.i = list.length; render(); }
  }
  function back() { if (S.i > 0) { S.i--; render(); } }

  function render() {
    var list = steps(), head = $('#quizTitle'), body = $('#quizBody');
    if (S.i >= list.length) return result();
    var q = list[S.i];
    head.textContent = en() ? ('Question ' + (S.i + 1) + ' of ' + list.length)
                            : ('سؤال ' + (S.i + 1) + ' من ' + list.length);
    var picked = S.ans[q.id];
    var isPicked = function (v) { return q.multi ? (picked || []).indexOf(v) > -1 : picked === v; };
    body.innerHTML =
      '<div class="quiz-progress" aria-hidden="true">' + list.map(function (_, i) {
        return '<span class="' + (i < S.i ? 'done' : (i === S.i ? 'now' : '')) + '"></span>'; }).join('') + '</div>' +
      '<h4 class="quiz-q">' + esc(tx(q, 'q')) + '</h4>' +
      (q.hint ? '<p class="quiz-hint">' + esc(tx(q, 'hint')) + '</p>' : '') +
      (q.note ? '<p class="quiz-hint">' + esc(tx(q, 'note')) + '</p>' : '') +
      '<div class="quiz-options" role="group">' + q.a.map(function (o) {
        return '<button type="button" class="quiz-opt' + (isPicked(o.v) ? ' picked' : '') + '"' +
          ' aria-pressed="' + (isPicked(o.v) ? 'true' : 'false') + '" data-v="' + esc(o.v) + '">' +
          '<span class="quiz-opt-ico" aria-hidden="true">' + o.ico + '</span>' +
          '<span class="quiz-opt-t">' + esc(tx(o, 't')) + '</span>' +
          (q.multi ? '<span class="quiz-tick" aria-hidden="true">' + (isPicked(o.v) ? '✓' : '') + '</span>' : '') +
          '</button>'; }).join('') + '</div>' +
      '<div class="quiz-nav">' +
        (S.i > 0 ? '<button type="button" class="quiz-back" data-back>‹ ' + (en() ? 'Back' : 'رجوع') + '</button>' : '<span></span>') +
        (q.multi ? '<button type="button" class="btn btn-gold quiz-next" data-next' + (answered(q) ? '' : ' disabled') + '>' +
            (en() ? 'Next ›' : 'التالي ›') + '</button>' : '<span></span>') +
      '</div>';
  }

  function assistCard(note, answersHTML) {
    return '<div class="quiz-result">' +
      '<div class="quiz-ritual-head"><span class="quiz-result-kicker">' + (en() ? 'YOUR YOURS RITUAL' : 'روتين YOURS بتاعك') + '</span>' +
        '<p class="quiz-ritual-sub">' + (en() ? 'A routine selected around your haircare needs.' : 'روتين متختار على حسب احتياج شعرك.') + '</p></div>' +
      answersHTML +
      '<div class="quiz-assist"><span class="quiz-assist-ico" aria-hidden="true">💬</span><p>' + esc(en() ? note.en : note.ar) + '</p></div>' +
      '<a class="btn btn-gold btn-block quiz-wa" data-wa-link target="_blank" rel="noopener" href="#">' +
        (en() ? 'Message the YOURS team' : 'كلّمي فريق YOURS') + '</a>' +
      '<button type="button" class="quiz-back" data-restart>↺ ' + (en() ? 'Retake the quiz' : 'اعملي الاختبار تاني') + '</button>' +
    '</div>';
  }

  function answersSummary() {
    var rows = steps().map(function (q) {
      var v = S.ans[q.id]; if (!v || (q.multi && !v.length)) return '';
      var label = function (val) { var o = q.a.filter(function (x) { return x.v === val; })[0]; return o ? tx(o, 't') : val; };
      var val = q.multi ? v.map(label).join('، ') : label(v);
      return '<li><span>' + esc(tx(q, 'q')) + '</span><b>' + esc(val) + '</b></li>';
    }).filter(Boolean).join('');
    return rows ? '<details class="quiz-summary"><summary>' + (en() ? 'Your answers' : 'إجاباتك') + '</summary><ul>' + rows + '</ul></details>' : '';
  }

  function result() {
    var cat = global.Sedra.state.catalog, body = $('#quizBody'), head = $('#quizTitle');
    head.textContent = en() ? 'Your routine' : 'روتينك';
    var r = recommend(S.ans);
    emit('quizCompletes');
    emit('quizPath_' + r.path);

    if (r.assist) {
      body.innerHTML = assistCard(r.note, answersSummary());
      var msg = (en() ? 'Hi! I did the hair quiz on the site and would like help choosing.\n' : 'السلام عليكم، عملت اختبار الشعر على الموقع وعايزة مساعدة في الاختيار.\n')
        + summaryText();
      var w = body.querySelector('.quiz-wa'); if (w) w.setAttribute('data-wa-text', msg);
      if (global.Sedra && Sedra.refreshWaLinks) Sedra.refreshWaLinks(body);
      return;
    }

    r.picks.forEach(function (x) { emit('quizPick_' + x.cat.id); });
    var main = r.picks[0], alts = r.picks.slice(1);
    body.innerHTML = '<div class="quiz-result">' +
      '<div class="quiz-ritual-head"><span class="quiz-result-kicker">' + (en() ? 'YOUR YOURS RITUAL' : 'روتين YOURS بتاعك') + '</span>' +
        '<p class="quiz-ritual-sub">' + (en() ? 'A routine selected around your haircare needs.' : 'روتين متختار على حسب احتياج شعرك.') + '</p></div>' +
      answersSummary() +
      collectionCard(cat, main.cat, true) +
      (r.addons.length ? '<div class="quiz-addons"><div class="quiz-addons-head">' +
          (en() ? 'Sold on their own, and relevant to what you picked' : 'بتتباع لوحدها، وليها علاقة باللي اخترتيه') + '</div>' +
          r.addons.map(function (p) {
            return '<button type="button" class="quiz-addon p-add" data-keep-label="1" data-add="' + esc(p.id) + '">' +
              '<span>' + esc(D.pick(p, 'name')) + '</span><b>' + D.money(D.effectivePrice(cat, p)) + '</b></button>';
          }).join('') + '</div>' : '') +
      (alts.length ? '<div class="quiz-alts"><div class="quiz-addons-head">' +
          (en() ? 'Also suitable — the difference is size and formula' : 'كمان مناسبة — الفرق في الحجم والتركيبة') + '</div>' +
          alts.map(function (x) { return collectionCard(cat, x.cat, false); }).join('') + '</div>' : '') +
      '<a class="btn btn-gold-outline btn-block quiz-wa" data-wa-link target="_blank" rel="noopener" href="#">' +
        (en() ? 'Ask our hair care experts' : 'استشيري خبراء العناية بشعرك') + '</a>' +
      '<button type="button" class="quiz-back" data-restart>↺ ' + (en() ? 'Retake the quiz' : 'اعملي الاختبار تاني') + '</button>' +
    '</div>';

    var msg = (en() ? 'Hi! The quiz suggested ' : 'السلام عليكم، الاختبار رشّحلي ') + D.pick(main.cat, 'name') + '.\n' + summaryText();
    var w = body.querySelector('.quiz-wa'); if (w) w.setAttribute('data-wa-text', msg);
    if (global.Sedra && Sedra.refreshWaLinks) Sedra.refreshWaLinks(body);
    D.hydrateMedia(body);
    if (global.Sedra && Sedra.refreshAddButtons) Sedra.refreshAddButtons();
  }

  function collectionCard(cat, c, primary) {
    var items = D.productsOf(cat, c.id);
    var save = (c.oldPrice && c.oldPrice > c.price) ? c.oldPrice - c.price : 0;
    var usage = D.pick(c, 'usage');
    return '<article class="quiz-pick' + (primary ? ' primary' : '') + '">' +
      '<a class="quiz-result-media" href="category.html?c=' + encodeURIComponent(c.id) + '">' +
        D.imgTag(c.coverImg, { alt: D.pick(c, 'name'), variant: 't' }) + '</a>' +
      '<h3 class="quiz-result-name">' + esc(c.icon) + ' ' + esc(D.pick(c, 'name')) + '</h3>' +
      '<p class="quiz-result-why">' + esc(WHY[c.id] ? WHY[c.id][en() ? 'en' : 'ar'] : D.pick(c, 'description')) + '</p>' +
      (items.length ? '<ul class="set-contents">' + items.map(function (p) {
          return '<li>' + esc(D.pick(p, 'name')) + '</li>'; }).join('') + '</ul>' : '') +
      (primary && usage ? '<div class="quiz-usage"><b>' + (en() ? 'How to use' : 'طريقة الاستخدام') + '</b><p>' + esc(usage) + '</p></div>' : '') +
      '<div class="price-line quiz-result-price"><span class="price-now">' + D.money(c.price) + '</span>' +
        (save ? '<span class="price-was">' + D.money(c.oldPrice) + '</span>' : '') + '</div>' +
      '<button type="button" class="btn ' + (primary ? 'btn-gold' : 'btn-dark') + ' btn-block p-add" data-keep-label="1" data-add="' + esc(D.setIdOf(c.id)) + '">' +
        (en() ? '+ Add the set to cart' : '+ أضف المجموعة للطلب') + '</button>' +
      '<a class="quiz-pick-link" href="category.html?c=' + encodeURIComponent(c.id) + '">' +
        (en() ? 'See the full collection' : 'شوفي المجموعة كاملة') + '</a>' +
    '</article>';
  }

  function summaryText() {
    return steps().map(function (q) {
      var v = S.ans[q.id]; if (!v || (q.multi && !v.length)) return '';
      var label = function (val) { var o = q.a.filter(function (x) { return x.v === val; })[0]; return o ? tx(o, 't') : val; };
      return '• ' + tx(q, 'q') + ' ' + (q.multi ? v.map(label).join('، ') : label(v));
    }).filter(Boolean).join('\n');
  }

  function mount() {
    if ($('#quizOverlay')) return;
    var holder = document.createElement('div');
    holder.innerHTML =
      '<div class="sheet-overlay quiz-overlay" id="quizOverlay">' +
        '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="quizTitle">' +
          '<div class="sheet-head"><h3 id="quizTitle">روتينك</h3>' +
            '<button class="round-close" type="button" data-close-quiz aria-label="إغلاق">✕</button></div>' +
          '<div class="sheet-body" id="quizBody"></div>' +
        '</div></div>';
    while (holder.firstChild) document.body.appendChild(holder.firstChild);

    document.addEventListener('click', function (e) {
      var t = e.target, el;
      if (!t || !t.closest) return;
      if ((el = t.closest('[data-open-quiz]'))) { e.preventDefault(); return open(); }
      if (t.closest('[data-close-quiz]')) { e.preventDefault(); return close(); }
      if (t.id === 'quizOverlay') return close();
      if ((el = t.closest('.quiz-opt'))) return choose(el.getAttribute('data-v'));
      if (t.closest('[data-next]')) { if (answered(cur())) next(); return; }
      if (t.closest('[data-back]')) return back();
      if (t.closest('[data-restart]')) { emit('quizRestarts'); S = { i: 0, ans: {}, open: true }; return render(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#quizOverlay').classList.contains('open')) close();
    });
  }

  global.YoursQuiz = { mount: mount, open: open, close: close, QUESTIONS: Q, recommend: recommend,
    _set: function (a) { S.ans = a; }, _state: function () { return S; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window);
