import { NextResponse } from 'next/server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import { broadcastToOptedIn } from '@/lib/beneficios-push'

// Automatic push: fires when a benefit row is INSERTed, via a Supabase Database
// Webhook (Dashboard → Database → Webhooks: table `benefits`, event INSERT, HTTP
// POST to this URL with header x-webhook-secret = BENEFICIOS_WEBHOOK_SECRET). This
// fires no matter HOW the row was created — admin script, dashboard, SQL, or a
// future UI — so notifications are truly event-driven, not on a manual trigger.
//
// web-push uses Node crypto, so this must run on the Node runtime, not Edge.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secret = process.env.BENEFICIOS_WEBHOOK_SECRET
  if (!secret || req.headers.get('x-webhook-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Supabase webhook payload: { type, table, schema, record, old_record }.
  const body = await req.json().catch(() => null)
  if (!body || body.type !== 'INSERT' || body.table !== 'benefits') {
    return NextResponse.json({ ok: true, skipped: 'not a benefit insert' })
  }
  const benefit = body.record
  if (!benefit?.activo) {
    return NextResponse.json({ ok: true, skipped: 'inactive benefit' })
  }

  // Resolve the business name so the notification is specific and useful.
  let negocio = 'Volga Beneficios'
  if (benefit.business_id) {
    const { data: biz } = await supabaseBeneficiosAdmin
      .from('businesses')
      .select('nombre')
      .eq('id', benefit.business_id)
      .maybeSingle()
    if (biz?.nombre) negocio = biz.nombre
  }

  const title = `Nuevo beneficio en ${negocio} 🎉`
  const mensaje = benefit.titulo || 'Mirá las novedades en Volga Beneficios.'
  // Deep-link straight to the benefit's page so tapping the push (or the bell)
  // lands on it, not the home. Falls back to home if the row has no id.
  const url = benefit.id ? `/beneficios/beneficio/${benefit.id}` : '/beneficios'

  const enviadas = await broadcastToOptedIn({
    title,
    body: mensaje,
    url,
    // Per-benefit tag: each new benefit shows as its own freshly-alerting
    // notification. (A per-business tag would let a later benefit silently replace
    // an earlier, still-undismissed one in the tray — benefits arrive one at a
    // time here, so there's nothing to collapse.)
    tag: `vb-benefit-${benefit.id || benefit.business_id || 'all'}`,
  })

  // In-app inbox (the header bell): fan out one row per member, independent of
  // push opt-in — the bell is in-app, so even members who never granted browser
  // push permission see new benefits there.
  const { data: members } = await supabaseBeneficiosAdmin
    .from('user_profiles')
    .select('id')
  let inbox = 0
  if (members && members.length) {
    const rows = members.map((m: { id: string }) => ({
      user_id: m.id,
      title,
      body: mensaje,
      url,
      business_id: benefit.business_id || null,
    }))
    const { error: inboxErr } = await supabaseBeneficiosAdmin
      .from('user_notifications')
      .insert(rows)
    if (inboxErr) console.error('[on-benefit] inbox fanout failed:', inboxErr.message)
    else inbox = rows.length
  }

  return NextResponse.json({ ok: true, enviadas, inbox })
}
