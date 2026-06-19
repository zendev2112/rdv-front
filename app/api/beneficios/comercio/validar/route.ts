import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

// Merchant-side canje validation — the accountable redemption (SPEC-comercios §Wave 1).
// The merchant confirms the canje from their own authenticated device; this is the
// source of truth, replacing the customer's old "Listo, lo usé" self-report.
//
// Ownership is enforced HERE in code (the canje belongs to another user, so the flip
// runs under the service-role admin client which bypasses RLS) — never trust the
// client. Order of checks mirrors the spec; first failure wins.
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'no_session' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const id: string | undefined = body.id
  if (!id) return NextResponse.json({ error: 'id_requerido' }, { status: 400 })

  // Which businesses does this merchant belong to?
  const { data: links } = await supabaseBeneficiosAdmin
    .from('merchant_users')
    .select('business_id')
    .eq('user_id', user.id)
  const businessIds = (links ?? []).map((l) => l.business_id)
  if (!businessIds.length) {
    return NextResponse.json({ error: 'sin_comercio' }, { status: 403 })
  }

  const { data: red } = await supabaseBeneficiosAdmin
    .from('redemptions')
    .select('id, business_id, benefit_id, estado, codigo')
    .eq('id', id)
    .single()
  if (!red) return NextResponse.json({ error: 'inexistente' }, { status: 404 })

  if (!businessIds.includes(red.business_id)) {
    return NextResponse.json({ error: 'ajeno' }, { status: 403 })
  }
  if (red.estado !== 'pendiente') {
    return NextResponse.json({ error: 'ya_validado', estado: red.estado }, { status: 409 })
  }

  const { data: ben } = await supabaseBeneficiosAdmin
    .from('benefits')
    .select('titulo, fecha_fin')
    .eq('id', red.benefit_id)
    .single()
  const hoy = new Date().toISOString().slice(0, 10)
  if (ben?.fecha_fin && ben.fecha_fin < hoy) {
    return NextResponse.json({ error: 'vencido' }, { status: 410 })
  }

  // Flip pendiente → validado, guarded so a double-scan can't double-count.
  const { data: updated, error } = await supabaseBeneficiosAdmin
    .from('redemptions')
    .update({ estado: 'validado', validado_at: new Date().toISOString() })
    .eq('id', red.id)
    .eq('estado', 'pendiente')
    .select('id')
  if (error) {
    console.error('validar update failed:', error.message)
    return NextResponse.json({ error: 'no_actualizado' }, { status: 500 })
  }
  if (!updated || updated.length === 0) {
    // Lost the race — someone validated it between our read and write.
    return NextResponse.json({ error: 'ya_validado', estado: 'validado' }, { status: 409 })
  }

  return NextResponse.json({ ok: true, descuento: ben?.titulo ?? '', codigo: red.codigo })
}
