// Service worker: deja instalar la web como app y, sin internet, muestra lo último que se vio.
// Siempre pide primero a la red (así nunca queda una versión vieja) y guarda una copia por si no hay conexión.
var CACHE = 'salgueros-v1';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  var pedido = e.request;
  if (pedido.method !== 'GET' || new URL(pedido.url).origin !== location.origin) return;
  e.respondWith(fetch(pedido).then(function (respuesta) {
    if (respuesta.ok) {
      var copia = respuesta.clone();
      caches.open(CACHE).then(function (c) { c.put(pedido, copia); });
    }
    return respuesta;
  }).catch(function () {
    return caches.match(pedido, { ignoreSearch: true }).then(function (r) { return r || caches.match('./'); });
  }));
});
