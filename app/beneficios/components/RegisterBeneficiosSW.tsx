'use client'

import { useEffect } from 'react'

// Registers the push-only service worker for the consumer Beneficios area, scoped
// to /beneficios. Unlike the news-site SW (/sw.js, cache-first), this one does no
// caching, so it's safe to register in development too — which lets push be tested
// on localhost. Push requires a registered SW, so this is what makes opt-in work.
export default function RegisterBeneficiosSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    // The merchant area (/beneficios/comercio) runs its own SW (comercios-sw.js);
    // don't register the consumer push SW over it.
    if (window.location.pathname.startsWith('/beneficios/comercio')) return
    navigator.serviceWorker
      .register('/beneficios-sw.js', { scope: '/beneficios' })
      .catch((err) => console.error('Beneficios SW registration failed:', err))
  }, [])

  return null
}
