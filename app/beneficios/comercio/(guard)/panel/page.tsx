import Link from 'next/link'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

export const dynamic = 'force-dynamic'

// Merchant home — the value the club hands back: proof of foot traffic. Read-only in
// Wave 1: a validate CTA, redemption counts (hoy / 7 días), and recent canjes. All
// scoped to the merchant's own business(es) via the merchant_users junction.
export default async function PanelPage() {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: links } = user
    ? await supabaseBeneficiosAdmin
        .from('merchant_users')
        .select('business_id')
        .eq('user_id', user.id)
    : { data: [] as { business_id: string }[] }
  const businessIds = (links ?? []).map((l) => l.business_id)

  if (!businessIds.length) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-extrabold text-gray-900">Mi comercio</h1>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Tu cuenta{user?.email ? ` (${user.email})` : ''} todavía no está vinculada
            a ningún comercio. Escribinos para activarla.
          </div>
        </div>
      </main>
    )
  }

  const now = new Date()
  const startToday = new Date(now)
  startToday.setHours(0, 0, 0, 0)
  const sevenAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000)

  const validados = () =>
    supabaseBeneficiosAdmin
      .from('redemptions')
      .select('id', { count: 'exact', head: true })
      .in('business_id', businessIds)
      .eq('estado', 'validado')

  const [{ count: hoy }, { count: semana }, { data: recientes }] = await Promise.all([
    validados().gte('validado_at', startToday.toISOString()),
    validados().gte('validado_at', sevenAgo.toISOString()),
    supabaseBeneficiosAdmin
      .from('redemptions')
      .select('id, benefit_id, estado, codigo, created_at, validado_at')
      .in('business_id', businessIds)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const benefitIds = Array.from(new Set((recientes ?? []).map((r) => r.benefit_id)))
  const { data: bens } = benefitIds.length
    ? await supabaseBeneficiosAdmin.from('benefits').select('id, titulo').in('id', benefitIds)
    : { data: [] as { id: string; titulo: string }[] }
  const benById = new Map((bens ?? []).map((b) => [b.id, b.titulo]))

  const USED = new Set(['usado', 'validado'])

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-extrabold text-gray-900">Mi comercio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sesión iniciada{user?.email ? ` como ${user.email}` : ''}.
        </p>

        <Link
          href="/beneficios/comercio/validar"
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-base font-extrabold text-white shadow-md shadow-green-600/20 hover:bg-green-700"
        >
          📷 Validar un canje
        </Link>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-3xl font-extrabold text-gray-900">{hoy ?? 0}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Hoy</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-3xl font-extrabold text-gray-900">{semana ?? 0}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Últimos 7 días
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-gray-500">
          Canjes recientes
        </h2>
        {(recientes ?? []).length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
            Todavía no hay canjes.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(recientes ?? []).map((r) => {
              const usado = USED.has(r.estado)
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {benById.get(r.benefit_id) ?? 'Beneficio'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.codigo} · {new Date(r.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      usado
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {usado ? '✓ Usado' : 'Pendiente'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
