var WEBSITE_LEAD_URL = "https://qqiqvxtbeswxnzqxcrye.supabase.co/functions/v1/website-lead";

(function () {
  // Testimonial videos load their file only when the page runs.
  [].slice.call(document.querySelectorAll('video[data-v]')).forEach(function (v) {
    v.src = '/assets/video/' + v.dataset.v + '.mp4';
  });

  // Highlight the current page in the menu.
  var here = location.pathname.replace(/index\.html$/, '');
  [].slice.call(document.querySelectorAll('.menu a[href^="/"]')).forEach(function (a) {
    if (a.getAttribute('href') === here) a.classList.add('on');
  });

  // Mobile menu.
  var menu = document.getElementById('menu'), burger = document.getElementById('burger');
  if (menu && burger) {
    burger.addEventListener('click', function () {
      var o = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(o));
    });
  }

  // Lead forms.
  var interests = ['Real estate mentorship', 'Multifamily course', 'Land trust', 'Empire', 'VentureU retreat', 'Self-Image Workshop', 'General question'];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  [].slice.call(document.querySelectorAll('.form-slot')).forEach(function (s) {
    var sel = s.dataset.interest, short = !!s.dataset.short;
    var opts = interests.map(function (i) { return '<option' + (i === sel ? ' selected' : '') + '>' + esc(i) + '</option>'; }).join('');
    s.innerHTML = '<form class="lead-form" novalidate><h3>' + esc(s.dataset.heading) + '</h3>' +
      (short
        ? '<label>First name<input name="first_name" autocomplete="given-name" required></label><label>Email<input type="email" name="email" autocomplete="email" required></label><label>Mobile phone<input type="tel" name="phone" autocomplete="tel"></label><input type="hidden" name="interest" value="' + esc(sel) + '">'
        : '<div class="row2"><label>First name<input name="first_name" autocomplete="given-name" required></label><label>Last name<input name="last_name" autocomplete="family-name" required></label></div>' +
          '<label>Email<input type="email" name="email" autocomplete="email" required></label>' +
          '<label>Mobile phone<input type="tel" name="phone" autocomplete="tel"></label>' +
          '<label>I’m interested in<select name="interest">' + opts + '</select></label>' +
          '<label>Anything we should know? (optional)<textarea name="message" rows="2"></textarea></label>') +
      '<div class="hpf" aria-hidden="true"><label>Leave this field empty<input name="hp" tabindex="-1" autocomplete="off"></label></div>' +
      '<label class="consent"><input type="checkbox" name="sms_customer_care"><span>I agree to receive customer care text messages from 4 Data Points Academy, Inc. about my inquiry, appointments, purchases and account. Message frequency varies. Message and data rates may apply. Reply HELP for help or STOP to opt out.</span></label>' +
      '<label class="consent"><input type="checkbox" name="sms_marketing"><span>I agree to receive marketing text messages from 4 Data Points Academy, Inc. about programs, events and offers. Message frequency varies. Message and data rates may apply. Reply HELP for help or STOP to opt out. Consent is not a condition of purchase.</span></label>' +
      '<p class="note">By submitting, you agree to our <a href="/privacy-policy/">Privacy Policy</a>, <a href="/terms-of-service/">Terms of Service</a> and <a href="/sms-terms/">Text Messaging Terms</a>. We never share your mobile number for marketing.</p>' +
      '<button class="btn btn-gold" type="submit">' + esc(s.dataset.button) + '</button>' +
      '<div class="form-err" role="alert"></div></form>';
  });

  function showErr(f, msg) { var e = f.querySelector('.form-err'); e.textContent = msg; e.style.display = 'block'; }

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f.classList || !f.classList.contains('lead-form')) return;
    e.preventDefault();
    var err = f.querySelector('.form-err'); err.style.display = 'none';
    var v = function (n) { var el = f.elements[n]; return el ? String(el.value || '').trim() : ''; };
    var cc = f.elements.sms_customer_care.checked, mk = f.elements.sms_marketing.checked;
    if (!v('first_name') || (f.elements.last_name && !v('last_name'))) return showErr(f, 'Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) return showErr(f, 'Please enter a valid email address.');
    var digits = v('phone').replace(/\D/g, '');
    if ((cc || mk) && digits.length < 10) return showErr(f, 'Please enter your mobile phone number so we can text you, or uncheck the text message boxes.');
    if (v('phone') && digits.length < 10) return showErr(f, 'Please check your mobile phone number.');
    var btn = f.querySelector('button[type=submit]'), label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    fetch(WEBSITE_LEAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: v('first_name'), last_name: v('last_name'), email: v('email'), phone: v('phone'),
        interest: v('interest'), message: v('message'), sms_customer_care: cc, sms_marketing: mk,
        page: location.pathname, hp: v('hp')
      })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok || !d.ok) throw new Error(d.message || 'failed'); }); })
      .then(function () { location.href = '/thank-you/'; })
      .catch(function () {
        btn.disabled = false; btn.textContent = label;
        showErr(f, 'Sorry, your message didn’t go through. Please call or text 702-710-8030 or email info@4datapoints.com.');
      });
  });
})();
