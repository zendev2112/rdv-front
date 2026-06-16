import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// "Listo, lo usé" — marks a self-reported canje as used. Owner-only (RLS +
// explicit user_id filter).
export const dynamic = 'force-dynamic'

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'no_session' }, { status: 401 })

  const { error } = await supabase
    .from('redemptions')
    .update({ estado: 'usado' })
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    console.error('canje patch failed:', error.message)
    return NextResponse.json({ error: 'no_actualizado' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
