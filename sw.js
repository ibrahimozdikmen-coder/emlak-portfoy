const CACHE='armax-gayrimenkul-v16';
const CORE=['./','./index.html','./config.js','./manifest.webmanifest','./logo.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(new URL(e.request.url).origin===location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;
  })));
});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){}
  e.waitUntil(self.registration.showNotification(d.title||'Randevu',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.id,data:d,renotify:true,requireInteraction:true,silent:false}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const id=(e.notification.data||{}).id;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if('focus' in c){c.postMessage({open:id});return c.focus()}}
    return clients.openWindow('./?a='+id)}))});
