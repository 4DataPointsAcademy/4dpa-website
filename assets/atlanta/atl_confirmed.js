(function(){
var P=location.pathname, K=/vip/i.test(P)?'vip':(/weekend/i.test(P)?'weekend':'day');
var LEAD={day:'Your Day Pass for the 4 Data Points Academy Atlanta Real Estate &amp; Entrepreneur Weekend is reserved. Here’s what happens next.',
 weekend:'Your Weekend Pass for the 4 Data Points Academy Atlanta Real Estate &amp; Entrepreneur Weekend is reserved: both days plus Friday night. Here’s what happens next.',
 vip:'Your VIP seat for the 4 Data Points Academy Atlanta Real Estate &amp; Entrepreneur Weekend is reserved. Here’s what happens next.'}[K];
var DATES={day:'Your pass covers the day you picked at checkout (Saturday, Day 1: Real Estate, or Sunday, Day 2: Entrepreneurship), plus the Friday night Investor Meet &amp; Greet. Want both days? Upgrade to the Weekend Pass at go.4datapoints.com/atlanta-weekend.',
 weekend:'You’re in for all three: Friday night Investor Meet &amp; Greet, Saturday’s Real Estate day and Sunday’s Entrepreneurship day.',
 vip:'You’re in for all three: Friday night Investor Meet &amp; Greet, Saturday’s Real Estate day and Sunday’s Entrepreneurship day, with front-row seats both days.'}[K];
var NOTE = K==='vip' ? '<div class="vip"><b>VIP guests:</b> your hard copies of <i>The Real Estate Investor’s Field Manual</i> and <i>No Guardrails</i> are handed to you at the event, and you’re invited to the Saturday-night after-party in Odis’s Presidential Suite. Your 30-minute group deal review on Zoom happens the week after, and your Multifamily Workshop On Demand and 3 months of Investor Plus come by email. Enroll in Mentorship or Empire within 30 days and your $249 comes back as a credit.</div>' : '';
var html = '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">'
+ '<style>'
+ '.atlk *{box-sizing:border-box;margin:0;padding:0}'
+ '.atlk{font-family:Poppins,system-ui,sans-serif;background:#0E0E0E;color:#e6e6e6;padding:48px 18px 56px;overflow-x:hidden}'
+ '.atlk .wrap{max-width:760px;margin:0 auto}'
+ '.atlk img.logo{display:block;width:150px;margin:0 auto 26px}'
+ '.atlk .badge{width:64px;height:64px;border-radius:50%;background:#D6AD48;color:#0E0E0E;font-size:34px;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}'
+ '.atlk .eyebrow{text-align:center;color:#D6AD48;font-weight:700;font-size:13px;letter-spacing:2.5px;text-transform:uppercase}'
+ '.atlk h1{text-align:center;color:#fff;font-size:34px;line-height:1.2;font-weight:800;margin:10px 0 12px}'
+ '.atlk .lead{text-align:center;color:#cfcfcf;font-size:16px;line-height:1.6;max-width:600px;margin:0 auto 30px}'
+ '.atlk img.hero{width:100%;border-radius:14px;display:block;margin-bottom:30px}'
+ '.atlk h2{color:#fff;font-size:22px;font-weight:800;margin:0 0 14px}'
+ '.atlk .step{display:flex;gap:16px;background:#171717;border:1px solid #262626;border-radius:12px;padding:16px 18px;margin-bottom:12px}'
+ '.atlk .num{flex:0 0 34px;height:34px;border-radius:50%;background:#D6AD48;color:#0E0E0E;font-weight:800;display:flex;align-items:center;justify-content:center}'
+ '.atlk .step b{color:#fff;display:block;font-size:15.5px;margin-bottom:3px}'
+ '.atlk .step p{font-size:14.5px;line-height:1.55;color:#cfcfcf}'
+ '.atlk .vip{margin-top:22px;background:#16130b;border-left:4px solid #D6AD48;border-radius:10px;padding:16px 18px;font-size:14.5px;line-height:1.6;color:#e8e2cf}'
+ '.atlk .vip b{color:#D6AD48}'
+ '.atlk .venue{margin-top:22px;text-align:center;font-size:14px;color:#bdbdbd;line-height:1.7}'
+ '.atlk .venue b{color:#fff}'
+ '@media(max-width:600px){.atlk h1{font-size:27px}.atlk{padding:36px 16px 44px}}'
+ '</style>'
+ '<div class="atlk"><div class="wrap">'
+ '<div class="badge">&#10003;</div>'
+ '<div class="eyebrow">Registration Confirmed</div>'
+ '<h1>You’re in. See you in Atlanta.</h1>'
+ '<p class="lead">'+LEAD+'</p>'
+ '<img class="hero" src="https://qqiqvxtbeswxnzqxcrye.supabase.co/storage/v1/object/public/marketing-assets/atlanta-feb-2027/atl_hero_desktop.jpg" alt="4 Data Points Academy Atlanta workshop">'
+ '<h2>Your next steps</h2>'
+ '<div class="step"><div class="num">1</div><div><b>Check your email and texts</b><p>Your receipt and registration confirmation are on the way. Add us to your contacts so nothing lands in spam.</p></div></div>'
+ '<div class="step"><div class="num">2</div><div><b>Save the dates: Fri–Sun, February 19–21, 2027</b><p>'+DATES+'</p></div></div>'
+ '<div class="step"><div class="num">3</div><div><b>Plan your trip to Atlanta</b><p>Friday night is the Investor Meet &amp; Greet. Saturday 10:00–4:00 is Day 1: Real Estate. Sunday 10:00–3:30 is Day 2: Entrepreneurship. We’re planning on The Candler Hotel downtown; the final venue is confirmed with registered guests.</p></div></div>'
+ '<div class="step"><div class="num">4</div><div><b>Bring a friend</b><p>Know an investor who should be in the room? Send them to 4datapoints.com/atlanta before seats run out.</p></div></div>'
+ NOTE
+ '<div class="venue"><b>Atlanta · February 19–21, 2027</b><br>If you can’t make it, your payment rolls over to the next 4 Data Points Academy workshop or is refunded on request.</div>'
+ '</div></div>';
var me = document.currentScript;
var box = document.createElement('div');
box.innerHTML = html;
if (me && me.parentNode) { me.parentNode.insertBefore(box, me); } else { document.body.appendChild(box); }
})();
