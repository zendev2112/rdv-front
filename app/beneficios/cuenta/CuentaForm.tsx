'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

type Mode = 'login' | 'registro' | 'recuperar'

// Google can't carry our consent checkbox through the OAuth redirect, so we stash
// it briefly; the /auth/callback route reads it and records the opt-in.
function setConsentCookie(on: boolean) {
  document.cookie = `vb-consent=${on ? '1' : '0'}; path=/beneficios; max-age=600; samesite=lax`
}

export default function CuentaForm({ next, errorFlag }: { next: string; errorFlag: boolean }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'enviado' | 'reset' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  const supabase = createBeneficiosBrowserClient()
  const callbackUrl = () =>
    `${window.location.origin}/beneficios/auth/callback?next=${encodeURIComponent(next)}`

  async function conGoogle() {
    setEstado('cargando')
    setConsentCookie(consent)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl() },
    })
    if (error) {
      setEstado('error')
      setMensaje('No pudimos abrir Google. Probá de nuevo.')
    }
    // On success the browser navigates to Google; nothing else to do here.
  }

  async function conEmail(e: React.FormEvent) {
    e.preventDefault()
    setEstado('cargando')
    setMensaje('')

    if (mode === 'registro') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl(),
          data: { nombre, marketing_opt_in: consent },
        },
      })
      if (error) {
        setEstado('error')
        setMensaje(traducir(error.message))
        return
      }
      // Email confirmation on → no session yet. (identities empty ⇒ email already exists.)
      if (!data.session) {
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setEstado('error')
          setMensaje('Ese email ya tiene una cuenta. Probá iniciar sesión.')
          return
        }
        setEstado('enviado')
        return
      }
      router.push(next)
      router.refresh()
      return
    }

    // login
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setEstado('error')
      setMensaje(traducir(error.message))
      return
    }
    router.push(next)
    router.refresh()
  }

  async function olvideClave(e: React.FormEvent) {
    e.preventDefault()
    setEstado('cargando')
    setMensaje('')
    const redirectTo = `${window.location.origin}/beneficios/auth/callback?next=${encodeURIComponent(
      '/beneficios/cuenta?reset=1',
    )}`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) {
      setEstado('error')
      setMensaje(traducir(error.message))
    } else {
      setEstado('reset')
    }
  }

  if (estado === 'enviado') {
    return (
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Te enviamos un mail a <strong>{email}</strong> para confirmar tu cuenta. Abrilo y volvé —
        después podés usar tus beneficios.
      </div>
    )
  }
  if (estado === 'reset') {
    return (
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Si <strong>{email}</strong> tiene una cuenta, te mandamos un link para crear una nueva
        contraseña.
      </div>
    )
  }

  const cargando = estado === 'cargando'

  if (mode === 'recuperar') {
    return (
      <div className="mt-6">
        <h2 className="text-base font-extrabold text-gray-900">Recuperar contraseña</h2>
        <p className="mt-1 text-sm text-gray-600">
          Ingresá tu email y te mandamos un link para crear una nueva contraseña.
        </p>
        <form onSubmit={olvideClave} className="mt-4 space-y-3">
          <Field label="Email">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={inputCls}
            />
          </Field>
          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {cargando ? 'Enviando…' : 'Enviar link'}
          </button>
          {estado === 'error' && <p className="text-sm text-red-600">{mensaje}</p>}
        </form>
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setEstado('idle')
            setMensaje('')
          }}
          className="mt-4 text-xs font-bold text-red-600"
        >
          ← Volver al ingreso
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {errorFlag && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          No pudimos completar el ingreso. Probá otra vez.
        </p>
      )}

      <button
        onClick={conGoogle}
        disabled={cargando}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        <GoogleIcon />
        Entrar con Google
      </button>

      <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" /> o con email <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={conEmail} className="space-y-3">
        {mode === 'registro' && (
          <Field label="Nombre">
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className={inputCls}
            />
          </Field>
        )}
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputCls}
          />
        </Field>
        <Field label="Contraseña">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={inputCls}
          />
        </Field>

        {mode === 'registro' && (
          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Acepto recibir novedades de Volga Beneficios y la{' '}
              <Link href="/beneficios/privacidad" className="underline" target="_blank">
                política de privacidad
              </Link>
              .
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {cargando ? 'Un momento…' : mode === 'registro' ? 'Crear cuenta' : 'Entrar'}
        </button>

        {estado === 'error' && <p className="text-sm text-red-600">{mensaje}</p>}
      </form>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        {mode === 'login' ? (
          <button type="button" onClick={() => setMode('registro')} className="font-bold text-red-600">
            Crear una cuenta
          </button>
        ) : (
          <button type="button" onClick={() => setMode('login')} className="font-bold text-red-600">
            Ya tengo cuenta
          </button>
        )}
        {mode === 'login' && (
          <button
            type="button"
            onClick={() => {
              setMode('recuperar')
              setEstado('idle')
              setMensaje('')
            }}
            className="underline"
          >
            Olvidé mi contraseña
          </button>
        )}
      </div>
    </div>
  )
}

const inputCls =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-red-500 focus:outline-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">
      {label}
      {children}
    </label>
  )
}

// Map the few Supabase auth errors users actually hit to friendly Spanish.
function traducir(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'Email o contraseña incorrectos.'
  if (m.includes('email not confirmed')) return 'Confirmá tu email antes de entrar (revisá tu correo).'
  if (m.includes('password')) return 'La contraseña no es válida (mínimo 6 caracteres).'
  if (m.includes('rate limit')) return 'Demasiados intentos. Esperá un momento.'
  return 'No pudimos completar la acción. Probá de nuevo.'
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z"
      />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  )
}
