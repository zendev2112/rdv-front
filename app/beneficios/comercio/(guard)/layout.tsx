import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import ComercioAppHeader from '../components/ComercioAppHeader'

export const dynamic = 'force-dynamic'

// Server auth guard for the merchant area (Volga Beneficios Comercios) — a separate
// product from the consumer app, gated to actual merchants. Two checks:
//   1. logged in at all (else → login),
//   2. linked to a business via merchant_users (else → not-a-merchant screen).
// One identity system is shared with the consumer app, but only merchant accounts
// reach this panel. The middleware also guards the path; this is the role gate.
export default async function ComercioGuardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/beneficios/comercio/ingresar')

  // Exclusive to linked merchants. A logged-in consumer must NOT reach the panel.
  const { data: links } = await supabaseBeneficiosAdmin
    .from('merchant_users')
    .select('business_id')
    .eq('user_id', user.id)
    .limit(1)

  if (!links || links.length === 0) {
    return <NoEsComercio email={user.email ?? null} />
  }

  const { data: biz } = await supabaseBeneficiosAdmin
    .from('businesses')
    .select('nombre')
    .eq('id', links[0].business_id)
    .maybeSingle()

  return (
    <>
      <ComercioAppHeader businessNombre={biz?.nombre ?? 'Mi comercio'} />
      {children}
    </>
  )
}

function NoEsComercio({ email }: { email: string | null }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-extrabold text-gray-900">Acceso solo para comercios</h1>
        <p className="mt-2 text-sm text-gray-500">
          {email ? (
            <>
              La cuenta <strong>{email}</strong> no está habilitada como comercio.
            </>
          ) : (
            'Esta cuenta no está habilitada como comercio.'
          )}{' '}
          Si tenés un comercio adherido a Volga Beneficios, escribinos para activarlo.
        </p>
        <Link
          href="/beneficios"
          className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-800"
        >
          Ir a Volga Beneficios
        </Link>
      </div>
    </main>
  )
}
