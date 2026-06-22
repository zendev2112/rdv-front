'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store } from 'lucide-react'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Merchant login for Volga Comercios. Email + password (no self-signup): accounts
// exist only because an admin provisioned them and linked them to a business via
// merchant_users. A successful sign-in just creates the session cookie; the (guard)
// layout is what decides whether this account actually reaches a panel. No email
// infrastructure is involved in this flow.
export default function IngresarPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState<'idle' | 'entrando' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function ingresar(e: React.FormEvent) {
    e.preventDefault()
    setEstado('entrando')
    setMensaje('')
    const supabase = createBeneficiosBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) {
      setEstado('error')
      // Supabase returns "Invalid login credentials" — soften it for merchants.
      setMensaje(
        /invalid login/i.test(error.message)
          ? 'Email o contraseña incorrectos.'
          : error.message,
      )
      return
    }
    // Refresh so the server guard sees the new session, then enter the panel.
    router.replace('/beneficios/comercio/panel')
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
            <p className="text-xs text-gray-500">Panel del comercio</p>
          </div>
        </div>

        <form onSubmit={ingresar} className="mt-6 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@comercio.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal text-gray-900 focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">
            Contraseña
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal text-gray-900 focus:border-brand focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={estado === 'entrando'}
            className="w-full rounded-lg bg-brand px-4 py-2.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {estado === 'entrando' ? 'Ingresando…' : 'Ingresar'}
          </button>
          {estado === 'error' && <p className="text-sm text-red-600">{mensaje}</p>}
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          ¿Querés sumar tu comercio a Volga Beneficios?{' '}
          <a href="mailto:radiodelvolga@gmail.com" className="font-semibold text-brand">
            Escribinos
          </a>
          .
        </p>
      </div>
    </main>
  )
}
