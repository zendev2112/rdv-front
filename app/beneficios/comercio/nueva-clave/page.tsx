'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store } from 'lucide-react'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Reached only after the recovery link is exchanged at comercio/auth/callback, which
// leaves an active recovery session — middleware guards this path, so without that
// session the merchant is bounced to /ingresar. Here they set a new password via
// updateUser on the live session, then drop straight into the panel.
export default function NuevaClavePage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState<'idle' | 'guardando' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setEstado('guardando')
    setMensaje('')
    const supabase = createBeneficiosBrowserClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setEstado('error')
      setMensaje('No pudimos cambiar la contraseña. Pedí un link nuevo desde la pantalla de ingreso.')
      return
    }
    // The recovery link left an active session; sign out so the merchant logs in
    // fresh with the new password instead of dropping straight into the panel.
    await supabase.auth.signOut()
    router.replace('/beneficios/comercio/ingresar?updated=1')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <Store size={20} />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold text-gray-900">Volga Comercios</h1>
            <p className="text-xs text-gray-500">Nueva contraseña</p>
          </div>
        </div>

        <form onSubmit={guardar} className="mt-6 space-y-3">
          <p className="text-sm text-gray-600">Elegí una nueva contraseña para tu comercio.</p>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            disabled={estado === 'guardando'}
            className="w-full rounded-lg bg-brand px-4 py-2.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {estado === 'guardando' ? 'Guardando…' : 'Guardar contraseña'}
          </button>
          {estado === 'error' && <p className="text-sm text-red-600">{mensaje}</p>}
        </form>
      </div>
    </main>
  )
}
