'use client'

import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

// Install prompt for Volga Comercios — mirrors the proven consumer PWAInstallPrompt:
// the Instalar button is shown ONLY once the browser has handed us a real
// `beforeinstallprompt` event, so tapping it always fires the native install dialog
// (never a dead "open the menu" fallback). iOS has no such event, so it gets a short
// manual hint instead of a button. Hidden when already installed (standalone) or
// dismissed this session (sessionStorage → returns on next launch).
type Prompt = Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }

export default function InstallBanner() {
  const [deferred, setDeferred] = useState<Prompt | null>(null)
  const [ios, setIos] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) return
    if (sessionStorage.getItem('vb-comercios-install-dismissed') === '1') return

    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      setIos(true)
      setShow(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as Prompt)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function instalar() {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setShow(false)
  }

  function cerrar() {
    sessionStorage.setItem('vb-comercios-install-dismissed', '1')
    setShow(false)
  }

  // Only render when we can actually act: a real prompt (Android) or iOS instructions.
  if (!show || (!ios && !deferred)) return null

  return (
    <div className="bg-brand-dark px-4 py-3 text-white">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Download size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight">Instalá Volga Comercios</p>
          {ios ? (
            <p className="text-[11px] text-white/80">
              Tocá <Share size={11} className="inline align-text-bottom" /> Compartir → «Agregar a
              inicio»
            </p>
          ) : (
            <p className="text-[11px] text-white/80">Tenela como app en el teléfono del local.</p>
          )}
        </div>
        {!ios && (
          <button
            onClick={instalar}
            className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand"
          >
            Instalar
          </button>
        )}
        <button onClick={cerrar} className="shrink-0 rounded-full p-1.5 text-white/80">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
