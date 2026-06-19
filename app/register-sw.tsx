'use client'

import { useEffect } from 'react'

// The service worker is cache-first for HTML and /_next/static, which is great
// for the installed PWA in production but DISASTROUS in development — it serves
// stale pages/JS/CSS so code changes never appear. So: register only in
// production; in development, unregister any existing SW and purge its caches so
// the browser always sees fresh output.
export default function RegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    if (process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
      return
    }

    // Development: tear down any previously-installed SW + caches.
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister())
    })
    if (window.caches) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
    }
  }, [])

  return null
}
