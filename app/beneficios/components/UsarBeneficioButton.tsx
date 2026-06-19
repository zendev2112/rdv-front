'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Primary canje action. Register-to-redeem (SPEC §0b): if the visitor is logged
// out, we route them to /beneficios/cuenta carrying a `?usar=` intent so the canje
// resumes automatically after they sign in. If logged in, we record the "mostrá la
// pantalla" canje and go to the cupón. No scanner, no QR (SPEC §0).
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
  const resumed = useRef(false)

  async function usar() {
    setEstado('cargando')
    setMensaje('')
    try {
      const supabase = createBeneficiosBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Not a member yet → register-to-redeem. Return here with the intent to resume.
      if (!user) {
        const next = `${window.location.pathname}?usar=${benefitId}`
        router.push(`/beneficios/cuenta?next=${encodeURIComponent(next)}`)
        return
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
        if (data.error === 'no_autenticado') {
          const next = `${window.location.pathname}?usar=${benefitId}`
          router.push(`/beneficios/cuenta?next=${encodeURIComponent(next)}`)
          return
        }
        throw new Error('No pudimos generar tu beneficio. Probá de nuevo.')
      }
      const { redemption } = await res.json()
      router.push(`/beneficios/cupon/${redemption.id}`)
    } catch (e) {
      setEstado('error')
      setMensaje(e instanceof Error ? e.message : 'Ocurrió un error.')
    }
  }

  // Resume after login: if we returned here with ?usar=<thisBenefit> and a session
  // now exists, fire the canje once and strip the param so it doesn't re-trigger.
  useEffect(() => {
    if (resumed.current) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('usar') !== benefitId) return
    resumed.current = true
    const clean = window.location.pathname
    window.history.replaceState(null, '', clean)
    usar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitId])

  return (
    <div>
      <button
        onClick={usar}
        disabled={estado === 'cargando'}
        className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/30 active:scale-[0.98] disabled:opacity-60"
      >
        {estado === 'cargando' ? 'Generando…' : 'Usar beneficio ahora'}
      </button>
      {estado === 'error' && <p className="mt-2 text-xs text-brand">{mensaje}</p>}
    </div>
  )
}
