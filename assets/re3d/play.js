// 4DPA Real Estate hero: the Detroit two-flat video now plays on its own (no scrolling needed).
// Chapters, rehab phases and the progress rail follow the video's playback time.
(function () {
  var MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  var el = function (id) { return document.getElementById(id); };
  var vid = el('rehab'), btn = el('re-play');
  var CHAPTERS = [
    { key: 'COST', n: '01', at: 0, title: "Every investment begins with understanding what you're buying.", body: 'The purchase price is only the first number. Learn to see past boarded windows to the true cost of acquiring the property.' },
    { key: 'REHAB', n: '02', at: 0.22, title: 'Understanding renovation costs protects your investment.', body: 'Roof, windows, masonry, siding, porch, landscaping. Budget every line item before you buy, not after the scaffolding goes up.' },
    { key: 'ARV', n: '03', at: 0.6, title: 'Know what the property may be worth after improvements.', body: 'After-repair value is based on what comparable renovated properties actually sell for, not on what you hope it is worth.' },
    { key: 'INCOME', n: '04', at: 0.8, title: 'Understand the income potential before you invest.', body: 'Two units, two rents. Learn to project realistic income, vacancy and expenses so the numbers carry the property.' }
  ];
  var PHASES = [
    { at: 0.22, label: 'Site clean-out' }, { at: 0.3, label: 'Scaffolding and dumpster' },
    { at: 0.36, label: 'New windows and doors' }, { at: 0.42, label: 'Siding and trim' },
    { at: 0.5, label: 'Porch and railings' }, { at: 0.55, label: 'Landscaping' }
  ];
  var lastKey = '', lastPhase = '';
  function find(list, t) { for (var i = list.length - 1; i >= 0; i--) if (t >= list[i].at - 1e-6) return list[i]; return null; }
  function render(t) {
    var ch = find(CHAPTERS, t) || CHAPTERS[0];
    if (ch.key !== lastKey) {
      lastKey = ch.key;
      var box = el('chapter');
      box.classList.remove('in'); void box.offsetWidth;
      el('ch-num').textContent = ch.n + ' / 04';
      el('ch-key').textContent = ch.key;
      el('ch-title').textContent = ch.title;
      el('ch-body').textContent = ch.body;
      box.classList.add('in');
      document.querySelectorAll('#track .rail .step').forEach(function (li) { li.classList.toggle('on', li.dataset.k === ch.key); });
      document.body.classList.toggle('final', ch.key === 'INCOME');
    }
    var ph = ch.key === 'REHAB' ? find(PHASES, t) : null;
    var label = ph ? ph.label : '';
    if (label !== lastPhase) { lastPhase = label; el('phase').textContent = label; el('phase').classList.toggle('on', !!label); }
    el('rail-fill').style.transform = 'scaleX(' + t + ')';
  }
  function tick() {
    if (vid.duration) render(Math.min(1, vid.currentTime / vid.duration));
    requestAnimationFrame(tick);
  }
  function setBtn() { if (btn) { btn.textContent = vid.ended ? 'Replay' : vid.paused ? 'Play' : 'Pause'; btn.setAttribute('aria-label', btn.textContent + ' video'); } }
  // Hold on the finished, rented building for a few seconds, then play the story again.
  var restart;
  vid.addEventListener('ended', function () { setBtn(); clearTimeout(restart); restart = setTimeout(function () { vid.currentTime = 0; vid.play().catch(function () {}); }, 6000); });
  ['play', 'pause'].forEach(function (e) { vid.addEventListener(e, setBtn); });
  if (btn) btn.addEventListener('click', function () {
    clearTimeout(restart);
    if (vid.ended) { vid.currentTime = 0; vid.play(); } else if (vid.paused) vid.play(); else vid.pause();
  });
  vid.muted = true;
  if (REDUCED) { vid.removeAttribute('autoplay'); vid.pause(); } else { var p = vid.play(); if (p && p.catch) p.catch(setBtn); }
  render(0); setBtn();
  requestAnimationFrame(function () { document.body.classList.add('ready'); requestAnimationFrame(tick); });
})();
