/* Navalla · subapp «Temps de ruta»
   Naismith / MIDE (aprox.) ajustat al teu ritme (calibrat amb GPX de sortides teves) + hora límit abans de fosc.
   Només per a condicions sense neu. Dades només al localStorage d'aquest dispositiu. */
(function(){
'use strict';
var KEY='navalla-ruta-v1',sec,S,MN={nai:'Naismith',mide:'MIDE (aprox.)'};
var DEF={m:'nai',p:{nai:{h:5,u:600,d:0},mide:{h:5,u:400,d:600}},pause:30,terr:1,tipus:'ai',lat:42.0,lon:1.8,alt:-0.833,marg:30,kf:'',rt:[]};
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function nv(id){var e=$(id),v=parseFloat(String(e?e.value:'').replace(',','.'));return isNaN(v)?0:v}
function fx(k){return k.toFixed(2).replace('.',',')}
function hm(h){var m=Math.round(h*60);return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')+' h'}
function ck(m){m=((Math.round(m)%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function tmin(s){var p=String(s||'08:00').split(':');return (+p[0]||0)*60+(+p[1]||0)}
function med(a){var s=a.slice().sort(function(x,y){return x-y}),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2}
function hav(a,b){var R=6371000,r=Math.PI/180,x=(b.a-a.a)*r,y=(b.o-a.o)*r,h=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a.a*r)*Math.cos(b.a*r)*Math.sin(y/2)*Math.sin(y/2);return 2*R*Math.asin(Math.sqrt(h))}
function load(){
 S=JSON.parse(JSON.stringify(DEF));
 try{var r=JSON.parse(localStorage.getItem(KEY)||'null');if(r){for(var k in r)if(r[k]!=null&&k!=='p')S[k]=r[k];if(r.p)for(var m in S.p)if(r.p[m])S.p[m]=Object.assign(S.p[m],r.p[m])}}catch(_){}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){}}

/* ---------- càlculs ---------- */
function base(m,d,u,dn){var P=S.p[m];return d/1000/(P.h>0?P.h:5)+u/(P.u>0?P.u:600)+(P.d>0?dn/P.d:0)}
function factor(m){
 if(S.kf!==''&&S.kf>0)return {k:+S.kf,n:0,auto:false};
 var a=S.rt.filter(function(r){return r.on!==false}).map(function(r){var b=base(m,r.d,r.u,r.dn);return b>0?r.mt/3600/b:null}).filter(function(x){return x});
 return {k:a.length?med(a):1,n:a.length,auto:true};
}
/* hora (Date) en què el sol arriba a l'altura «alt» (graus) al vespre: -0,833 = posta; -6 = fi del crepuscle civil */
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
 if(!d&&!u){out.innerHTML='<p class="mu" style="margin:0">Posa la distància i el desnivell per veure el temps.</p>';return}
 var m=S.m,o2=m==='nai'?'mide':'nai',F=factor(m),b=base(m,d,u,dn),mv=b*F.k*S.terr,tot=mv+S.pause/60,b2=base(o2,d,u,dn)*factor(o2).k*S.terr;
 var h='<div class="rt-big">'+hm(tot)+'<small> amb pauses</small></div><div class="mu">Marxa neta '+hm(mv)+' · pauses '+Math.round(S.pause)+' min</div>'+
  '<div class="rt-grid"><div class="st"><span>'+MN[m]+' brut</span><b>'+hm(b)+'</b></div><div class="st"><span>El teu ritme</span><b>×'+fx(F.k*S.terr)+'</b></div><div class="st"><span>Amb '+MN[o2]+'</span><b>'+hm(b2+S.pause/60)+'</b></div></div>';
 var day=$('rt-date').value?new Date($('rt-date').value+'T12:00'):new Date(),ds=dusk(day,S.lat,S.lon,S.alt);
 if(!ds||isNaN(ds))h+='<p class="mu">No puc calcular la posta de sol per a aquesta posició.</p>';
 else{
  var dm=ds.getHours()*60+ds.getMinutes(),lim=dm-S.marg,sm=tmin($('rt-t').value),end=sm+tot*60;
  h+='<div class="rt-sun">🌇 '+(S.alt<-1?'Fi del crepuscle':'Posta de sol')+' <b>'+ck(dm)+'</b> · límit amb marge <b>'+ck(lim)+'</b></div>';
  h+='<div class="rt-line">Surts a les '+ck(sm)+' → acabaràs cap a les <b>'+ck(end)+'</b> '+(end<=lim?'✅ <span class="mu">'+Math.round(lim-end)+' min de marge</span>':'⚠️ <b style="color:#e5532d">passes el límit '+Math.round(end-lim)+' min</b>')+'</div>';
  if(S.tipus==='ai')h+='<div class="rt-line">🔁 Gira cua com a molt tard a les <b>'+ck(lim-mv*30)+'</b> <span class="mu">(suposa que la tornada dura la meitat de la marxa)</span></div>';
  h+='<div class="rt-line">⏰ Hora límit per sortir: <b>'+ck(lim-tot*60)+'</b></div>';
 }
 var e=d/1000+u/100,sim=S.rt.filter(function(r){return r.on!==false&&r.d+r.u>0&&e>0}).map(function(r){return {r:r,x:Math.abs(Math.log((r.d/1000+r.u/100)/e))}}).filter(function(x){return x.x<.35}).sort(function(a,b){return a.x-b.x}).slice(0,2);
 if(sim.length){h+='<div class="rt-sim"><div class="mu">Sortides teves d’esforç semblant</div>';sim.forEach(function(x){var r=x.r;h+='<div class="rt-line"><b>'+esc(r.n)+'</b> · '+(r.d/1000).toFixed(1).replace('.',',')+' km · +'+r.u+' m → marxa <b>'+hm(r.mt/3600)+'</b></div>'});h+='</div>'}
 out.innerHTML=h+'<p class="mu" style="margin:8px 0 0">Orientatiu, per a condicions sense neu. A la muntanya el sol s’amaga abans per les crestes: no t’acostis al límit.</p>';
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
 var m=S.m,F=factor(m),h='';
 $('rt-k').innerHTML=S.rt.length?'<div class="rt-fk">El teu ritme: <b>×'+fx(F.k)+'</b> <span class="mu">'+(F.auto?'(mediana de '+F.n+(F.n===1?' ruta':' rutes')+' respecte a '+MN[m]+')':'(manual)')+'</span></div><div class="mu">×1,00 = vas com el mètode; més gran = vas més lent. Desmarca les sortides que no siguin representatives (carreres, mal temps…).</div>':'<p class="mu" style="margin:6px 0">Encara no tens rutes: es fa servir el mètode tal qual (×1,00).</p>';
 S.rt.forEach(function(r){var b=base(m,r.d,r.u,r.dn),on=r.on!==false;
  h+='<div class="rt-r"><input type="checkbox" data-a="tog" data-id="'+r.id+'"'+(on?' checked':'')+'><div class="n"><b>'+esc(r.n)+'</b><span class="mu">'+r.dt.split('-').reverse().slice(0,2).join('/')+' · '+(r.d/1000).toFixed(1).replace('.',',')+' km · +'+r.u+'/−'+r.dn+' m · marxa '+hm(r.mt/3600)+(b>0?' · ×'+fx(r.mt/3600/b):'')+'</span></div><button class="sm" data-a="rm" data-id="'+r.id+'" aria-label="Treu">✕</button></div>'});
 $('rt-list').innerHTML=h;
}

/* ---------- interfície ---------- */
var CSS='\
.rt-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.rt-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}\
#t-ruta label{display:block;font-size:12px;color:var(--mu)}#t-ruta label input,#t-ruta label select{display:block;width:100%;margin-top:3px;font:inherit;font-size:15px;color:var(--tx);padding:10px;border-radius:12px;border:1px solid var(--bd);background:var(--bg)}\
.rt-big{font-size:38px;font-weight:800;letter-spacing:-1px}.rt-big small{font-size:14px;font-weight:400;color:var(--mu);letter-spacing:0}\
.rt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}\
.rt-sun{margin:6px 0;padding:10px 12px;border-radius:14px;background:var(--bg)}.rt-line{margin:6px 0;line-height:1.45}.rt-sim{margin-top:10px;padding-top:8px;border-top:1px solid var(--bd)}\
.rt-r{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--bd)}.rt-r input{width:20px;height:20px;flex:none}.rt-r .n b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.rt-fk{font-size:16px;margin:6px 0 2px}#t-ruta details{margin-top:12px}#t-ruta summary{cursor:pointer;color:var(--mu);font-size:13px}';
function build(){
 var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 sec=document.createElement('section');sec.id='t-ruta';sec.className='toolsec';sec.style.display='none';
 sec.innerHTML='<div class="card"><h2>La ruta</h2><div class="rt-g"><label>Distància (km)<input type="text" id="rt-d" inputmode="decimal" placeholder="12,5"></label><label>Desnivell + (m)<input type="text" id="rt-u" inputmode="decimal" placeholder="900"></label><label>Desnivell − (m)<input type="text" id="rt-n" inputmode="decimal" placeholder="900"></label></div>'+
  '<div class="row"><div class="seg" id="rt-m"><button data-a="m" data-v="nai">Naismith</button><button data-a="m" data-v="mide">MIDE (aprox.)</button></div></div>'+
  '<div class="rt-g2"><label>Tipus<select id="rt-ty"><option value="ai">Anada i tornada</option><option value="ci">Circular / un sentit</option></select></label><label>Terreny (respecte al teu habitual)<select id="rt-tr"><option value="0.9">Més fàcil (pista)</option><option value="1">Igual</option><option value="1.15">Més tècnic</option><option value="1.3">Molt tècnic</option></select></label><label>Dia<input type="date" id="rt-date"></label><label>Hora de sortida<input type="time" id="rt-t" value="08:00"></label><label>Pauses totals (min)<input type="text" id="rt-p" inputmode="numeric"></label></div></div>'+
  '<div class="card"><h2>Temps estimat</h2><div id="rt-out"></div></div>'+
  '<div class="card"><h2>Llum del dia</h2><div class="rt-g"><label>Latitud<input type="text" id="rt-la" inputmode="decimal"></label><label>Longitud<input type="text" id="rt-lo" inputmode="decimal"></label><label>Marge (min)<input type="text" id="rt-mg" inputmode="numeric"></label></div><div class="rt-g2"><label>Es fa fosc a…<select id="rt-al"><option value="-0.833">la posta de sol</option><option value="-6">el final del crepuscle</option></select></label><div style="align-self:end"><button class="sm" data-a="gps" style="width:100%;padding:11px">📍 Usa la meva posició</button></div></div></div>'+
  '<div class="card"><h2>El meu ritme</h2><p class="mu" style="margin:0 0 8px">Carrega GPX de sortides teves sense neu (amb hora i altitud): el temps es calibra amb el que realment tardes.</p><label class="btn pri big" for="rt-f">📂 Afegeix GPX</label><input type="file" id="rt-f" multiple accept=".gpx"><div class="mu" id="rt-msg"></div><div id="rt-k"></div><div id="rt-list"></div>'+
  '<details><summary>Ajusta el mètode i el factor</summary><div class="rt-g2"><label>Factor manual (buit = automàtic)<input type="text" id="rt-kf" inputmode="decimal"></label><span></span></div><div class="rt-g" style="margin-top:10px"><label>km/h en pla<input type="text" id="rt-ph" inputmode="decimal"></label><label>m/h de pujada<input type="text" id="rt-pu" inputmode="decimal"></label><label>m/h de baixada<input type="text" id="rt-pd" inputmode="decimal"></label></div><p class="mu">Naismith clàssic: 5 km/h + 600 m/h de pujada (baixada = 0, no compta). MIDE (aprox.) suma temps horitzontal i vertical amb valors orientatius: ajusta’ls si cal.</p><button class="sm" data-a="reset">Restaura els valors del mètode</button></details></div>';
 document.querySelector('main').appendChild(sec);
 sec.addEventListener('click',onClick);
 function ev(e){var i=e.target.id;if(i&&i.indexOf('rt-')===0&&i!=='rt-f'){rd();save();calc();drawRt()}}
 sec.addEventListener('input',ev);sec.addEventListener('change',function(e){if(e.target.id==='rt-f')onFiles(e.target);else ev(e)});
}
function rd(){
 S.pause=nv('rt-p');S.terr=+$('rt-tr').value||1;S.tipus=$('rt-ty').value;S.alt=+$('rt-al').value;S.marg=nv('rt-mg');
 S.lat=nv('rt-la')||S.lat;S.lon=$('rt-lo').value.trim()===''?S.lon:nv('rt-lo');S.kf=$('rt-kf').value.trim()===''?'':nv('rt-kf');
 var P=S.p[S.m],D0=DEF.p[S.m];P.h=nv('rt-ph')||D0.h;P.u=nv('rt-pu')||D0.u;P.d=nv('rt-pd');
}
function fillP(){var P=S.p[S.m];$('rt-ph').value=P.h;$('rt-pu').value=P.u;$('rt-pd').value=P.d;Array.prototype.forEach.call(document.querySelectorAll('#rt-m button'),function(b){b.classList.toggle('on',b.dataset.v===S.m)})}
function fill(){$('rt-p').value=S.pause;$('rt-tr').value=String(S.terr);$('rt-ty').value=S.tipus;$('rt-al').value=String(S.alt);$('rt-mg').value=S.marg;$('rt-la').value=S.lat;$('rt-lo').value=S.lon;$('rt-kf').value=S.kf;fillP()}
function onClick(e){
 var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a;
 if(a==='m'){rd();S.m=b.dataset.v;fillP()}
 else if(a==='tog'){var r=S.rt.filter(function(x){return x.id===b.dataset.id})[0];if(r)r.on=b.checked}
 else if(a==='rm'){S.rt=S.rt.filter(function(x){return x.id!==b.dataset.id})}
 else if(a==='reset'){S.p[S.m]=JSON.parse(JSON.stringify(DEF.p[S.m]));fillP()}
 else if(a==='gps'){if(navigator.geolocation)navigator.geolocation.getCurrentPosition(function(p){S.lat=+p.coords.latitude.toFixed(3);S.lon=+p.coords.longitude.toFixed(3);fill();save();calc()},function(){$('rt-msg').textContent='No he pogut obtenir la posició.'});return}
 save();calc();drawRt();
}
function sync(){if(!sec)return;if(location.hash.slice(1)==='ruta'){sec.style.display='';calc()}}
load();build();fill();$('rt-date').value=iso(new Date());calc();drawRt();sync();
window.addEventListener('hashchange',sync);
})();
