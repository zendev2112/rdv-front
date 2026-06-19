'use client'

import { useState } from 'react'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Merchant login (screen entry to the comercio area). MVP uses an email magic
// link (passwordless) — simplest, no password storage. Requires email auth to be
// enabled on the beneficios Supabase project (on by default; configure SMTP for
// production deliverability).
export default function IngresarPage() {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviado' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function enviarLink(e: React.FormEvent) {
    e.preventDefault()
    setEstado('enviando')
    setMensaje('')
    const supabase = createBeneficiosBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Land on the callback that exchanges the code for a session cookie, NOT
        // directly on the guarded /panel (the guard would bounce us with no session).
        emailRedirectTo: `${window.location.origin}/beneficios/comercio/auth/confirm`,
      },
    })
    if (error) {
      setEstado('error')
      setMensaje(error.message)
    } else {
      setEstado('enviado')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900">Volga Beneficios</h1>
        <p className="mt-1 text-sm text-gray-500">Panel del comercio</p>

        {estado === 'enviado' ? (
          <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            Te enviamos un enlace de acceso a <strong>{email}</strong>. Abrilo en este
            dispositivo para entrar.
          </div>
        ) : (
          <form onSubmit={enviarLink} className="mt-6 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@comercio.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal text-gray-900 focus:border-red-500 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {estado === 'enviando' ? 'Enviando…' : 'Enviar enlace de acceso'}
            </button>
            {estado === 'error' && <p className="text-sm text-red-600">{mensaje}</p>}
          </form>
        )}
      </div>
    </main>
  )
}
