const CACHE_NAME = 'orhan-oglu-v1';

// Fichiers vitaux à mettre en cache immédiatement (App Shell)
const STATIC_ASSETS = [
  '/iyiliksever1984/',
  '/iyiliksever1984/index.html',
  '/iyiliksever1984/manifest.json',
  '/iyiliksever1984/css/root.css',
  '/iyiliksever1984/css/layout.css',
  '/iyiliksever1984/css/components.css',
  '/iyiliksever1984/js/main.js',
  '/iyiliksever1984/js/store.js',
  '/iyiliksever1984/js/data.js',
  '/iyiliksever1984/js/render.js',
  '/iyiliksever1984/js/shuffle.js',
  '/iyiliksever1984/js/lettrine.js',
  '/iyiliksever1984/js/theme.js',
  '/iyiliksever1984/js/menu.js',
  '/iyiliksever1984/js/fab.js',
  '/iyiliksever1984/js/share.js',
  '/iyiliksever1984/js/search.js',
  '/iyiliksever1984/js/pwa.js',
  '/iyiliksever1984/assets/favicon/web-app-manifest-192x192.png',
  '/iyiliksever1984/assets/favicon/web-app-manifest-512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Pour les données JSON : Stratégie Network-First
  if (url.pathname.endsWith('.json') && !url.pathname.includes('manifest.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Pour le reste (HTML, CSS, JS, Fonts, Images) : Stratégie Cache-First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        // Mise en cache dynamique des nouvelles ressources (fonts, images)
        if (response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return response;
      }).catch(() => {
        // Fallback hors-ligne générique si besoin (optionnel)
      });
    })
  );
});
