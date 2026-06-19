'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Header account control (Phase 1a). Reads the member session client-side and shows
// "Hola, {nombre}" + Salir, or an "Ingresar" link when logged out. Keeps the canje
// gate's source of truth (the session cookie) and the header in sync via
// onAuthStateChange.
export default function CuentaButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [nombre, setNombre] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createBeneficiosBrowserClient()
    let active = true

    const resolve = (user: { email?: string; user_metadata?: any } | null) => {
      if (!user) return null
      const meta = user.user_metadata || {}
      return (
        meta.nombre ||
        meta.full_name ||
        meta.name ||
        (user.email ? user.email.split('@')[0] : 'vos')
      )
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setNombre(resolve(data.user))
      setReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!active) return
      setNombre(resolve(session?.user ?? null))
      setReady(true)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function salir() {
    const supabase = createBeneficiosBrowserClient()
    await supabase.auth.signOut()
    setNombre(null)
    router.refresh()
  }

  if (!ready) return null

  if (!nombre) {
    return (
      <Link
        href="/beneficios/cuenta"
        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
      >
        <User size={16} />
        {!compact && 'Ingresar'}
      </Link>
    )
  }

  const primerNombre = nombre.split(' ')[0]
  return (
    <div className="flex items-center gap-1.5">
      {!compact && (
        <span className="max-w-[7rem] truncate text-sm font-semibold text-gray-700">
          Hola, {primerNombre}
        </span>
      )}
      <button
        onClick={salir}
        aria-label="Salir"
        title="Salir"
        className="flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
      >
        <LogOut size={14} />
        {!compact && 'Salir'}
      </button>
    </div>
  )
}
