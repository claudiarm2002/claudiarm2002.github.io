const V='gpx-v5',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='tiles').map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.hostname==='tile.openstreetmap.org'){
  e.respondWith(caches.open('tiles').then(async c=>{const h=await c.match(e.request);if(h)return h;
   try{const r=await fetch(e.request);c.put(e.request,r.clone());c.keys().then(k=>{if(k.length>400)c.delete(k[0])});return r}catch(_){return Response.error()}}));
  return}
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request)))});
