import Link from 'next/link'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

export const dynamic = 'force-dynamic'

// "Mis canjes" — the prototype's 2nd tab. Lists the user's canjes (RLS restricts
// to their own). Business names are joined via the admin client.
export default async function MisCanjesPage() {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const canjes = user
    ? (await supabase.from('redemptions').select('*').order('created_at', { ascending: false })).data ?? []
    : []

  // Bulk-resolve business names.
  const nombres = new Map<string, string>()
  const ids = Array.from(new Set(canjes.map((c) => c.business_id)))
  if (ids.length) {
    const { data: bizs } = await supabaseBeneficiosAdmin
      .from('businesses')
      .select('id, nombre')
      .in('id', ids)
    for (const b of bizs ?? []) nombres.set(b.id, b.nombre)
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-extrabold text-dark-gray">Mis canjes</h1>
        <p className="mt-1 text-sm text-neutral-gray">Lo que fuiste usando.</p>

        {canjes.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-gray/30 bg-white p-8 text-center text-sm text-neutral-gray">
            Todavía no usaste ningún beneficio.
            <br />
            Andá a{' '}
            <Link href="/beneficios" className="font-bold text-primary-red">
              Beneficios
            </Link>{' '}
            y elegí uno.
          </div>
        ) : (
          <ul className="mt-6 space-y-2">
            {canjes.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-gray/15 bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-dark-gray">
                    {nombres.get(c.business_id) ?? 'Comercio'}
                  </p>
                  <p className="text-xs text-neutral-gray">
                    {c.estado === 'usado' ? '✓ Usado' : '⏳ Pendiente'} ·{' '}
                    {new Date(c.created_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs font-bold text-neutral-gray">
                  {c.codigo}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
