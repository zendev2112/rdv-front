import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

// Stores a browser's push subscription against the logged-in member and flips
// their push_opt_in flag. Subscriptions are account-tied (push_subscriptions.user_id
// is NOT NULL), so this requires an authenticated member. Writes go through the
// service-role client (the table is server-side only, RLS with no client policy).
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const sub = await req.json().catch(() => null)
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return NextResponse.json({ error: 'invalid subscription' }, { status: 400 })
  }

  // Upsert by endpoint (unique): re-subscribing, or a shared device switching
  // members, updates the owning user_id instead of duplicating the row.
  const { error } = await supabaseBeneficiosAdmin
    .from('push_subscriptions')
    .upsert(
      { user_id: user.id, endpoint: sub.endpoint, keys: sub.keys },
      { onConflict: 'endpoint' },
    )
  if (error) {
    console.error('[push/subscribe] store failed:', error.message)
    return NextResponse.json({ error: 'store failed' }, { status: 500 })
  }

  await supabaseBeneficiosAdmin
    .from('user_profiles')
    .update({ push_opt_in: true })
    .eq('id', user.id)

  return NextResponse.json({ ok: true })
}
