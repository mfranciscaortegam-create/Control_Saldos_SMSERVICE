const CACHE='sm-service-v1';
const APP=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
const REMOTE=[
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(async cache=>{
    await cache.addAll(APP);
    for(const url of REMOTE){ try{ const r=await fetch(url,{mode:'cors'}); if(r.ok) await cache.put(url,r.clone()); }catch(e){} }
  }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  event.respondWith(caches.match(req).then(cached=>cached || fetch(req).then(resp=>{
    if(resp && resp.ok){ const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); }
    return resp;
  }).catch(()=>caches.match('./index.html'))));
});
