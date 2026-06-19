'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Resolves a typed VB-XXXX code to its canje (scoped to this merchant's businesses)
// and routes to the shared /validar/[id] confirm screen — one validation path for
// both scan and manual entry.
export default function CodigoForm() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [estado, setEstado] = useState<'idle' | 'buscando' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function buscar(e: React.FormEvent) {
    e.preventDefault()
    setEstado('buscando')
    setMensaje('')
    try {
      const res = await fetch(
        `/api/beneficios/comercio/buscar?codigo=${encodeURIComponent(codigo.trim())}`,
      )
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.id) {
        router.push(`/beneficios/comercio/validar/${data.id}`)
        return
      }
      setEstado('error')
      setMensaje(
        data.error === 'no_encontrado'
          ? 'No encontramos ese código en tu comercio.'
          : data.error === 'sin_comercio'
            ? 'Tu cuenta no tiene un comercio asociado.'
            : 'Revisá el código e intentá de nuevo.',
      )
    } catch {
      setEstado('error')
      setMensaje('Sin conexión. Intentá otra vez.')
    }
  }

  return (
    <form onSubmit={buscar} className="mt-3 space-y-3">
      <input
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
        placeholder="VB-XXXX"
        autoCapitalize="characters"
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-center font-mono text-lg tracking-widest text-gray-900 focus:border-green-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={estado === 'buscando' || codigo.trim().length < 3}
        className="w-full rounded-lg bg-green-600 px-4 py-2.5 font-bold text-white hover:bg-green-700 disabled:opacity-60"
      >
        {estado === 'buscando' ? 'Buscando…' : 'Buscar cupón'}
      </button>
      {estado === 'error' && <p className="text-sm font-semibold text-red-600">{mensaje}</p>}
    </form>
  )
}
