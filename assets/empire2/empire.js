/* Empire flagship: nav, hero film, comparison, command center simulation, 3D build tower, industries, attribution, events. */
(function () {
  document.body.classList.remove('no-js');
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SAVE = !!(navigator.connection && navigator.connection.saveData);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // Nav
  var nav = $('#enav'), mb = $('#emenu-btn');
  mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu'; });
  $$('#emenu a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = 'Menu'; }); });

  // Hero film: loads after the page, composition chosen by screen shape. Never blocks content.
  var vid = $('#eh-vid');
  if (vid && !REDUCED && !SAVE) addEventListener('load', function () {
    var mob = matchMedia('(max-width:760px), (max-width:1024px) and (orientation:portrait)').matches;
    vid.src = mob ? vid.dataset.mob : vid.dataset.desk;
    vid.addEventListener('playing', function () { vid.classList.add('on'); }, { once: true });
    var p = vid.play(); if (p && p.catch) p.catch(function () {});
  });

  // Reveal
  if ('IntersectionObserver' in window && !REDUCED) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { ro.observe(el); });
  } else $$('.rv').forEach(function (el) { el.classList.add('in'); });

  // Website vs system switch (mobile)
  var cmpv = $('#cmpv');
  $$('.cmp-sw button').forEach(function (b) {
    b.addEventListener('click', function () { cmpv.dataset.show = b.dataset.show; $$('.cmp-sw button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); });
  });

  // ---- Command center simulation (illustrative; nothing leaves the browser)
  var cc = $('#cc');
  if (cc) {
    var steps = $$('.cc-steps button[data-i]'), cur = 0, timers = [];
    var T = steps.map(function (b) { return { t: b.querySelector('span').firstChild.textContent, d: b.querySelector('small').textContent }; });
    var FLOW = [['ads', 'web'], ['web', 'crm'], ['crm', 'msg'], ['msg', 'cal'], ['crm', 'pay'], ['pay', 'onb'], ['onb', 'rev'], ['crm', 'rev']];
    var ACTIVE = [['ads', 'web'], ['web', 'crm'], ['crm'], ['crm', 'msg'], ['cal', 'msg', 'crm'], ['pay', 'crm'], ['onb', 'msg'], ['rev', 'msg']];
    var PANELS = [['phone'], ['phone'], ['pipe'], ['phone', 'auto'], ['cal', 'phone', 'pipe'], ['pay', 'pipe'], ['phone', 'auto'], ['phone', 'auto']];
    var msgs = $('#ph-msgs'), note = $('#ph-note'), auto = $('#auto'), led = $('#led'), pk = $('#cc-pk');
    function clear() { timers.forEach(clearTimeout); timers = []; }
    var fast = false;
    function later(fn, ms) { if (fast || REDUCED) { fn(); return; } timers.push(setTimeout(fn, ms)); }
    function bub(text, cls) { var d = document.createElement('div'); d.className = 'bub ' + (cls || ''); d.textContent = text; msgs.appendChild(d); requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('in'); }); }); while (msgs.children.length > 6) msgs.removeChild(msgs.firstChild); }
    function autoRow(text, tag) { var d = document.createElement('div'); d.className = 'nw'; d.innerHTML = '<span></span><em></em>'; d.firstChild.textContent = text; d.lastChild.textContent = tag; auto.prepend(d); [].slice.call(auto.children).forEach(function (c, i) { if (i) c.classList.remove('nw'); }); while (auto.children.length > 4) auto.removeChild(auto.lastChild); $('#au-st').textContent = 'Running'; }
    function card(col, name, sub) {
      var old = $('.card.jordan', cc); if (old) old.parentNode.removeChild(old);
      var c = document.createElement('div'); c.className = 'card hl jordan'; c.innerHTML = 'Jordan Example<small></small>'; c.lastChild.textContent = sub;
      $('.col[data-c="' + col + '"]', cc).appendChild(c);
    }
    function packet(a, b) {
      var ln = $('#ln-' + a + '-' + b, cc) || $('#ln-' + b + '-' + a, cc); if (!ln || REDUCED) return;
      var L = ln.getTotalLength(), rev = !$('#ln-' + a + '-' + b, cc), t0 = performance.now(), D = 900;
      (function f(now) { var k = Math.min(1, (now - t0) / D); var p = ln.getPointAtLength((rev ? 1 - k : k) * L); pk.setAttribute('cx', p.x); pk.setAttribute('cy', p.y); if (k < 1) requestAnimationFrame(f); else { pk.setAttribute('cx', -20); } })(t0);
    }
    function reset() {
      msgs.innerHTML = ''; auto.innerHTML = ''; $('#au-st').textContent = 'Idle';
      led.innerHTML = '<div><span>Pat Lee · deposit</span><span>$250.00</span></div>';
      var j = $('.card.jordan', cc); if (j) j.parentNode.removeChild(j);
      $('#slot').classList.remove('bk'); $('#slot').textContent = '10:00'; $('#cal-st').textContent = 'This week';
    }
    var SCENES = [
      function () { $('#ph-st').textContent = 'Instagram'; note.innerHTML = '<b>Jordan, a new customer</b>Jordan sees your post and taps through to your website.'; bub('Your Business · sponsored post', 'sys'); bub('Kitchen remodels done right. Free estimates this month.'); },
      function () { $('#ph-st').textContent = 'yourbusiness.com'; note.innerHTML = '<b>Website inquiry</b>Jordan asks for an estimate on a kitchen remodel using the form on your site.'; bub('Request sent: kitchen remodel estimate', 'sys'); },
      function () { card(0, 'Jordan Example', 'Source: website · New'); },
      function () { $('#ph-st').textContent = 'Text message'; note.innerHTML = '<b>About a minute later</b>Jordan gets a text and an email with a link to book.'; card(1, 'Jordan Example', 'Auto-reply sent'); later(function () { bub('Hi Jordan, thanks for reaching out to Your Business. Pick a time for your estimate: yourbusiness.com/book'); autoRow('Instant reply sent to Jordan', 'SMS + EMAIL'); }, 300); },
      function () { $('#ph-st').textContent = 'Text message'; note.innerHTML = '<b>Booked</b>Jordan picks Thursday at 10:00. A reminder is scheduled for the day before.'; later(function () { var s = $('#slot'); s.classList.add('bk'); s.textContent = 'Jordan'; $('#cal-st').textContent = 'Thu 10:00 booked'; card(2, 'Jordan Example', 'Thu 10:00'); }, 250); later(function () { bub('Reminder: your estimate is tomorrow at 10:00 AM. Reply C to confirm.'); bub('C', 'me'); }, 900); },
      function () { later(function () { var d = document.createElement('div'); d.className = 'nw'; d.innerHTML = '<span>Jordan Example · deposit</span><span>$500.00 <em>PAID</em></span>'; led.prepend(d); card(3, 'Jordan Example', 'Deposit paid'); }, 300); },
      function () { $('#ph-st').textContent = 'Email'; note.innerHTML = '<b>Welcome aboard</b>Jordan gets next steps, a short intake form and the project timeline.'; later(function () { bub('Welcome, Jordan! Here are your next steps and a short form to complete before we start.'); autoRow('Welcome sequence started', 'ONBOARD'); }, 300); },
      function () { $('#ph-st').textContent = 'Text message'; note.innerHTML = '<b>After the job</b>A review request goes out, and a check-in is scheduled for a few months later.'; later(function () { bub('Thanks for choosing Your Business, Jordan! Would you leave us a quick review?'); autoRow('Review request sent', 'RETAIN'); autoRow('Check-in scheduled · 90 days', 'RETAIN'); }, 300); },
    ];
    function go(i, user) {
      clear();
      if (i < cur || i === 0) { reset(); fast = true; for (var k = 0; k < i; k++) SCENES[k](); fast = false; }
      cur = i;
      steps.forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); b.classList.toggle('done', k < i); });
      $('#cc-count').textContent = ('0' + (i + 1)).slice(-2);
      $('#cc-title').textContent = T[i].t; $('#cc-desc').textContent = T[i].d;
      $$('.nd', cc).forEach(function (n) { n.classList.toggle('on', ACTIVE[i].indexOf(n.dataset.n) > -1); });
      $$('.ln', cc).forEach(function (l) { l.classList.toggle('on', ACTIVE[i].indexOf(l.dataset.a) > -1 && ACTIVE[i].indexOf(l.dataset.b) > -1); });
      $$('.pnl', cc).forEach(function (p) { p.classList.toggle('on', PANELS[i].indexOf(p.dataset.p) > -1); });
      packet(FLOW[i][0], FLOW[i][1]);
      var NM = { ads: 'Discovery', web: 'Website', crm: 'CRM', msg: 'Messaging', cal: 'Calendar', pay: 'Payments', onb: 'Onboarding', rev: 'Reviews' };
      $('#cf-a').textContent = NM[FLOW[i][0]]; $('#cf-b').textContent = NM[FLOW[i][1]];
      SCENES[i]();
      ['cc-prev', 'cc-mprev'].forEach(function (id) { $('#' + id).disabled = i === 0; });
      ['cc-next', 'cc-mnext'].forEach(function (id) { $('#' + id).textContent = i === 7 ? 'Start over' : 'Next step'; });
      if (user) { var b = steps[i]; if (b.scrollIntoView && matchMedia('(max-width:1100px)').matches) b.parentNode.scrollTo({ left: b.offsetLeft - 10, behavior: REDUCED ? 'auto' : 'smooth' }); }
    }
    steps.forEach(function (b, k) { b.addEventListener('click', function () { if (k === cur) return; if (k > cur) { clear(); fast = true; for (var j = cur + 1; j < k; j++) SCENES[j](); fast = false; cur = k - 1; } go(k, true); }); });
    function next() { go(cur === 7 ? 0 : cur + 1, true); }
    function prev() { if (cur > 0) go(cur - 1, true); }
    ['cc-next', 'cc-mnext'].forEach(function (id) { $('#' + id).addEventListener('click', next); });
    ['cc-prev', 'cc-mprev'].forEach(function (id) { $('#' + id).addEventListener('click', prev); });
    cc.addEventListener('keydown', function (e) { if (e.target.closest('.cc-steps') && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) { e.preventDefault(); next(); steps[cur].focus(); } if (e.target.closest('.cc-steps') && (e.key === 'ArrowUp' || e.key === 'ArrowLeft')) { e.preventDefault(); prev(); steps[cur].focus(); } });
    go(0);
  }

  // ---- 3D build tower (lazy; still drawing for reduced motion, data saver or no WebGL)
  var tws = $('#tw-stage'), tower = null, phase = 'blueprint';
  $$('.tw-steps button').forEach(function (b) {
    b.addEventListener('click', function () { phase = b.dataset.k; $$('.tw-steps button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); if (tower) tower.set(phase); });
  });
  function webgl() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } }
  if (tws && !REDUCED && !SAVE && webgl() && 'IntersectionObserver' in window) {
    var tio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; tio.disconnect();
      import('/assets/empire2/tower3d.js?v=20261127e').then(function (m) { tower = m.mount(tws); if (tower) { tws.classList.add('has3d'); tower.set(phase); } }).catch(function () {});
    }, { rootMargin: '300px 0px' });
    tio.observe(tws);
  }

  // ---- Industry selector (carries the industry into the free review form)
  var data = {}; try { data = JSON.parse($('#ind-data').textContent); } catch (e) {}
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  $$('.ind-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = data[b.dataset.k]; if (!d) return;
      $$('.ind-tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $('#ind-panel').setAttribute('aria-labelledby', b.id);
      $('#ind-name').textContent = d.name; $('#ind-who').textContent = d.who;
      $('#ind-j').innerHTML = d.j.map(function (s) { return '<li><div><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div></li>'; }).join('');
      $('#ind-c').innerHTML = d.c.map(function (s) { return '<li><span>' + esc(s[0]) + '</span><em>' + esc(s[1]) + '</em></li>'; }).join('');
      var go = $('#ind-go'), u = new URL(go.getAttribute('href'), location.href); u.searchParams.set('industry', d.name); go.href = u.pathname + u.search;
    });
  });
  var tl = $('.ind-tabs');
  if (tl) tl.addEventListener('keydown', function (e) {
    var bs = $$('.ind-tabs button'), i = bs.indexOf(document.activeElement); if (i < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length]; n.focus(); n.click(); }
  });

  // Sticky mobile bar: after the hero, hidden over packages and the footer
  var st = $('#esticky'), hero = $('.eh'), pkg = $('#packages'), ft = $('.efoot');
  if (st && 'IntersectionObserver' in window) {
    var a = false, b2 = false, c = false, u2 = function () { st.classList.toggle('show', a && !b2 && !c); };
    new IntersectionObserver(function (e) { a = !e[0].isIntersecting; u2(); }).observe(hero);
    new IntersectionObserver(function (e) { b2 = e[0].isIntersecting; u2(); }, { threshold: 0.02 }).observe(pkg);
    new IntersectionObserver(function (e) { c = e[0].isIntersecting; u2(); }).observe(ft);
  }

  // Campaign attribution to checkout and the review form
  var q = new URLSearchParams(location.search), keep = [];
  q.forEach(function (v, k) { if (/^utm_|^fbclid$|^gclid$/.test(k)) keep.push([k, v]); });
  if (keep.length) $$('a[data-enroll], a[data-review]').forEach(function (el) {
    try { var u = new URL(el.getAttribute('href'), location.href); keep.forEach(function (p) { if (!u.searchParams.has(p[0])) u.searchParams.set(p[0], p[1]); }); el.href = u.toString(); } catch (e) {}
  });

  // Conversion events (pixels load from /assets/track.js on the live page only)
  function fb() { if (window.fbq) fbq.apply(null, arguments); }
  function gt() { if (window.gtag) gtag.apply(null, arguments); }
  var seen = false;
  if (pkg && 'IntersectionObserver' in window) new IntersectionObserver(function (e) {
    if (e[0].isIntersecting && !seen) { seen = true; fb('track', 'ViewContent', { content_name: 'Empire packages' }); gt('event', 'view_item_list', { item_list_name: 'Empire packages' }); }
  }, { threshold: 0.2 }).observe(pkg);
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a'); if (!el) return;
    if (el.dataset.enroll) {
      var v = Number(el.dataset.price) || 0;
      fb('track', 'InitiateCheckout', { content_name: el.dataset.enroll, value: v, currency: 'USD' });
      gt('event', 'begin_checkout', { currency: 'USD', value: v, items: [{ item_name: el.dataset.enroll, price: v }] });
    } else if (el.dataset.review) {
      gt('event', 'select_content', { content_type: 'empire_business_review', placement: el.dataset.review });
    } else if (el.dataset.explore) {
      gt('event', 'select_content', { content_type: 'empire_explore', placement: el.dataset.explore });
    }
  });
})();
