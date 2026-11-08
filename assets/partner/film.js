// Referral Partner hero (video): one shared link spreads across the city to 4DPA headquarters; scroll scrubs the film.
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
    { key: '', n: '', at: 0, title: 'Share 4DPA. Earn a Referral Fee.', body: 'It starts with one link. Scroll to see how the 4DPA Referral Partner program works.' },
    { key: 'SHARE', n: '01', at: 0.05, title: 'It Starts With One Link.', body: 'Sign up and get your own personal 4DPA link. Share it in a post, a DM or a text with people who want to invest in real estate.' },
    { key: 'CONNECT', n: '02', at: 0.27, title: 'Your Network Becomes Their Opportunity.', body: 'Everyone who signs up through your link is tracked back to you, so you get credit for every introduction.' },
    { key: 'ENROLL', n: '03', at: 0.52, title: 'They Learn From Odis James.', body: 'Your referrals join 4 Data Points Academy and learn real estate investing the way investors do, through our mentorship programs.' },
    { key: 'EARN', n: '04', at: 0.76, title: 'You Earn a Referral Fee.', body: 'When someone you refer enrolls in a 4DPA real estate investing mentorship program, you earn a referral fee, paid as set out in your Referral Partner Agreement.' },
    { key: 'FINAL', n: '', at: 0.93, title: 'Become a 4DPA Referral Partner.', body: 'Free to join. No minimum. Sign up in about a minute.' },
  ];
  let lastKey = null;
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
    el('rail-fill').style.transform = `scaleX(${clamp01((t - 0.05) / 0.88)})`;
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
    return t < 0.05 ? 0.02 : t < 0.27 ? 0.2 : t < 0.52 ? 0.45 : t < 0.76 ? 0.7 : t < 0.93 ? 0.88 : 1;
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
