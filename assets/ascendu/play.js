// AscendU hero (self-playing video): a realistic self-image transformation, from doubt at the mirror
// to standing tall on a rooftop at sunrise. Chapters follow the video; ends on the programs button + Replay.
(function () {
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const el = (id) => document.getElementById(id);
  const vid = el('film');
  const STAGES = [
    { key: 'LIMITATION', n: '01', at: 0, title: 'Every result starts with how you see yourself.', body: 'A limited self-image quietly sets the ceiling on the goals you set, the risks you take and the value you claim.' },
    { key: 'AWARENESS', n: '02', at: 0.2, title: 'Awareness is the first crack in the ceiling.', body: 'You cannot change a picture you cannot see. The first step is recognizing the beliefs that have been holding you in place.' },
    { key: 'BREAKTHROUGH', n: '03', at: 0.42, title: 'Old limits do not fall on their own.', body: 'A self-image built over decades shifts through structure, repetition and the right work done over consecutive days.' },
    { key: 'PERSPECTIVE', n: '04', at: 0.65, title: 'A new self-image changes what you see as possible.', body: 'Stand taller in your leadership, your relationships and your goals, and see the path in front of you clearly.' },
    { key: 'ASCEND', n: '05', at: 0.85, title: 'Elevate your mind. Transform your future.', body: 'Begin with the Self-Image Workshop. Go deeper with the two-week Intensive with Dr. Alfred E. Smith.' },
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
      document.body.classList.toggle('final', st.key === 'ASCEND');
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
  el('replay').addEventListener('click', () => { lastKey = null; vid.currentTime = 0; vid.play(); });
  el('tapplay').addEventListener('click', () => vid.play());
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vid.removeAttribute('autoplay'); vid.poster = '/assets/ascendu/ascendu-end.jpg';
    render(1); document.body.classList.add('ended');
  } else {
    render(0);
    const p = vid.play();
    if (p && p.catch) p.catch(() => document.body.classList.add('needs-tap'));
  }
  document.body.classList.add('ready');
})();
