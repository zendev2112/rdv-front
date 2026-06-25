'use client'

import { useEffect, useState } from 'react'
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
  const [estado, setEstado] = useState<
    'idle' | 'entrando' | 'error' | 'reset-enviando' | 'reset-enviado' | 'actualizada'
  >('idle')
  const [mensaje, setMensaje] = useState('')

  // This page is the PWA start_url (it always returns 200, unlike the guarded panel,
  // which is required for the app to be installable). When an already-logged-in
  // merchant launches the installed app, forward them straight to the panel.
  useEffect(() => {
    // A recovery link that expired or was already used bounces back here with a flag.
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') === 'auth') {
      setEstado('error')
      setMensaje('El link de recuperación expiró o ya se usó. Pedí uno nuevo.')
      return // not logged in, so skip the session check / panel redirect
    }
    if (params.get('updated') === '1') {
      // Just reset the password — invite a fresh login, don't auto-enter the panel.
      setEstado('actualizada')
      setMensaje('Contraseña actualizada. Ingresá con tu nueva contraseña.')
      return
    }
    const supabase = createBeneficiosBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/beneficios/comercio/panel')
    })
  }, [router])

  // Sends a Supabase password-recovery email. The link returns to the merchant
  // callback on THIS origin (comercios subdomain), which exchanges it for a recovery
  // session and forwards to nueva-clave. Supabase reports success whether or not the
  // address has an account, so the confirmation never reveals which emails exist.
  async function recuperar() {
    if (!email.trim()) {
      setEstado('error')
      setMensaje('Escribí tu email arriba y volvé a tocar "¿Olvidaste tu contraseña?".')
      return
    }
    setEstado('reset-enviando')
    setMensaje('')
    const supabase = createBeneficiosBrowserClient()
    const redirectTo = `${window.location.origin}/beneficios/comercio/auth/callback?next=${encodeURIComponent(
      '/beneficios/comercio/nueva-clave',
    )}`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })
    if (error) {
      setEstado('error')
      setMensaje(error.message)
      return
    }
    setEstado('reset-enviado')
  }

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
          {estado === 'reset-enviado' && (
            <p className="text-sm text-green-700">
              Si esa dirección tiene una cuenta, te enviamos un link para restablecer la
              contraseña. Revisá tu email (y la carpeta de spam).
            </p>
          )}
          {estado === 'actualizada' && <p className="text-sm text-green-700">{mensaje}</p>}
          <button
            type="button"
            onClick={recuperar}
            disabled={estado === 'reset-enviando'}
            className="w-full text-center text-xs font-semibold text-brand hover:underline disabled:opacity-60"
          >
            {estado === 'reset-enviando' ? 'Enviando…' : '¿Olvidaste tu contraseña?'}
          </button>
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
