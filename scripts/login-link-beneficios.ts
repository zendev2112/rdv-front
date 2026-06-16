/**
 * Generate a one-time passwordless login link for a seeded merchant — no email
 * needed (useful for local testing). Uses the service-role admin API to mint a
 * magic-link token_hash, then builds a URL to our /auth/confirm route.
 *
 * Run: set -a && source .env.local && set +a && npx tsx scripts/login-link-beneficios.ts [baseUrl]
 *   baseUrl defaults to http://localhost:3000
 *   SEED_MERCHANT_EMAIL overrides the email (default: comercio.test@radiodelvolga.com.ar)
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL!
const service = process.env.BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY!
const email = process.env.SEED_MERCHANT_EMAIL ?? 'comercio.test@radiodelvolga.com.ar'
const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const next = '/beneficios/comercio/panel'

async function main() {
  const admin = createClient(url, service, { auth: { persistSession: false } })
  const { data, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email })
  if (error || !data.properties) {
    console.error('generateLink failed:', error?.message)
    process.exit(1)
  }
  const tokenHash = data.properties.hashed_token
  const link = `${base}/beneficios/comercio/auth/confirm?token_hash=${tokenHash}&type=magiclink&next=${encodeURIComponent(
    next,
  )}`
  console.log(`\nMerchant login link for ${email} (one-time, ~1h):\n`)
  console.log(link)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
