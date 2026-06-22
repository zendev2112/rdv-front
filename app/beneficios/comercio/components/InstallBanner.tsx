'use client'

import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

// Invites the merchant to install the Volga Comercios PWA. The banner shows on every
// platform as long as the app isn't already installed (standalone) and wasn't dismissed
// this session — it does NOT wait for the flaky `beforeinstallprompt` event. When that
// event IS available (Android/desktop Chrome), the Instalar button fires the native
// install prompt; otherwise it reveals manual instructions (iOS share sheet, or the
// browser's ⋮ → "Instalar app" menu). Dismiss uses sessionStorage, so it returns next
// launch instead of disappearing forever.
type Prompt = Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }

export default function InstallBanner() {
  const [deferred, setDeferred] = useState<Prompt | null>(null)
  const [ios, setIos] = useState(false)
  const [show, setShow] = useState(false)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) return
    if (sessionStorage.getItem('vb-comercios-install-dismissed') === '1') return

    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent))
    setShow(true)

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as Prompt)
    }
    const onInstalled = () => setShow(false)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function instalar() {
    if (deferred) {
      deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
      setShow(false)
      return
    }
    // No native prompt available — reveal the manual how-to instead.
    setHint(true)
  }

  function cerrar() {
    sessionStorage.setItem('vb-comercios-install-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

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
          ) : hint ? (
            <p className="text-[11px] text-white/80">
              Abrí el menú ⋮ del navegador y elegí «Instalar app».
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
