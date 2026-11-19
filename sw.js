// 취준 RPG 서비스 워커: 온라인이면 항상 최신 파일, 오프라인이면 저장된 파일
const CACHE='jrpg-v1';
const FILES=['./','index.html','sprites.png','tiles.png','tex_grass.png','tex_floor.png','tex_arena.png','tex_wall.png','Galmuri11.woff2','Galmuri11-Bold.woff2','Galmuri14.woff2','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))))});
