// 네트워크 우선, 실패 시 캐시 — 업데이트는 바로 반영되고 오프라인(작업장)에서도 열림
const CACHE = 'tofu-recipe-v9';
const ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'illustrations.js', 'sync.js', 'supabase-config.js',
  'data/standard-recipes.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png'];
const SDK_HOST = 'www.gstatic.com';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // 앱 파일만 캐시. Supabase 로그인·데이터 통신은 건드리지 않음
  if (url.origin !== location.origin && url.host !== SDK_HOST) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
