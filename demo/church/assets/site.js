(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const R=Math.min(devicePixelRatio||1,2);
window.toast=function(t){const e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),4400)};
function pref(k,v){try{if(v===undefined)return localStorage.getItem('lv_'+k)==='1';localStorage.setItem('lv_'+k,v?'1':'0')}catch(e){return false}}
const calm=()=>document.body.classList.contains('calm')||matchMedia('(prefers-reduced-motion: reduce)').matches;window.isCalm=calm;
// accessibility
['big','contrast','calm'].forEach(k=>{if(pref(k))document.body.classList.add(k);const c=$('#a_'+k);if(c){c.checked=pref(k);c.onchange=()=>{document.body.classList.toggle(k,c.checked);pref(k,c.checked)}}});
const ab=$('#a11yBtn');if(ab)ab.onclick=()=>$('#a11y').classList.toggle('on');
// video helper: stream on the live site, blob in previews (iPhone-safe)
const STREAM=/4datapoints\.com$/.test(location.hostname);const blobs={};
window.srcFor=async function(src){if(STREAM)return src;if(blobs[src])return blobs[src];try{const r=await fetch(src);if(!r.ok)throw 0;return blobs[src]=URL.createObjectURL(await r.blob())}catch(e){return src}};
$$('video.loopv').forEach(v=>{new IntersectionObserver((es,o)=>es.forEach(x=>{if(x.isIntersecting){if(!v.dataset.on){v.dataset.on=1;srcFor(v.dataset.src).then(u=>{v.src=u;v.muted=true;if(!calm())v.play().catch(()=>{})})}else if(!calm())v.play().catch(()=>{})}else v.pause()}),{threshold:.1}).observe(v)});
// mobile nav
const bu=$('#burger');if(bu)bu.onclick=()=>$('#mnav').classList.add('on');const mx=$('#mnavX');if(mx)mx.onclick=()=>$('#mnav').classList.remove('on');
$$('#mnav a').forEach(a=>a.addEventListener('click',()=>$('#mnav').classList.remove('on')));
// demo forms
$$('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const ok=f.dataset.ok?document.getElementById(f.dataset.ok):null;if(ok){f.style.display='none';ok.style.display='block'}else f.reset();toast(T(f.dataset.demo))}));
// tabs + option pickers
$$('.tabs').forEach(t=>t.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const g=t.dataset.group;if(!g)return;t.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));$$('.tabp[data-group="'+g+'"]').forEach(p=>p.classList.toggle('on',p.id===b.dataset.t))}));
$$('.opts').forEach(o=>o.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||!o.dataset.pick)return;o.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));b.classList.add('on')}));
document.addEventListener('click',e=>{const b=e.target.closest('.rsvp');if(!b)return;b.classList.toggle('on');const on=b.classList.contains('on');b.textContent=T(on?'Going ✓':'RSVP');if(on)toast(T("You're registered. A reminder text would go out the day before. (Demo)"))});
// events
window.nextDow=function(dow,weeks){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+((dow-d.getDay()+7)%7||7)+7*(weeks||0));return d};
window.evRow=function(d,t,s,tag,cls){const L=es?'es-US':'en-US';return `<div class="e ${cls||'slide'}"><div class="d"><span>${d.toLocaleString(L,{month:'short'})}</span><b>${d.getDate()}</b></div><div><b>${T(t)}</b>${tag?`<span class="tag">${T(tag)}</span>`:''}<p>${d.toLocaleString(L,{weekday:'long'})} · ${T(s)}</p></div><button class="rsvp">${T('RSVP')}</button></div>`};
function renderEvents(){$$('[data-events]').forEach(box=>{const all=window.EVENTS||[];const f=box.dataset.events;const list=all.filter(x=>f==='all'||x[4]===f||(f==='home'&&x[5]));box.innerHTML=list.map(x=>evRow(nextDow(x[0],x[1]),x[2],x[3],x[4])).join('');box.querySelectorAll('.slide').forEach((el,i)=>{el.style.transitionDelay=(i*90)+'ms';sio.observe(el)})})}
// ---------- Spanish: whole-page translation from the dictionary (es.js)
const D=window.ES_DICT||{};let es=pref('es');
function T(s){if(!es||!s)return s;const k=s.trim();return D[k]?s.replace(k,D[k]):s}window.T=T;window.isES=()=>es;
const orig=new WeakMap();
function walk(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||/SCRIPT|STYLE|NOSCRIPT/.test(p.tagName)||p.closest('[data-noes]'))return 2;return n.textContent.trim()?1:2}});const out=[];while(w.nextNode())out.push(w.currentNode);return out}
function translate(){walk(document.body).forEach(n=>{if(!orig.has(n))orig.set(n,n.textContent);const o=orig.get(n),k=o.trim();n.textContent=es&&D[k]?o.replace(k,D[k]):o});
 $$('[placeholder]').forEach(el=>{if(!el.dataset.ph)el.dataset.ph=el.placeholder;el.placeholder=es&&D[el.dataset.ph]?D[el.dataset.ph]:el.dataset.ph});
 const b=$('#langBtn');if(b)b.textContent=es?'EN':'ES';document.documentElement.lang=es?'es':'en'}
