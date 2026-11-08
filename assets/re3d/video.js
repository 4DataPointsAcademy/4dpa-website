// 4DPA Real Estate hero (video edition): one Detroit two-flat, from distressed to income, scrubbed by scroll.
// Keeps the approved copy, chapter UI and scroll mapping from the 3D version; the picture is a realistic video.
(function () {
  const params = new URLSearchParams(location.search);
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FIXED_T = params.has('t') ? parseFloat(params.get('t')) : null;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const el = (id) => document.getElementById(id);
  const vid = el('rehab');

  const CHAPTERS = [
    { key: 'COST', n: '01', at: 0, title: "Every investment begins with understanding what you're buying.", body: 'The purchase price is only the first number. Learn to see past boarded windows to the true cost of acquiring the property.' },
    { key: 'REHAB', n: '02', at: 0.22, title: 'Understanding renovation costs protects your investment.', body: 'Roof, windows, masonry, siding, porch, landscaping. Budget every line item before you buy, not after the scaffolding goes up.' },
    { key: 'ARV', n: '03', at: 0.6, title: 'Know what the property may be worth after improvements.', body: 'After-repair value is based on what comparable renovated properties actually sell for, not on what you hope it is worth.' },
    { key: 'INCOME', n: '04', at: 0.8, title: 'Understand the income potential before you invest.', body: 'Two units, two rents. Learn to project realistic income, vacancy and expenses so the numbers carry the property.' },
  ];
  const PHASES = [
    { at: 0.22, label: 'Site clean-out' },
    { at: 0.3, label: 'Scaffolding and dumpster' },
    { at: 0.36, label: 'New windows and doors' },
    { at: 0.42, label: 'Siding and trim' },
    { at: 0.5, label: 'Porch and railings' },
    { at: 0.55, label: 'Landscaping' },
  ];
  let lastKey = '', lastPhase = '';
  function renderUI(t) {
    const ch = [...CHAPTERS].reverse().find((c) => t >= c.at - 1e-6);
    if (ch.key !== lastKey) {
      lastKey = ch.key;
      const box = el('chapter');
      box.classList.remove('in'); void box.offsetWidth;
      el('ch-num').textContent = `${ch.n} / 04`;
      el('ch-key').textContent = ch.key;
      el('ch-title').textContent = ch.title;
      el('ch-body').textContent = ch.body;
      box.classList.add('in');
      document.querySelectorAll('#track .rail .step').forEach((li) => li.classList.toggle('on', li.dataset.k === ch.key));
      document.body.classList.toggle('final', ch.key === 'INCOME');
    }
    const ph = ch.key === 'REHAB' ? [...PHASES].reverse().find((p) => t >= p.at) : null;
    const label = ph ? ph.label : '';
    if (label !== lastPhase) { lastPhase = label; el('phase').textContent = label; el('phase').classList.toggle('on', !!label); }
    el('rail-fill').style.transform = `scaleX(${t})`;
  }
  function seek(t) {
    if (!vid.duration) return;
    const ct = clamp01(t) * (vid.duration - 0.06);
    if (Math.abs(vid.currentTime - ct) > 0.03 && !vid.seeking) vid.currentTime = ct;
  }
  const HOLD = 0.88;
  function targetFromScroll() {
    const track = el('track');
    const top = parseFloat(getComputedStyle(track).getPropertyValue('--hdr')) || 0;
    const max = track.offsetHeight - (innerHeight - top);
    const p = clamp01((top - track.getBoundingClientRect().top) / Math.max(1, max));
    const t = clamp01(p / HOLD);
    if (!REDUCED) return t;
    return t < 0.22 ? 0.08 : t < 0.6 ? 0.45 : t < 0.8 ? 0.7 : 0.99;
  }
  const state = { t: FIXED_T ?? 0, target: FIXED_T ?? 0, frozen: FIXED_T !== null };
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    document.body.classList.toggle('scrolled', scrollY > 60);
    if (!state.frozen) state.target = targetFromScroll();
    const d = state.target - state.t;
    if (d !== 0) {
      state.t = REDUCED || Math.abs(d) < 4e-4 ? state.target : state.t + d * (1 - Math.exp(-dt * 7));
      renderUI(state.t);
    }
    seek(state.t);
    requestAnimationFrame(tick);
  }
  vid.addEventListener('loadedmetadata', () => seek(state.t));
  // iOS buffers a video only after it has played once
  let primed = false;
  const prime = () => { if (primed) return; primed = true; vid.play().then(() => { vid.pause(); seek(state.t); }).catch(() => {}); };
  ['touchstart', 'pointerdown', 'wheel', 'scroll', 'keydown'].forEach((e) => addEventListener(e, prime, { passive: true, once: true }));
  renderUI(state.t);
  requestAnimationFrame(() => { window.__ready = true; document.body.classList.add('ready'); requestAnimationFrame(tick); });
  window.__setT = (t) => { state.frozen = true; state.target = state.t = t; renderUI(t); seek(t); };
})();
