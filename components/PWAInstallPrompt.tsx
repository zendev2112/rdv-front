'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

// Never show to someone who already installed the app; keep reminding those who
// haven't, on a cadence (not once-forever). Storage keys:
//   pwa-installed  → 'true' once installed (permanent) → never prompt again
//   pwa-prompt-snooze → timestamp (ms) until which we stay quiet
const INSTALLED_KEY = 'pwa-installed'
const SNOOZE_KEY = 'pwa-prompt-snooze'
const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
// Ignored (shown but not acted on) → remind again tomorrow. Dismissed with ✕ →
// give it a few days. Tune these two to make it more/less insistent.
const SNOOZE_ON_SHOW = 1 * DAY
const SNOOZE_ON_DISMISS = 3 * DAY

function isInstalled(): boolean {
  if (typeof window === 'undefined') return false
  if (localStorage.getItem(INSTALLED_KEY) === 'true') return true
  const standalone = window.matchMedia?.('(display-mode: standalone)')?.matches
  const iosStandalone = (window.navigator as any).standalone === true
  return !!(standalone || iosStandalone)
}

function snooze(ms: number) {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + ms))
  } catch {}
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // 1. Already installed → never prompt, and remember it permanently.
    if (isInstalled()) {
      localStorage.setItem(INSTALLED_KEY, 'true')
      return
    }
    // 2. Within a snooze window → stay quiet for now.
    const snoozeUntil = Number(localStorage.getItem(SNOOZE_KEY) || 0)
    if (Date.now() < snoozeUntil) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
      // Showing counts as one reminder: if ignored, come back tomorrow (not on
      // every reload). Dismiss/install override this below.
      snooze(SNOOZE_ON_SHOW)
      setTimeout(() => setShowPrompt(false), 12000)
    }

    // The app was installed (this tab or another) → never prompt again.
    const onInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, 'true')
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setShowPrompt(false)
    setDeferredPrompt(null)
    if (outcome === 'accepted') {
      // 'appinstalled' will also fire, but set it now so we never re-prompt.
      localStorage.setItem(INSTALLED_KEY, 'true')
    } else {
      snooze(SNOOZE_ON_DISMISS)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    snooze(SNOOZE_ON_DISMISS)
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-24 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40 animate-slide-in md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Download className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Descargar app</p>
            <p className="text-xs text-gray-600 mt-1">
              Accedé a Radio del Volga desde tu pantalla de inicio
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={handleInstall}
        className="mt-3 w-full bg-primary-red text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
      >
        Instalar
      </button>
    </div>
  )
}
