'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

// VAPID public keys are URL-safe base64; the Push API wants the raw bytes.
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

type Estado =
  | 'cargando'
  | 'no-soportado'
  | 'inactivo'
  | 'activo'
  | 'bloqueado'
  | 'trabajando'

// Opt-in control for Web Push. Reflects the real subscription state (reads it from
// the service worker on mount), so it stays correct across devices/sessions.
export default function NotificacionesToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const [estado, setEstado] = useState<Estado>('cargando')
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  // Subscriptions are account-tied, so we need to know if there's a session. On the
  // public home page a logged-out visitor is sent to login before subscribing.
  useEffect(() => {
    const supabase = createBeneficiosBrowserClient()
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user))
  }, [])

  useEffect(() => {
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window) ||
      !VAPID_PUBLIC
    ) {
      setEstado('no-soportado')
      return
    }
    if (Notification.permission === 'denied') {
      setEstado('bloqueado')
      return
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEstado(sub ? 'activo' : 'inactivo'))
      .catch(() => setEstado('inactivo'))
  }, [])

  async function activar() {
    if (!loggedIn) {
      router.push(
        `/beneficios/cuenta?next=${encodeURIComponent(pathname || '/beneficios')}`,
      )
      return
    }
    setEstado('trabajando')
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        setEstado(perm === 'denied' ? 'bloqueado' : 'inactivo')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC!),
      })
      const res = await fetch('/api/beneficios/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      setEstado(res.ok ? 'activo' : 'inactivo')
    } catch {
      setEstado('inactivo')
    }
  }

  async function desactivar() {
    setEstado('trabajando')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/beneficios/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setEstado('inactivo')
    } catch {
      setEstado('inactivo')
    }
  }

  if (estado === 'cargando' || estado === 'no-soportado') return null

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
          {estado === 'activo' ? <BellRing size={20} /> : <Bell size={20} />}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-gray-900">Notificaciones</p>
          <p className="text-xs text-gray-500">
            {estado === 'activo'
              ? 'Te avisamos cuando haya nuevos beneficios.'
              : estado === 'bloqueado'
                ? 'Están bloqueadas. Activálas desde los ajustes del navegador.'
                : 'Recibí un aviso cuando haya nuevos beneficios.'}
          </p>
        </div>
      </div>

      {estado === 'bloqueado' ? (
        <BellOff size={20} className="shrink-0 text-gray-400" />
      ) : estado === 'activo' ? (
        <button
          type="button"
          onClick={desactivar}
          className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
        >
          Desactivar
        </button>
      ) : (
        <button
          type="button"
          onClick={activar}
          disabled={estado === 'trabajando'}
          className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {estado === 'trabajando' ? 'Un momento…' : 'Activar'}
        </button>
      )}
    </div>
  )
}
