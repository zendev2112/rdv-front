import Link from 'next/link'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import { verifyUnsubToken } from '@/lib/beneficios-unsub'

// One-click unsubscribe landing for marketing emails (Ley 25.326). The link in
// every email carries a signed token (?t=) so we can opt the member out without a
// login. Idempotent — flips marketing_opt_in to false.
export const dynamic = 'force-dynamic'

export default async function BajaPage({ searchParams }: { searchParams: { t?: string } }) {
  const userId = searchParams.t ? verifyUnsubToken(searchParams.t) : null
  let ok = false
  if (userId) {
    const { error } = await supabaseBeneficiosAdmin
      .from('user_profiles')
      .update({ marketing_opt_in: false })
      .eq('id', userId)
    ok = !error
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      {ok ? (
        <>
          <h1 className="text-xl font-extrabold text-gray-900">Listo, te diste de baja</h1>
          <p className="mt-2 text-sm text-gray-600">
            No vas a recibir más novedades por email. Podés volver a activarlas cuando quieras desde
            tu cuenta.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-extrabold text-gray-900">No pudimos procesar la baja</h1>
          <p className="mt-2 text-sm text-gray-600">
            El enlace no es válido o expiró. Escribinos a{' '}
            <a href="mailto:radiodelvolga@gmail.com" className="text-red-600 underline">
              radiodelvolga@gmail.com
            </a>{' '}
            y lo resolvemos.
          </p>
        </>
      )}
      <Link href="/beneficios" className="mt-6 text-sm font-bold text-red-600">
        ← Ir a Beneficios
      </Link>
    </main>
  )
}
