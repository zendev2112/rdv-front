import webpush from 'web-push'
import { supabaseBeneficiosAdmin } from './supabase-beneficios'

// Server-side Web Push sender for Volga Beneficios. VAPID keys live in env
// (NEXT_PUBLIC_VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY + VAPID_SUBJECT). Subscriptions
// are stored in push_subscriptions (one row per browser/device, tied to a user).
// Used by event-driven sends (new activation) and the throwaway test script.

let configured = false
function configure() {
  if (configured) return
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:radiodelvolga@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )
  configured = true
}

export type PushPayload = {
  title: string
  body?: string
  url?: string // where notificationclick should land (default /beneficios)
  icon?: string
  tag?: string // collapse/replace same-tag notifications
}

type SubRow = { id: string; endpoint: string; keys: webpush.PushSubscription['keys'] }

// Delivers one payload to one stored subscription. A 404/410 means the browser
// dropped the subscription — prune the row so dead endpoints don't accumulate.
async function sendOne(sub: SubRow, payload: PushPayload): Promise<boolean> {
  configure()
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: sub.keys },
      JSON.stringify(payload),
    )
    return true
  } catch (err: any) {
    const code = err?.statusCode
    if (code === 404 || code === 410) {
      await supabaseBeneficiosAdmin.from('push_subscriptions').delete().eq('id', sub.id)
    } else {
      console.error('[beneficios-push] send failed:', code, err?.body || err?.message)
    }
    return false
  }
}

// Sends to every subscription for the given user ids, or to ALL stored
// subscriptions when userIds is omitted (subscriptions only exist for opted-in
// users). Returns how many were actually delivered.
export async function sendPushToUsers(
  payload: PushPayload,
  userIds?: string[],
): Promise<number> {
  let query = supabaseBeneficiosAdmin
    .from('push_subscriptions')
    .select('id, endpoint, keys')
  if (userIds && userIds.length) query = query.in('user_id', userIds)

  const { data, error } = await query
  if (error || !data) return 0

  const results = await Promise.all(data.map((s) => sendOne(s as SubRow, payload)))
  return results.filter(Boolean).length
}

// Phase 2 — event-driven send: notify every opted-in member that new benefits are
// live, and record the send in notifications_sent (optionally tied to an
// activation). Returns how many devices got it. Triggered by the admin when new
// benefits are published, so the copy is human-controlled (not a per-row firehose).
export async function broadcastToOptedIn(
  payload: PushPayload,
  opts?: { activationId?: string },
): Promise<number> {
  const enviadas = await sendPushToUsers(payload)
  await supabaseBeneficiosAdmin
    .from('notifications_sent')
    .insert({ activation_id: opts?.activationId ?? null, enviadas })
  return enviadas
}
