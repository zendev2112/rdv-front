'use client'

import { useState } from 'react'
import Link from 'next/link'

// The merchant's explicit confirm. Scanning only navigates here (a GET has no side
// effects); the canje is burned only when the merchant taps CONFIRMAR, which POSTs
// to /api/beneficios/comercio/validar (re-checks everything server-side).
export default function ConfirmCanje({
  id,
  codigo,
  descuento,
  comercio,
}: {
  id: string
  codigo: string
  descuento: string
  comercio: string
}) {
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'ok' | 'error'>('listo')
  const [mensaje, setMensaje] = useState('')

  async function confirmar() {
    setEstado('enviando')
    setMensaje('')
    try {
      const res = await fetch('/api/beneficios/comercio/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setEstado('ok')
        return
      }
      const data = await res.json().catch(() => ({}))
      const errores: Record<string, string> = {
        ya_validado: 'Este cupón ya fue usado.',
        ajeno: 'Este beneficio no es de tu comercio.',
        vencido: 'El beneficio está vencido.',
        inexistente: 'El cupón no existe.',
        sin_comercio: 'Tu cuenta no tiene un comercio asociado.',
        no_session: 'Se cerró la sesión. Volvé a ingresar.',
      }
      setEstado('error')
      setMensaje(errores[data.error] ?? 'No se pudo validar. Probá de nuevo.')
    } catch {
      setEstado('error')
      setMensaje('Sin conexión. Revisá la señal e intentá otra vez.')
    }
  }

  if (estado === 'ok') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-4xl text-white shadow-lg shadow-green-600/30">
          ✓
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-green-800">¡Canje válido!</h1>
        <p className="mt-2 text-sm text-green-900/80">
          Aplicá <strong>{descuento}</strong> en {comercio}.
        </p>
        <Link
          href="/beneficios/comercio/validar"
          className="mt-8 inline-block rounded-xl bg-green-600 px-8 py-3 text-sm font-bold text-white hover:bg-green-700"
        >
          Validar otro
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Cupón {codigo}</p>
      <h1 className="mt-2 text-2xl font-extrabold text-gray-900">{descuento}</h1>
      <p className="mt-1 text-sm text-gray-500">{comercio}</p>

      <button
        onClick={confirmar}
        disabled={estado === 'enviando'}
        className="mt-7 w-full rounded-xl bg-green-600 px-6 py-4 text-base font-extrabold text-white shadow-md shadow-green-600/20 hover:bg-green-700 disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Validando…' : 'CONFIRMAR CANJE'}
      </button>

      {estado === 'error' && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {mensaje}
        </p>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Confirmá solo después de aplicar el descuento al cliente.
      </p>
    </div>
  )
}
