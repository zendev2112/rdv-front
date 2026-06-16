import { redirect } from 'next/navigation'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

export const dynamic = 'force-dynamic'

// Server auth guard for the merchant area. Routes inside this (guard) route group
// require a valid beneficios session; everything else under /beneficios/comercio
// (notably /ingresar) is outside the group and stays public. The middleware also
// redirects unauthenticated requests — this is defense in depth at render time.
//
// Phase 0: any logged-in user reaches the panel. The merchant_staff role check
// (via merchant_users) lands with the Phase 3 dashboard, once merchants are seeded.
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
  return <>{children}</>
}
