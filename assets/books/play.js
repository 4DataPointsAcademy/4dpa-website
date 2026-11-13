// Library hero (self-playing video): a walk through a modern private library that ends at the reading
// table, where the seven real covers appear. Chapters follow the video; ends on Shop + Replay.
(function () {
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const el = (id) => document.getElementById(id);
  const vid = el('film');
  const STAGES = [
    { key: 'THE LIBRARY', n: '01', at: 0, title: 'Every investor and every builder needs a library.', body: 'Seven books by Odis D. James III, from an investor, broker and entrepreneur who has overseen a $650M portfolio and 2,700 units and built 4 Data Points Academy.' },
    { key: 'SHELVES', n: '02', at: 0.19, title: 'Built from real deals, real buildings and real businesses.', body: 'Four books on real estate and three on entrepreneurship, written as working manuals, not motivation.' },
    { key: 'THE BOOKS', n: '03', at: 0.385, title: 'Seven editions. One system.', body: 'Every book is a digital edition you can read today: buy it, log in to the 4DPA student portal and download the PDF.' },
    { key: 'TWO PATHS', n: '04', at: 0.52, title: 'Real estate on one side. Entrepreneurship on the other.', body: 'The Field Manuals and No Shortcuts for investors. No Guardrails, Starting From Zero and One Decision From Glory for builders.' },
    { key: 'THE COLLECTION', n: '05', at: 0.705, title: 'The complete 4DPA library.', body: 'Buy a single edition or save with a bundle. The Complete Library includes all seven books.' },
  ];
  let lastKey = null;
  function render(p) {
    const st = [...STAGES].reverse().find((s) => p >= s.at - 1e-6);
    if (st.key !== lastKey) {
      lastKey = st.key;
      const box = el('chapter');
      box.classList.remove('in'); void box.offsetWidth;
      el('ch-num').textContent = `${st.n} / 05`;
      el('ch-key').textContent = st.key;
      el('ch-title').textContent = st.title;
      el('ch-body').textContent = st.body;
      box.classList.add('in');
      document.querySelectorAll('.rail .step').forEach((li) => li.classList.toggle('on', li.dataset.k === st.key));
      document.body.classList.toggle('final', st.key === 'THE COLLECTION');
    }
    el('rail-fill').style.transform = `scaleX(${Math.min(1, p)})`;
  }
  function loop() {
    if (vid.duration) render(vid.currentTime / vid.duration);
    if (!vid.paused && !vid.ended) requestAnimationFrame(loop);
  }
  ['timeupdate', 'seeked'].forEach((e) => vid.addEventListener(e, () => { if (vid.duration && !vid.ended) render(vid.currentTime / vid.duration); }));
  vid.addEventListener('play', () => { document.body.classList.remove('ended', 'needs-tap'); requestAnimationFrame(loop); });
  vid.addEventListener('ended', () => { render(1); document.body.classList.add('ended'); });
  el('replay').addEventListener('click', () => { lastKey = null; document.body.classList.remove('ended'); vid.currentTime = 0; vid.play(); });
  el('tapplay').addEventListener('click', () => vid.play());
  el('skip').addEventListener('click', () => {
    vid.pause(); if (vid.duration) vid.currentTime = vid.duration;
    render(1); document.body.classList.add('ended');
    const shop = document.getElementById('shop'); if (shop) shop.scrollIntoView({ behavior: 'smooth' });
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vid.removeAttribute('autoplay'); vid.poster = MOBILE ? '/assets/books/library-end-m.jpg' : '/assets/books/library-end.jpg';
    render(1); document.body.classList.add('ended');
  } else {
    render(0);
    const p = vid.play();
    if (p && p.catch) p.catch(() => document.body.classList.add('needs-tap'));
  }
  document.body.classList.add('ready');
})();
