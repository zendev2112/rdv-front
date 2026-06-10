// Radio del Volga — service worker.
//
// Strategy per resource type:
//   - /_next/static/*  (hashed, immutable JS/CSS) -> cache-first  (instant repeat launches)
//   - Cloudinary images                           -> stale-while-revalidate
//   - page navigations (HTML)                     -> network-first, fall back to cache/offline
//   - everything else (API, etc.)                 -> passthrough to network (always fresh)
//
// Caches are versioned; bumping VERSION purges old caches on activate so a new
// deploy rolls out cleanly. HTML is never served stale (network-first), so news
// stays current; only immutable assets and images are served from cache.

const VERSION = 'v2'
const STATIC_CACHE = `rdv-static-${VERSION}`
const PAGE_CACHE = `rdv-pages-${VERSION}`
const IMAGE_CACHE = `rdv-images-${VERSION}`

// Minimal app shell precached on install. Kept small on purpose: if any entry
// 404s, addAll() rejects and install fails — so only stable, known assets here.
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

// Try the network first (fresh content); on failure fall back to the cached
// copy, then to the cached homepage shell so navigation never hard-fails.
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response && response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    const cached = await cache.match(request)
    if (cached) return cached
    const shell = await caches.match('/')
    if (shell) return shell
    throw err
  }
}

// --- routing --------------------------------------------------------------

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Immutable Next.js build assets -> cache-first.
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Cloudinary images -> stale-while-revalidate.
  if (url.hostname === 'res.cloudinary.com') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE))
    return
  }

  // Page navigations (HTML) -> network-first with cache/offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE))
    return
  }

  // Everything else (APIs, third parties): straight to network, untouched.
})
