const V='navalla-v12',SHELL=['./','index.html','manifest.json','tema.css','tema.js','despeses.js','tasques.js','motxilla.js','ruta.js','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='tiles').map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.hostname==='tile.openstreetmap.org'){
  e.respondWith(caches.open('tiles').then(async c=>{const h=await c.match(e.request);if(h)return h;
   try{const r=await fetch(e.request);c.put(e.request,r.clone());c.keys().then(k=>{if(k.length>400)c.delete(k[0])});return r}catch(_){return Response.error()}}));
  return}
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 /* Primer la xarxa (sempre l'última versió); si no hi ha connexió, la còpia desada. */
 e.respondWith(fetch(u.href,{cache:'no-cache'}).then(r=>{
  if(r.ok&&r.type==='basic'){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}
  return r
 }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(h=>h||Response.error())))});
