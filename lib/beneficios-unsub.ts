import { createHmac, timingSafeEqual } from 'crypto'

// Signed, login-free unsubscribe tokens for marketing emails (Ley 25.326: opt-out
// must be one click). The token carries the user id + an HMAC so it can't be forged;
// the beneficios service-role key doubles as the signing secret (server-only — this
// module must never be imported into a client component).
const secret = () => process.env.BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY ?? 'dev-unsub-secret'

function b64url(s: string): string {
  return Buffer.from(s).toString('base64url')
}

export function signUnsubToken(userId: string): string {
  const payload = b64url(userId)
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

// Returns the userId if the token is valid, else null.
export function verifyUnsubToken(token: string): string | null {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    return Buffer.from(payload, 'base64url').toString('utf8')
  } catch {
    return null
  }
}
