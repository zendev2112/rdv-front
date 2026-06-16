/**
 * Seed a test merchant for the Volga Beneficios merchant area (Phase 0 verification).
 *
 * Creates (against the BENEFICIOS Supabase project, via the service-role key):
 *   - an auth user (email magic-link login)
 *   - sets its profile rol = 'merchant_staff'
 *   - links it to a business via merchant_users
 *   - seeds a week of merchant_hours
 *
 * Run with the beneficios env vars available, e.g.:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/seed-beneficios.ts [businessId]
 *
 * Optional: SEED_MERCHANT_EMAIL overrides the default email.
 * Pass a businessId as the first arg, or it uses the first business in the table.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL
const serviceKey = process.env.BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL and BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY.',
  )
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const EMAIL = process.env.SEED_MERCHANT_EMAIL ?? 'comercio.test@radiodelvolga.com.ar'

async function main() {
  // 1. pick a business (arg, or the first one)
  const argId = process.argv[2]
  const bizQuery = admin.from('businesses').select('id, nombre')
  const { data: biz } = argId
    ? await bizQuery.eq('id', argId).single()
    : await bizQuery.limit(1).single()
  if (!biz) {
    console.error('No business found. Pass a valid businessId or seed a business first.')
    process.exit(1)
  }

  // 2. create (or find) the auth user
  let userId: string | undefined
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: EMAIL,
    email_confirm: true,
  })
  if (created?.user) {
    userId = created.user.id
  } else {
    // likely already exists — find it
    const { data: list } = await admin.auth.admin.listUsers()
    userId = list?.users.find((u: { email?: string; id: string }) => u.email === EMAIL)?.id
    if (!userId) {
      console.error('Could not create or find the merchant user:', createErr?.message)
      process.exit(1)
    }
  }

  // 3. mark the profile as merchant_staff (the on-signup trigger created the row)
  await admin
    .from('user_profiles')
    .update({ rol: 'merchant_staff', nombre: 'Comercio de prueba' })
    .eq('id', userId)

  // 4. link to the business
  await admin
    .from('merchant_users')
    .upsert({ user_id: userId, business_id: biz.id, rol: 'owner' })

  // 5. seed hours (Mon–Fri 09–13 & 17–21, Sat 09–13, Sun closed)
  await admin.from('merchant_hours').delete().eq('business_id', biz.id)
  const franjasSemana = [
    { desde: '09:00', hasta: '13:00' },
    { desde: '17:00', hasta: '21:00' },
  ]
  const rows: Array<{ business_id: string; dia: number; abierto: boolean; franjas: unknown }> = []
  for (let dia = 1; dia <= 5; dia++) {
    rows.push({ business_id: biz.id, dia, abierto: true, franjas: franjasSemana })
  }
  rows.push({ business_id: biz.id, dia: 6, abierto: true, franjas: [{ desde: '09:00', hasta: '13:00' }] })
  rows.push({ business_id: biz.id, dia: 0, abierto: false, franjas: [] })
  await admin.from('merchant_hours').insert(rows)

  console.log(`✓ Seeded merchant user ${EMAIL} → ${biz.nombre} (${biz.id})`)
  console.log('  Log in at /beneficios/comercio/ingresar with that email (magic link).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
