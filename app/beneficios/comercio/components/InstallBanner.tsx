'use client'

import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

// Invites the merchant to install the Volga Comercios PWA. On Android/Chrome it uses
// the native install prompt (beforeinstallprompt); on iOS Safari (which has no such
// event) it shows the manual "Compartir → Agregar a inicio" hint. Hidden when already
// installed (standalone) or after the merchant dismisses it.
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
    if (localStorage.getItem('vb-comercios-install-dismissed') === '1') return

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    if (isIos) {
      setIos(true)
      setShow(true)
      return
    }

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as Prompt)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  async function instalar() {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setShow(false)
  }

  function cerrar() {
    localStorage.setItem('vb-comercios-install-dismissed', '1')
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
