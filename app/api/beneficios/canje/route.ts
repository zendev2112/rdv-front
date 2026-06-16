import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

// Records a "mostrá la pantalla" canje (SPEC §0). Self-reported, no scanner, no
// TTL. The only gate is the per-benefit cap (existing limite_tipo/limite_cantidad).
export const dynamic = 'force-dynamic'

// Human-readable reference shown at the counter. Avoids ambiguous chars (0/O/1/I).
function generarCodigo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `VB-${s}`
}

// Start of the rolling window for a benefit's cap. null = no time bound.
function inicioVentana(tipo: string): Date | null {
  const now = new Date()
  if (tipo === 'por_dia') {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (tipo === 'por_semana') {
    const d = new Date(now)
    const lunes = (d.getDay() + 6) % 7 // 0 = Monday
    d.setDate(d.getDate() - lunes)
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (tipo === 'por_mes') return new Date(now.getFullYear(), now.getMonth(), 1)
  if (tipo === 'total') return new Date(0)
  return null // 'ilimitado' or unknown
}

export async function POST(req: Request) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'no_session' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const benefitId: string | undefined = body.benefit_id
  const activacionId: string | null = body.activacion_id ?? null
  if (!benefitId) return NextResponse.json({ error: 'benefit_id_requerido' }, { status: 400 })

  // Benefit metadata via the admin client (non-user data; avoids RLS/grant surprises).
  const { data: ben } = await supabaseBeneficiosAdmin
    .from('benefits')
    .select('id, business_id, titulo, limite_tipo, limite_cantidad, fecha_fin')
    .eq('id', benefitId)
    .single()
  if (!ben) return NextResponse.json({ error: 'beneficio_inexistente' }, { status: 404 })

  const hoy = new Date().toISOString().slice(0, 10)
  if (ben.fecha_fin && ben.fecha_fin < hoy) {
    return NextResponse.json({ error: 'beneficio_vencido' }, { status: 410 })
  }

  // Cap check against the existing limite_tipo / limite_cantidad fields.
  if (ben.limite_tipo && ben.limite_tipo !== 'ilimitado' && ben.limite_cantidad) {
    const desde = inicioVentana(ben.limite_tipo)
    let q = supabase
      .from('redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('benefit_id', benefitId)
    if (desde) q = q.gte('created_at', desde.toISOString())
    const { count } = await q
    if ((count ?? 0) >= ben.limite_cantidad) {
      return NextResponse.json({ error: 'ya_canjeado' }, { status: 409 })
    }
  }

  // Insert under the user-scoped client so RLS (auth.uid() = user_id) applies.
  const { data: red, error } = await supabase
    .from('redemptions')
    .insert({
      user_id: user.id,
      benefit_id: ben.id,
      business_id: ben.business_id,
      activacion_id: activacionId,
      metodo: 'mostrar',
      codigo: generarCodigo(),
      estado: 'pendiente',
    })
    .select()
    .single()

  if (error || !red) {
    console.error('canje insert failed:', error?.message)
    return NextResponse.json({ error: 'no_creado' }, { status: 500 })
  }
  return NextResponse.json({ redemption: red }, { status: 201 })
}
