// Volga Beneficios — push notification service worker (consumer side).
//
// Scoped to /beneficios. Intentionally PUSH-ONLY: no caching strategies, so it can
// never serve a stale page. (The news-site PWA caching SW, /sw.js, is a separate
// file and is not registered here.) This mirrors how the merchant area runs its own
// scoped SW, comercios-sw.js.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

// A push arrives with a JSON payload built by lib/beneficios-push.ts.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = {}
  }
  const title = data.title || 'Volga Beneficios'
  const options = {
    body: data.body || '',
    icon: data.icon || '/images/icon-192.png',
    badge: data.badge || '/images/icon-192.png',
    data: { url: data.url || '/beneficios' },
    tag: data.tag, // when set, a newer notification replaces an older same-tag one
    renotify: Boolean(data.tag),
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// Tapping the notification focuses an existing tab on the target, or opens one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/beneficios'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes(url) && 'focus' in client) return client.focus()
        }
        if (self.clients.openWindow) return self.clients.openWindow(url)
      }),
  )
})
