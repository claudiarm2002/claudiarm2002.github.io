/* Navalla · subapp «Tasques i recordatoris»
   Un botó per tasca. En marcar-la desa el dia, qui l'ha feta i a qui toca la propera vegada (rotació).
   Dades només al localStorage d'aquest dispositiu. */
(function(){
'use strict';
var KEY='navalla-tasques-v1',D=null,editing=null,open=null,sec,undoT=null,UNDO=null,flt='tot',ideas=false;
var PC=['#3f7d4e','#d2693a','#3f9484','#c39a2e','#8a5fa8','#5b7bd0'];
var IDEES=[
['🐾 Loa',[['🥫','Comprar menjar de la Loa',30],['🪣','Netejar el sorral de la Loa',14]]],
['🏠 Casa',[['🛁','Netejar el lavabo',14],['🍳','Netejar la cuina',14],['🛋️','Netejar el menjador',14],['🧹','Aspirar i fregar',30],['🧺','Rentadores',4],['🛏️','Canviar els llençols',21],['🗑️','Treure les escombraries',3],['🌱','Regar les plantes',7],['🛒','Comprar menjar',7]]]];
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function today(){return iso(new Date())}
function num(s){var p=s.split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])/864e5}
function ago(s){return Math.round(num(today())-num(s))}
function fmt(s){var p=s.split('-');return p[2]+'/'+p[1]}
function txt(n){return n<=0?'avui':n===1?'ahir':n<14?'fa '+n+' dies':n<60?'fa '+Math.round(n/7)+' setmanes':'fa '+Math.round(n/30)+' mesos'}
function last(t){return t.log.length?t.log.slice().sort().pop():null}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(_){toast('No s’ha pogut desar al dispositiu.')}}
function fixTurns(){D.tasks.forEach(function(t){if(t.asg){if(!D.people.length){t.asg=false;t.turn=null}else if(D.people.indexOf(t.turn)<0)t.turn=D.people[0]}})}
function load(){
 try{var r=localStorage.getItem(KEY);D=r?JSON.parse(r):null}catch(_){D=null}
 if(!D||!Array.isArray(D.tasks))D={v:2,tasks:[],people:[]};
 if(!Array.isArray(D.people))D.people=[];
 D.tasks.forEach(function(t){if(!t.by)t.by={};if(t.asg==null)t.asg=false;if(t.turn===undefined)t.turn=null});fixTurns();
}
function find(id){return D.tasks.filter(function(t){return t.id===id})[0]}
function info(t){var l=last(t),d=l?ago(l):null,r=null;if(t.every>0)r=d==null?9:d/t.every;return {l:l,d:d,r:r,late:t.every>0&&(d==null||d>=t.every)}}
function key(t){var i=info(t);return i.d==null?(t.every>0?1e6:1e5):(i.r!=null?i.r*1000:i.d/30*1000)}
function pcol(n){var i=D.people.indexOf(n);return PC[(i<0?0:i)%PC.length]}
function av(n){return n?'<span class="tq-av" style="background:'+pcol(n)+'">'+esc(n.charAt(0).toUpperCase())+'</span>':''}
function nextOf(n){var p=D.people;return p.length?p[(p.indexOf(n)+1)%p.length]:null}
function mk(o){var p=D.people,asg=!!o.asg&&p.length>0;return {id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),n:o.n,e:o.e||'✅',every:o.every||0,log:[],asg:asg,turn:asg?(o.turn||p[D.tasks.length%p.length]):null,by:{}}}

