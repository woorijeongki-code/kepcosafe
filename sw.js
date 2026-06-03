// Cache Killer Service Worker
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('캐시 삭제됨:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // 캐시를 무시하고 무조건 네트워크에서 가져옵니다.
  // URL 뒤에 타임스탬프를 붙여 브라우저 캐시까지 무효화합니다.
  if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
    const url = new URL(e.request.url);
    url.searchParams.set('nocache', Date.now());
    e.respondWith(fetch(url.toString(), { cache: 'no-store' }));
  } else {
    e.respondWith(fetch(e.request));
  }
});
