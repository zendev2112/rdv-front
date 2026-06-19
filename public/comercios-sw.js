// Volga Comercios — minimal service worker.
//
// Purpose: make the merchant panel installable as a PWA (Android needs a SW with a
// fetch handler). Strategy is NETWORK-FIRST: validation screens must always be
// current, so we never serve stale HTML — we only fall back to cache when offline.
// Scoped to /beneficios/comercio, so it never affects the consumer Beneficios app.
const CACHE = 'comercios-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(req)),
  )
})
