/* Mentorship flagship page: hero footage, Four Data Points steps, sticky mobile buttons, conversion events. */
(function () {
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SAVE = navigator.connection && navigator.connection.saveData;

  // Hero footage loads after the page so text, buttons and prices are never delayed.
  var vid = document.getElementById('mh-vid');
  if (vid && !REDUCED && !SAVE) {
    window.addEventListener('load', function () {
      vid.src = vid.dataset.src;
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    });
  }

  // Four Data Points: highlight the step in view and swap the matching image.
  var steps = [].slice.call(document.querySelectorAll('.mdp-steps li'));
  var imgs = [].slice.call(document.querySelectorAll('.mdp-stage img'));
  if ('IntersectionObserver' in window && steps.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var k = e.target.dataset.k;
        steps.forEach(function (s) { s.classList.toggle('on', s.dataset.k === k); });
        imgs.forEach(function (i) { i.classList.toggle('on', i.dataset.k === k); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }

  // Mobile sticky buttons appear after the hero and hide over the program cards.
  var sticky = document.getElementById('msticky');
  var hero = document.querySelector('.mh'), programs = document.getElementById('programs');
  if (sticky && 'IntersectionObserver' in window) {
    var pastHero = false, onPrograms = false;
    var upd = function () { sticky.classList.toggle('show', pastHero && !onPrograms); };
    new IntersectionObserver(function (es) { pastHero = !es[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (es) { onPrograms = es[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(programs);
  }

  // Conversion events (Meta Pixel and Google tag come from /assets/track.js).
  function fb() { if (window.fbq) fbq.apply(null, arguments); }
  function gt() { if (window.gtag) gtag.apply(null, arguments); }
  var viewed = false;
  if (programs && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !viewed) {
        viewed = true;
        fb('track', 'ViewContent', { content_name: 'Mentorship programs' });
        gt('event', 'view_item_list', { item_list_name: 'Mentorship programs' });
      }
    }, { threshold: 0.3 }).observe(programs);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.dataset.enroll) {
      var price = Number(a.dataset.price) || 0, name = a.dataset.enroll;
      fb('track', 'InitiateCheckout', { content_name: name, value: price, currency: 'USD' });
      gt('event', 'begin_checkout', { currency: 'USD', value: price, items: [{ item_name: name, price: price }] });
    } else if (a.dataset.speak) {
      fb('track', 'Contact', { content_name: 'Mentorship: speak with our team' });
      gt('event', 'contact', { method: 'mentorship_page', placement: a.dataset.speak });
    } else if (a.dataset.explore) {
      gt('event', 'select_content', { content_type: 'explore_programs', placement: a.dataset.explore });
    }
  });
})();
