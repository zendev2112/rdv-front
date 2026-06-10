// Radio del Volga — service worker.
//
// Goal: make the installed PWA launch *instantly* (paint from cache, refresh in
// the background) instead of waiting on the network.
//
// Strategy per resource type:
//   - page navigations (HTML)        -> CACHE-FIRST + background revalidate
//                                       (instant launch; fresh content next open)
//   - /_next/static/* (hashed JS/CSS)-> cache-first (immutable, never changes)
//   - Cloudinary images              -> stale-while-revalidate
//   - everything else (API, etc.)    -> passthrough to network (always fresh)
//
// Why cache-first for HTML is safe here: the homepage is content that tolerates
// being a few minutes old for one launch, and the background fetch updates the
// cache so the *next* launch is current. Hashed assets are immutable, so the
// cached HTML's chunk references always resolve. Caches are versioned; bump
// VERSION to force a clean rollout.

const VERSION = 'v3'
const STATIC_CACHE = `rdv-static-${VERSION}`
const PAGE_CACHE = `rdv-pages-${VERSION}`
const IMAGE_CACHE = `rdv-images-${VERSION}`

// App shell precached on install, so even the first launch has the homepage
// ready. Kept small: if any entry 404s, addAll() rejects, so only stable assets.
const PRECACHE_URLS = ['/', '/images/icon-192.png', '/images/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()), // never block install on a precache miss
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.endsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

// --- caching strategies ---------------------------------------------------

// Serve from cache if present; otherwise fetch, cache, and return.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response && (response.ok || response.type === 'opaque')) {
    cache.put(request, response.clone())
  }
  return response
}

// Return cached immediately (if any) while refreshing the cache in the
// background; fall back to the network on a cold cache.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)
  return cached || network
}

// --- routing --------------------------------------------------------------

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Page navigations -> cache-first for INSTANT launch, revalidate in the
  // background so the next open is fresh. Falls back to the precached homepage
  // shell when a specific page isn't cached and the network is unavailable.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PAGE_CACHE)
        const cached =
          (await cache.match(request)) || (await caches.match('/'))

        const network = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => null)

        if (cached) {
          // Paint instantly from cache; keep the SW alive to finish the
          // background refresh so the next launch is up to date.
          event.waitUntil(network)
          return cached
        }
        // Cold cache (e.g. first ever launch): wait for the network, then
        // fall back to the homepage shell if that fails too.
        return (await network) || (await caches.match('/'))
      })(),
    )
    return
  }

  // Immutable Next.js build assets -> cache-first.
  if (
    url.origin === self.location.origin &&
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Cloudinary images -> stale-while-revalidate.
  if (url.hostname === 'res.cloudinary.com') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE))
    return
  }

  // Everything else (APIs, third parties): straight to network, untouched.
})
