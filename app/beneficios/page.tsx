import { BeneficioActivo } from './types'
import BeneficiosGrid from './components/BeneficiosGrid'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'

async function getBeneficios(): Promise<BeneficioActivo[]> {
  const { data, error } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('*')
    .order('business_nombre', { ascending: true })

  if (error) {
    console.error('Error fetching beneficios:', error)
    return []
  }

  return data ?? []
}

export const dynamic = 'force-dynamic'

export default async function BeneficiosPage() {
  const beneficios = await getBeneficios()

  const porCategoria = beneficios.reduce<Record<string, BeneficioActivo[]>>(
    (acc, b) => {
      const key = b.categoria_nombre
      if (!acc[key]) acc[key] = []
      acc[key].push(b)
      return acc
    },
    {},
  )

  const comerciosPorCategoria = Object.entries(porCategoria).reduce<
    Record<string, BeneficioActivo[]>
  >((acc, [cat, items]) => {
    const seen = new Set<string>()
    acc[cat] = items.filter((i) => {
      if (seen.has(i.business_slug)) return false
      seen.add(i.business_slug)
      return true
    })
    return acc
  }, {})

  const totalComercios = new Set(beneficios.map((b) => b.business_slug)).size
  const totalBeneficios = beneficios.length

  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-dark-gray px-4 pb-10 pt-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-primary-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-red">
          Programa de beneficios
        </span>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Volga Beneficios
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-neutral-gray">
          Descuentos y promociones exclusivos en comercios de Coronel Suárez y
          la región, solo para vos.
        </p>
        <div className="mt-6 flex justify-center gap-6">
          <Stat value={totalComercios} label="Comercios" />
          <div className="w-px bg-white/10" />
          <Stat value={totalBeneficios} label="Beneficios" />
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {Object.keys(comerciosPorCategoria).length === 0 ? (
          <EmptyState />
        ) : (
          <BeneficiosGrid comerciosPorCategoria={comerciosPorCategoria} />
        )}
      </div>
    </main>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-neutral-gray">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <p className="text-4xl">🏪</p>
      <p className="mt-3 font-semibold text-dark-gray">
        No hay beneficios disponibles
      </p>
      <p className="mt-1 text-sm text-neutral-gray">
        Volvé pronto, estamos sumando comercios.
      </p>
    </div>
  )
}
