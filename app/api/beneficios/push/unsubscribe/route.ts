import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

// Removes this browser's push subscription for the logged-in member. If it was
// their last one, clears push_opt_in so the flag reflects reality.
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (body?.endpoint) {
    await supabaseBeneficiosAdmin
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', body.endpoint)
      .eq('user_id', user.id)
  }

  const { count } = await supabaseBeneficiosAdmin
    .from('push_subscriptions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
  if (!count) {
    await supabaseBeneficiosAdmin
      .from('user_profiles')
      .update({ push_opt_in: false })
      .eq('id', user.id)
  }

  return NextResponse.json({ ok: true })
}
