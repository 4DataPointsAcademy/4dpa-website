// Scroll hint for the scroll-driven video pages: if a visitor hasn't scrolled after a moment,
// the "Scroll to..." pill grows, turns gold and pulses so people know the story plays as they scroll.
(function () {
  var cue = document.querySelector('.scroll-cue');
  if (!cue) return;
  var css = document.createElement('style');
  css.textContent =
    '.scroll-cue.hint-on{opacity:1!important;background:#C9A84C!important;color:#16140F!important;font-size:15px!important;padding:14px 22px!important;box-shadow:0 10px 40px rgba(0,0,0,.55),0 0 0 0 rgba(201,168,76,.6);animation:hintPulse 1.8s ease-out infinite;z-index:40!important}' +
    '.scroll-cue.hint-on::before{border-color:#16140F!important}' +
    '@keyframes hintPulse{0%{box-shadow:0 10px 40px rgba(0,0,0,.55),0 0 0 0 rgba(201,168,76,.6)}70%{box-shadow:0 10px 40px rgba(0,0,0,.55),0 0 0 18px rgba(201,168,76,0)}100%{box-shadow:0 10px 40px rgba(0,0,0,.55),0 0 0 0 rgba(201,168,76,0)}}' +
    '@media (prefers-reduced-motion:reduce){.scroll-cue.hint-on{animation:none}}';
  document.head.appendChild(css);
  var start = window.scrollY, done = false;
  function stop() { if (done) return; done = true; cue.classList.remove('hint-on'); }
  addEventListener('scroll', function () { if (Math.abs(window.scrollY - start) > 40) stop(); }, { passive: true });
  setTimeout(function () { if (!done && Math.abs(window.scrollY - start) < 40) cue.classList.add('hint-on'); }, 2500);
})();
