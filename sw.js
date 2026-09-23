// 네트워크 우선, 실패 시 캐시 — 업데이트는 바로 반영되고 오프라인(작업장)에서도 열림
const CACHE = 'tofu-recipe-v13';
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
  // 앱 파일은 브라우저 HTTP 캐시(GitHub Pages max-age=600)를 건너뛰고 서버에 확인해 새 버전과 옛 버전이 섞이지 않게 한다
  const req = url.origin === location.origin ? fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(e.request);
  e.respondWith(
    req
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