function setLang(v){es=v;pref('es',v);renderEvents();$$('.words').forEach(el=>{el.innerHTML=el.dataset.orig||el.innerHTML});translate();splitAll(true);document.dispatchEvent(new CustomEvent('lang',{detail:es}))}
const lb=$('#langBtn');if(lb)lb.onclick=()=>{setLang(!es);toast(es?'Español activado':'English')};
// ---------- word-by-word headings
function split(el){if(!el.dataset.orig)el.dataset.orig=el.innerHTML;const tmp=document.createElement('div');tmp.innerHTML=el.innerHTML;let n=0;
 (function wk(node){[...node.childNodes].forEach(ch=>{if(ch.nodeType===3){const fr=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){fr.appendChild(document.createTextNode(w));return}const s=document.createElement('span');s.className='w';s.style.transitionDelay=(n++*70)+'ms';s.textContent=w;fr.appendChild(s)});ch.replaceWith(fr)}else wk(ch)})})(tmp);el.innerHTML=tmp.innerHTML}
function splitAll(keepIn){$$('.words').forEach(el=>{const was=el.classList.contains('in');split(el);if(keepIn&&was)el.classList.add('in')})}
const sio=new IntersectionObserver(es2=>es2.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');sio.unobserve(x.target)}}),{threshold:.15});
// ---------- counters
const cio=new IntersectionObserver(es2=>es2.forEach(x=>{if(!x.isIntersecting)return;cio.unobserve(x.target);const el=x.target,to=+el.dataset.count,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1600),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=v.toLocaleString();if(k<1)requestAnimationFrame(f)})(t0)}),{threshold:.5});
// ---------- night-to-dawn background + parallax
const C0=[11,18,32],C1=[20,26,46],C2=[42,26,20],C3=[58,36,20];
function mix(a,b,k){return a.map((v,i)=>Math.round(v+(b[i]-v)*k))}
function bgAt(p){return p<.5?mix(C0,C1,p/.5):p<.8?mix(C1,C2,(p-.5)/.3):mix(C2,C3,(p-.8)/.2)}
window.emberLevel=document.body.classList.contains('home')?0:1;
function onScroll(){const y=scrollY,vh=innerHeight,dh=Math.max(1,document.documentElement.scrollHeight-vh);const p=Math.max(0,Math.min(1,y/dh));
 if(document.body.classList.contains('dark')){const c=bgAt(p);document.body.style.backgroundColor=`rgb(${c})`;document.documentElement.style.setProperty('--bgEnd',`rgb(${c})`)}
 if(document.body.classList.contains('home'))emberLevel=Math.min(1,y/(vh*.7));
 if(calm())return;$$('.par').forEach(im=>{const r=im.parentElement.getBoundingClientRect();const k=(r.top+r.height/2-vh/2)/vh;im.style.transform=`translateY(${k*-60}px)`});
 if(window.onPageScroll)onPageScroll(y,vh)}
