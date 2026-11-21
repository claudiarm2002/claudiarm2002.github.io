/* Navalla · tema: logo, títol per eina, rajoles de colors i botó d'actualitzar (no toca la lògica de les eines) */
(function(){
var h=document.querySelector('header'),h1=h&&h.querySelector('h1');
if(h1){
 if(h1.firstChild&&h1.firstChild.nodeType===3)h1.firstChild.nodeValue='Navalla';
 var lg=document.createElement('span');lg.className='lg';
 lg.innerHTML='<svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#1f3a2a"/><rect x="8" y="8" width="14" height="14" rx="4.5" fill="#d9774a"/><circle cx="33" cy="15" r="7" fill="#d3ab3e"/><circle cx="15" cy="33" r="7" fill="#4fa596"/><rect x="26" y="26" width="14" height="14" rx="4.5" fill="#8cc06f"/></svg>';
 h.insertBefore(lg,h1);
}
var m=document.querySelector('meta[name=theme-color]');if(m)m.content='#2f5d3f';
function tag(){document.body.dataset.tool=location.hash.slice(1)}
window.addEventListener('hashchange',tag);tag();
var K=[['Repara','gpx'],['Despeses','despeses'],['Tasques','tasques'],['Checklist','motxilla'],['Temps de ruta','ruta']],box=document.getElementById('tools');
function paint(){Array.prototype.forEach.call(box.children,function(b){var t=b.textContent;K.forEach(function(k){if(t.indexOf(k[0])>=0)b.dataset.k=k[1]});if(b.children[0])b.dataset.e=b.children[0].textContent})}
if(box){paint();new MutationObserver(paint).observe(box,{childList:true})}
var hi=new Date().getHours(),gp=document.querySelector('#home>p.mu');if(gp)gp.textContent=(hi<13?'Bon dia':hi<20?'Bona tarda':'Bona nit')+' 👋 Què necessites avui?';

/* ---- botó d'actualitzar: fa de F5 sense perdre el que tens a mig fer ----
   Les dades de les eines ja es desen soles al dispositiu. El que no es desa (els camps que tens
   escrits, p. ex. a «Temps de ruta») es guarda un moment i es retorna en recarregar. */
var RK='navalla-restore',UK='navalla-updated';
function gpxLoaded(){return document.querySelectorAll('#list .frag').length>0}
function snapshot(){
 var o={};
 Array.prototype.forEach.call(document.querySelectorAll('.toolsec:not(#t-gpx) input[id],.toolsec:not(#t-gpx) select[id]'),function(e){
  if(e.type==='file')return;o[e.id]=e.type==='checkbox'?e.checked:e.value});
 try{sessionStorage.setItem(RK,JSON.stringify({t:Date.now(),y:window.scrollY,v:o}))}catch(_){}
}
try{
 var r=JSON.parse(sessionStorage.getItem(RK)||'null');sessionStorage.removeItem(RK);
 if(r&&Date.now()-r.t<60000){
  Object.keys(r.v).forEach(function(id){
   var e=document.getElementById(id);if(!e||e.type==='file')return;
   if(e.type==='checkbox')e.checked=!!r.v[id];else e.value=r.v[id];
   e.dispatchEvent(new Event('input',{bubbles:true}));
   if(e.tagName==='SELECT')e.dispatchEvent(new Event('change',{bubbles:true}));
  });
  setTimeout(function(){window.scrollTo(0,r.y||0)},50);
 }
}catch(_){}
var home=document.getElementById('home');
if(home){
 var w=document.createElement('div');w.style.cssText='text-align:center;margin:26px 0 6px';
 w.innerHTML='<button class="sm" id="upd">🔄 Actualitza l’app</button><div class="mu" id="updm" style="margin-top:8px"></div>';
 home.appendChild(w);
 var um=document.getElementById('updm'),ub=document.getElementById('upd');
 function ver(){
  var just=false;try{just=sessionStorage.getItem(UK)==='1';sessionStorage.removeItem(UK)}catch(_){}
  var base=just?'✅ Actualitzada · ':'';
  if(window.caches)caches.keys().then(function(k){var v=k.filter(function(x){return /^navalla-v/.test(x)})[0];um.textContent=base+(v?'Versió '+v.replace('navalla-',''):'')}).catch(function(){um.textContent=base});
  else um.textContent=base;
 }
 ver();
 ub.onclick=async function(){
  if(gpxLoaded()&&!confirm('Tens una ruta carregada a l’editor de GPX i no es conserva en recarregar. Si continues, l’hauràs de tornar a carregar. Vols actualitzar igualment?'))return;
  ub.disabled=true;um.textContent='Buscant actualitzacions…';
  snapshot();
  try{sessionStorage.setItem(UK,'1')}catch(_){}
  try{
   if('serviceWorker' in navigator){var reg=await navigator.serviceWorker.getRegistration();if(reg)await reg.update()}
  }catch(_){}
  location.reload();
 };
}
})();
