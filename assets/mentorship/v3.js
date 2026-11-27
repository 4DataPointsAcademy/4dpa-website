/* Mentorship flagship V3: hero film, 4 Data Points dashboard + 3D model, stories, sticky CTA, attribution, conversion events. */
(function () {
  document.body.classList.remove('no-js');
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SAVE = !!(navigator.connection && navigator.connection.saveData);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // Nav: solid after the hero starts scrolling; mobile menu toggle.
  var nav = $('#vnav'), mb = $('#vmenu-btn');
  var onScroll = function () { nav.classList.toggle('solid', scrollY > 40 || nav.classList.contains('open')); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  mb.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu'; onScroll();
  });
  $$('#vmenu a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = 'Menu'; }); });

  // Hero film: composition-specific source, loaded after the page so text and buttons are never delayed.
  var vid = $('#vh-vid');
  if (vid && !REDUCED && !SAVE) {
    addEventListener('load', function () {
      var mob = matchMedia('(max-width:700px), (max-width:1024px) and (orientation:portrait)').matches;
      vid.src = mob ? vid.dataset.mob : vid.dataset.desk;
      vid.addEventListener('playing', function () { vid.classList.add('on'); }, { once: true });
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    });
  }

  // Reveal on scroll.
  if ('IntersectionObserver' in window && !REDUCED) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { ro.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  // ---- Four Data Points calculator (logic unchanged from V2; illustrative only)
  var calc = $('#calc'), model = null, current = 'buy';
  var labels = { buy: '01 · Cost to buy', rehab: '02 · Cost to rehab', arv: '03 · After-repair value', rent: '04 · Rental income' };
  var descs = { buy: 'The property as you find it.', rehab: 'Every component that needs work, budgeted.', arv: 'The finished property, valued on renovated comps.', rent: 'What the finished property can earn each month.' };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var money = function (n) { return (n < 0 ? '-$' : '$') + fmt(Math.abs(n)); };
  var parse = function (v) { var n = Number(String(v).replace(/[^0-9.]/g, '')); return isFinite(n) ? n : 0; };
  var val = {};
  function fill(r) { var p = (Number(r.value) - Number(r.min)) / (Number(r.max) - Number(r.min)) * 100; r.style.setProperty('--p', Math.max(0, Math.min(100, p)) + '%'); }
  function show(k) {
    current = k;
    $$('.dp-fallback img').forEach(function (i) { i.classList.toggle('on', i.dataset.k === k); });
    $$('.fld', calc).forEach(function (f) { f.classList.toggle('on', f.dataset.k === k); });
    $$('.dp-steps button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === k); });
    $('#dp-cap-t').textContent = labels[k]; $('#dp-cap-d').textContent = descs[k];
    if (model) model.setStep(k, val);
  }
  function out() {
    var all = val.buy + val.rehab, spread = val.arv - all, annual = val.rent * 12;
    $('#o-all').textContent = money(all);
    var sp = $('#o-spread'); sp.textContent = money(spread); sp.classList.toggle('neg', spread < 0);
    $('#o-rent').textContent = money(annual);
    if (model) model.setValues(val);
  }
  if (calc) {
    ['buy', 'rehab', 'arv', 'rent'].forEach(function (k) {
      var r = $('#c-' + k + '-r'), n = $('#c-' + k);
      val[k] = Number(r.value); fill(r);
      r.addEventListener('input', function () { val[k] = Number(r.value); n.value = fmt(val[k]); fill(r); show(k); out(); });
      n.addEventListener('input', function () { val[k] = parse(n.value); if (val[k] <= Number(r.max)) { r.value = val[k]; fill(r); } show(k); out(); });
      n.addEventListener('blur', function () { n.value = fmt(val[k]); });
      n.addEventListener('focus', function () { show(k); });
      r.addEventListener('focus', function () { show(k); });
    });
    $$('.dp-steps button').forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.k); }); });
    $$('.vh-rail a[data-step]').forEach(function (a) { a.addEventListener('click', function () { show(a.dataset.step); }); });
    out(); show('buy');
  }

  // 3D property model: loaded only near the section, only with WebGL, motion allowed and no data saver.
  var stage = $('#dp-stage');
  function webgl() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } }
  if (stage && !REDUCED && !SAVE && webgl() && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect();
      import('/assets/mentorship/dp3d.js?v=20261127c').then(function (m) {
        model = m.mount(document.getElementById('dp-view'), { lite: matchMedia('(max-width:700px)').matches });
        if (!model) return;
        stage.classList.add('has3d');
        var h = $('#dp-hint'); if (h) h.textContent = 'Drag to rotate';
        model.setValues(val); model.setStep(current, val);
      }).catch(function () {});
    }, { rootMargin: '300px 0px' });
    io.observe(stage);
  }

  // Testimonial videos: load on demand, one plays at a time.
  $$('.vid').forEach(function (w) {
    var v = $('video', w), b = $('.play', w);
    b.addEventListener('click', function () {
      $$('.vid video').forEach(function (o) { if (o !== v && !o.paused) o.pause(); });
      if (!v.src) v.src = '/assets/video/' + v.dataset.v + '.mp4';
      v.controls = true; w.classList.add('playing');
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      v.focus && v.focus();
    });
  });

  // Mobile sticky CTA: after the hero, hidden over program cards and the footer.
  var sticky = $('#vsticky'), hero = $('.vh'), programs = $('#programs'), foot = $('.vfoot');
  if (sticky && 'IntersectionObserver' in window) {
    var past = false, onP = false, onF = false;
    var upd = function () { sticky.classList.toggle('show', past && !onP && !onF); };
    new IntersectionObserver(function (es) { past = !es[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (es) { onP = es[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe(programs);
    new IntersectionObserver(function (es) { onF = es[0].isIntersecting; upd(); }).observe(foot);
  }

  // Carry campaign parameters (utm_*, fbclid, gclid) to checkout and the free call.
  var q = new URLSearchParams(location.search), keep = [];
  q.forEach(function (v, k) { if (/^utm_|^fbclid$|^gclid$/.test(k)) keep.push([k, v]); });
  if (keep.length) {
    $$('a[data-enroll], a[data-speak]').forEach(function (a) {
      try {
        var u = new URL(a.getAttribute('href'), location.href);
        keep.forEach(function (p) { if (!u.searchParams.has(p[0])) u.searchParams.set(p[0], p[1]); });
        a.href = u.toString();
      } catch (e) {}
    });
  }

  // Conversion events (Meta Pixel and Google tag come from /assets/track.js on the live page).
  function fb() { if (window.fbq) fbq.apply(null, arguments); }
  function gt() { if (window.gtag) gtag.apply(null, arguments); }
  var viewed = false;
  if (programs && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !viewed) {
        viewed = true;
        fb('track', 'ViewContent', { content_name: 'Mentorship programs' });
        gt('event', 'view_item_list', { item_list_name: 'Mentorship programs' });
      }
    }, { threshold: 0.3 }).observe(programs);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.dataset.enroll) {
      var price = Number(a.dataset.price) || 0, name = a.dataset.enroll;
      fb('track', 'InitiateCheckout', { content_name: name, value: price, currency: 'USD' });
      gt('event', 'begin_checkout', { currency: 'USD', value: price, items: [{ item_name: name, price: price }] });
    } else if (a.dataset.speak) {
      fb('track', 'Contact', { content_name: 'Mentorship: free mentorship call' });
      gt('event', 'contact', { method: 'mentorship_page', placement: a.dataset.speak });
    } else if (a.dataset.explore) {
      gt('event', 'select_content', { content_type: 'explore_programs', placement: a.dataset.explore });
    }
  });
})();
