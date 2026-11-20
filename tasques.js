/* Navalla · subapp «Tasques i recordatoris»
   Un botó per tasca (netejar el bany, regar les plantes…). En marcar-la, desa el dia
   i t'ensenya quant fa que no la fas. Dades només al localStorage d'aquest dispositiu. */
(function(){
'use strict';
var KEY='navalla-tasques-v1',D=null,editing=null,open=null,sec,undoT=null;
var IDEES=[['🌱','Regar les plantes',7],['🛁','Netejar el bany',7],['🧹','Aspirar i fregar',7],['🛏️','Canviar els llençols',14],['🍳','Netejar la cuina a fons',14],['🧊','Netejar la nevera',30],['🪴','Abonar les plantes',30],['🪟','Netejar els vidres',60],['🗑️','Treure les escombraries',3]];
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
function load(){try{var r=localStorage.getItem(KEY);D=r?JSON.parse(r):{v:1,tasks:[]}}catch(_){D={v:1,tasks:[]}}}
function find(id){return D.tasks.filter(function(t){return t.id===id})[0]}
function info(t){ // estat de la tasca
 var l=last(t),d=l?ago(l):null,r=null;
 if(t.every>0)r=d==null?9:d/t.every;
 return {l:l,d:d,r:r,late:t.every>0&&(d==null||d>=t.every)};
}
function key(t){var i=info(t);return i.d==null?(t.every>0?1e6:1e5):(i.r!=null?i.r*1000:i.d/30*1000)}

var CSS='\
.tq-top{display:flex;gap:8px;align-items:center;margin-bottom:12px}.tq-top .n{flex:1}\
.tq-card{background:var(--card);border:1px solid var(--bd);border-radius:18px;margin-bottom:10px;box-shadow:var(--sh);overflow:hidden}\
.tq-main{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 14px}\
.tq-main .ic{font-size:28px;width:34px;text-align:center;flex:none}.tq-main .n{flex:1;min-width:0;cursor:pointer}\
.tq-main .n b{display:block;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.tq-ok{flex:none;width:52px;height:52px;padding:0;border-radius:50%;font-size:24px;font-weight:700;background:var(--bg)}\
.tq-ok.done{background:#2e9e4f;border-color:transparent;color:#fff}\
.tq-late .tq-ok{background:linear-gradient(135deg,#ff6a2b,#fc4c02);border-color:transparent;color:#fff}\
.tq-bar{height:5px;background:var(--bg)}.tq-bar i{display:block;height:100%}\
.tq-s{font-size:13px}.tq-g{color:#2e9e4f}.tq-o{color:#e08a00}.tq-r{color:#e5532d;font-weight:600}\
.tq-det{padding:4px 14px 14px;border-top:1px solid var(--bd)}\
.tq-h{display:flex;justify-content:space-between;padding:5px 0;font-size:14px}\
.tq-det input[type=date]{font:inherit;padding:8px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--tx)}\
.tq-f{display:flex;flex-direction:column;gap:8px}.tq-f .r2{display:flex;gap:8px}\
.tq-id{display:flex;gap:6px;flex-wrap:wrap}.tq-id button{padding:6px 10px;font-size:13px;border-radius:20px}\
#tq-toast{position:fixed;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:70;max-width:676px;margin:0 auto;display:none;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:rgba(20,24,30,.95);color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.3)}\
#tq-toast.on{display:flex}#tq-toast span{flex:1}#tq-toast button{background:transparent;color:#ffb38f;border:0;font-weight:700;padding:4px 8px}';

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
var UNDO=null;
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#tq-toast [data-a=undo]')&&UNDO){var u=UNDO;UNDO=null;var t=find(u.id);if(t){var k=t.log.lastIndexOf(u.day);if(k>=0)t.log.splice(k,1);save()}$('tq-toast').classList.remove('on');draw()}});

function mark(id,day){
 var t=find(id);if(!t)return;day=day||today();
 if(t.log.indexOf(day)>=0&&day===today())return;
 t.log.push(day);if(t.log.length>40)t.log=t.log.sort().slice(-40);
 save();UNDO={id:id,day:day};toast('✓ '+t.n+' · '+(day===today()?'avui':fmt(day)),true);draw();
}
function onClick(e){
 var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id;
 if(a==='ok')mark(id);
 else if(a==='open'){open=open===id?null:id;draw()}
 else if(a==='new'){editing='new';open=null;draw();if(b.dataset.pre!=null)fillIdea(+b.dataset.pre);var n=$('tq-n');if(n)n.focus()}
 else if(a==='edit'){editing=id;draw()}
 else if(a==='cancel'){editing=null;draw()}
 else if(a==='idea'){fillIdea(+b.dataset.i)}
 else if(a==='saveform')saveForm();
 else if(a==='day'){var v=$('tq-d').value;if(v&&v<=today())mark(id,v);else toast('Tria un dia vàlid (no pot ser futur).')}
 else if(a==='del'){var t=find(id);if(t&&confirm('Esborrar «'+t.n+'» i el seu historial?')){D.tasks=D.tasks.filter(function(x){return x.id!==id});save();open=null;editing=null;draw()}}
 else if(a==='rmlog'){var t2=find(id);if(t2){t2.log.splice(+b.dataset.i,1);save();draw()}}
 else if(a==='copy'){var s=JSON.stringify(D);(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(function(){toast('Còpia feta: enganxa-la en algun lloc segur.')},function(){prompt('Copia aquest text:',s)})}
 else if(a==='restore'){var r=prompt('Enganxa aquí la còpia de seguretat:');if(!r)return;try{var j=JSON.parse(r);if(!j||!Array.isArray(j.tasks))throw 0;D={v:1,tasks:j.tasks.map(function(t){return {id:String(t.id||Math.random()),n:String(t.n||'Tasca'),e:String(t.e||'✅'),every:+t.every||0,log:(t.log||[]).filter(function(x){return /^\d{4}-\d\d-\d\d$/.test(x)})}})};save();draw();toast('Restaurat.')}catch(_){toast('Aquesta còpia no és vàlida.')}}
}
function fillIdea(i){var x=IDEES[i];$('tq-e').value=x[0];$('tq-n').value=x[1];$('tq-k').value=x[2]}
function saveForm(){
 var n=$('tq-n').value.trim(),e=$('tq-e').value.trim()||'✅',k=parseInt($('tq-k').value,10)||0;
 if(!n){toast('Posa-li un nom.');return}
 if(editing==='new')D.tasks.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),n:n,e:e,every:k>0?k:0,log:[]});
 else{var t=find(editing);if(t){t.n=n;t.e=e;t.every=k>0?k:0}}
 save();editing=null;draw();
}
function form(t){
 var h='<div class="card"><h2>'+(t?'Edita la tasca':'Nova tasca')+'</h2><div class="tq-f"><div class="r2"><input type="text" id="tq-e" maxlength="4" value="'+esc(t?t.e:'✅')+'" style="width:64px;text-align:center;font-size:20px"><input type="text" id="tq-n" placeholder="Què cal fer? (p. ex. Netejar el bany)" value="'+esc(t?t.n:'')+'"></div>'+
  '<input type="text" id="tq-k" inputmode="numeric" placeholder="Cada quants dies toca? (opcional)" value="'+(t&&t.every?t.every:'')+'">'+
  '<div class="mu">Si hi poses dies, la tasca es posarà en taronja i vermell quan s’acosti i quan toqui.</div>';
 if(!t){h+='<div class="mu">Idees:</div><div class="tq-id">'+IDEES.map(function(x,i){return '<button data-a="idea" data-i="'+i+'">'+x[0]+' '+esc(x[1])+'</button>'}).join('')+'</div>'}
 return h+'<div class="row" style="margin-bottom:0"><button class="pri" data-a="saveform">Desa</button><button data-a="cancel">Cancel·la</button></div></div></div>';
}
function card(t){
 var i=info(t),cls=i.late?'tq-late':'',done=i.d===0,h='';
 var s,sc='';
 if(i.d==null){s='Encara no l’has fet';sc=t.every?'tq-r':''}
 else{s='Fet '+txt(i.d)+' · '+fmt(i.l);if(t.every){var left=t.every-i.d;
   if(left<0){s+=' · <b>toca fa '+(-left)+(left===-1?' dia':' dies')+'</b>';sc='tq-r'}
   else if(left===0){s+=' · <b>toca avui</b>';sc='tq-r'}
   else{s+=' · queden '+left+(left===1?' dia':' dies');sc=i.r>=.75?'tq-o':'tq-g'}}}
 h+='<div class="tq-card '+cls+'"><div class="tq-main"><span class="ic">'+esc(t.e)+'</span><div class="n" data-a="open" data-id="'+t.id+'"><b>'+esc(t.n)+'</b><span class="tq-s '+sc+'">'+s+'</span></div><button class="tq-ok'+(done?' done':'')+'" data-a="ok" data-id="'+t.id+'" aria-label="Fet">✓</button></div>';
 if(t.every){var p=i.r==null?1:Math.min(1,i.r);h+='<div class="tq-bar"><i style="width:'+p*100+'%;background:'+(i.r>=1?'#e5532d':i.r>=.75?'#fb8c00':'#2e9e4f')+'"></i></div>'}
 if(open===t.id){
  var hist=t.log.slice().sort().reverse();
  h+='<div class="tq-det"><div class="mu" style="margin:8px 0 2px">Historial'+(t.every?' · cada '+t.every+' dies':'')+'</div>';
  if(!hist.length)h+='<div class="mu">Encara res.</div>';
  hist.slice(0,6).forEach(function(d){var idx=t.log.indexOf(d);h+='<div class="tq-h"><span>'+fmt(d)+' · '+txt(ago(d))+'</span><button class="sm" data-a="rmlog" data-id="'+t.id+'" data-i="'+idx+'" aria-label="Treu">✕</button></div>'});
  if(hist.length>1){var gs=[];for(var k=0;k<hist.length-1;k++)gs.push(num(hist[k])-num(hist[k+1]));var avg=Math.round(gs.reduce(function(a,b){return a+b},0)/gs.length);h+='<div class="mu" style="margin-top:4px">Mitjana entre vegades: cada '+avg+' dies</div>'}
  h+='<div class="row"><span class="mu">L’has fet un altre dia?</span><input type="date" id="tq-d" max="'+today()+'" value="'+today()+'"><button class="sm" data-a="day" data-id="'+t.id+'">Desa</button></div>'+
   '<div class="row" style="margin-bottom:0"><button class="sm" data-a="edit" data-id="'+t.id+'">✏️ Edita</button><button class="sm" data-a="del" data-id="'+t.id+'">🗑️ Esborra</button></div></div>';
 }
 return h+'</div>';
}
function draw(){
 if(!D)load();
 var h='',tasks=D.tasks.slice().sort(function(a,b){return key(b)-key(a)}),late=tasks.filter(function(t){return info(t).late}).length;
 h+='<div class="tq-top"><span class="n">'+(late?'<b style="color:#e5532d">🔔 '+late+(late===1?' cosa toca':' coses toquen')+'</b>':'<span class="mu">'+(tasks.length?'Tot al dia ✨':'Cap tasca encara.')+'</span>')+'</span><button class="pri sm" data-a="new">＋ Nova tasca</button></div>';
 if(editing==='new')h+=form(null);
 if(!tasks.length&&editing!=='new')h+='<div class="card"><p class="mu" style="margin:0 0 8px">Crea la teva primera tasca i marca-la amb ✓ cada vegada que la facis: guardaré el dia i t’avisaré visualment quan toqui repetir-la. Idees:</p><div class="tq-id">'+IDEES.map(function(x,i){return '<button data-a="new" data-pre="'+i+'">'+x[0]+' '+esc(x[1])+'</button>'}).join('')+'</div></div>';
 tasks.forEach(function(t){h+=editing===t.id?form(t):card(t)});
 if(tasks.length)h+='<p class="mu" style="margin-top:16px">Les dades es guarden només en aquest dispositiu. <button class="sm" data-a="copy">Còpia de seguretat</button> <button class="sm" data-a="restore">Restaura</button></p>';
 sec.innerHTML=h;
}
function sync(){if(!sec)return;if(location.hash.slice(1)==='tasques'){sec.style.display='';draw()}}
build();load();draw();sync();
window.addEventListener('hashchange',sync);
document.addEventListener('visibilitychange',function(){if(!document.hidden&&sec&&sec.style.display!=='none'&&!editing)draw()});
})();
