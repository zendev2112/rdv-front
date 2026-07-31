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

// iPhone/iPad Safari that has NOT installed the app. Only Safari's share sheet has
// "Add to Home Screen", so we exclude other iOS browsers (Chrome/Firefox/Edge) and
// in-app webviews (Instagram/Facebook), where the instruction wouldn't work.
function isIosSafariNotInstalled(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent || ''
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' &&
      (navigator as any).maxTouchPoints > 1)
  if (!isIOS) return false
  if ((window.navigator as any).standalone === true) return false // already installed
  const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|opt\//i.test(ua)
  const inApp = /fban|fbav|instagram|line\/|micromessenger/i.test(ua)
  return isSafari && !inApp
}

function snooze(ms: number) {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + ms))
  } catch {}
}

// The iOS share glyph (a box with an arrow out of the top) so users recognize the
// button they need to tap in Safari's toolbar.
function IosShareIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block align-text-bottom text-primary-red"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M8 11H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2" />
    </svg>
  )
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [mode, setMode] = useState<'android' | 'ios' | null>(null)

  useEffect(() => {
    // 1. Already installed → never prompt, and remember it permanently.
    if (isInstalled()) {
      localStorage.setItem(INSTALLED_KEY, 'true')
      return
    }
    // 2. Within a snooze window → stay quiet for now.
    const snoozeUntil = Number(localStorage.getItem(SNOOZE_KEY) || 0)
    if (Date.now() < snoozeUntil) return

    // 3a. iOS Safari: no beforeinstallprompt exists — show manual instructions.
    if (isIosSafariNotInstalled()) {
      setMode('ios')
      setShowPrompt(true)
      snooze(SNOOZE_ON_SHOW)
      const t = setTimeout(() => setShowPrompt(false), 15000)
      return () => clearTimeout(t)
    }

    // 3b. Chromium (Android/desktop): use the native install event.
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setMode('android')
      setShowPrompt(true)
      snooze(SNOOZE_ON_SHOW)
      setTimeout(() => setShowPrompt(false), 12000)
    }
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
      localStorage.setItem(INSTALLED_KEY, 'true')
    } else {
      snooze(SNOOZE_ON_DISMISS)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    snooze(SNOOZE_ON_DISMISS)
  }

  if (!showPrompt) return null
  if (mode === 'android' && !deferredPrompt) return null

  return (
    <div className="fixed bottom-24 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40 animate-slide-in md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Download className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Descargar app</p>
            {mode === 'ios' ? (
              <p className="text-xs text-gray-600 mt-1">
                Tocá Compartir <IosShareIcon /> en la barra de Safari y elegí{' '}
                <span className="font-semibold">«Agregar a inicio»</span>.
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-1">
                Accedé a Radio del Volga desde tu pantalla de inicio
              </p>
            )}
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
      {mode === 'ios' ? (
        <button
          onClick={handleDismiss}
          className="mt-3 w-full bg-primary-red text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
        >
          Entendido
        </button>
      ) : (
        <button
          onClick={handleInstall}
          className="mt-3 w-full bg-primary-red text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
        >
          Instalar
        </button>
      )}
    </div>
  )
}
