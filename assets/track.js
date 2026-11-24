/* 4DPA ad measurement: Meta Pixel (VentureU Website Data) + Google tag (Google Ads).
   Fires PageView on every page and a Lead on thank-you pages after a form.
   Forms that finish in place (no thank-you page) call window.dpaLead('name'). */
(function () {
  var META_PIXEL = '1430246128961754';
  var GOOGLE_TAG = 'AW-17059633286';
  var LEAD_CONVERSION = 'AW-17059633286/m3FUCKuiqOkbEIax1cY_'; /* Google Ads "Submit lead form" */
  var path = location.pathname;
  var isLead = /\/thanks\/?$|\/thank-you\/?$/.test(path);

  /* Meta Pixel */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL);
  fbq('track', 'PageView');

  /* Google tag */
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_TAG;
  document.head.appendChild(g);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GOOGLE_TAG);

  window.dpaLead = function (what) {
    fbq('track', 'Lead', { content_name: what });
    gtag('event', 'generate_lead', { lead_source: what });
    gtag('event', 'conversion', { send_to: LEAD_CONVERSION, value: 1.0, currency: 'USD' });
  };

  if (isLead) {
    var what = path.indexOf('/blueprint/') === 0 ? 'VentureU Business Blueprint'
      : path.indexOf('/guides/') === 0 ? '4 Data Points guide'
      : path.indexOf('/44-places/') === 0 ? '44 Places guide'
      : path.indexOf('/beyond-rental-income/') === 0 ? 'Beyond Rental Income guide'
      : path.replace(/\//g, ' ').trim();
    window.dpaLead(what);
  }
})();
