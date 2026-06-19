'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Shown when a password-recovery link returns the user here logged in (?reset=1).
// They set a new password via updateUser on the active recovery session.
export default function NuevaClaveForm({ next }: { next: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setEstado('cargando')
    const supabase = createBeneficiosBrowserClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setEstado('error')
      setMensaje('No pudimos cambiar la contraseña. Pedí un nuevo link.')
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={guardar} className="mt-6 space-y-3">
      <p className="text-sm text-gray-600">Elegí una nueva contraseña.</p>
      <input
        type="password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-red-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={estado === 'cargando'}
        className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {estado === 'cargando' ? 'Guardando…' : 'Guardar contraseña'}
      </button>
      {estado === 'error' && <p className="text-sm text-red-600">{mensaje}</p>}
    </form>
  )
}
