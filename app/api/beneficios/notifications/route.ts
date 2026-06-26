import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

// Feeds the header bell: the logged-in member's latest notifications plus the
// unread count (read_at IS NULL). Returns an empty feed for logged-out visitors
// so the bell simply shows no badge. Rows are written by the benefits webhook
// (app/api/beneficios/push/on-benefit). Access is service-role, scoped by user.
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ unread: 0, items: [] })

  const { data } = await supabaseBeneficiosAdmin
    .from('user_notifications')
    .select('id, title, body, url, read_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const items = data ?? []
  const unread = items.filter((n) => !n.read_at).length
  return NextResponse.json({ unread, items })
}