var CSS='\
.tq-top{display:flex;gap:8px;align-items:center;margin-bottom:12px}.tq-top .n{flex:1}\
.tq-card{background:var(--card);border:1px solid var(--bd);border-radius:18px;margin-bottom:10px;box-shadow:var(--sh);overflow:hidden}\
.tq-main{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 14px}\
.tq-main .ic{font-size:28px;width:34px;text-align:center;flex:none}.tq-main .n{flex:1;min-width:0;cursor:pointer}\
.tq-main .n b{display:block;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.tq-ok{flex:none;width:52px;height:52px;padding:0;border-radius:50%;font-size:24px;font-weight:700;background:var(--bg)}\
.tq-ok.done{background:#2e9e4f;border-color:transparent;color:#fff}\
.tq-late .tq-ok{background:#d9582b;border-color:transparent;color:#fff}\
.tq-bar{height:5px;background:var(--bg)}.tq-bar i{display:block;height:100%}\
.tq-s{font-size:13px;display:block}.tq-g{color:#2e9e4f}.tq-o{color:#e08a00}.tq-r{color:#e5532d;font-weight:600}\
.tq-turn{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;margin-top:4px;color:var(--mu)}.tq-turn b{color:var(--tx)}\
.tq-av{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;color:#fff;font-size:11px;font-weight:700}\
.tq-det{padding:4px 14px 14px;border-top:1px solid var(--bd)}\
.tq-h{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:14px}\
.tq-det input[type=date],.tq-det select,.tq-f select{font:inherit;padding:8px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--tx)}\
.tq-f{display:flex;flex-direction:column;gap:8px}.tq-f .r2{display:flex;gap:8px}.tq-chk{display:flex;gap:8px;align-items:center}\
.tq-id{display:flex;gap:6px;flex-wrap:wrap}.tq-id button{padding:6px 10px;font-size:13px;border-radius:20px}.tq-id button small{color:var(--mu);margin-left:4px}\
#tq-toast{position:fixed;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:70;max-width:676px;margin:0 auto;display:none;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:rgba(20,24,30,.95);color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.3)}\
#tq-toast.on{display:flex}#tq-toast span{flex:1}#tq-toast button{background:transparent;color:#9fe0b4;border:0;font-weight:700;padding:4px 8px}';

function build(){
 var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 sec=document.createElement('section');sec.id='t-tasques';sec.className='toolsec';sec.style.display='none';
 document.querySelector('main').appendChild(sec);
 var t=document.createElement('div');t.id='tq-toast';document.body.appendChild(t);
 sec.addEventListener('click',onClick);
}
function toast(m,undo){
 var t=$('tq-toast');t.innerHTML='<span></span>'+(undo?'<button data-a="undo">Desfés</button>':'');t.firstChild.textContent=m;t.classList.add('on');
 clearTimeout(undoT);undoT=setTimeout(function(){t.classList.remove('on');UNDO=null},5000);
}
document.addEventListener('click',function(e){
 if(e.target.closest&&e.target.closest('#tq-toast [data-a=undo]')&&UNDO){
  var u=UNDO;UNDO=null;var t=find(u.id);
  if(t){var k=t.log.lastIndexOf(u.day);if(k>=0)t.log.splice(k,1);delete t.by[u.day];t.turn=u.turn;save()}
  $('tq-toast').classList.remove('on');draw();
 }
});

