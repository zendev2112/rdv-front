'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Primary canje action: ensure a session (lazy anonymous sign-in — the user
// never sees a signup wall), record the "mostrá la pantalla" canje, then go to
// the cupón. No scanner, no QR (SPEC §0).
export default function UsarBeneficioButton({
  benefitId,
  activacionId,
}: {
  benefitId: string
  activacionId?: string | null
}) {
  const router = useRouter()
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function usar() {
    setEstado('cargando')
    setMensaje('')
    try {
      const supabase = createBeneficiosBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        const { error } = await supabase.auth.signInAnonymously()
        if (error) throw new Error('No pudimos iniciar tu sesión. Probá de nuevo.')
      }

      const res = await fetch('/api/beneficios/canje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ benefit_id: benefitId, activacion_id: activacionId ?? null }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.error === 'ya_canjeado')
          throw new Error('Ya usaste este beneficio por ahora. Volvé más tarde.')
        if (data.error === 'beneficio_vencido') throw new Error('Este beneficio ya venció.')
        throw new Error('No pudimos generar tu beneficio. Probá de nuevo.')
      }
      const { redemption } = await res.json()
      router.push(`/beneficios/cupon/${redemption.id}`)
    } catch (e) {
      setEstado('error')
      setMensaje(e instanceof Error ? e.message : 'Ocurrió un error.')
    }
  }

  return (
    <div>
      <button
        onClick={usar}
        disabled={estado === 'cargando'}
        className="w-full rounded-xl bg-primary-red px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-primary-red/20 transition-all hover:bg-primary-red/90 hover:shadow-lg hover:shadow-primary-red/30 active:scale-[0.98] disabled:opacity-60"
      >
        {estado === 'cargando' ? 'Generando…' : 'Usar beneficio ahora'}
      </button>
      {estado === 'error' && <p className="mt-2 text-xs text-primary-red">{mensaje}</p>}
    </div>
  )
}
