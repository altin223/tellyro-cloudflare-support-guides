(()=>{'use strict';const D=window.TELLYRO_HELP;if(!D)return;
const $=s=>document.querySelector(s),sel=$('#guide-lang');let current='firetv';
const ICON={
 stick:'<rect x="9" y="2.5" width="6" height="15" rx="2"/><path d="M12 17.5v4"/><circle cx="12" cy="7" r="1"/>',
 tv:'<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
 smarttv:'<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M9.5 8.3v4.4l3.8-2.2z"/><path d="M8 20.5h8M12 16.5v4"/>',
 phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
 iphone:'<rect x="4" y="3" width="11" height="18" rx="2.5"/><rect x="14" y="7" width="7" height="12" rx="1.8"/><path d="M8.5 18h2"/>',
 laptop:'<rect x="4" y="4.5" width="16" height="11" rx="1.6"/><path d="M2 19.5h20"/>',
 info:'<circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5M12 7.6v.1"/>',
 warn:'<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.1"/>',
 key:'<circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21M17.5 12v3M20.5 12v2.4"/>',
 ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
 copy:'<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>',
 wa:'<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.5c0 3.4 2.9 6.5 6.5 6.6l1.2-1.6-2.1-1-1 .9c-1-.4-2.3-1.6-2.8-2.7l.9-1-.9-2.2z"/>',
 tg:'<path d="M21 4 2.8 11.2l6 2.1L18 7l-7.2 7.6.1 5.4 3-3.6 4.5 3.3z"/>'};
const svg=(k,c)=>`<svg class="${c||'i'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
function language(){const v=sel.value;return D.languages.includes(v)?v:'en'}
const L=o=>o[language()]||o.en;
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
/* Plain text with **bold**; everything is escaped first. */
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
function callout(kind,title,text){const c=el('div','callout '+kind);c.append(el('span','co-ic',svg(kind==='key'?'key':kind==='warn'?'warn':'info')));const b=el('div','co-b');if(title)b.append(el('strong','co-t',esc(title)));b.append(el('p',0,rich(text)));c.append(b);return c}
function copyText(text){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);return new Promise((ok,no)=>{const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0;top:0';document.body.append(t);t.select();try{document.execCommand('copy')?ok():no()}catch(e){no(e)}t.remove()})}
function support(d,u){const box=el('section','support'+(d.bob?' bob':''));box.setAttribute('aria-labelledby','g-sup-h');
 const h=el('h3',0,esc(d.bob?u.bobH:u.helpH));h.id='g-sup-h';box.append(h,el('p','sup-p',esc(d.bob?u.bobP:u.helpP)));
 const msg=d.msg?L(d.msg):u.defMsg.replace('{app}',d.app).replace('{device}',L(d.label));
 const lab=el('label','msg-l',esc(u.msg));lab.htmlFor='g-msg';const ta=el('textarea','msg');ta.id='g-msg';ta.value=msg;ta.rows=d.bob?7:2;ta.spellcheck=false;
 const status=el('p','msg-s');status.setAttribute('role','status');
 const doCopy=()=>copyText(ta.value).then(()=>{status.textContent=u.copied;status.className='msg-s ok'},()=>{status.textContent=u.copyFail;status.className='msg-s';ta.focus();ta.select()});
 const cp=el('button','btn copy',svg('copy')+'<span>'+esc(u.copy)+'</span>');cp.type='button';cp.onclick=doCopy;
 const ln=D.links(),acts=el('div','sup-acts');
 const wa=el('a','btn wa',svg('wa')+'<span>'+esc(u.wa)+'</span>'),tg=el('a','btn tg',svg('tg')+'<span>'+esc(u.tg)+'</span>');
 wa.href=ln.wa;tg.href=ln.tg;[wa,tg].forEach(a=>{a.target='_blank';a.rel='noopener noreferrer';a.addEventListener('click',doCopy)});
 acts.append(wa,tg);box.append(lab,ta,el('div','copy-row'),acts,status);box.querySelector('.copy-row').append(cp);return box}
function guide(d){const u=D.ui[language()],g=$('#g-guide');let n=0;
 const head=el('header','g-head');head.append(el('span','g-ic',svg(d.icon)));const ht=el('div');const h2=el('h2',0,esc(L(d.label)));h2.id='g-title';ht.append(h2,el('p','g-app',`${esc(u.app)}: <b>${esc(d.app)}</b>${d.by&&d.by!==d.app?` <span>· ${esc(u.by)} ${esc(d.by)}</span>`:''}`));head.append(ht);
 const parts=[head,el('p','g-intro',rich(L(d.intro))),callout('key',u.before,d.bob?u.beforeBob:u.beforeText)];
 d.sections.forEach(s=>{const sec=el('section','g-sec');sec.append(el('h3',0,esc(L(s.h))));const ol=el('ol','steps');ol.start=n+1;
  s.steps.forEach(st=>{const t=st.t?st.t:st,li=el('li');li.append(el('span','n',String(++n)));const body=el('div','t',rich(L(t)));
   if(st.code){const c=el('div','codebox');c.innerHTML=`<span class="cb-l">${esc(u.code)}</span><span class="cb-code" translate="no">${D.downloader.code}</span><span class="cb-or">${esc(u.orUrl)}: <b translate="no">${D.downloader.url}</b></span><span class="cb-src">${esc(u.codeSrc)}</span>`;body.append(c)}
   li.append(body);ol.append(li)});
  sec.append(ol);parts.push(sec)});
 d.notes.forEach(x=>parts.push(callout(x.kind,'',L(x.t))));
 const lk=el('section','g-links');lk.append(el('h3',0,esc(u.links)));const row=el('div','lk-row');d.links.forEach(l=>{const a=el('a','lk',`<span>${esc(L(l.label))}</span>`+svg('ext'));a.href=l.url;a.target='_blank';a.rel='noopener noreferrer';row.append(a)});lk.append(row,el('p','third',esc(u.third)));
 /* For BOB Player, sending the codes is the main task, so the support box comes before the links. */
 if(d.bob)parts.push(support(d,u),lk);else parts.push(lk,support(d,u));
 g.replaceChildren(...parts);g.setAttribute('aria-labelledby','g-title');
 const ta=$('#g-msg'),fit=()=>{ta.style.height='auto';ta.style.height=ta.scrollHeight+2+'px'};fit();ta.addEventListener('input',fit)}
addEventListener('resize',()=>{const ta=$('#g-msg');if(ta){ta.style.height='auto';ta.style.height=ta.scrollHeight+2+'px'}});
function choose(id,user){const d=D.devices.find(x=>x.id===id)||D.devices[0];current=d.id;guide(d);
 document.querySelectorAll('#g-picker button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.device===d.id)));
 if(user){const u=new URL(location.href);u.searchParams.set('device',d.id);u.searchParams.set('lang',language());history.replaceState(null,'',u);
  if(innerWidth<781){const g=$('#g-guide'),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;g.scrollIntoView({behavior:rm?'auto':'smooth',block:'start'});g.focus({preventScroll:true})}}}
function render(){const lang=language(),u=D.ui[lang];document.documentElement.lang=lang;try{localStorage.setItem('tellyro-lang',lang)}catch{}
 const txt={'g-eyebrow':u.eyebrow,'g-h1a':u.h1a,'g-h1b':u.h1b,'g-lead':u.lead,'g-pick':u.pick,'g-faq-h':u.faqH,'nav-home':u.home,'nav-pricing':u.pricing,'nav-help':u.support};
 Object.entries(txt).forEach(([k,v])=>{$('#'+k).textContent=v});
 $('#g-picker').replaceChildren(...D.devices.map(d=>{const b=el('button','tile');b.type='button';b.dataset.device=d.id;b.setAttribute('aria-controls','g-guide');
  b.innerHTML=`<span class="t-ic">${svg(d.icon)}</span><span class="t-tx"><strong>${esc(L(d.label))}</strong><small>${esc(d.sub||d.app)}</small></span>`;b.addEventListener('click',()=>choose(d.id,true));return b}));
 $('#g-faq').replaceChildren(...u.faq.map(([q,a])=>{const x=el('details');x.append(el('summary',0,esc(q)),el('p',0,esc(a)));return x}));
 choose(current,false)}
const qs=new URLSearchParams(location.search);if(D.devices.some(d=>d.id===qs.get('device')))current=qs.get('device');
let lang=qs.get('lang');if(!D.languages.includes(lang)){try{lang=localStorage.getItem('tellyro-lang')}catch{}}if(!D.languages.includes(lang))lang='en';
sel.value=lang;sel.addEventListener('change',()=>{render();const u=new URL(location.href);u.searchParams.set('lang',language());history.replaceState(null,'',u)});render();
})();