function mark(id,day,who){
 var t=find(id);if(!t)return;day=day||today();
 if(t.log.indexOf(day)>=0&&day===today())return;
 var prev=t.turn,doer=who||(t.asg?t.turn:null);
 t.log.push(day);if(doer)t.by[day]=doer;
 if(t.log.length>40)t.log=t.log.sort().slice(-40);
 if(t.asg&&doer&&last(t)===day)t.turn=nextOf(doer);
 save();UNDO={id:id,day:day,turn:prev};
 toast('✓ '+t.n+' · '+(day===today()?'avui':fmt(day))+(doer?' · '+doer:''),true);draw();
}
function onClick(e){
 var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id;
 if(a==='ok')mark(id);
 else if(a==='open'){open=open===id?null:id;draw()}
 else if(a==='new'){editing='new';open=null;draw();var n=$('tq-n');if(n)n.focus()}
 else if(a==='edit'){editing=id;draw()}
 else if(a==='cancel'){editing=null;draw()}
 else if(a==='ids'){ideas=!ideas;draw()}
 else if(a==='idea'){var x=IDEES[+b.dataset.g][1][+b.dataset.i];D.tasks.push(mk({n:x[1],e:x[0],every:x[2],asg:D.people.length>0}));save();toast('＋ '+x[1]);draw()}
 else if(a==='ppl'){editing=editing==='people'?null:'people';draw()}
 else if(a==='savepeople')savePeople();
 else if(a==='flt'){flt=b.dataset.v;draw()}
 else if(a==='turn'){var t0=find(id);if(t0){t0.turn=D.people[+b.dataset.i];save();draw()}}
 else if(a==='saveform')saveForm();
 else if(a==='day'){var v=$('tq-d').value,w=$('tq-w')?$('tq-w').value:'';if(v&&v<=today())mark(id,v,w||null);else toast('Tria un dia vàlid (no pot ser futur).')}
 else if(a==='del'){var t=find(id);if(t&&confirm('Esborrar «'+t.n+'» i el seu historial?')){D.tasks=D.tasks.filter(function(x){return x.id!==id});save();open=null;editing=null;draw()}}
 else if(a==='rmlog'){var t2=find(id);if(t2){var dd=t2.log[+b.dataset.i];t2.log.splice(+b.dataset.i,1);if(t2.log.indexOf(dd)<0)delete t2.by[dd];save();draw()}}
 else if(a==='copy'){var s=JSON.stringify(D);(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(function(){toast('Còpia feta: enganxa-la en algun lloc segur.')},function(){prompt('Copia aquest text:',s)})}
 else if(a==='restore'){var r=prompt('Enganxa aquí la còpia de seguretat:');if(!r)return;try{var j=JSON.parse(r);if(!j||!Array.isArray(j.tasks))throw 0;
  D={v:2,people:Array.isArray(j.people)?j.people.map(String):[],tasks:j.tasks.map(function(t){return {id:String(t.id||Math.random()),n:String(t.n||'Tasca'),e:String(t.e||'✅'),every:+t.every||0,log:(t.log||[]).filter(function(x){return /^\d{4}-\d\d-\d\d$/.test(x)}),asg:!!t.asg,turn:t.turn||null,by:t.by&&typeof t.by==='object'?t.by:{}}})};
  fixTurns();save();draw();toast('Restaurat.')}catch(_){toast('Aquesta còpia no és vàlida.')}}
}
function savePeople(){
 var raw=$('tq-p').value.split(/[,;\n]/).map(function(s){return s.trim()}).filter(Boolean),p=[];
 raw.forEach(function(n){if(p.indexOf(n)<0&&p.length<6)p.push(n)});
 var first=!D.people.length&&p.length&&D.tasks.every(function(t){return !t.asg});
 D.people=p;
 if(first)D.tasks.forEach(function(t,i){t.asg=true;t.turn=p[i%p.length]});
 fixTurns();if(flt!=='tot'&&p.indexOf(flt)<0)flt='tot';
 save();editing=null;draw();
}
function saveForm(){
 var n=$('tq-n').value.trim(),e=$('tq-e').value.trim()||'✅',k=parseInt($('tq-k').value,10)||0,a=$('tq-a')?$('tq-a').checked:false,tn=$('tq-tn')?$('tq-tn').value:null;
 if(!n){toast('Posa-li un nom.');return}
 var o={n:n,e:e,every:k>0?k:0,asg:a,turn:a?tn:null};
 if(editing==='new')D.tasks.push(mk(o));
 else{var t=find(editing);if(t){t.n=n;t.e=e;t.every=o.every;t.asg=a&&D.people.length>0;t.turn=t.asg?tn:null}}
 save();editing=null;draw();
}
function peopleForm(){
 return '<div class="card"><h2>👥 Persones</h2><div class="tq-f"><input type="text" id="tq-p" placeholder="Noms separats per comes (p. ex. Claudia, Xènia)" value="'+esc(D.people.join(', '))+'">'+
  '<div class="mu">Fins a 6 noms. Quan marques una tasca amb ✓, es guarda qui l’ha feta i la propera vegada toca a la següent persona. Pots canviar-ho a mà dins de cada tasca.</div>'+
  '<div class="row" style="margin-bottom:0"><button class="pri" data-a="savepeople">Desa</button><button data-a="cancel">Cancel·la</button></div></div></div>';
}
function form(t){
 var pp=D.people,asg=t?t.asg:pp.length>0,tn=t?t.turn:null;
 var h='<div class="card"><h2>'+(t?'Edita la tasca':'Nova tasca')+'</h2><div class="tq-f"><div class="r2"><input type="text" id="tq-e" maxlength="4" value="'+esc(t?t.e:'✅')+'" style="width:64px;text-align:center;font-size:20px"><input type="text" id="tq-n" placeholder="Què cal fer? (p. ex. Netejar el bany)" value="'+esc(t?t.n:'')+'"></div>'+
  '<input type="text" id="tq-k" inputmode="numeric" placeholder="Cada quants dies toca? (opcional)" value="'+(t&&t.every?t.every:'')+'">';
 if(pp.length)h+='<label class="tq-chk"><input type="checkbox" id="tq-a"'+(asg?' checked':'')+'> Repartiu-vos la tasca (rotació)</label><label class="mu">Ara toca a <select id="tq-tn">'+pp.map(function(p){return '<option'+(p===tn?' selected':'')+'>'+esc(p)+'</option>'}).join('')+'</select></label>';
 else h+='<div class="mu">Amb 👥 pots afegir persones per repartir-vos les tasques.</div>';
 h+='<div class="mu">Si hi poses dies, la tasca es posarà en taronja i vermell quan s’acosti i quan toqui.</div><div class="row" style="margin-bottom:0"><button class="pri" data-a="saveform">Desa</button><button data-a="cancel">Cancel·la</button></div></div></div>';
 return h;
}
function ideasHtml(){
 var have={},any=false;D.tasks.forEach(function(t){have[t.n.toLowerCase()]=1});
 var h='<div class="card"><h2>💡 Idees de tasques</h2><p class="mu" style="margin:0 0 4px">Toca una tasca per afegir-la. Després la pots editar.</p>';
 IDEES.forEach(function(g,gi){var b='';g[1].forEach(function(x,i){if(have[x[1].toLowerCase()])return;b+='<button data-a="idea" data-g="'+gi+'" data-i="'+i+'">'+x[0]+' '+esc(x[1])+'<small>'+x[2]+' d</small></button>'});
  if(b){any=true;h+='<div class="mu" style="margin-top:10px;margin-bottom:4px">'+esc(g[0])+'</div><div class="tq-id">'+b+'</div>'}});
 if(!any)h+='<p class="mu">Ja les tens totes! 🙌</p>';
 return h+'</div>';
}
function card(t){
 var i=info(t),done=i.d===0,s,sc='',h='';
 if(i.d==null){s='Encara no l’has fet';sc=t.every?'tq-r':''}
 else{s='Fet '+txt(i.d)+' · '+fmt(i.l)+(t.by[i.l]?' · '+esc(t.by[i.l]):'');
  if(t.every){var left=t.every-i.d;
   if(left<0){s+=' · <b>toca fa '+(-left)+(left===-1?' dia':' dies')+'</b>';sc='tq-r'}
   else if(left===0){s+=' · <b>toca avui</b>';sc='tq-r'}
   else{s+=' · queden '+left+(left===1?' dia':' dies');sc=i.r>=.75?'tq-o':'tq-g'}}}
 var tn=t.asg&&t.turn?'<span class="tq-turn">'+av(t.turn)+'Toca a <b>'+esc(t.turn)+'</b></span>':'';
 h+='<div class="tq-card '+(i.late?'tq-late':'')+'"><div class="tq-main"><span class="ic">'+esc(t.e)+'</span><div class="n" data-a="open" data-id="'+t.id+'"><b>'+esc(t.n)+'</b><span class="tq-s '+sc+'">'+s+'</span>'+tn+'</div><button class="tq-ok'+(done?' done':'')+'" data-a="ok" data-id="'+t.id+'" aria-label="Fet">✓</button></div>';
 if(t.every){var p=i.r==null?1:Math.min(1,i.r);h+='<div class="tq-bar"><i style="width:'+p*100+'%;background:'+(i.r>=1?'#e5532d':i.r>=.75?'#fb8c00':'#2e9e4f')+'"></i></div>'}
 if(open===t.id){
  var hist=t.log.slice().sort().reverse();
  h+='<div class="tq-det">';
  if(t.asg&&D.people.length)h+='<div class="mu" style="margin:8px 0 4px">Ara toca a:</div><div class="tq-id">'+D.people.map(function(p,k){return '<button class="'+(p===t.turn?'pri':'')+'" data-a="turn" data-id="'+t.id+'" data-i="'+k+'">'+esc(p)+'</button>'}).join('')+'</div>';
  h+='<div class="mu" style="margin:10px 0 2px">Historial'+(t.every?' · cada '+t.every+' dies':'')+'</div>';
  if(!hist.length)h+='<div class="mu">Encara res.</div>';
  hist.slice(0,6).forEach(function(d){var idx=t.log.indexOf(d);h+='<div class="tq-h"><span>'+fmt(d)+' · '+txt(ago(d))+(t.by[d]?' · '+esc(t.by[d]):'')+'</span><button class="sm" data-a="rmlog" data-id="'+t.id+'" data-i="'+idx+'" aria-label="Treu">✕</button></div>'});
  if(hist.length>1){var gs=[];for(var k=0;k<hist.length-1;k++)gs.push(num(hist[k])-num(hist[k+1]));var avg=Math.round(gs.reduce(function(a,b){return a+b},0)/gs.length);h+='<div class="mu" style="margin-top:4px">Mitjana entre vegades: cada '+avg+' dies</div>'}
  h+='<div class="row"><span class="mu">L’ha fet algú un altre dia?</span><input type="date" id="tq-d" max="'+today()+'" value="'+today()+'">'+
   (D.people.length?'<select id="tq-w"><option value="">Qui?</option>'+D.people.map(function(p){return '<option>'+esc(p)+'</option>'}).join('')+'</select>':'')+
   '<button class="sm" data-a="day" data-id="'+t.id+'">Desa</button></div>'+
   '<div class="row" style="margin-bottom:0"><button class="sm" data-a="edit" data-id="'+t.id+'">✏️ Edita</button><button class="sm" data-a="del" data-id="'+t.id+'">🗑️ Esborra</button></div></div>';
 }
 return h+'</div>';
}
function draw(){
 if(!D)load();
 var all=D.tasks.slice().sort(function(a,b){return key(b)-key(a)}),late=all.filter(function(t){return info(t).late}).length;
 var tasks=all.filter(function(t){return flt==='tot'||t.turn===flt});
 var h='<div class="tq-top"><span class="n">'+(late?'<b style="color:#e5532d">🔔 '+late+(late===1?' cosa toca':' coses toquen')+'</b>':'<span class="mu">'+(all.length?'Tot al dia ✨':'Cap tasca encara.')+'</span>')+'</span>'+
  '<button class="sm" data-a="ppl">👥'+(D.people.length?' '+D.people.length:'')+'</button><button class="sm" data-a="ids">💡</button><button class="pri sm" data-a="new">＋ Nova</button></div>';
 if(editing==='people')h+=peopleForm();
 if(editing==='new')h+=form(null);
 if(ideas||(!all.length&&editing!=='new'&&editing!=='people'))h+=ideasHtml();
 if(D.people.length>1&&all.length)h+='<div class="row" style="margin-top:0"><div class="seg"><button data-a="flt" data-v="tot" class="'+(flt==='tot'?'on':'')+'">Tot</button>'+D.people.map(function(p){return '<button data-a="flt" data-v="'+esc(p)+'" class="'+(flt===p?'on':'')+'">'+esc(p)+'</button>'}).join('')+'</div></div>';
 tasks.forEach(function(t){h+=editing===t.id?form(t):card(t)});
 if(all.length)h+='<p class="mu" style="margin-top:16px">Les dades es guarden només en aquest dispositiu. <button class="sm" data-a="copy">Còpia de seguretat</button> <button class="sm" data-a="restore">Restaura</button></p>';
 sec.innerHTML=h;
}
function sync(){if(!sec)return;if(location.hash.slice(1)==='tasques'){sec.style.display='';draw()}}
build();load();draw();sync();
window.addEventListener('hashchange',sync);
document.addEventListener('visibilitychange',function(){if(!document.hidden&&sec&&sec.style.display!=='none'&&!editing)draw()});
})();
