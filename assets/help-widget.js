(()=>{
'use strict';
const D=window.TELLYRO_HELP;if(!D)return;
const doc=document;const S=(tag,cls,txt)=>{const e=doc.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
const svg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8A8.5 8.5 0 0 1 12.5 20a8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></svg>';
const launch=S('button','th-launch'); launch.id='tellyro-help-button';launch.type='button';launch.setAttribute('aria-haspopup','dialog');launch.setAttribute('aria-expanded','false');launch.innerHTML=svg; const launchLabel=S('span','th-launch-label');launch.append(launchLabel);
const panel=S('section','th-panel');panel.id='tellyro-help-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','th-title');
const header=S('div','th-head');const symbol=S('div','th-symbol','▶');symbol.setAttribute('aria-hidden','true');const heads=S('div','th-headtxt'), title=S('strong');title.id='th-title';const subtitle=S('small'); heads.append(title,subtitle);const close=S('button','th-close','×');close.type='button';close.setAttribute('aria-label','Close support');header.append(symbol,heads,close);
const scroll=S('div','th-scroll');const bottom=S('div','th-bottom');const foot=S('a');foot.href='installation.html';const footNote=S('small');bottom.append(foot,footNote);panel.append(header,scroll,bottom);doc.body.append(launch,panel);
let view={page:'home',id:null};
function lang(){return D.language()}function ui(){return D.ui[lang()]||D.ui.en}
function updateStatic(){const l=ui();launchLabel.textContent=l.help;title.textContent=l.heading;subtitle.textContent=l.subtitle;close.setAttribute('aria-label',l.close);foot.textContent=l.all;footNote.textContent=l.note}
function bubble(str){scroll.append(S('p','th-bubble',str))}
function label(str){scroll.append(S('p','th-kicker',str))}
function choice(str,icon,fn,secondary=false){const b=S('button','th-choice'+(secondary?' secondary':''));b.type='button';b.append(S('span','th-icon',icon),S('span','',str),S('span','th-arrow','›'));b.addEventListener('click',fn);return b}
function options(list){const wrap=S('div','th-options');list.forEach(e=>wrap.append(e));scroll.append(wrap)}
function links(){const urls=D.links();const wrap=S('div','th-links');for(const [name,url] of [[ui().w,urls.wa],[ui().t,urls.tg]]){const a=S('a','',name);a.href=url;a.target='_blank';a.rel='noopener noreferrer';wrap.append(a)}scroll.append(wrap)}
function askBox(){
 const l=ui(),form=S('form','th-search');form.setAttribute('role','search');
 const inp=S('input');inp.type='search';inp.name='help-question';inp.placeholder=l.ask;inp.setAttribute('aria-label',l.ask);inp.maxLength=150;inp.autocomplete='off';
 const send=S('button','',l.send);send.type='submit';form.append(inp,send);
 form.addEventListener('submit',e=>{e.preventDefault();const q=inp.value.trim().toLowerCase();if(!q)return;
 const tests=[
 [/fire\s?stick|fire\s?tv|amazon/,()=>show('device','firetv')],
 [/samsung|\blg\b|smart\s?tv|bob\s?player/,()=>show('device','smarttv')],
 [/android\s?tv|google\s?tv|nvidia\s?shield/,()=>show('device','androidtv')],
 [/iphone|ipad|apple\s?tv|\bios\b|smarters/,()=>show('device','ios')],
 [/android\s?(phone|mobile)|tablet|telefon|telefono/,()=>show('device','androidphone')],
 [/windows|laptop|computer|pc|ordinateur|bilgisayar/,()=>show('device','windows')],
 [/buffer|slow|lag|freeze|stutter|loading|donma|lento|lent|langsam|bloque|blocc|internet|wifi/,()=>show('answer','buffer')],
 [/login|password|credential|username|incorrect|invalid|giriş|anmeld|connexion|contrase|acceso|accesso/,()=>show('answer','login')],
 [/second|device limit|two devices|multi.?device|zweit|cihaz|dos dispositivos|due dispositivi/,()=>show('answer','limit')],
 [/pay|renew|pric|cost|bill|refund|subscription|tarif|ödeme|pagam|precio|fiyat/,()=>show('answer','cost')],
 [/not work|no channels|nothing plays|blank|black screen|doesn.t play|kein sender|kanal yok|chaînes|canales|canali/,()=>show('answer','works')]
 ];
 const hit=tests.find(([pattern])=>pattern.test(q));if(hit)hit[1]();else show('unknown');
 });scroll.append(form);
}
function back(){options([choice(ui().back,'←',()=>show('home'),true)])}
function show(page,id){view={page,id};scroll.replaceChildren();const l=ui(),loc=lang();if(page==='home'){bubble(l.intro);label(l.start);askBox();options([choice(l.install,'📺',()=>show('install')),choice(l.issues,'🛠️',()=>show('issues')),choice(l.plans,'💳',()=>show('answer','cost')),choice(l.human,'💬',()=>show('human'))]);scroll.append(S('p','th-note',l.note))}
else if(page==='install'){scroll.append(S('h3','th-title',l.choose),S('p','th-small',l.need));options(D.devices.map(d=>choice(d.label,d.icon,()=>show('device',d.id))));back()}
else if(page==='device'){const d=D.devices.find(x=>x.id===id);if(!d)return show('install');scroll.append(S('h3','th-title',d.label));bubble(l.copy);const a=S('a','th-guide',l.open+' ↗');a.href='installation.html?device='+encodeURIComponent(d.id)+(loc==='en'?'':'&lang='+loc);scroll.append(a);scroll.append(S('p','th-small',l.caution));options([choice(l.human,'💬',()=>show('human'))]);back()}
else if(page==='issues'){bubble(l.textIssue);askBox();label(l.quick);options(['works','login','buffer','limit'].map((k,i)=>choice(l[k],['▶','🔐','📡','📺'][i],()=>show('answer',k))));back()}
else if(page==='answer'){scroll.append(S('h3','th-title',l[id]||l.quick),S('p','th-answer',D.solutions[id]?.[loc]||D.solutions[id]?.en||''));if(id==='cost'){const a=S('a','th-guide',l.start+' →');a.href='#pricing';a.addEventListener('click',()=>hide());scroll.append(a)}else{options([choice(l.install,'📺',()=>show('install'))])}scroll.append(S('p','th-note',l.after));links();back()}
else if(page==='unknown'){bubble(l.unknown);options([choice(l.install,'📺',()=>show('install')),choice(l.issues,'🛠️',()=>show('issues'))]);links();back()}
else if(page==='human'){bubble(l.after);links();options([choice(l.install,'📺',()=>show('install')),choice(l.issues,'🛠️',()=>show('issues'))]);back()}
scroll.scrollTop=0}
function open(){updateStatic();panel.hidden=false;launch.setAttribute('aria-expanded','true');show(view.page,view.id);close.focus({preventScroll:true})}
function hide(){panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.focus({preventScroll:true})}
launch.addEventListener('click',()=>panel.hidden?open():hide());close.addEventListener('click',hide);
doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.stopPropagation();hide()}});
doc.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!launch.contains(e.target))hide()});
for(const select of [doc.getElementById('site-lang'),doc.getElementById('guide-lang')]){if(select)select.addEventListener('change',()=>{setTimeout(()=>{updateStatic();if(!panel.hidden)show(view.page,view.id)},0)})}
updateStatic();
doc.querySelectorAll('[data-open-tellyro-help]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();open()}));
})();
