import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

// Resolves a typed `codigo` (VB-XXXX) to its redemption id, scoped to the merchant's
// own businesses — the manual-entry path for when the camera can't read the QR. The
// actual confirmation still happens on /validar/[id], so there's one validation path.
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'no_session' }, { status: 401 })

  const codigo = new URL(req.url).searchParams.get('codigo')?.trim().toUpperCase()
  if (!codigo) return NextResponse.json({ error: 'codigo_requerido' }, { status: 400 })

  const { data: links } = await supabaseBeneficiosAdmin
    .from('merchant_users')
    .select('business_id')
    .eq('user_id', user.id)
  const businessIds = (links ?? []).map((l) => l.business_id)
  if (!businessIds.length) return NextResponse.json({ error: 'sin_comercio' }, { status: 403 })

  const { data: red } = await supabaseBeneficiosAdmin
    .from('redemptions')
    .select('id, business_id')
    .eq('codigo', codigo)
    .in('business_id', businessIds)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!red) return NextResponse.json({ error: 'no_encontrado' }, { status: 404 })
  return NextResponse.json({ id: red.id })
}
