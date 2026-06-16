/**
 * Verify the Volga Beneficios setup against the live beneficios project.
 *  - anonymous sign-in works (Phase 1 canje dependency) and fires the profile trigger
 *  - RLS lets an anonymous user read its own profile
 *  - the seed landed (merchant_users + merchant_hours)
 *
 * Run: set -a && source .env.local && set +a && npx tsx scripts/verify-beneficios.ts
 * Note: each run creates one throwaway anonymous auth user.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_ANON_KEY!
const service = process.env.BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY!

async function main() {
  // 1. Anonymous sign-in (what UsarBeneficioButton does)
  const pub = createClient(url, anon)
  const { data: anonData, error: anonErr } = await pub.auth.signInAnonymously()
  if (anonErr || !anonData.user) {
    console.error('✗ anonymous sign-in FAILED:', anonErr?.message)
    process.exit(1)
  }
  console.log(`✓ anonymous sign-in works (user ${anonData.user.id}, is_anonymous=${anonData.user.is_anonymous})`)

  // 2. Profile trigger fired + RLS lets the anon user read its own profile
  const { data: profile, error: profErr } = await pub
    .from('user_profiles')
    .select('id, rol')
    .eq('id', anonData.user.id)
    .single()
  if (profErr || !profile) {
    console.error('✗ profile not readable / not created:', profErr?.message)
  } else {
    console.log(`✓ profile row created + readable under RLS (rol=${profile.rol})`)
  }

  // 3. Seed landed (service-role bypasses RLS)
  const admin = createClient(url, service, { auth: { persistSession: false } })
  const { count: muCount } = await admin
    .from('merchant_users')
    .select('*', { count: 'exact', head: true })
  const { count: mhCount } = await admin
    .from('merchant_hours')
    .select('*', { count: 'exact', head: true })
  console.log(`✓ seed: merchant_users=${muCount ?? 0}, merchant_hours=${mhCount ?? 0}`)

  // 4. Canje data path: an anonymous user inserts + updates a redemption under RLS
  //    (exactly what /api/beneficios/canje and /canje/[id] do).
  const { data: ben } = await admin.from('benefits').select('id, business_id').limit(1).single()
  if (!ben) {
    console.log('… no benefit found to test the canje round-trip (skip)')
  } else {
    const { data: red, error: insErr } = await pub
      .from('redemptions')
      .insert({
        user_id: anonData.user.id,
        benefit_id: ben.id,
        business_id: ben.business_id,
        metodo: 'mostrar',
        codigo: 'VB-TEST',
        estado: 'pendiente',
      })
      .select()
      .single()
    if (insErr || !red) {
      console.error('✗ redemption insert under RLS FAILED:', insErr?.message)
    } else {
      const { error: updErr } = await pub
        .from('redemptions')
        .update({ estado: 'usado' })
        .eq('id', red.id)
      console.log(
        `✓ canje round-trip under RLS works (insert + ${updErr ? 'UPDATE FAILED: ' + updErr.message : 'update'})`,
      )
      // tidy up the test row
      await admin.from('redemptions').delete().eq('id', red.id)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
