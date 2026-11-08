// Empire hero (video edition): a storefront grows into a lit tower; scroll scrubs the film.
(function () {
  const params = new URLSearchParams(location.search);
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FIXED_T = params.has('t') ? parseFloat(params.get('t')) : null;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const el = (id) => document.getElementById(id);
  const vid = el('film');
  const STAGES = [
    { key: '', n: '', at: 0, title: "You've Got a Website. But Do You Have a Business?", body: 'A desk, a phone and a simple website can open the doors. Scroll to see what a fully built business runs on.' },
    { key: 'BLUEPRINT', n: '01', at: 0.15, title: 'Before We Build, We Strategize.', body: 'We identify the systems, processes, and opportunities your business needs to operate more efficiently.' },
    { key: 'BUILD', n: '02', at: 0.27, title: 'We Build Your Business Infrastructure.', body: 'Website, CRM, booking, email and SMS, payments, pipelines and onboarding, set up for your business based on the package you choose.' },
    { key: 'LAUNCH', n: '03', at: 0.53, title: 'Your Systems. Connected. Automated.', body: 'AI, automation, and integrated business systems help manage communication, customers, and daily operations.' },
    { key: 'SCALE', n: '04', at: 0.76, title: 'Built to Operate at Another Level.', body: 'More floors, more capacity, one connected operation. The systems you choose keep working together as your business grows.' },
    { key: 'FINAL', n: '', at: 0.92, title: "We Don't Just Build Websites. We Build Businesses.", body: 'Strategy. Infrastructure. Automation. AI. Built for your business.' },
  ];
  const FLOW = ['A new lead comes in through your funnel', 'An AI agent responds', 'The lead is saved in your CRM', 'An appointment is scheduled', 'Email and text follow-up begins', 'Payment is collected', 'Onboarding starts automatically', 'Marketing workflows keep them engaged'];
  const sysItems = [...document.querySelectorAll('#sys li')];
  let lastKey = null, lastPhase = '';
  function renderUI(t) {
    const st = [...STAGES].reverse().find((s) => t >= s.at - 1e-6);
    if (st.key !== lastKey) {
      lastKey = st.key;
      const box = el('chapter');
      box.classList.remove('in'); void box.offsetWidth;
      el('ch-num').textContent = st.n ? `${st.n} / 04` : '';
      el('ch-key').textContent = st.key === 'FINAL' ? '' : st.key;
      el('ch-title').textContent = st.title;
      el('ch-body').textContent = st.body;
      box.classList.add('in');
      document.body.dataset.stage = st.key || 'INTRO';
      document.querySelectorAll('#track .rail .step').forEach((li) => li.classList.toggle('on', li.dataset.k === st.key || st.key === 'FINAL'));
      document.body.classList.toggle('final', st.key === 'FINAL');
    }
    // systems light up one by one through Launch, stay lit through Scale
    const k = Math.floor(clamp01((t - 0.55) / 0.19) * sysItems.length + 1e-6);
    sysItems.forEach((li, i) => li.classList.toggle('lit', i < k));
    document.body.classList.toggle('sys-on', t >= 0.53 && t < 0.92);
    let label = '';
    if (st.key === 'LAUNCH' && k > 0) label = `${k} of 8 · ${FLOW[Math.min(k, 8) - 1]}`;
    if (label !== lastPhase) { lastPhase = label; el('phase').textContent = label; el('phase').classList.toggle('on', !!label); }
    el('rail-fill').style.transform = `scaleX(${clamp01((t - 0.15) / 0.77)})`;
  }
  function seek(t) {
    if (!vid.duration) return;
    const ct = clamp01(t) * (vid.duration - 0.06);
    if (Math.abs(vid.currentTime - ct) > 0.03 && !vid.seeking) vid.currentTime = ct;
  }
  const HOLD = 0.9;
  function targetFromScroll() {
    const track = el('track');
    const top = parseFloat(getComputedStyle(track).getPropertyValue('--hdr')) || 0;
    const max = track.offsetHeight - (innerHeight - top);
    const p = clamp01((top - track.getBoundingClientRect().top) / Math.max(1, max));
    const t = clamp01(p / HOLD);
    if (!REDUCED) return t;
    return t < 0.15 ? 0.06 : t < 0.27 ? 0.22 : t < 0.53 ? 0.45 : t < 0.76 ? 0.74 : t < 0.92 ? 0.88 : 1;
  }
  const state = { t: FIXED_T ?? 0, target: FIXED_T ?? 0, frozen: FIXED_T !== null };
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    document.body.classList.toggle('scrolled', scrollY > 60);
    if (!state.frozen) state.target = targetFromScroll();
    const d = state.target - state.t;
    if (d !== 0) { state.t = REDUCED || Math.abs(d) < 4e-4 ? state.target : state.t + d * (1 - Math.exp(-dt * 7)); renderUI(state.t); }
    seek(state.t);
    requestAnimationFrame(tick);
  }
  vid.addEventListener('loadedmetadata', () => seek(state.t));
  let primed = false;
  const prime = () => { if (primed) return; primed = true; vid.play().then(() => { vid.pause(); seek(state.t); }).catch(() => {}); };
  ['touchstart', 'pointerdown', 'wheel', 'scroll', 'keydown'].forEach((e) => addEventListener(e, prime, { passive: true, once: true }));
  renderUI(state.t);
  requestAnimationFrame(() => { window.__ready = true; document.body.classList.add('ready'); requestAnimationFrame(tick); });
  window.__setT = (t) => { state.frozen = true; state.target = state.t = t; renderUI(t); seek(t); };
})();
