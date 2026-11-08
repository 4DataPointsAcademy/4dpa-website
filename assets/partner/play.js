// Referral Partner hero (self-playing video): the film plays once on its own; the four steps
// appear as it plays; at the end it rests on the lit HQ with the sign-up buttons and a Replay button.
(function () {
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const el = (id) => document.getElementById(id);
  const vid = el('film');
  const STAGES = [
    { key: 'SHARE', n: '01', at: 0, title: 'It Starts With One Link.', body: 'Sign up and get your own personal 4DPA link. Share it in a post, a DM or a text with people who want to invest in real estate.' },
    { key: 'CONNECT', n: '02', at: 0.22, title: 'Your Network Becomes Their Opportunity.', body: 'Everyone who signs up through your link is tracked back to you, so you get credit for every introduction.' },
    { key: 'ENROLL', n: '03', at: 0.47, title: 'They Learn From Odis James.', body: 'Your referrals join 4 Data Points Academy and learn real estate investing the way investors do, through our mentorship programs.' },
    { key: 'EARN', n: '04', at: 0.72, title: 'You Earn a Referral Fee.', body: 'When someone you refer enrolls in a 4DPA real estate investing mentorship program, you earn a referral fee, paid as set out in your Referral Partner Agreement.' },
    { key: 'FINAL', n: '', at: 0.9, title: 'Become a 4DPA Referral Partner.', body: 'Free to join. No minimum. Sign up in about a minute.' },
  ];
  let lastKey = null;
  function render(p) {
    const st = [...STAGES].reverse().find((s) => p >= s.at - 1e-6);
    if (st.key !== lastKey) {
      lastKey = st.key;
      const box = el('chapter');
      box.classList.remove('in'); void box.offsetWidth;
      el('ch-num').textContent = st.n ? `${st.n} / 04` : '';
      el('ch-key').textContent = st.key === 'FINAL' ? '' : st.key;
      el('ch-title').textContent = st.title;
      el('ch-body').textContent = st.body;
      box.classList.add('in');
      document.querySelectorAll('#track .rail .step').forEach((li) => li.classList.toggle('on', li.dataset.k === st.key || st.key === 'FINAL'));
      document.body.classList.toggle('final', st.key === 'FINAL');
    }
    el('rail-fill').style.transform = `scaleX(${Math.min(1, p / 0.9)})`;
  }
  function loop() {
    if (vid.duration) render(vid.currentTime / vid.duration);
    if (!vid.paused && !vid.ended) requestAnimationFrame(loop);
  }
  vid.addEventListener('play', () => { document.body.classList.remove('ended', 'needs-tap'); requestAnimationFrame(loop); });
  vid.addEventListener('ended', () => { render(1); document.body.classList.add('ended'); });
  el('replay').addEventListener('click', () => { lastKey = null; vid.currentTime = 0; vid.play(); });
  el('tapplay').addEventListener('click', () => vid.play());
  // Reduced motion: show the final frame and buttons without playing.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vid.removeAttribute('autoplay'); vid.poster = '/assets/partner/partner-end.jpg';
    render(1); document.body.classList.add('ended');
  } else {
    render(0);
    const p = vid.play();
    if (p && p.catch) p.catch(() => document.body.classList.add('needs-tap')); // e.g. iPhone Low Power Mode
  }
  document.body.classList.add('ready');
  window.__ready = true;
})();
