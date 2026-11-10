/*
 * E-3913 / F-3931 Controle Concept — atualização V1.3.5
 * Atualiza app.js e componentes da V1.3.5, preservando consistência da PWA.
 * Mantém o uso offline dos últimos arquivos baixados.
 */
const CACHE = 'e3913-f3931-concept-v1.3.5';
const PREFIX = 'e3913-f3931-concept-';
const ASSETS = [
  './', './index.html', './style.css', './app.js',
  './interlock.js', './interlock.css',
  './assets/intertravamento-gas-acido-original.png',
  './assets/diagrama-original.png', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Revalida arquivos mesmo que o navegador tenha uma versão HTTP antiga.
    await cache.addAll(ASSETS.map(url => new Request(url, {cache: 'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isPage = request.mode === 'navigate';
  const isProgramFile = /\.(?:js|css|webmanifest)$/i.test(url.pathname);

  if (isPage || isProgramFile) {
    // HTML/JS/CSS: rede primeiro para evitar HTML V1.2 com JS V1.1.1.
    event.respondWith((async () => {
      try {
        const response = await fetch(request, {cache: 'no-cache'});
        if (response.ok) {
          const cache = await caches.open(CACHE);
          const key = isPage ? './index.html' : request;
          event.waitUntil(cache.put(key, response.clone()));
        }
        return response;
      } catch (error) {
        const cached = isPage
          ? await caches.match('./index.html')
          : await caches.match(request);
        if (cached) return cached;
        throw error;
      }
    })());
    return;
  }

  // Diagramas, ícones e outras mídias: cache primeiro com fallback na rede.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      event.waitUntil(cache.put(request, response.clone()));
    }
    return response;
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
