import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import BackButton from '@/app/beneficios/components/BackButton'
import ConfirmCanje from './ConfirmCanje'

export const dynamic = 'force-dynamic'

// The scan landing. The customer's QR opens this URL in the merchant's phone camera.
// We resolve the merchant's business(es), load the canje, and either present the
// CONFIRMAR action (estado pendiente, owned, not expired) or a terminal result. The
// estado flip itself happens on POST (ConfirmCanje) — a GET must not have side effects.
export default async function ValidarPage({ params }: { params: { id: string } }) {
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

  const { data: red } = await supabaseBeneficiosAdmin
    .from('redemptions')
    .select('id, business_id, benefit_id, estado, codigo, validado_at, created_at')
    .eq('id', params.id)
    .maybeSingle()

  const biz = red
    ? (
        await supabaseBeneficiosAdmin
          .from('businesses')
          .select('nombre')
          .eq('id', red.business_id)
          .maybeSingle()
      ).data
    : null
  const ben = red
    ? (
        await supabaseBeneficiosAdmin
          .from('benefits')
          .select('titulo, fecha_fin')
          .eq('id', red.benefit_id)
          .maybeSingle()
      ).data
    : null

  const hoy = new Date().toISOString().slice(0, 10)
  const USED = new Set(['usado', 'validado'])

  let estado:
    | 'sin_comercio'
    | 'inexistente'
    | 'ajeno'
    | 'ya_validado'
    | 'cancelado'
    | 'vencido'
    | 'listo'
  if (!businessIds.length) estado = 'sin_comercio'
  else if (!red) estado = 'inexistente'
  else if (!businessIds.includes(red.business_id)) estado = 'ajeno'
  else if (red.estado === 'cancelado') estado = 'cancelado'
  else if (USED.has(red.estado)) estado = 'ya_validado'
  else if (ben?.fecha_fin && ben.fecha_fin < hoy) estado = 'vencido'
  else estado = 'listo'

  const descuento = ben?.titulo ?? 'Beneficio'
  const comercio = biz?.nombre ?? 'Comercio'

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <BackButton
          fallback="/beneficios/comercio/panel"
          label="Volver"
          className="mb-6 text-gray-500 hover:text-gray-900"
        />

        {estado === 'listo' && red ? (
          <ConfirmCanje
            id={red.id}
            codigo={red.codigo}
            descuento={descuento}
            comercio={comercio}
          />
        ) : (
          <Resultado estado={estado} comercio={comercio} descuento={descuento} red={red} />
        )}
      </div>
    </main>
  )
}

function Resultado({
  estado,
  comercio,
  descuento,
  red,
}: {
  estado: string
  comercio: string
  descuento: string
  red: { validado_at: string | null } | null
}) {
  const map: Record<string, { icon: string; title: string; sub: string; tone: string }> = {
    sin_comercio: {
      icon: '🔒',
      title: 'No tenés un comercio asociado',
      sub: 'Esta cuenta no está vinculada a ningún comercio. Escribinos para activarla.',
      tone: 'amber',
    },
    inexistente: {
      icon: '✗',
      title: 'Cupón inexistente',
      sub: 'Este código no corresponde a ningún canje. Pedile al cliente que reabra su cupón.',
      tone: 'red',
    },
    ajeno: {
      icon: '✗',
      title: 'No es de tu comercio',
      sub: 'Este beneficio pertenece a otro comercio y no podés validarlo.',
      tone: 'red',
    },
    ya_validado: {
      icon: '⚠️',
      title: 'Ya fue usado',
      sub: red?.validado_at
        ? `Este cupón se validó el ${new Date(red.validado_at).toLocaleString('es-AR')}.`
        : 'Este cupón ya figura como usado.',
      tone: 'amber',
    },
    cancelado: {
      icon: '✗',
      title: 'Cupón cancelado',
      sub: 'Este canje fue cancelado y no puede usarse.',
      tone: 'red',
    },
    vencido: {
      icon: '⌛',
      title: 'Beneficio vencido',
      sub: `${descuento} en ${comercio} ya no está vigente.`,
      tone: 'red',
    },
  }
  const r = map[estado] ?? map.inexistente
  const tone =
    r.tone === 'red'
      ? 'bg-red-50 border-red-200 text-red-800'
      : 'bg-amber-50 border-amber-200 text-amber-900'

  return (
    <div className={`rounded-2xl border p-8 text-center ${tone}`}>
      <div className="text-5xl">{r.icon}</div>
      <h1 className="mt-4 text-xl font-extrabold">{r.title}</h1>
      <p className="mt-2 text-sm opacity-90">{r.sub}</p>
    </div>
  )
}
