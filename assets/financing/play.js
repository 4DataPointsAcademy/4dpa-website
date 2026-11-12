// Financing hero (self-playing video): a two-flat is funded and renovated, then a storefront grows into a tower;
// chapters and the loan list follow the video; it ends on the tower with the buttons and a Replay button.
(function () {
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const el = (id) => document.getElementById(id);
  const vid = el('film');
  const STAGES = [
    { key: '', n: '', at: 0, title: 'Your Next Deal Needs Capital. Start Here.', body: 'One front door for real estate investing and business financing.' },
    { key: 'APPLY', n: '01', at: 0.075, title: 'Tell Us About the Project.', body: "What it's for, how much and how soon. The request takes about two minutes." },
    { key: 'REVIEW', n: '02', at: 0.24, title: 'Odis Reviews Every Request.', body: 'Your request comes to us first. If it fits, you get a short follow-up with the details a lender needs.' },
    { key: 'MATCH', n: '03', at: 0.40, title: 'We Match You With the Right Lender.', body: 'Our network covers fix and flip, rentals, bridge, construction and multifamily, plus business lines of credit, term loans, SBA and equipment.' },
    { key: 'FUND', n: '04', at: 0.56, title: 'Capital for Your Business, Too.', body: "Working capital, equipment and expansion for the business you're building." },
    { key: 'FINAL', n: '', at: 0.92, title: 'Business and Real Estate Financing. One Front Door.', body: "Built by investors and entrepreneurs who've been where you are." },
  ];
  const FLOW = ['Fix and flip', 'Rental (DSCR)', 'Bridge', 'New construction', 'Multifamily 5+', 'Line of credit', 'Term and SBA loans', 'Equipment'];
  const sysItems = [...document.querySelectorAll('#sys li')];
  let lastKey = null, lastPhase = '';
  function render(t) {
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
    const k = Math.floor(clamp01((t - 0.41) / 0.36) * sysItems.length + 1e-6);
    sysItems.forEach((li, i) => li.classList.toggle('lit', i < k));
    document.body.classList.toggle('sys-on', t >= 0.40 && t < 0.92);
    let label = '';
    if ((st.key === 'MATCH' || st.key === 'FUND') && k > 0) label = `Lending partners for ${FLOW[Math.min(k, 8) - 1].toLowerCase()}`;
    if (label !== lastPhase) { lastPhase = label; el('phase').textContent = label; el('phase').classList.toggle('on', !!label); }
    el('rail-fill').style.transform = `scaleX(${clamp01((t - 0.075) / 0.845)})`;
  }
  function loop() {
    if (vid.duration) render(vid.currentTime / vid.duration);
    if (!vid.paused && !vid.ended) requestAnimationFrame(loop);
  }
  vid.addEventListener('play', () => { document.body.classList.remove('ended', 'needs-tap'); requestAnimationFrame(loop); });
  ['timeupdate', 'seeked'].forEach((e) => vid.addEventListener(e, () => { if (vid.duration && !vid.ended) render(vid.currentTime / vid.duration); }));
  vid.addEventListener('ended', () => { render(1); document.body.classList.add('ended'); });
  el('replay').addEventListener('click', () => { lastKey = null; vid.currentTime = 0; vid.play(); });
  el('tapplay').addEventListener('click', () => vid.play());
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vid.removeAttribute('autoplay'); render(1); document.body.classList.add('ended');
    vid.addEventListener('loadedmetadata', () => { vid.currentTime = vid.duration - 0.05; });
  } else {
    render(0);
    const p = vid.play();
    if (p && p.catch) p.catch(() => document.body.classList.add('needs-tap'));
  }
  document.body.classList.add('ready');
  window.__ready = true;
})();
