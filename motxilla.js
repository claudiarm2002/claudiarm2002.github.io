/* Navalla · subapp «Checklist de motxilla»
   Tria el tipus de sortida, genera la llista i ves fitxant: suma el pes del que ja tens a la motxilla.
   Pesos aproximats i editables. Dades només al localStorage d'aquest dispositiu.
   Item: [categoria, nom, grams, flag]  flag: 'p' = ho portes posat (no compta pes), 'r' = recordatori (sense pes) */
(function(){
'use strict';
var KEY='navalla-motxilla-v2',sec,S,ORDER=['dia','lliure','guardat','alpi','muntanya','custom'];
var PRE='Abans de sortir';
var ACT={
 dia:{e:'🥾',n:'Excursió de dia',items:[
  [PRE,'Mirar la previsió del temps',0,'r'],[PRE,'Avisar algú de la ruta i l’hora de tornada',0,'r'],
  ['Menjar i beure','Aigua (1,5 L)',1500],['Menjar i beure','Dinar',400],['Menjar i beure','Fruita i snacks',250],['Menjar i beure','Barretes energètiques',120],
  ['Roba','Jaqueta impermeable',350],['Roba','Forro polar',350],['Roba','Samarreta de recanvi',150],['Roba','Mitjons de recanvi',80],['Roba','Guants + gorro',150],['Roba','Gorra o capell',60],
  ['Seguretat','Farmaciola',150],['Seguretat','Manta d’emergència + xiulet',100],['Seguretat','Frontal',90],['Seguretat','Mapa / track descarregat',50],['Seguretat','Mòbil + bateria externa',300],['Seguretat','Navalla / multieina',80],
  ['Altres','Crema solar + protector labial',100],['Altres','Ulleres de sol',40],['Altres','Paper i mocadors',40],['Altres','Bossa d’escombraries',20],['Altres','DNI, targeta i efectiu',50],['Altres','Bastons',500]]},
 lliure:{e:'⛺',n:'2 dies · refugi lliure',items:[
  [PRE,'Mirar la previsió del temps',0,'r'],[PRE,'Avisar algú de la ruta, el refugi i l’hora de tornada',0,'r'],[PRE,'Comprovar l’estat del refugi (aigua propera, capacitat)',0,'r'],
  ['Dormir','Sac de dormir (confort 0 °C)',1200],['Dormir','Matalàs aïllant',500],['Dormir','Coixí inflable',70],['Dormir','Tapons per a les orelles',10],
  ['Menjar i beure','Fogonet',100],['Menjar i beure','Cartutx de gas',250],['Menjar i beure','Olla + got + cullera',250],['Menjar i beure','Encenedor + llumins',30],['Menjar i beure','Aigua (1,5 L)',1500],['Menjar i beure','Filtre d’aigua',100],
  ['Menjar i beure','Dinar dia 1',400],['Menjar i beure','Sopar liofilitzat',150],['Menjar i beure','Esmorzar',200],['Menjar i beure','Dinar dia 2',400],['Menjar i beure','Snacks i barretes',400],
  ['Roba','Jaqueta impermeable',350],['Roba','Forro polar',350],['Roba','Jaqueta de plomes lleugera',350],['Roba','Roba tèrmica per dormir',300],['Roba','Samarreta de recanvi',150],['Roba','Mitjons de recanvi (×2)',160],['Roba','Guants + gorro',150],['Roba','Gorra o capell',60],['Roba','Xancles / sabates de refugi',250],
  ['Seguretat','Farmaciola',200],['Seguretat','Manta d’emergència + xiulet',100],['Seguretat','Frontal',120],['Seguretat','Mapa / track descarregat',50],['Seguretat','Mòbil + bateria externa',300],['Seguretat','Navalla / multieina',80],
  ['Altres','Higiene (raspall, paper, tovallola ràpida)',200],['Altres','Crema solar + protector labial',100],['Altres','Ulleres de sol',40],['Altres','Bossa d’escombraries (ho baixes tot)',30],['Altres','DNI, targeta i efectiu',50],['Altres','Bastons',500]]},
 guardat:{e:'🛖',n:'2 dies · refugi guardat',items:[
  [PRE,'Reserva del refugi confirmada (sopar i esmorzar)',0,'r'],[PRE,'Mirar la previsió del temps',0,'r'],[PRE,'Avisar algú de la ruta i l’hora de tornada',0,'r'],
  ['Dormir','Sac llençol',150],['Dormir','Tapons per a les orelles',10],['Dormir','Xancles / sabates de refugi',250],
  ['Menjar i beure','Aigua (1,5 L)',1500],['Menjar i beure','Dinar dia 1',400],['Menjar i beure','Dinar dia 2',400],['Menjar i beure','Snacks i barretes',400],
  ['Roba','Jaqueta impermeable',350],['Roba','Forro polar',350],['Roba','Jaqueta de plomes lleugera',350],['Roba','Roba còmoda per al refugi',350],['Roba','Samarreta de recanvi',150],['Roba','Mitjons de recanvi (×2)',160],['Roba','Guants + gorro',150],['Roba','Gorra o capell',60],
  ['Seguretat','Farmaciola',150],['Seguretat','Manta d’emergència + xiulet',100],['Seguretat','Frontal',90],['Seguretat','Mapa / track descarregat',50],['Seguretat','Mòbil + bateria externa',300],['Seguretat','Navalla / multieina',80],
  ['Altres','Higiene (raspall, paper, tovallola ràpida)',200],['Altres','Crema solar + protector labial',100],['Altres','Ulleres de sol',40],['Altres','Bossa d’escombraries',20],['Altres','DNI, carnet federat i efectiu per pagar',60],['Altres','Bastons',500]]},
 alpi:{e:'⛷️',n:'Esquí alpí',items:[
  [PRE,'Comprar o carregar el forfet',0,'r'],[PRE,'Mirar l’estat de les pistes i el temps',0,'r'],
  ['Equip posat','Esquís + fixacions',0,'p'],['Equip posat','Botes d’esquí',0,'p'],['Equip posat','Bastons',0,'p'],['Equip posat','Casc',0,'p'],['Equip posat','Màscara',0,'p'],['Equip posat','Guants',0,'p'],
  ['Roba posada','Pantaló i jaqueta d’esquí',0,'p'],['Roba posada','Primera capa tèrmica',0,'p'],['Roba posada','Mitjons d’esquí',0,'p'],['Roba posada','Buff / coll',0,'p'],
  ['A la motxilla','Jaqueta de plomes lleugera',350],['A la motxilla','Guants de recanvi',120],['A la motxilla','Capa tèrmica de recanvi',200],['A la motxilla','Aigua o termo',600],['A la motxilla','Dinar',400],['A la motxilla','Snacks i barretes',250],
  ['A la motxilla','Crema solar + protector labial',100],['A la motxilla','Ulleres de sol',40],['A la motxilla','Mòbil + bateria externa',250],['A la motxilla','Forfet, DNI i targeta',50],['A la motxilla','Farmaciola',100],['A la motxilla','Mocadors',30],
  ['Per després','Roba seca per al cotxe (samarreta, mitjons)',250],['Per després','Bossa per a la roba mullada',20]]},
 muntanya:{e:'🎿',n:'Esquí de muntanya',items:[
  [PRE,'Consultar el butlletí de perill d’allaus',0,'r'],[PRE,'Mirar la previsió del temps i la neu',0,'r'],[PRE,'Avisar algú de la ruta i l’hora de tornada',0,'r'],[PRE,'Carregar i provar l’ARVA',0,'r'],
  ['Equip posat','Esquís + fixacions de travessa',0,'p'],['Equip posat','Botes (mode caminar)',0,'p'],['Equip posat','Bastons telescòpics',0,'p'],['Equip posat','Casc',0,'p'],['Equip posat','ARVA (sobre el cos)',0,'p'],
  ['Seguretat de neu','Pala',600],['Seguretat de neu','Sonda',250],['Seguretat de neu','Arpons / ganivets',380],['Seguretat de neu','Piolet lleuger',250],['Seguretat de neu','Grampons lleugers',600],
  ['Material','Pells de foca',480],['Material','Kit de reparació (cinta, cordino, tornavís)',200],['Material','Ulleres de ventisca',120],
  ['Roba','Jaqueta de plomes lleugera',450],['Roba','Jaqueta impermeable',450],['Roba','Capa tèrmica de recanvi',200],['Roba','Guants de recanvi',120],['Roba','Guants fins',60],['Roba','Buff / coll',60],['Roba','Mitjons de recanvi',80],
  ['Menjar i beure','Termo amb te calent (0,75 L)',900],['Menjar i beure','Aigua (1 L)',1000],['Menjar i beure','Dinar',400],['Menjar i beure','Snacks i barretes',300],
  ['Seguretat','Farmaciola',250],['Seguretat','Manta d’emergència + xiulet',100],['Seguretat','Frontal',90],['Seguretat','Mapa / track descarregat',50],['Seguretat','Mòbil + bateria externa',300],['Seguretat','Navalla / multieina',80],
  ['Altres','Crema solar + protector labial',100],['Altres','DNI, targeta i efectiu',50]]},
 custom:{e:'✨',n:'Personalitzable',items:[]}
};
var EXTRES=[['Dormir','Tenda lleugera (3 estacions)',1600],['Dormir','Tarp / bivac d’emergència',400],['Menjar i beure','Pastilles potabilitzadores',30],['Menjar i beure','Bidó plegable (2 L)',60],['Material','Càmera',450],['Material','Prismàtics',250],['Material','Llibre o e-reader',250],['Material','Cinta americana + cordino',70],['Material','Paraigua petit',250],['Material','Bateria solar plegable',350],['Roba','Pantaló impermeable',300],['Roba','Calçotets i samarreta de recanvi',150]];
var CAT=null;
function catalog(){
 if(CAT)return CAT;var seen={},o=[];
 ORDER.forEach(function(a){ACT[a].items.forEach(function(x){if(x[3]||x[0]===PRE||seen[x[1].toLowerCase()])return;seen[x[1].toLowerCase()]=1;o.push({cat:x[0],n:x[1],g:x[2]})})});
 EXTRES.forEach(function(x){if(!seen[x[1].toLowerCase()]){seen[x[1].toLowerCase()]=1;o.push({cat:x[0],n:x[1],g:x[2]})}});
 return CAT=o;
}
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function kg(g){return (g/1000).toFixed(1).replace('.',',')+' kg'}
function wt(g){return g>=1000?kg(g):Math.round(g)+' g'}
function load(){
 S={act:'dia',w:{},tick:{},add:{},off:{},filt:'tot',edit:false,sug:false};
 try{var r=JSON.parse(localStorage.getItem(KEY)||'null');if(r){['act','w','tick','add','off'].forEach(function(k){if(r[k]!=null)S[k]=r[k]});if(!ACT[S.act])S.act='dia'}}catch(_){}
 S.sug=S.act==='custom';
}
function save(){try{localStorage.setItem(KEY,JSON.stringify({act:S.act,w:S.w,tick:S.tick,add:S.add,off:S.off}))}catch(_){}}
function list(a){
 var off=S.off[a]||[],out=[];
 ACT[a].items.forEach(function(x){var id=a+':'+x[1];if(off.indexOf(id)>=0)return;out.push({id:id,cat:x[0],n:x[1],f:x[3]||'',g:x[3]?0:(S.w[id]!=null?S.w[id]:x[2])})});
 (S.add[a]||[]).forEach(function(x){out.push({id:x.id,cat:x.cat,n:x.n,f:'',g:S.w[x.id]!=null?S.w[x.id]:x.g,c:1})});
 return out;
}
function cats(items){var o=[],m={};items.forEach(function(it){if(!m[it.cat]){m[it.cat]=[];o.push(it.cat)}m[it.cat].push(it)});return {order:o,map:m}}

var CSS='\
.mb-acts{display:flex;gap:6px;overflow-x:auto;padding:2px 0 10px;scrollbar-width:none}.mb-acts::-webkit-scrollbar{display:none}\
.mb-acts button{flex:none;padding:8px 13px;border-radius:20px;font-size:14px;white-space:nowrap}.mb-acts button.on{background:var(--ac);border-color:transparent;color:#fff;font-weight:600}\
.mb-sum{position:sticky;top:6px;z-index:5}\
.mb-big{font-size:30px;font-weight:700;letter-spacing:-.5px}.mb-big small{font-size:14px;font-weight:400;color:var(--mu);letter-spacing:0}\
.mb-bar{height:10px;border-radius:8px;background:var(--bg);overflow:hidden;margin:8px 0 6px}.mb-bar i{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#2e9e4f,#5bc27a);transition:width .25s}\
.mb-cat{margin-bottom:12px}.mb-cat h3{font-size:14px;margin:0 0 4px;display:flex;gap:8px;align-items:baseline}.mb-cat h3 span{margin-left:auto;font-weight:400}\
.mb-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-top:1px solid var(--bd);cursor:pointer;user-select:none}.mb-row:first-of-type{border-top:0}\
.mb-bx{flex:none;width:26px;height:26px;border-radius:8px;border:2px solid var(--bd);display:grid;place-items:center;color:#fff;font-size:15px;font-weight:700}\
.mb-row.on .mb-bx{background:#2e9e4f;border-color:#2e9e4f}.mb-row.on .t{color:var(--mu);text-decoration:line-through}\
.mb-row .t{flex:1;min-width:0}.mb-w{flex:none;padding:4px 9px;font-size:13px;border-radius:20px;background:var(--bg);border:0;font-variant-numeric:tabular-nums;color:var(--tx)}span.mb-w{color:var(--mu)}\
.mb-x{flex:none;padding:2px 9px;border:0;background:transparent;color:#e5532d;font-size:18px}\
.mb-f{display:flex;flex-direction:column;gap:8px}.mb-f .r2{display:flex;gap:8px}.mb-f select{width:100%}\
.mb-tag{font-size:11px;padding:1px 7px;border-radius:20px;background:var(--bg);color:var(--mu);margin-left:6px}\
.mb-sg{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}.mb-sg button{padding:6px 10px;font-size:13px;border-radius:20px}.mb-sg button small{color:var(--mu);margin-left:4px}';

function build(){
 var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 sec=document.createElement('section');sec.id='t-motxilla';sec.className='toolsec';sec.style.display='none';
 document.querySelector('main').appendChild(sec);sec.addEventListener('click',onClick);
}
function parseG(s){s=String(s||'').trim().toLowerCase().replace(',','.');var n=parseFloat(s);if(isNaN(n)||n<0)return null;return Math.round(/kg/.test(s)?n*1000:n)}
function onClick(e){
 var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id,act=S.act;
 if(a==='act'){S.act=b.dataset.v;S.edit=false;S.sug=S.act==='custom';save()}
 else if(a==='tick'){var T=S.tick[act]||(S.tick[act]={});if(T[id])delete T[id];else T[id]=1;save()}
 else if(a==='w'){var it=list(act).filter(function(x){return x.id===id})[0];if(!it)return;var v=prompt('Pes de «'+it.n+'» (en grams, o en kg si hi poses «kg»):',it.g);if(v==null)return;var g=parseG(v);if(g==null)return;S.w[id]=g;save()}
 else if(a==='rm'){var c=(S.add[act]||[]).filter(function(x){return x.id===id});if(c.length)S.add[act]=S.add[act].filter(function(x){return x.id!==id});else(S.off[act]||(S.off[act]=[])).push(id);if(S.tick[act])delete S.tick[act][id];save()}
 else if(a==='filt'){S.filt=b.dataset.v}
 else if(a==='edit'){S.edit=!S.edit}
 else if(a==='sug'){S.sug=!S.sug}
 else if(a==='sadd'){var s=catalog()[+b.dataset.i];if(s)(S.add[act]||(S.add[act]=[])).push({id:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,4),cat:s.cat,n:s.n,g:s.g});save()}
 else if(a==='clear'){S.tick[act]={};save()}
 else if(a==='reset'){if(!confirm('Tornar a la llista original d’aquesta sortida? Es perdran els pesos canviats, les coses afegides i les que has tret.'))return;S.tick[act]={};S.off[act]=[];S.add[act]=[];var pre=act+':';Object.keys(S.w).forEach(function(k){if(k.indexOf(pre)===0)delete S.w[k]});save()}
 else if(a==='addit'){
  var n=$('mb-n').value.trim(),g2=parseG($('mb-g').value),c2=$('mb-c').value;
  if(!n){$('mb-n').focus();return}if(g2==null){$('mb-g').focus();return}
  (S.add[act]||(S.add[act]=[])).push({id:'c'+Date.now().toString(36),cat:c2,n:n,g:g2});save()}
 draw();
}
function sugHtml(items){
 var have={};items.forEach(function(it){have[it.n.toLowerCase()]=1});
 var by={},order=[];
 catalog().forEach(function(s,i){if(have[s.n.toLowerCase()])return;if(!by[s.cat]){by[s.cat]=[];order.push(s.cat)}by[s.cat].push([s,i])});
 if(!order.length)return '<div class="card"><p class="mu" style="margin:0">Ja tens al llistat tots els suggeriments. 🙌</p></div>';
 var h='<div class="card"><h2>💡 Suggeriments</h2><p class="mu" style="margin:0 0 6px">Toca una cosa per afegir-la a la llista (després en pots ajustar el pes).</p>';
 order.forEach(function(c){h+='<div class="mu" style="margin-top:6px">'+esc(c)+'</div><div class="mb-sg">'+by[c].map(function(p){return '<button data-a="sadd" data-i="'+p[1]+'">＋ '+esc(p[0].n)+'<small>'+wt(p[0].g)+'</small></button>'}).join('')+'</div>'});
 return h+'</div>';
}
function draw(){
 var a=S.act,items=list(a),T=S.tick[a]||{},tot=0,got=0,n=0,k=0;
 items.forEach(function(it){tot+=it.g;n++;if(T[it.id]){got+=it.g;k++}});
 var h='<div class="mb-acts">'+ORDER.map(function(x){return '<button data-a="act" data-v="'+x+'" class="'+(x===a?'on':'')+'">'+ACT[x].e+' '+ACT[x].n+'</button>'}).join('')+'</div>';
 h+='<div class="card mb-sum"><div class="mb-big">'+kg(got)+' <small>a la motxilla · de '+kg(tot)+'</small></div><div class="mb-bar"><i style="width:'+(tot?got/tot*100:0)+'%"></i></div>'+
  '<div class="mu">'+k+' de '+n+' coses fitxades · falta '+kg(tot-got)+'</div></div>';
 h+='<div class="row" style="margin-top:0"><div class="seg"><button data-a="filt" data-v="tot" class="'+(S.filt==='tot'?'on':'')+'">Tot</button><button data-a="filt" data-v="falta" class="'+(S.filt==='falta'?'on':'')+'">Falta</button></div><button class="sm" data-a="sug" style="'+(S.sug?'background:#fb8c00;color:#fff':'')+'">💡</button><button class="sm" data-a="edit" style="'+(S.edit?'background:#fb8c00;color:#fff':'')+'">✏️ Edita</button></div>';
 if(S.edit)h+='<div style="margin-bottom:10px;padding:8px 12px;border-radius:12px;background:var(--card);font-size:13px">Toca el pes per canviar-lo. Amb ✕ treus una cosa. A sota en pots afegir de noves.</div>';
 if(S.sug)h+=sugHtml(items);
 var G=cats(items),shown=0;
 G.order.forEach(function(c){
  var its=G.map[c].filter(function(it){return S.filt==='tot'||!T[it.id]});if(!its.length)return;shown+=its.length;
  var ct=0,cg=0;G.map[c].forEach(function(it){ct+=it.g;if(T[it.id])cg+=it.g});
  h+='<div class="card mb-cat"><h3>'+esc(c)+'<span class="mu">'+(ct?kg(cg)+' / '+kg(ct):'')+'</span></h3>';
  its.forEach(function(it){
   var chip=it.f==='r'?'':it.f==='p'?'<span class="mb-w">posat</span>':'<button class="mb-w" data-a="w" data-id="'+esc(it.id)+'">'+wt(it.g)+'</button>';
   h+='<div class="mb-row'+(T[it.id]?' on':'')+'" data-a="tick" data-id="'+esc(it.id)+'"><span class="mb-bx">'+(T[it.id]?'✓':'')+'</span><span class="t">'+esc(it.n)+(it.c?'<span class="mb-tag">meu</span>':'')+'</span>'+chip+(S.edit?'<button class="mb-x" data-a="rm" data-id="'+esc(it.id)+'" aria-label="Treu">✕</button>':'')+'</div>'});
  h+='</div>';
 });
 if(!shown)h+='<div class="card" style="text-align:center"><div style="font-size:34px">'+(items.length?'🎉':'🎒')+'</div><b>'+(items.length?'Tot a la motxilla!':'Encara no hi ha res.')+'</b>'+(items.length?'':'<p class="mu" style="margin:6px 0 0">Obre els suggeriments (💡) o afegeix coses amb ✏️ Edita.</p>')+'</div>';
 if(S.edit){
  var opts=G.order.slice();['Dormir','Menjar i beure','Roba','Seguretat','Material','Altres'].forEach(function(o){if(opts.indexOf(o)<0)opts.push(o)});
  h+='<div class="card"><h2>Afegeix una cosa</h2><div class="mb-f"><div class="r2"><input type="text" id="mb-n" placeholder="Nom (p. ex. Càmera)"><input type="text" id="mb-g" inputmode="decimal" placeholder="Pes en g" style="width:110px"></div><select id="mb-c">'+opts.map(function(o){return '<option>'+esc(o)+'</option>'}).join('')+'</select><button class="pri" data-a="addit">＋ Afegeix</button></div></div>';
 }
 h+='<div class="row"><button class="sm" data-a="clear">Desmarca tot</button><button class="sm" data-a="reset">Restaura la llista original</button></div><p class="mu">Els pesos són aproximats (sense la motxilla en si): ajusta’ls al teu material. El que portes posat no compta pes. Dades només en aquest dispositiu.</p>';
 var y=window.scrollY;sec.innerHTML=h;window.scrollTo(0,y);
}
function sync(){if(!sec)return;if(location.hash.slice(1)==='motxilla'){sec.style.display='';draw()}}
build();load();draw();sync();
window.addEventListener('hashchange',sync);
})();
