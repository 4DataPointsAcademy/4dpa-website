// Empire hero (self-playing video): the storefront-to-tower film plays once by itself; chapters and the
// system list follow the video; it ends on the tower with the buttons and a Replay button.
(function () {
  const MOBILE = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)').matches;
  document.body.dataset.view = MOBILE ? 'mobile' : 'desktop';
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const el = (id) => document.getElementById(id);
  const vid = el('film');
  const STAGES = [
    { key: '', n: '', at: 0, title: "You've Got a Website. But Do You Have a Business?", body: 'A desk, a phone and a simple website can open the doors. Watch what a fully built business runs on.' },
    { key: 'BLUEPRINT', n: '01', at: 0.1003, title: 'Before We Build, We Strategize.', body: 'We identify the systems, processes, and opportunities your business needs to operate more efficiently.' },
    { key: 'BUILD', n: '02', at: 0.2431, title: 'We Build Your Business Infrastructure.', body: 'Website, CRM, booking, email and SMS, payments, pipelines and onboarding, set up for your business based on the package you choose.' },
    { key: 'LAUNCH', n: '03', at: 0.4386, title: 'Your Systems. Connected. Automated.', body: 'AI, automation, and integrated business systems help manage communication, customers, and daily operations.' },
    { key: 'SCALE', n: '04', at: 0.7134, title: 'Built to Operate at Another Level.', body: 'More floors, more capacity, one connected operation. The systems you choose keep working together as your business grows.' },
    { key: 'FINAL', n: '', at: 0.9284, title: "We Don't Just Build Websites. We Build Businesses.", body: 'Strategy. Infrastructure. Automation. AI. Built for your business.' },
  ];
  const FLOW = ['A new lead comes in through your funnel', 'An AI agent responds', 'The lead is saved in your CRM', 'An appointment is scheduled', 'Email and text follow-up begins', 'Payment is collected', 'Onboarding starts automatically', 'Marketing workflows keep them engaged'];
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
    const k = Math.floor(clamp01((t - 0.4625) / 0.227) * sysItems.length + 1e-6);
    sysItems.forEach((li, i) => li.classList.toggle('lit', i < k));
    document.body.classList.toggle('sys-on', t >= 0.4386 && t < 0.9284);
    let label = '';
    if (st.key === 'LAUNCH' && k > 0) label = `${k} of 8 · ${FLOW[Math.min(k, 8) - 1]}`;
    if (label !== lastPhase) { lastPhase = label; el('phase').textContent = label; el('phase').classList.toggle('on', !!label); }
    el('rail-fill').style.transform = `scaleX(${clamp01((t - 0.1003) / 0.8281)})`;
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
