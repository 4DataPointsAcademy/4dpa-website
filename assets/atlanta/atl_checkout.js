(function(){
var HERO="https://qqiqvxtbeswxnzqxcrye.supabase.co/storage/v1/object/public/marketing-assets/atlanta-feb-2027/atl_hero_desktop.jpg";
var css="<link href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap\" rel=\"stylesheet\">"+
"<style>.atlc *{box-sizing:border-box;margin:0;padding:0}"+
".atlc{font-family:Poppins,system-ui,sans-serif;color:#141414;background:#0E0E0E;padding:28px 18px;border-radius:16px}"+
".atlc img.hero{width:100%;border-radius:12px;display:block;margin-bottom:18px}"+
".atlc .eyebrow{color:#D6AD48;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase}"+
".atlc h1{color:#fff;font-size:28px;line-height:1.2;font-weight:800;margin:6px 0 4px}"+
".atlc .price{color:#D6AD48;font-size:34px;font-weight:800}"+
".atlc .price s{color:#888;font-size:18px;margin-left:8px}"+
".atlc ul{list-style:none;margin:14px 0 6px}"+
".atlc li{color:#e6e6e6;font-size:15px;padding:5px 0 5px 26px;position:relative}"+
".atlc li:before{content:\"\\2713\";color:#D6AD48;font-weight:800;position:absolute;left:0}"+
".atlc .meta{color:#bdbdbd;font-size:13.5px;margin-top:10px;line-height:1.6}"+
".atlc .promise{margin-top:14px;background:#16130b;border-left:4px solid #D6AD48;padding:12px 14px;border-radius:8px;color:#e8e2cf;font-size:13.5px}"+
".atlc .switch{margin-top:12px;font-size:13.5px;color:#bdbdbd;line-height:1.7}.atlc .switch a{color:#D6AD48;font-weight:700}"+
"</style>";
var META="<div class=\"meta\">Fri–Sun, February 19–21, 2027 · Atlanta<br>Sat 10:00–4:00 · Sun 10:00–3:30<br>The Candler Hotel on Peachtree (final venue confirmed with registered guests)</div>";
var DAY="https://go.4datapoints.com/atlanta-preregister", WKND="https://go.4datapoints.com/atlanta-weekend", VIP="https://go.4datapoints.com/atlanta-vip";
function card(eyebrow,title,price,was,items,promise,sw){
 return "<div class=\"atlc\"><img class=\"hero\" src=\""+HERO+"\" alt=\"We're coming back to Atlanta\">"+
 "<div class=\"eyebrow\">"+eyebrow+"</div><h1>"+title+"</h1><div class=\"price\">$"+price+"<s>$"+was+"</s></div>"+
 "<ul><li>"+items.join("</li><li>")+"</li></ul>"+META+
 "<div class=\"promise\"><b style=\"color:#D6AD48\">Our promise:</b> "+promise+"</div>"+
 "<div class=\"switch\">"+sw+"</div></div>";
}
var v={
 day:card("Pre-Registration · Day Pass","Atlanta Real Estate &amp; Entrepreneur Weekend – Day Pass","99","149",
  ["Your choice of day (pick below): Saturday, Day 1: Real Estate, or Sunday, Day 2: Entrepreneurship","Friday night Investor Meet &amp; Greet","Workshop materials for your day"],
  "If you can't make it, your $99 rolls over to the next 4DPA workshop or is refunded.",
  "Want both days? <a href=\""+WKND+"\">Weekend Pass – $149 →</a><br>Want the full experience? <a href=\""+VIP+"\">VIP – $249 →</a>"),
 weekend:card("Pre-Registration · Weekend Pass","Atlanta Real Estate &amp; Entrepreneur Weekend – Weekend Pass","149","249",
  ["Saturday, Day 1: Real Estate (10:00–4:00)","Sunday, Day 2: Entrepreneurship – the 8 Areas from <i>No Guardrails</i> (10:00–3:30)","Friday night Investor Meet &amp; Greet","Workshop materials for both days"],
  "If you can't make it, your $149 rolls over to the next 4DPA workshop or is refunded.",
  "Only need one day? <a href=\""+DAY+"\">Day Pass – $99 →</a><br>Want the full experience? <a href=\""+VIP+"\">VIP – $249 →</a>"),
 vip:card("Pre-Registration · VIP · Only 25","Atlanta Real Estate &amp; Entrepreneur Weekend – VIP","249","399",
  ["Both days, front-row seats, plus the Friday night Investor Meet &amp; Greet","Hard copies of <i>The Real Estate Investor's Field Manual</i> and <i>No Guardrails</i>","Saturday-night after-party in Odis's Presidential Suite","30-minute group deal review on Zoom the week after","Multifamily Workshop On Demand + 3 months of Investor Plus","$249 credit toward Mentorship or Empire if you enroll within 30 days"],
  "If you can't make it, your payment rolls over to the next 4DPA workshop or is refunded.",
  "Just want both days? <a href=\""+WKND+"\">Weekend Pass – $149 →</a><br>Only need one day? <a href=\""+DAY+"\">Day Pass – $99 →</a>")
};
var p=location.pathname, k=/vip/i.test(p)?"vip":(/weekend/i.test(p)?"weekend":"day");
var cur=document.currentScript, host=document.createElement('div');
host.innerHTML=css+v[k];
if(cur&&cur.parentNode){cur.parentNode.insertBefore(host,cur);}else{document.body.prepend(host);}
})();
