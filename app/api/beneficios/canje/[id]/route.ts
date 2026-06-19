import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// Status of the member's own cupón, for the live poll on the cupón screen: when the
// merchant validates it (estado → 'validado'), the member's screen flips to "ya usado"
// on its own. Owner-only (RLS + explicit user_id filter).
//
// The old PATCH (customer self-report "Listo, lo usé") was removed — the merchant is
// now the source of truth, so a member can no longer mark their own canje used.
export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'no_session' }, { status: 401 })

  const { data } = await supabase
    .from('redemptions')
    .select('estado')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ estado: data?.estado ?? null })
}
