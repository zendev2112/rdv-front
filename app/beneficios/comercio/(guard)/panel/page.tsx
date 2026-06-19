import { Camera, QrCode } from 'lucide-react'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import CodigoForm from '../validar/CodigoForm'

export const dynamic = 'force-dynamic'

// Volga Comercios — home. Deliberately minimal: the only job is registering canjes,
// by scanning the client's QR (phone camera → /validar/[id]) or typing the code.
// A small "hoy" count + recent list reassure the merchant their scans landed.
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

  const startToday = new Date()
  startToday.setHours(0, 0, 0, 0)

  const [{ count: hoy }, { data: recientes }] = await Promise.all([
    supabaseBeneficiosAdmin
      .from('redemptions')
      .select('id', { count: 'exact', head: true })
      .in('business_id', businessIds)
      .eq('estado', 'validado')
      .gte('validado_at', startToday.toISOString()),
    supabaseBeneficiosAdmin
      .from('redemptions')
      .select('id, benefit_id, estado, codigo, validado_at, created_at')
      .in('business_id', businessIds)
      .eq('estado', 'validado')
      .order('validado_at', { ascending: false })
      .limit(5),
  ])

  const benefitIds = Array.from(new Set((recientes ?? []).map((r) => r.benefit_id)))
  const { data: bens } = benefitIds.length
    ? await supabaseBeneficiosAdmin.from('benefits').select('id, titulo').in('id', benefitIds)
    : { data: [] as { id: string; titulo: string }[] }
  const benById = new Map((bens ?? []).map((b) => [b.id, b.titulo]))

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-md space-y-5">
        {/* Validation — the whole point of the app */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-lg font-extrabold text-gray-900">Validar un canje</h1>

          <div className="mt-4 flex items-start gap-3 rounded-xl bg-brand/5 p-4">
            <Camera className="mt-0.5 shrink-0 text-brand" size={22} />
            <p className="text-sm text-gray-700">
              Apuntá la <strong>cámara de tu teléfono</strong> al código QR del cliente.
              Se abre solo la pantalla para confirmar.
            </p>
          </div>

          <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />o ingresá el código<span className="h-px flex-1 bg-gray-200" />
          </div>

          <CodigoForm />
        </section>

        {/* Reassurance: today's count */}
        <section className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-500">
              <QrCode size={16} /> Canjes hoy
            </span>
            <span className="text-2xl font-extrabold text-gray-900">{hoy ?? 0}</span>
          </div>
        </section>

        {/* Recent */}
        {(recientes ?? []).length > 0 && (
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
              Últimos canjes
            </h2>
            <ul className="space-y-2">
              {(recientes ?? []).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5"
                >
                  <span className="truncate text-sm font-semibold text-gray-800">
                    {benById.get(r.benefit_id) ?? 'Beneficio'}
                  </span>
                  <span className="ml-3 shrink-0 text-xs text-gray-400">{r.codigo}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
