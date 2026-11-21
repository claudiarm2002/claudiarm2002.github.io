/* Navalla · tema: logo, títol per eina i rajoles de colors (no toca la lògica de les eines) */
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
})();
