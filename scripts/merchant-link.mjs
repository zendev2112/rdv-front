// Mints a merchant login link WITHOUT sending email (bypasses the email rate limit
// and any SMTP/DNS setup). Uses the admin API to generate a magic-link token_hash,
// then prints the /auth/confirm URL our route verifies. Single-use, ~1h expiry.
//   node scripts/merchant-link.mjs [email]
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    }),
)

const url = env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL
const key = env.BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY
const site = env.NEXT_PUBLIC_SITE_URL || 'https://www.radiodelvolga.com.ar'
const email = process.argv[2] || 'zendeviagge@gmail.com'

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
const { data, error } = await supabase.auth.admin.generateLink({ type: 'magiclink', email })
if (error) {
  console.error('ERROR:', error.message)
  process.exit(1)
}
const th = data.properties.hashed_token
console.log(`\nLogin URL for ${email} (open it in a browser):\n`)
console.log(`${site}/beneficios/comercio/auth/confirm?token_hash=${th}&type=magiclink\n`)
