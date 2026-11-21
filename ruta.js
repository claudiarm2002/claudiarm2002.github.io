/* Navalla · subapp «Temps de ruta»
   Un sol mètode (DIN 33466 / SAC, el mateix esquema que el MIDE): 4 km/h en pla, 300 m/h de pujada, 500 m/h de baixada;
   temps = el més llarg entre horitzontal i vertical + la meitat de l'altre. Ajustat al teu ritme amb GPX de sortides teves.
   Només per a condicions sense neu. Dades només al localStorage d'aquest dispositiu. */
(function(){
'use strict';
var KEY='navalla-ruta-v1',sec,S;
var DEF={pause:30,terr:1,lat:42.0,lon:1.8,marg:30,rt:[]};
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function nv(id){var e=$(id),v=parseFloat(String(e?e.value:'').replace(',','.'));return isNaN(v)?0:v}
function fx(k){return k.toFixed(2).replace('.',',')}
function hmm(h){var m=Math.round(h*60),a=Math.floor(m/60),b=m%60;return a?a+' h'+(b?' '+String(b).padStart(2,'0')+' min':''):b+' min'}
function ck(m){m=((Math.round(m)%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function tmin(s){var p=String(s||'08:00').split(':');return (+p[0]||0)*60+(+p[1]||0)}
function med(a){var s=a.slice().sort(function(x,y){return x-y}),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2}
function hav(a,b){var R=6371000,r=Math.PI/180,x=(b.a-a.a)*r,y=(b.o-a.o)*r,h=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a.a*r)*Math.cos(b.a*r)*Math.sin(y/2)*Math.sin(y/2);return 2*R*Math.asin(Math.sqrt(h))}
function load(){
 S=JSON.parse(JSON.stringify(DEF));
 try{var r=JSON.parse(localStorage.getItem(KEY)||'null');if(r)Object.keys(DEF).forEach(function(k){if(r[k]!=null)S[k]=r[k]})}catch(_){}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){}}

/* ---------- càlculs ---------- */
function base(d,u,dn){var a=d/1000/4,v=u/300+dn/500;return Math.max(a,v)+Math.min(a,v)/2}
function factor(){
 var a=S.rt.filter(function(r){return r.on!==false}).map(function(r){var b=base(r.d,r.u,r.dn||0);return b>0?r.mt/3600/b:null}).filter(function(x){return x});
 return {k:a.length?med(a):1,n:a.length};
}
/* hora en què el sol arriba a l'altura «alt» (graus) al vespre: -0,833 = posta */
function dusk(date,lat,lon,alt){
 var R=Math.PI/180,jd=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),12)/864e5+2440587.5,n=Math.round(jd-2451545),Js=n-lon/360,
 M=(357.5291+0.98560028*Js)%360,C=1.9148*Math.sin(M*R)+0.02*Math.sin(2*M*R)+0.0003*Math.sin(3*M*R),L=(M+C+180+102.9372)%360,
 Jt=2451545+Js+0.0053*Math.sin(M*R)-0.0069*Math.sin(2*L*R),sd=Math.sin(L*R)*Math.sin(23.4397*R),cd=Math.cos(Math.asin(sd)),
 c=(Math.sin(alt*R)-Math.sin(lat*R)*sd)/(Math.cos(lat*R)*cd);
 if(c<-1||c>1)return null;
 return new Date((Jt+Math.acos(c)/R/360-2440587.5)*864e5);
}
function calc(){
 var d=nv('rt-d')*1000,u=nv('rt-u'),dn=nv('rt-n'),out=$('rt-out');
 if(!d&&!u&&!dn){out.innerHTML='<div class="rt-empty">Posa la distància i el desnivell<br>per veure quant tardaràs.</div>';return}
 var F=factor(),mv=base(d,u,dn)*F.k*S.terr,tot=mv+S.pause/60,sm=tmin($('rt-t').value),end=sm+tot*60;
 var h='<div class="rt-lab">Durada estimada</div><div class="rt-time">'+hmm(tot)+'</div><div class="rt-sub">'+hmm(mv)+' caminant + '+Math.round(S.pause)+' min de pauses</div>'+
  '<div class="rt-end">Tornaràs cap a les <b>'+ck(end)+'</b></div>';
 var day=$('rt-date').value?new Date($('rt-date').value+'T12:00'):new Date(),ds=dusk(day,S.lat,S.lon,-0.833);
 if(ds&&!isNaN(ds)){
  var dm=ds.getHours()*60+ds.getMinutes(),lim=dm-S.marg,ok=end<=lim;
  h+='<div class="rt-pill '+(ok?'ok':'no')+'">'+(ok?'🌇 Hi arribes de llum · posta de sol a les '+ck(dm):'⚠️ Et farà fosc · hauries de sortir abans de les '+ck(lim-tot*60))+'</div>';
 }
 out.innerHTML=h+'<div class="rt-foot">Orientatiu, sense neu. A la muntanya el sol s’amaga abans per les crestes.</div>';
}

/* ---------- GPX de sortides teves ---------- */
function parse(txt,name){
 var d=new DOMParser().parseFromString(txt,'application/xml');if(d.getElementsByTagName('parsererror').length)throw new Error(name+': XML no vàlid');
 var els=d.getElementsByTagName('trkpt'),P=[],i;
 for(i=0;i<els.length;i++){var e=els[i],te=e.getElementsByTagName('time')[0],ee=e.getElementsByTagName('ele')[0],la=parseFloat(e.getAttribute('lat')),lo=parseFloat(e.getAttribute('lon'));
  if(!isNaN(la)&&!isNaN(lo))P.push({a:la,o:lo,e:ee?parseFloat(ee.textContent):null,t:te?Date.parse(te.textContent):null})}
 if(P.length<10)throw new Error(name+': massa pocs punts');
 if(P[0].t==null||isNaN(P[0].t))throw new Error(name+': no té hores');
 if(P.some(function(p){return p.e==null||isNaN(p.e)}))throw new Error(name+': no té altitud');
 var Sm=P.map(function(p,i){var s=0,n=0;for(var k=Math.max(0,i-2);k<=Math.min(P.length-1,i+2);k++){s+=P[k].e;n++}return s/n}),up=0,dn=0,ref=Sm[0];
 Sm.forEach(function(v){if(v-ref>=3){up+=v-ref;ref=v}else if(ref-v>=3){dn+=ref-v;ref=v}});
 var dist=0,mt=0;
 for(i=1;i<P.length;i++){var dd=hav(P[i-1],P[i]),dt=(P[i].t-P[i-1].t)/1000;dist+=dd;if(dt>0&&dt<=60&&dd/dt>.3)mt+=dt}
 return {id:Date.now().toString(36)+Math.random().toString(36).slice(2,4),n:name.replace(/\.gpx$/i,''),d:Math.round(dist),u:Math.round(up),dn:Math.round(dn),mt:Math.round(mt),et:Math.round((P[P.length-1].t-P[0].t)/1000),dt:iso(new Date(P[0].t)),on:true};
}
function onFiles(inp){
 var fs=Array.prototype.slice.call(inp.files),n=fs.length,err=[];if(!n)return;
 fs.forEach(function(f){
  f.text().then(function(t){S.rt.unshift(parse(t,f.name))}).catch(function(x){err.push(x&&x.message?x.message:'No s’ha pogut llegir '+f.name)})
  .then(function(){if(--n===0){save();drawRt();calc();inp.value='';$('rt-msg').textContent=err.join(' · ')}});
 });
}
function drawRt(){
 var F=factor(),h='';
 $('rt-k').innerHTML=S.rt.length?'<div class="rt-fk">El teu ritme: <b>×'+fx(F.k)+'</b></div><div class="mu">×1,00 = vas com el mètode; més gran = vas més lent. Desmarca les sortides que no siguin representatives (carreres, mal temps…).</div>':'<div class="mu">Encara no tens sortides: es fa servir el mètode tal qual (×1,00).</div>';
 S.rt.forEach(function(r){var b=base(r.d,r.u,r.dn||0),on=r.on!==false;
  h+='<div class="rt-r"><input type="checkbox" data-a="tog" data-id="'+r.id+'"'+(on?' checked':'')+'><div class="n"><b>'+esc(r.n)+'</b><span class="mu">'+r.dt.split('-').reverse().slice(0,2).join('/')+' · '+(r.d/1000).toFixed(1).replace('.',',')+' km · +'+r.u+' m · '+hmm(r.mt/3600)+(b>0?' · ×'+fx(r.mt/3600/b):'')+'</span></div><button class="sm" data-a="rm" data-id="'+r.id+'" aria-label="Treu">✕</button></div>'});
 $('rt-list').innerHTML=h;
}

/* ---------- interfície ---------- */
var CSS='\
#t-ruta label{display:block;font-size:12px;color:var(--mu)}\
#t-ruta label input,#t-ruta label select{display:block;width:100%;margin-top:4px;font:inherit;font-size:16px;color:var(--tx);padding:11px 12px;border-radius:14px;border:1px solid var(--bd);background:var(--bg)}\
.rt-in{display:grid;grid-template-columns:1fr 1fr;gap:12px}.rt-in input{font-size:22px!important;font-weight:700;padding:12px!important}\
.rt-in input,.rt-in select{height:56px;min-width:0;-webkit-appearance:none;appearance:none;text-align:left;line-height:1.2;box-sizing:border-box;margin:4px 0 0}\
.rt-in select{font-size:18px;font-weight:600;padding:0 12px;background-image:linear-gradient(45deg,transparent 50%,var(--mu) 50%),linear-gradient(135deg,var(--mu) 50%,transparent 50%);background-position:calc(100% - 20px) 24px,calc(100% - 15px) 24px;background-size:5px 5px;background-repeat:no-repeat;padding-right:34px}\
.rt-in input::-webkit-date-and-time-value{text-align:left;min-height:1.2em;margin:0}\
.rt-in input::-webkit-datetime-edit{padding:0}\
.rt-hero{background:linear-gradient(150deg,var(--ac),#2f6485);border:0;color:#fff;border-radius:26px;padding:22px 18px;text-align:center}\
.rt-lab{font-size:13px;opacity:.85;text-transform:uppercase;letter-spacing:.6px}\
.rt-time{font-size:46px;font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin:4px 0}\
.rt-sub{font-size:13px;opacity:.85}\
.rt-end{margin:14px 0 10px;font-size:17px}\
.rt-pill{display:inline-block;padding:9px 14px;border-radius:20px;font-size:14px;background:rgba(255,255,255,.22)}.rt-pill.no{background:#fff;color:#c4421a;font-weight:600}\
.rt-foot{margin-top:14px;font-size:12px;opacity:.7}.rt-empty{opacity:.9;padding:14px 0;line-height:1.5}\
.rt-adj summary{cursor:pointer;font-weight:700;color:var(--ac);font-size:15px}\
.rt-adj .rt-in{margin-top:12px}.rt-adj h3{font-size:13px;margin:18px 0 6px;color:var(--ac);text-transform:uppercase;letter-spacing:.6px}\
.rt-r{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--bd)}.rt-r input{width:20px;height:20px;flex:none}.rt-r .n b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.rt-fk{font-size:16px;margin:8px 0 2px}';
function build(){
 var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 sec=document.createElement('section');sec.id='t-ruta';sec.className='toolsec';sec.style.display='none';
 sec.innerHTML='<div class="card"><div class="rt-in"><label>Distància (km)<input type="text" id="rt-d" inputmode="decimal" placeholder="12,5"></label><label>Hora de sortida<input type="time" id="rt-t" value="08:00"></label><label>Desnivell + (m)<input type="text" id="rt-u" inputmode="decimal" placeholder="900"></label><label>Desnivell − (m)<input type="text" id="rt-n" inputmode="decimal" placeholder="900"></label></div></div>'+
  '<div class="card rt-hero" id="rt-out"></div>'+
  '<details class="card rt-adj"><summary>⚙️ Ajusta</summary>'+
  '<div class="rt-in"><label>Pauses (min)<input type="text" id="rt-p" inputmode="numeric"></label><label>Marge de llum (min)<input type="text" id="rt-mg" inputmode="numeric"></label><label>Terreny<select id="rt-tr"><option value="0.9">Més fàcil (pista)</option><option value="1">Normal</option><option value="1.15">Tècnic</option><option value="1.3">Molt tècnic</option></select></label><label>Dia<input type="date" id="rt-date"></label></div>'+
  '<div class="row"><button class="sm" data-a="gps">📍 Usa la meva posició per a la posta de sol</button></div>'+
  '<h3>El meu ritme</h3><p class="mu" style="margin:0 0 8px">Carrega GPX de sortides teves sense neu (amb hora i altitud): el temps s’ajusta al que realment tardes.</p>'+
  '<label class="btn pri big" for="rt-f">📂 Afegeix GPX</label><input type="file" id="rt-f" multiple accept=".gpx"><div class="mu" id="rt-msg"></div><div id="rt-k"></div><div id="rt-list"></div></details>';
 document.querySelector('main').appendChild(sec);
 sec.addEventListener('click',onClick);
 function ev(e){var i=e.target.id;if(i&&i.indexOf('rt-')===0&&i!=='rt-f'){rd();save();calc()}}
 sec.addEventListener('input',ev);sec.addEventListener('change',function(e){if(e.target.id==='rt-f')onFiles(e.target);else ev(e)});
}
function rd(){S.pause=nv('rt-p');S.terr=+$('rt-tr').value||1;S.marg=nv('rt-mg')}
function fill(){$('rt-p').value=S.pause;$('rt-tr').value=String(S.terr);$('rt-mg').value=S.marg}
function onClick(e){
 var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a;
 if(a==='tog'){var r=S.rt.filter(function(x){return x.id===b.dataset.id})[0];if(r)r.on=b.checked}
 else if(a==='rm'){S.rt=S.rt.filter(function(x){return x.id!==b.dataset.id})}
 else if(a==='gps'){if(navigator.geolocation)navigator.geolocation.getCurrentPosition(function(p){S.lat=+p.coords.latitude.toFixed(3);S.lon=+p.coords.longitude.toFixed(3);save();calc();$('rt-msg').textContent='Posició actualitzada.'},function(){$('rt-msg').textContent='No he pogut obtenir la posició.'});return}
 save();calc();drawRt();
}
function sync(){if(!sec)return;if(location.hash.slice(1)==='ruta'){sec.style.display='';calc()}}
load();build();fill();$('rt-date').value=iso(new Date());calc();drawRt();sync();
window.addEventListener('hashchange',sync);
})();
