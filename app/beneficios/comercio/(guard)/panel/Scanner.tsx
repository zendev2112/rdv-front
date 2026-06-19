'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'

// In-app QR scanner for the merchant. Opens the camera INSIDE the app (no browser
// navigation), decodes the client's cupón QR, and validates it on the spot via the
// same /api/beneficios/comercio/validar endpoint — then shows the result in place.
// The QR encodes the validar URL; we just pull the redemption UUID out of it, so it
// works regardless of which domain the QR was generated on.
type Estado = 'idle' | 'scanning' | 'validando' | 'ok' | 'error'

const ERRORES: Record<string, string> = {
  ya_validado: 'Este cupón ya fue usado.',
  ajeno: 'Este beneficio no es de tu comercio.',
  vencido: 'El beneficio está vencido.',
  inexistente: 'El cupón no existe.',
  sin_comercio: 'Tu cuenta no tiene un comercio asociado.',
  no_session: 'Se cerró la sesión. Volvé a ingresar.',
}

function extraerId(texto: string): string {
  const m = texto.match(/\/validar\/([0-9a-fA-F-]{36})/)
  if (m) return m[1]
  return texto.trim()
}

export default function Scanner() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensaje, setMensaje] = useState('')
  const [descuento, setDescuento] = useState('')
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null)
  const handlingRef = useRef(false)

  const detener = useCallback(async () => {
    const s = scannerRef.current
    scannerRef.current = null
    if (s) {
      try {
        await s.stop()
        s.clear()
      } catch {
        /* already stopped */
      }
    }
  }, [])

  const validar = useCallback(
    async (texto: string) => {
      if (handlingRef.current) return
      handlingRef.current = true
      await detener()
      setEstado('validando')
      try {
        const res = await fetch('/api/beneficios/comercio/validar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: extraerId(texto) }),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          setDescuento(data.descuento ?? '')
          setEstado('ok')
        } else {
          setMensaje(ERRORES[data.error] ?? 'No se pudo validar. Probá de nuevo.')
          setEstado('error')
        }
      } catch {
        setMensaje('Sin conexión. Revisá la señal e intentá otra vez.')
        setEstado('error')
      }
    },
    [detener],
  )

  // Start the camera whenever we enter the scanning state (the #qr-reader div is
  // mounted by then). Dynamic import keeps the camera lib out of SSR.
  useEffect(() => {
    if (estado !== 'scanning') return
    let cancelado = false
    ;(async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        if (cancelado) return
        const html5 = new Html5Qrcode('qr-reader')
        scannerRef.current = html5
        await html5.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (texto) => validar(texto),
          () => {
            /* per-frame decode misses — ignore */
          },
        )
      } catch {
        if (!cancelado) {
          setMensaje('No pudimos abrir la cámara. Revisá los permisos o usá el código.')
          setEstado('error')
        }
      }
    })()
    return () => {
      cancelado = true
    }
  }, [estado, validar])

  useEffect(() => {
    return () => {
      void detener()
    }
  }, [detener])

  function abrir() {
    handlingRef.current = false
    setMensaje('')
    setDescuento('')
    setEstado('scanning')
  }

  async function cerrar() {
    await detener()
    handlingRef.current = false
    setEstado('idle')
  }

  return (
    <>
      <button
        onClick={abrir}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-base font-extrabold text-white shadow-md shadow-brand/20 hover:bg-brand/90"
      >
        <Camera size={22} /> Escanear QR
      </button>

      {estado !== 'idle' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 px-4 py-6">
          <div className="mx-auto flex w-full max-w-md items-center justify-between text-white">
            <span className="text-sm font-bold">
              {estado === 'scanning' && 'Apuntá al QR del cliente'}
              {estado === 'validando' && 'Validando…'}
              {estado === 'ok' && 'Canje válido'}
              {estado === 'error' && 'No se pudo validar'}
            </span>
            <button onClick={cerrar} className="rounded-full bg-white/10 p-2 text-white">
              <X size={18} />
            </button>
          </div>

          <div className="mx-auto mt-6 w-full max-w-md flex-1">
            {(estado === 'scanning' || estado === 'validando') && (
              <div
                id="qr-reader"
                className="overflow-hidden rounded-2xl bg-black [&_video]:rounded-2xl"
              />
            )}

            {estado === 'ok' && (
              <div className="rounded-2xl bg-green-50 p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-4xl text-white">
                  ✓
                </div>
                <h2 className="mt-5 text-2xl font-extrabold text-green-800">¡Canje válido!</h2>
                {descuento && (
                  <p className="mt-2 text-sm text-green-900/80">
                    Aplicá <strong>{descuento}</strong>.
                  </p>
                )}
                <div className="mt-7 space-y-2">
                  <button
                    onClick={abrir}
                    className="w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
                  >
                    Escanear otro
                  </button>
                  <button
                    onClick={cerrar}
                    className="w-full rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-700"
                  >
                    Listo
                  </button>
                </div>
              </div>
            )}

            {estado === 'error' && (
              <div className="rounded-2xl bg-red-50 p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-4xl text-white">
                  ✗
                </div>
                <p className="mt-5 text-sm font-semibold text-red-700">{mensaje}</p>
                <div className="mt-7 space-y-2">
                  <button
                    onClick={abrir}
                    className="w-full rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand/90"
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={cerrar}
                    className="w-full rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
