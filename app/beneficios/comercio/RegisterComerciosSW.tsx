'use client'

import { useEffect } from 'react'

// Registers the Volga Comercios service worker (scoped to the merchant area only)
// so the panel is installable. Production-only — in dev we skip it to avoid stale
// caches. A root-served SW can take a narrower scope without extra headers.
export default function RegisterComerciosSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return
    navigator.serviceWorker
      .register('/comercios-sw.js', { scope: '/beneficios/comercio' })
      .catch((e) => console.error('Comercios SW registration failed:', e))
  }, [])
  return null
}
