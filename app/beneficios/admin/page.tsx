import { cookies } from 'next/headers'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

export const dynamic = 'force-dynamic'

// Internal metrics dashboard for the team. Password-gated (shared password in
// BENEFICIOS_ADMIN_PASSWORD). Reads program data from the beneficios project via
// the service-role client and aggregates in-process (fine at MVP volume).

type Red = {
  id: string
  business_id: string
  benefit_id: string
  estado: string
  metodo: string
  created_at: string
  user_id: string | null
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
function startOfWeek() {
  const d = startOfToday()
  const lunes = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - lunes)
  return d
}
function startOfMonth() {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), 1)
}

function LoginForm({ error, configured }: { error: boolean; configured: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        method="post"
        action="/api/beneficios/admin/login"
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-extrabold text-gray-900">Métricas · Volga Beneficios</h1>
        <p className="mt-1 text-sm text-gray-500">Acceso interno.</p>
        {!configured && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            Falta definir <code>BENEFICIOS_ADMIN_PASSWORD</code> en el entorno.
          </p>
        )}
        <input
          type="password"
          name="password"
          required
          placeholder="Contraseña"
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">Contraseña incorrecta.</p>}
        <button
          type="submit"
          className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700"
        >
          Entrar
        </button>
      </form>
    </main>
  )
}

function Kpi({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

export default async function AdminMetricsPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const expected = process.env.BENEFICIOS_ADMIN_PASSWORD
  const authed = !!expected && cookies().get('vb-admin')?.value === expected
  if (!authed) {
    return <LoginForm error={!!searchParams.error} configured={!!expected} />
  }

  // --- data ---
  const [{ data: redsRaw }, { data: bizs }, { data: bens }] = await Promise.all([
    supabaseBeneficiosAdmin
      .from('redemptions')
      .select('id, business_id, benefit_id, estado, metodo, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5000),
    supabaseBeneficiosAdmin.from('businesses').select('id, nombre'),
    supabaseBeneficiosAdmin.from('benefits').select('id, titulo'),
  ])
  const reds = (redsRaw ?? []) as Red[]
  const nombre = new Map((bizs ?? []).map((b: any) => [b.id, b.nombre as string]))
  const titulo = new Map((bens ?? []).map((b: any) => [b.id, b.titulo as string]))

  // --- aggregates ---
  const total = reds.length
  const usados = reds.filter((r) => r.estado === 'usado').length
  const tHoy = startOfToday().toISOString()
  const tSem = startOfWeek().toISOString()
  const tMes = startOfMonth().toISOString()
  const hoy = reds.filter((r) => r.created_at >= tHoy).length
  const semana = reds.filter((r) => r.created_at >= tSem).length
  const mes = reds.filter((r) => r.created_at >= tMes).length
  const usuarios = new Set(reds.map((r) => r.user_id).filter(Boolean)).size

  // per comercio
  const porComercio = new Map<string, { total: number; usados: number }>()
  for (const r of reds) {
    const e = porComercio.get(r.business_id) ?? { total: 0, usados: 0 }
    e.total++
    if (r.estado === 'usado') e.usados++
    porComercio.set(r.business_id, e)
  }
  const comercios = Array.from(porComercio.entries())
    .map(([id, v]) => ({ nombre: nombre.get(id) ?? '—', ...v }))
    .sort((a, b) => b.total - a.total)

  // last 14 days
  const dias: { fecha: string; n: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(startOfToday())
    d.setDate(d.getDate() - i)
    const next = new Date(d)
    next.setDate(next.getDate() + 1)
    const n = reds.filter((r) => r.created_at >= d.toISOString() && r.created_at < next.toISOString()).length
    dias.push({ fecha: d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }), n })
  }
  const maxDia = Math.max(1, ...dias.map((d) => d.n))

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold text-gray-900">Métricas · Volga Beneficios</h1>
        <p className="mt-1 text-sm text-gray-500">
          {total} canjes registrados · {usuarios} usuarios · actualizado al momento
        </p>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="Hoy" value={hoy} />
          <Kpi label="Esta semana" value={semana} />
          <Kpi label="Este mes" value={mes} />
          <Kpi label="Total" value={total} sub={`${usados} usados`} />
        </div>

        {/* per-day */}
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Canjes · últimos 14 días
          </h2>
          <div className="mt-3 flex items-end gap-1.5 rounded-xl border border-gray-200 bg-white p-4">
            {dias.map((d) => (
              <div key={d.fecha} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-red-500"
                  style={{ height: `${Math.round((d.n / maxDia) * 80) + 2}px` }}
                  title={`${d.fecha}: ${d.n}`}
                />
                <span className="text-[9px] text-gray-400">{d.fecha.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* per comercio */}
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Por comercio</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                  <th className="px-4 py-2 font-bold">Comercio</th>
                  <th className="px-4 py-2 text-right font-bold">Canjes</th>
                  <th className="px-4 py-2 text-right font-bold">Usados</th>
                </tr>
              </thead>
              <tbody>
                {comercios.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                      Todavía no hay canjes.
                    </td>
                  </tr>
                ) : (
                  comercios.map((c) => (
                    <tr key={c.nombre} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-2 font-medium text-gray-900">{c.nombre}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{c.total}</td>
                      <td className="px-4 py-2 text-right text-gray-500">{c.usados}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* recent */}
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Últimos canjes</h2>
          <ul className="mt-3 space-y-1.5">
            {reds.slice(0, 12).map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm"
              >
                <span className="truncate text-gray-900">
                  {nombre.get(r.business_id) ?? '—'}
                  <span className="text-gray-400"> · {titulo.get(r.benefit_id) ?? ''}</span>
                </span>
                <span className="shrink-0 text-xs text-gray-400">
                  {r.estado === 'usado' ? '✓' : '·'}{' '}
                  {new Date(r.created_at).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
