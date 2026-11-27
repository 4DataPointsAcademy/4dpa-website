/* Mentorship flagship page: hero footage, Four Data Points steps, sticky mobile buttons, conversion events. */
(function () {
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SAVE = navigator.connection && navigator.connection.saveData;

  // Hero footage loads after the page so text, buttons and prices are never delayed.
  var vid = document.getElementById('mh-vid');
  if (vid && !REDUCED && !SAVE) {
    window.addEventListener('load', function () {
      vid.src = vid.dataset.src;
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    });
  }

  // Four Data Points calculator (illustrative). The picture follows the number being changed.
  var calc = document.getElementById('calc');
  if (calc) {
    var keys = ['buy', 'rehab', 'arv', 'rent'];
    var labels = { buy: '01 · Cost to buy', rehab: '02 · Cost to rehab', arv: '03 · After-repair value', rent: '04 · Income potential' };
    var stage = [].slice.call(document.querySelectorAll('.calc-stage img'));
    var tag = document.getElementById('calc-tag');
    var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
    var money = function (n) { return (n < 0 ? '-$' : '$') + fmt(Math.abs(n)); };
    var parse = function (v) { var n = Number(String(v).replace(/[^0-9.]/g, '')); return isFinite(n) ? n : 0; };
    var val = {};
    function show(k) {
      stage.forEach(function (i) { i.classList.toggle('on', i.dataset.k === k); });
      [].slice.call(calc.querySelectorAll('.field')).forEach(function (f) { f.classList.toggle('on', f.dataset.k === k); });
      if (tag) tag.textContent = labels[k];
    }
    function out() {
      var all = val.buy + val.rehab, spread = val.arv - all, annual = val.rent * 12;
      document.getElementById('o-all').textContent = money(all);
      var sp = document.getElementById('o-spread'); sp.textContent = money(spread); sp.classList.toggle('neg', spread < 0);
      document.getElementById('o-rent').textContent = money(annual);
    }
    keys.forEach(function (k) {
      var r = document.getElementById('c-' + k + '-r'), n = document.getElementById('c-' + k);
      val[k] = Number(r.value);
      r.addEventListener('input', function () { val[k] = Number(r.value); n.value = fmt(val[k]); show(k); out(); });
      n.addEventListener('input', function () { val[k] = parse(n.value); if (val[k] <= Number(r.max)) r.value = val[k]; show(k); out(); });
      n.addEventListener('blur', function () { n.value = fmt(val[k]); });
      n.addEventListener('focus', function () { show(k); });
      r.addEventListener('focus', function () { show(k); });
    });
    out();
  }

  // Mobile sticky buttons appear after the hero and hide over the program cards.
  var sticky = document.getElementById('msticky');
  var hero = document.querySelector('.mh'), programs = document.getElementById('programs');
  if (sticky && 'IntersectionObserver' in window) {
    var pastHero = false, onPrograms = false;
    var upd = function () { sticky.classList.toggle('show', pastHero && !onPrograms); };
    new IntersectionObserver(function (es) { pastHero = !es[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (es) { onPrograms = es[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(programs);
  }

  // Carry campaign parameters (utm_*, fbclid, gclid) to checkout and the free call.
  var q = new URLSearchParams(location.search), keep = [];
  q.forEach(function (v, k) { if (/^utm_|^fbclid$|^gclid$/.test(k)) keep.push([k, v]); });
  if (keep.length) {
    [].slice.call(document.querySelectorAll('a[data-enroll], a[data-speak]')).forEach(function (a) {
      try {
        var u = new URL(a.getAttribute('href'), location.href);
        keep.forEach(function (p) { if (!u.searchParams.has(p[0])) u.searchParams.set(p[0], p[1]); });
        a.href = u.toString();
      } catch (e) {}
    });
  }

  // Conversion events (Meta Pixel and Google tag come from /assets/track.js).
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
