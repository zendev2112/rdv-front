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

  const enviadas = await broadcastToOptedIn({
    title: `Nuevo beneficio en ${negocio} 🎉`,
    body: benefit.titulo || 'Mirá las novedades en Volga Beneficios.',
    url: '/beneficios',
    // Per-business tag: a burst of inserts for the same comercio collapses into one
    // visible notification instead of N, while different comercios still show apart.
    tag: `vb-benefit-${benefit.business_id || 'all'}`,
  })

  return NextResponse.json({ ok: true, enviadas })
}
