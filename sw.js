const CACHE = 'oge-v7';
const PRECACHE = ['./icon-192.png','./icon-512.png','./manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== 'oge-videos').map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

async function videoResp(req) {
  const c = await caches.open('oge-videos');
  const hit = await c.match(req.url);
  if (!hit) return fetch(req);
  const range = req.headers.get('range');
  if (!range) return hit;
  const buf = await hit.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let s = m[1] ? +m[1] : 0, e = m[2] ? +m[2] : buf.byteLength - 1;
  if (!m[1] && m[2]) { s = buf.byteLength - (+m[2]); e = buf.byteLength - 1; }
  e = Math.min(e, buf.byteLength - 1);
  return new Response(buf.slice(s, e + 1), { status: 206, statusText: 'Partial Content', headers: { 'Content-Type': 'video/mp4', 'Content-Range': 'bytes ' + s + '-' + e + '/' + buf.byteLength, 'Content-Length': String(e - s + 1), 'Accept-Ranges': 'bytes' } });
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method === 'GET' && url.pathname.indexOf('/videos/') >= 0) { e.respondWith(videoResp(e.request)); return; }
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/')) return;
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return res;
    }))
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NOTIFY_NOW') {
    e.waitUntil(self.registration.showNotification(e.data.title || 'ОГЭ', {
      body: e.data.body || 'Время заниматься',
      icon: './icon-192.png',
      tag: 'oge-daily',
      renotify: true,
      data: { url: './index.html' }
    }));
  }
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow('./index.html');
  }));
});
