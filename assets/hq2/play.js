// Homepage hero (self-playing video): approach the 4DPA HQ, enter the lobby, arrive at six doorways; ends on the path buttons.
// appear as it plays; at the end it rests on the lit HQ with the sign-up buttons and a Replay button.
(function () {
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const el = (id) => document.getElementById(id);
  const vid = el('film');
  const STAGES = [
    { key: '', n: '', at: 0, title: 'Learn to Buy Real Estate Like an Investor.', body: 'Mentorship with no end date from Odis D. James III, a licensed broker who has overseen $650M+ in multifamily assets.' },
    { key: '', n: '', at: 0.34, title: 'Learn to Buy Real Estate Like an Investor.', body: 'Live classes, real-world deal support and a framework you can use on any property. Then grow into business, mindset and capital.' },
    { key: 'FINAL', n: '', at: 0.8, title: 'Learn to Buy Real Estate Like an Investor.', body: 'See the mentorship plans, or talk with Odis about where to start.' },
  ];
  let lastKey = null;
  function render(p) {
    const st = [...STAGES].reverse().find((s) => p >= s.at - 1e-6);
    if (st.title !== lastKey) {
      lastKey = st.title;
      const box = el('chapter');
      box.classList.remove('in'); void box.offsetWidth;
      el('ch-num').textContent = st.n ? `${st.n} / 04` : '';
      el('ch-key').textContent = st.key === 'FINAL' ? '' : st.key;
      el('ch-title').textContent = st.title;
      el('ch-body').textContent = st.body;
      box.classList.add('in');
            document.body.classList.toggle('final', st.key === 'FINAL');
    }
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
  // Reduced motion: show the final frame and buttons without playing.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vid.removeAttribute('autoplay'); vid.poster = '/assets/hq2/hq-end.jpg?v=2';
    render(1); document.body.classList.add('ended');
  } else {
    render(0);
    const p = vid.play();
    if (p && p.catch) p.catch(() => document.body.classList.add('needs-tap')); // e.g. iPhone Low Power Mode
  }
  document.body.classList.add('ready');
  window.__ready = true;
})();
