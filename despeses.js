/* Navalla · subapp «Despeses mensuals»
   Llegeix l'Excel de gestió personal (pestanyes Moviments i Categories) al propi navegador.
   Les dades NO es pugen enlloc: es queden al localStorage d'aquest dispositiu. */
(function(){
'use strict';
var MESOS=['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];
var MES3=['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'];
var KEY='navalla-despeses-v1',IN='Ingressos',OUT='Excloure';
var DATA=null,AG=[],sel=0,view='mes',mvKind='des',mvCat=null,mvLim=40,CH=null;
var $=function(i){return document.getElementById(i)};
var nf0=new Intl.NumberFormat('ca-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0});
var nf2=new Intl.NumberFormat('ca-ES',{style:'currency',currency:'EUR'});
function z(n){return Math.abs(n)<.005?0:n}
function e0(n){return nf0.format(Math.round(z(n)))}
function e2(n){return nf2.format(z(n))}
function pc(x){return Math.round(x*100)+'%'}
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function ddmm(ts){var d=new Date(ts);return String(d.getUTCDate()).padStart(2,'0')+'/'+String(d.getUTCMonth()+1).padStart(2,'0')}

/* ---------- lector d'.xlsx sense llibreries (zip + XML) ---------- */
async function inflate(u8){
 if(typeof DecompressionStream==='undefined')throw new Error('Aquest navegador no pot descomprimir l’Excel (cal iOS 16.4+ / un Chrome o Safari recent).');
 var s=new Blob([u8]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
 return new Uint8Array(await new Response(s).arrayBuffer());
}
function unzip(ab){
 var u8=new Uint8Array(ab),dv=new DataView(ab),n=u8.length,e=-1,i;
 for(i=n-22;i>=Math.max(0,n-65557);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}
 if(e<0)throw new Error('Aquest fitxer no sembla un .xlsx');
 var cnt=dv.getUint16(e+10,true),off=dv.getUint32(e+16,true),files={},dec=new TextDecoder();
 for(var k=0;k<cnt;k++){
  if(dv.getUint32(off,true)!==0x02014b50)break;
  var nl=dv.getUint16(off+28,true),xl=dv.getUint16(off+30,true),cl=dv.getUint16(off+32,true);
  files[dec.decode(u8.subarray(off+46,off+46+nl))]={m:dv.getUint16(off+10,true),c:dv.getUint32(off+20,true),o:dv.getUint32(off+42,true)};
  off+=46+nl+xl+cl;
 }
 return {has:function(p){return !!files[p]},text:async function(p){
  var f=files[p];if(!f)throw new Error('Falta '+p+' dins l’Excel');
  var s=f.o+30+dv.getUint16(f.o+26,true)+dv.getUint16(f.o+28,true),d=u8.subarray(s,s+f.c);
  if(f.m===8)d=await inflate(d);else if(f.m!==0)throw new Error('Compressió no suportada');
  return dec.decode(d);
 }};
}
function xml(t){var d=new DOMParser().parseFromString(t,'application/xml');if(d.getElementsByTagName('parsererror').length)throw new Error('XML no vàlid dins l’Excel');return d}
function colIdx(ref){var m=/^[A-Z]+/.exec(ref)[0],n=0;for(var i=0;i<m.length;i++)n=n*26+m.charCodeAt(i)-64;return n-1}
function rowIdx(ref){return parseInt(ref.replace(/^[A-Z]+/,''),10)}
function sheetRows(doc,SS){
 var rows={},cs=doc.getElementsByTagName('c');
 for(var i=0;i<cs.length;i++){
  var c=cs[i],ref=c.getAttribute('r'),t=c.getAttribute('t'),v=c.getElementsByTagName('v')[0],val;
  if(t==='inlineStr'){var ts=c.getElementsByTagName('t');val='';for(var k=0;k<ts.length;k++)val+=ts[k].textContent}
  else if(!v)continue;
  else if(t==='s')val=SS[+v.textContent];
  else if(t==='str'||t==='e')val=v.textContent;
  else if(t==='b')val=v.textContent==='1';
  else val=parseFloat(v.textContent);
  if(val===undefined||val===''||(typeof val==='number'&&isNaN(val)))continue;
  var r=rowIdx(ref);(rows[r]||(rows[r]={}))[colIdx(ref)]=val;
 }
 return rows;
}
async function parseXlsx(ab,name){
 var zp=unzip(ab),wb=xml(await zp.text('xl/workbook.xml')),rel=xml(await zp.text('xl/_rels/workbook.xml.rels')),targets={};
 Array.prototype.forEach.call(rel.getElementsByTagName('Relationship'),function(r){var t=r.getAttribute('Target').replace(/^\//,'');targets[r.getAttribute('Id')]=t.indexOf('xl/')===0?t:'xl/'+t});
 var sheets={};
 Array.prototype.forEach.call(wb.getElementsByTagName('sheet'),function(s){sheets[s.getAttribute('name')]=targets[s.getAttribute('r:id')]});
 if(!sheets.Moviments||!sheets.Categories)throw new Error('No trobo les pestanyes «Moviments» i «Categories». Hi són?');
 var SS=[];
 if(zp.has('xl/sharedStrings.xml')){
  Array.prototype.forEach.call(xml(await zp.text('xl/sharedStrings.xml')).getElementsByTagName('si'),function(si){
   var t=si.getElementsByTagName('t'),s='';for(var i=0;i<t.length;i++){if(t[i].parentNode.nodeName==='rPh')continue;s+=t[i].textContent}SS.push(s)});
 }
 var cat=sheetRows(xml(await zp.text(sheets.Categories)),SS),mov=sheetRows(xml(await zp.text(sheets.Moviments)),SS);
 var gmap={},bud={},order=[],r;
 Object.keys(cat).map(Number).sort(function(a,b){return a-b}).forEach(function(k){
  if(k<2)return;var x=cat[k];
  if(typeof x[0]==='string'&&typeof x[1]==='string')gmap[x[0].trim()]=x[1].trim();
  if(typeof x[3]==='string'&&typeof x[4]==='number'){bud[x[3].trim()]=x[4];order.push(x[3].trim())}
 });
 var rows=[];
 Object.keys(mov).map(Number).sort(function(a,b){return a-b}).forEach(function(k){
  if(k<2)return;var x=mov[k];
  if(typeof x[4]!=='number')return;                        // sense import
  var ts=typeof x[0]==='number'?Math.round((x[0]-25569)*864e5):null;
  var mi=typeof x[1]==='string'?MESOS.map(function(m){return m.toLowerCase()}).indexOf(x[1].trim().toLowerCase()):-1;
  if(mi<0&&ts!=null)mi=new Date(ts).getUTCMonth();
  if(mi<0)return;
  var c=String(x[6]||x[5]||x[7]||'Sense categoria').trim();  // manual > auto (igual que l'Excel)
  rows.push([ts,mi,x[2]||'',x[3]||x[10]||'',x[4],c,gmap[c]||'Sense grup']);
 });
 if(!rows.length)throw new Error('La pestanya Moviments no té cap moviment llegible.');
 return {v:1,name:name,at:Date.now(),rows:rows,bud:bud,order:order};
}

/* ---------- càlculs ---------- */
function compute(){
 AG=[];for(var m=0;m<12;m++)AG.push({ing:0,des:0,grp:{},cat:{},n:0,nom:0});
 DATA.rows.forEach(function(r){
  var o=AG[r[1]],a=r[4],g=r[6];o.n++;
  if(r[5]==='Nòmina')o.nom+=a;
  if(g===IN)o.ing+=a;
  else if(g!==OUT){o.des-=a;o.grp[g]=(o.grp[g]||0)-a;o.cat[r[5]]=(o.cat[r[5]]||0)-a}
 });
 AG.forEach(function(o){o.est=o.ing-o.des;o.pct=o.ing>0?o.est/o.ing:0;o.complet=o.nom>0});
}
function lastMonth(){for(var m=11;m>=0;m--)if(AG[m].n)return m;return 0}
function budTotal(){var t=0;for(var k in DATA.bud)t+=DATA.bud[k];return t}

/* ---------- interfície ---------- */
var sec,CSS='\
.dp-in{display:flex;gap:10px;align-items:center}.dp-in .n{flex:1;min-width:0}\
.dp-kpi{display:grid;grid-template-columns:1fr 1fr;gap:8px}\
.dp-kpi .st b{font-size:20px}.dp-pos{color:#2e9e4f}.dp-neg{color:#e5532d}\
.dp-months{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;margin:0 -2px;scrollbar-width:none}.dp-months::-webkit-scrollbar{display:none}\
.dp-months button{flex:none;padding:7px 13px;border-radius:20px;font-size:14px}\
.dp-months button.on{background:var(--ac);border-color:transparent;color:#fff;font-weight:600}\
.dp-months button.cur{border-style:dashed}\
.dp-row{padding:9px 0;border-top:1px solid var(--bd)}.dp-row:first-of-type{border-top:0}\
.dp-top{display:flex;gap:8px;align-items:baseline}.dp-top .n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.dp-bar{height:8px;border-radius:6px;background:var(--bg);margin-top:6px;overflow:hidden}.dp-bar i{display:block;height:100%;border-radius:6px}\
.dp-tap{cursor:pointer}.dp-tap:active{opacity:.6}\
.dp-mv{display:flex;gap:10px;padding:8px 0;border-top:1px solid var(--bd);align-items:center}\
.dp-mv .d{width:38px;font-size:12px;color:var(--mu);flex:none}.dp-mv .n{flex:1;min-width:0}\
.dp-mv .n b{display:block;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.dp-mv .n span{font-size:12px;color:var(--mu)}.dp-mv .a{font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:600}\
.dp-tb{width:100%;border-collapse:collapse;font-size:14px}.dp-tb th{font-size:12px;color:var(--mu);font-weight:500;text-align:right;padding:4px 0}\
.dp-tb td{padding:8px 0;border-top:1px solid var(--bd);text-align:right;font-variant-numeric:tabular-nums}.dp-tb th:first-child,.dp-tb td:first-child{text-align:left}\
.dp-tb tr.cur td{color:var(--mu)}.dp-tb tr.tap{cursor:pointer}\
canvas#dp-ch{height:230px;cursor:pointer}\
.dp-leg{display:flex;gap:14px;font-size:12px;color:var(--mu);margin-top:6px;flex-wrap:wrap}.dp-leg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}';

function build(){
 var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 sec=document.createElement('section');sec.id='t-despeses';sec.className='toolsec';sec.style.display='none';
 sec.innerHTML='<div class="card" id="dp-load"></div><div id="dp-main"></div>';
 document.querySelector('main').appendChild(sec);
 sec.addEventListener('change',function(e){if(e.target.id==='dp-file')onFile(e.target)});
 sec.addEventListener('click',onClick);
 var cv;sec.addEventListener('pointerup',function(e){if(e.target.id==='dp-ch')chTap(e)});
}
function onClick(e){
 var t=e.target.closest('[data-a]');if(!t)return;var a=t.dataset.a,v=t.dataset.v;
 if(a==='mes'){sel=+v;view='mes';mvCat=null;mvLim=40;draw();window.scrollTo(0,0)}
 else if(a==='view'){view=v;draw()}
 else if(a==='kind'){mvKind=v;mvCat=null;mvLim=40;draw()}
 else if(a==='cat'){mvCat=(mvCat===v?null:v);mvKind='des';mvLim=40;draw();var m=$('dp-mv');if(m)m.scrollIntoView({block:'start',behavior:'smooth'})}
 else if(a==='more'){mvLim+=40;draw()}
 else if(a==='clrcat'){mvCat=null;draw()}
 else if(a==='wipe'){if(confirm('Vols esborrar d’aquesta app les dades de l’Excel? (L’Excel no es toca.)')){try{localStorage.removeItem(KEY)}catch(_){}DATA=null;AG=[];draw()}}
 else if(a==='pick'){$('dp-file').click()}
}
async function onFile(inp){
 var f=inp.files[0];if(!f)return;msg('Llegint '+f.name+'…');
 try{
  var d=await parseXlsx(await f.arrayBuffer(),f.name);
  DATA=d;compute();sel=lastMonth();view='mes';mvKind='des';mvCat=null;mvLim=40;
  try{localStorage.setItem(KEY,JSON.stringify(d));msg('')}catch(_){msg('Carregat, però no s’ha pogut desar al dispositiu (hauràs de tornar-lo a triar la propera vegada).')}
 }catch(err){msg('Error: '+err.message)}
 inp.value='';draw();
}
function msg(t){var m=$('dp-msg');if(m)m.textContent=t}
function draw(){
 var L=$('dp-load'),M=$('dp-main');
 var file='<input id="dp-file" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">';
 if(!DATA){
  L.innerHTML='<h2>📊 Carrega el teu Excel</h2><label class="btn pri big" for="dp-file">📂 Tria Despeses2026.xlsx</label>'+file+
   '<p class="mu">Llegeix les pestanyes <b>Moviments</b> i <b>Categories</b>. Tot passa al teu dispositiu: l’Excel no es puja enlloc i les dades només es desen en aquest navegador.</p><div class="mu" id="dp-msg"></div>';
  M.innerHTML='';return;
 }
 L.innerHTML='<div class="dp-in"><span style="font-size:22px">📄</span><div class="n"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(DATA.name)+'</b><span class="mu">'+DATA.rows.length+' moviments · carregat '+new Date(DATA.at).toLocaleDateString('ca',{day:'numeric',month:'short'})+'</span></div>'+
  '<label class="btn sm" for="dp-file">Actualitza</label><button class="sm" data-a="wipe" title="Esborra les dades">🗑️</button></div>'+file+'<div class="mu" id="dp-msg" style="margin-top:6px"></div>';
 M.innerHTML='<div class="row" style="margin-top:0"><div class="seg"><button data-a="view" data-v="mes" class="'+(view==='mes'?'on':'')+'">Mes</button><button data-a="view" data-v="any" class="'+(view==='any'?'on':'')+'">Any</button></div></div>'+(view==='mes'?mesHtml():anyHtml());
 if(view==='any')drawChart();
 var on=M.querySelector('.dp-months .on');if(on&&on.scrollIntoView)on.parentNode.scrollLeft=on.offsetLeft-20;
}
function kpi(l,v,cls){return '<div class="st"><span>'+l+'</span><b'+(cls?' class="'+cls+'"':'')+'>'+v+'</b></div>'}
function barColor(f){return f>1?'#e5532d':f>.85?'#fb8c00':'#2e9e4f'}

function mesHtml(){
 var o=AG[sel],h='<div class="dp-months">';
 for(var m=0;m<12;m++){if(!AG[m].n&&m!==sel)continue;h+='<button data-a="mes" data-v="'+m+'" class="'+(m===sel?'on ':'')+(AG[m].complet?'':'cur')+'">'+MESOS[m]+'</button>'}
 h+='</div><div class="card">';
 if(!o.n)return h+'<p class="mu">No hi ha moviments aquest mes.</p></div>';
 if(!o.complet)h+='<p class="mu" style="margin:0 0 8px">⏳ Mes en curs: encara no hi ha la nòmina, així que l’estalvi és provisional.</p>';
 h+='<div class="dp-kpi">'+kpi('Ingressos',e0(o.ing))+kpi('Despeses',e0(o.des))+kpi('Estalvi',e0(o.est),o.est>=0?'dp-pos':'dp-neg')+kpi('% estalviat',o.ing>0?pc(o.pct):'—')+'</div></div>';
 // pressupost
 var gs=DATA.order.slice();Object.keys(o.grp).forEach(function(g){if(gs.indexOf(g)<0)gs.push(g)});
 var rows='';
 gs.forEach(function(g){
  var sp=o.grp[g]||0,b=DATA.bud[g]||0;if(!b&&Math.abs(sp)<.005)return;
  if(b>0){var f=sp/b,rest=b-sp;
   rows+='<div class="dp-row"><div class="dp-top"><b class="n">'+esc(g)+'</b><span>'+e0(sp)+' <span class="mu">de '+e0(b)+'</span></span></div><div class="dp-bar"><i style="width:'+Math.min(100,Math.max(0,f*100))+'%;background:'+barColor(f)+'"></i></div>'+
    '<div class="mu" style="margin-top:4px">'+(rest>=0?'✓ dins · queden '+e0(rest):'✗ passat per '+e0(-rest))+'</div></div>';
  }else rows+='<div class="dp-row"><div class="dp-top"><b class="n">'+esc(g)+'</b><span>'+e0(sp)+' <span class="mu">sense pressupost</span></span></div></div>';
 });
 if(rows)h+='<div class="card"><h2>Pressupost</h2>'+rows+'</div>';
 // on gasto més
 var cats=Object.keys(o.cat).filter(function(c){return o.cat[c]>.005}).sort(function(a,b){return o.cat[b]-o.cat[a]});
 if(cats.length){
  var mx=o.cat[cats[0]];h+='<div class="card"><h2>On gasto més</h2><p class="mu" style="margin:0 0 4px">Toca una categoria per veure’n els moviments.</p>';
  cats.forEach(function(c){var v=o.cat[c];
   h+='<div class="dp-row dp-tap" data-a="cat" data-v="'+esc(c)+'"><div class="dp-top"><b class="n">'+(mvCat===c?'👉 ':'')+esc(c)+'</b><span>'+e0(v)+' <span class="mu">'+(o.des>0?pc(v/o.des):'')+'</span></span></div><div class="dp-bar"><i style="width:'+(v/mx*100)+'%;background:var(--ac)"></i></div></div>'});
  h+='</div>';
 }
 // moviments
 var list=DATA.rows.map(function(r,i){return {r:r,i:i}}).filter(function(x){
  var r=x.r;if(r[1]!==sel)return false;
  if(mvCat)return r[5]===mvCat;
  return mvKind==='ing'?r[6]===IN:mvKind==='exc'?r[6]===OUT:(r[6]!==IN&&r[6]!==OUT)});
 list.sort(function(a,b){return (b.r[0]||0)-(a.r[0]||0)||a.i-b.i});
 var tot=0;list.forEach(function(x){tot+=x.r[4]});
 h+='<div class="card" id="dp-mv"><h2>Moviments</h2>';
 if(mvCat)h+='<div class="row" style="margin-top:0"><span class="chip">'+esc(mvCat)+'</span><button class="sm" data-a="clrcat">✕ Treu el filtre</button></div>';
 else h+='<div class="row" style="margin-top:0"><div class="seg">'+[['des','Despeses'],['ing','Ingressos'],['exc','Excloses']].map(function(k){return '<button data-a="kind" data-v="'+k[0]+'" class="'+(mvKind===k[0]?'on':'')+'">'+k[1]+'</button>'}).join('')+'</div></div>';
 h+='<div class="mu">'+list.length+' moviments · total '+e2(tot)+'</div>';
 list.slice(0,mvLim).forEach(function(x){var r=x.r;
  h+='<div class="dp-mv"><span class="d">'+(r[0]!=null?ddmm(r[0]):'')+'</span><div class="n"><b>'+esc(r[3])+'</b><span>'+esc(r[5])+' · '+esc(r[2])+'</span></div><span class="a '+(r[4]>0?'dp-pos':'')+'">'+e2(r[4])+'</span></div>'});
 if(list.length>mvLim)h+='<button class="big" style="width:100%;margin-top:8px" data-a="more">Mostra’n més ('+(list.length-mvLim)+')</button>';
 return h+'</div>';
}

function anyHtml(){
 var comp=AG.map(function(o,i){return i}).filter(function(i){return AG[i].complet}),n=comp.length,T={ing:0,des:0,cat:{}};
 comp.forEach(function(i){T.ing+=AG[i].ing;T.des+=AG[i].des;for(var c in AG[i].cat)T.cat[c]=(T.cat[c]||0)+AG[i].cat[c]});
 var est=T.ing-T.des,h='<div class="card"><h2>Resum de l’any</h2><p class="mu" style="margin:0 0 8px">Només compten els mesos complets (els que ja tenen la nòmina): '+n+' de 12.</p><div class="dp-kpi">'+
  kpi('Ingressos',e0(T.ing))+kpi('Despeses',e0(T.des))+kpi('Estalvi',e0(est),est>=0?'dp-pos':'dp-neg')+kpi('% estalviat',T.ing>0?pc(est/T.ing):'—')+kpi('Despesa / mes',n?e0(T.des/n):'—')+kpi('Estalvi / mes',n?e0(est/n):'—')+'</div>';
 if(n){
  var mxD=comp[0],mnD=comp[0],mxE=comp[0];comp.forEach(function(i){if(AG[i].des>AG[mxD].des)mxD=i;if(AG[i].des<AG[mnD].des)mnD=i;if(AG[i].est>AG[mxE].est)mxE=i});
  h+='<div style="margin-top:10px" class="mu">Més despesa: <b>'+MESOS[mxD]+'</b> ('+e0(AG[mxD].des)+') · Menys: <b>'+MESOS[mnD]+'</b> ('+e0(AG[mnD].des)+') · Més estalvi: <b>'+MESOS[mxE]+'</b> ('+e0(AG[mxE].est)+')</div>';
 }
 h+='</div><div class="card"><h2>Mes a mes <span class="mu" style="margin-left:auto">toca un mes</span></h2><canvas id="dp-ch"></canvas><div class="dp-leg"><span><i style="background:#2e9e4f"></i>Ingressos</span><span><i style="background:#fc4c02"></i>Despeses</span>'+(budTotal()?'<span>┄ Pressupost ('+e0(budTotal())+')</span>':'')+'</div>'+
  '<table class="dp-tb" style="margin-top:10px"><tr><th>Mes</th><th>Ingressos</th><th>Despeses</th><th>Estalvi</th></tr>';
 AG.forEach(function(o,m){if(!o.n)return;h+='<tr class="tap'+(o.complet?'':' cur')+'" data-a="mes" data-v="'+m+'"><td>'+MESOS[m]+(o.complet?'':' ⏳')+'</td><td>'+e0(o.ing)+'</td><td>'+e0(o.des)+'</td><td class="'+(o.est>=0?'dp-pos':'dp-neg')+'">'+e0(o.est)+'</td></tr>'});
 h+='</table></div>';
 var cats=Object.keys(T.cat).filter(function(c){return T.cat[c]>.005}).sort(function(a,b){return T.cat[b]-T.cat[a]});
 if(cats.length){h+='<div class="card"><h2>On se’n van els diners</h2><table class="dp-tb"><tr><th>Categoria</th><th>Total</th><th>Mitjana/mes</th><th>%</th></tr>';
  cats.forEach(function(c){h+='<tr><td>'+esc(c)+'</td><td>'+e0(T.cat[c])+'</td><td>'+(n?e0(T.cat[c]/n):'')+'</td><td>'+(T.des>0?pc(T.cat[c]/T.des):'')+'</td></tr>'});h+='</table></div>'}
 return h;
}

/* ---------- gràfic de barres ---------- */
function drawChart(){
 var cv=$('dp-ch');if(!cv||!DATA)return;
 var dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;if(!W)return;cv.width=W*dpr;cv.height=H*dpr;
 var x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);
 var L=40,R=6,T=10,B=22,pw=W-L-R,ph=H-T-B,bt=budTotal(),mx=bt;
 AG.forEach(function(o){mx=Math.max(mx,o.ing,o.des)});mx=mx||1;
 var tk=[];var st=Math.pow(10,Math.floor(Math.log10(mx/4)));var q=mx/4/st;st*=q<1.5?1:q<3?2:q<7?5:10;for(var v=0;v<=mx*1.05;v+=st)tk.push(v);
 var top=tk[tk.length-1]||mx;
 function Y(v){return T+ph-(v/top)*ph}
 x.font='11px -apple-system,system-ui,sans-serif';x.fillStyle='#8a93a0';x.strokeStyle='rgba(130,140,155,.22)';x.lineWidth=1;x.textAlign='right';
 tk.forEach(function(v){var y=Math.round(Y(v))+.5;x.beginPath();x.moveTo(L,y);x.lineTo(W-R,y);x.stroke();x.fillText(v>=1000?(v/1000).toFixed(v%1000?1:0)+'k':String(v),L-6,y+4)});
 var gw=pw/12,bw=Math.min(14,gw*.36);CH={L:L,gw:gw};
 AG.forEach(function(o,m){
  var cx=L+gw*m+gw/2;
  if(m===sel&&view==='any'){}
  x.globalAlpha=o.n?(o.complet?1:.45):0;
  x.fillStyle='#2e9e4f';x.fillRect(cx-bw-1,Y(o.ing),bw,Math.max(0,Y(0)-Y(o.ing)));
  x.fillStyle='#fc4c02';x.fillRect(cx+1,Y(o.des),bw,Math.max(0,Y(0)-Y(o.des)));
  x.globalAlpha=1;x.fillStyle=o.n?'#8a93a0':'rgba(138,147,160,.4)';x.textAlign='center';x.fillText(MES3[m],cx,H-7);
 });
 if(bt){x.setLineDash([5,4]);x.strokeStyle='#8a93a0';x.lineWidth=1.5;x.beginPath();x.moveTo(L,Y(bt));x.lineTo(W-R,Y(bt));x.stroke();x.setLineDash([])}
}
function chTap(e){
 if(!CH)return;var r=$('dp-ch').getBoundingClientRect(),m=Math.floor((e.clientX-r.left-CH.L)/CH.gw);
 if(m>=0&&m<12&&AG[m].n){sel=m;view='mes';mvCat=null;mvKind='des';mvLim=40;draw();window.scrollTo(0,0)}
}

/* ---------- arrencada ---------- */
function visible(){return sec&&sec.style.display!=='none'}
function sync(){
 if(!sec)return;var on=location.hash.slice(1)==='despeses';
 if(on){sec.style.display='';setTimeout(draw,30)}
}
build();
try{var raw=localStorage.getItem(KEY);if(raw){DATA=JSON.parse(raw);compute();sel=lastMonth()}}catch(_){DATA=null}
draw();sync();
window.addEventListener('hashchange',sync);
window.addEventListener('resize',function(){if(view==='any'&&visible())drawChart()});
})();