let tk=false;addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(()=>{onScroll();tk=false})}},{passive:true});addEventListener('resize',onScroll);
// ---------- soft ambient specks (behind content); lanterns only after the prayer sky
if(document.body.classList.contains('dark')){const ec=document.createElement('canvas');ec.id='embers';document.body.prepend(ec);const ex=ec.getContext('2d');let EW,EH,E=[],LN=[];
 const MOB=innerWidth<700;
 function esize(){EW=ec.width=innerWidth*R;EH=ec.height=innerHeight*R}esize();addEventListener('resize',esize);
 function speck(any){return{x:Math.random()*EW,y:any?Math.random()*EH:EH+10*R,r:(MOB?.5:.6)*R+Math.random()*(MOB?.6:.8)*R,v:(.12+Math.random()*.28)*R,ph:Math.random()*6,tw:Math.random()*6}}
 function lantern(){return{x:(.1+Math.random()*.8)*EW,y:EH+30*R,s:(MOB?.8:1.1)*R*(.8+Math.random()*.4),v:(.25+Math.random()*.2)*R,ph:Math.random()*6,a:0}}
 for(let i=0;i<(MOB?12:22);i++)E.push(speck(true));
 const pray=document.getElementById('pray');let lt=0;
 (function edraw(){ex.clearRect(0,0,EW,EH);
  if(!calm()&&emberLevel>0.01&&!document.hidden){
   for(const e of E){e.y-=e.v;e.ph+=.012;e.tw+=.03;e.x+=Math.sin(e.ph)*.25*R;if(e.y<-10*R)Object.assign(e,speck(false));
    ex.globalAlpha=Math.max(0,emberLevel*(.12+.22*Math.sin(e.tw)**2)*Math.min(1,e.y/(EH*.3)));
    const g=ex.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*3.5);g.addColorStop(0,'rgba(255,214,160,.9)');g.addColorStop(1,'rgba(255,180,100,0)');ex.fillStyle=g;ex.beginPath();ex.arc(e.x,e.y,e.r*3.5,0,7);ex.fill()}
   const after=pray&&pray.getBoundingClientRect().bottom<innerHeight*.95;lt++;
   if(after&&LN.length<(MOB?4:7)&&lt%70===0)LN.push(lantern());
   LN=LN.filter(l=>l.y>-40*R&&!(l.a<=0&&!after&&l.y<EH));
   for(const l of LN){l.y-=l.v;l.ph+=.02;l.a=after?Math.min(1,l.a+.01):Math.max(0,l.a-.02);const x=l.x+Math.sin(l.ph)*6*R,y=l.y,s=l.s;
    ex.globalAlpha=Math.max(0,.75*l.a*Math.min(1,y/(EH*.3)));const g=ex.createRadialGradient(x,y,0,x,y,22*s);g.addColorStop(0,'rgba(255,196,120,.45)');g.addColorStop(1,'rgba(255,170,80,0)');ex.fillStyle=g;ex.beginPath();ex.arc(x,y,22*s,0,7);ex.fill();
    ex.fillStyle='#f4b56a';ex.beginPath();ex.moveTo(x-6*s,y-8*s);ex.lineTo(x+6*s,y-8*s);ex.lineTo(x+5*s,y+7*s);ex.lineTo(x-5*s,y+7*s);ex.closePath();ex.fill();ex.fillStyle='rgba(255,250,235,.9)';ex.fillRect(x-2.5*s,y+2*s,5*s,3.5*s)}}
  ex.globalAlpha=1;requestAnimationFrame(edraw)})()}
// ---------- Pastor's tour
const TOUR=window.TOUR||[{sel:'.phead',t:'Every page feels like the homepage',d:'Ministry pages open on moving video, carry the same night-to-dawn look and have a sign-up that reaches the right leader instantly.'},{sel:'form',t:'No paperwork',d:'Every form texts and emails a confirmation and lands with the right person on staff. Nothing falls through the cracks.'}];
const tb=document.createElement('button');tb.className='tourbtn';tb.innerHTML='<i>?</i><span>Pastor\'s tour</span>';tb.dataset.noes=1;document.body.appendChild(tb);
const shade=document.createElement('div');shade.className='tourshade';shade.innerHTML='<div class="tourspot"></div>';document.body.appendChild(shade);
const card=document.createElement('div');card.className='tourcard';card.dataset.noes=1;document.body.appendChild(card);
let ti=0;function show(){const s=TOUR[ti];const el=$(s.sel);const last=ti===TOUR.length-1;
 card.innerHTML=`<div class="lbl">Pastor's tour · ${ti+1} of ${TOUR.length}</div><h3>${s.t}</h3><p>${s.d}</p><div class="tnav"><button class="btn o" id="tx" style="border-color:var(--ink);color:var(--ink)">${last?'Close':'Exit'}</button><span class="dots"></span>${last?'<a class="btn p" href="/talk/">Talk to Odis about your church</a>':'<button class="btn p" id="tn">Next →</button>'}</div>`;
 $('#tx').onclick=end;const n=$('#tn');if(n)n.onclick=()=>{ti++;show()};
 const spot=shade.querySelector('.tourspot');if(el){el.querySelectorAll('.bub,.fstep').forEach(x=>x.classList.add('in','on'));el.scrollIntoView({behavior:calm()?'auto':'smooth',block:s.block||'center'});setTimeout(()=>{const r=el.getBoundingClientRect();const pad=10;spot.style.left=(Math.max(6,r.left-pad))+'px';spot.style.top=(Math.max(6,r.top-pad))+'px';spot.style.width=Math.min(innerWidth-12,r.width+pad*2)+'px';spot.style.height=Math.min(innerHeight*.62,r.height+pad*2)+'px'},calm()?50:700)}}
function start(){ti=0;document.body.classList.add('touring');show()}function end(){document.body.classList.remove('touring')}
tb.onclick=start;addEventListener('keydown',e=>{if(e.key==='Escape')end()});addEventListener('scroll',()=>{if(!document.body.classList.contains('touring'))return;const s=TOUR[ti],el=$(s.sel);if(!el)return;const r=el.getBoundingClientRect(),spot=shade.querySelector('.tourspot');spot.style.top=(r.top-10)+'px';spot.style.left=(Math.max(6,r.left-10))+'px'},{passive:true});
if(location.hash==='#tour')setTimeout(start,1200);
// ---------- start
renderEvents();translate();splitAll();
setTimeout(()=>{$$('.reveal,.words').forEach(el=>sio.observe(el));$$('[data-count]').forEach(el=>cio.observe(el));onScroll()},30);
})();
