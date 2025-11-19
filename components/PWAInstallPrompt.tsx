'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-24 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40 animate-slide-in md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Download className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              Descargar app
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Accedé a Radio del Volga desde tu pantalla de inicio
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
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