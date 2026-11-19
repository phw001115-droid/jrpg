// 취준 RPG 서비스 워커 v2
// 화면(index.html): 인터넷이 되면 최신 파일, 3초 안에 안 오거나 오프라인이면 저장된 파일
// 그림·글꼴: 저장된 파일을 바로 쓰고, 없을 때만 내려받음 (그림 주소에 버전이 붙어 있어 업데이트 때는 새로 받음)
const CACHE='jrpg-v2';
const FILES=['./','index.html','sprites.png?v=131','tiles.png?v=131','tex_grass.png','tex_floor.png','tex_arena.png','tex_wall.png','Galmuri11.woff2','Galmuri11-Bold.woff2','Galmuri14.woff2','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>null)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function isPage(req){return req.mode==='navigate'||/\/(index\.html)?$/.test(new URL(req.url).pathname)}
function timeout(ms,p){return new Promise((ok,no)=>{const t=setTimeout(()=>no(new Error('timeout')),ms);p.then(r=>{clearTimeout(t);ok(r)},e=>{clearTimeout(t);no(e)})})}
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  if(isPage(req)){
    e.respondWith(timeout(3000,fetch(req,{cache:'no-cache'})).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp))}return r})
      .catch(()=>caches.match('index.html').then(m=>m||fetch(req))));
    return}
  e.respondWith(caches.match(req).then(m=>m||fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})));
});
