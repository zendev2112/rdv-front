import { notFound } from 'next/navigation'
import { Comercio } from '../types'
import ComercioHeader from '../components/ComercioHeader'
import BenefitCard from '../components/BenefitCard'

async function getComercio(slug: string): Promise<Comercio | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/beneficios/${slug}`,
    { next: { revalidate: 60 } },
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Error al cargar comercio')
  const json = await res.json()
  return json.comercio ?? null
}

export default async function ComercioPage({
  params,
}: {
  params: { slug: string }
}) {
  const comercio = await getComercio(params.slug)
  if (!comercio) notFound()

  return (
    <main className="min-h-screen bg-cream">
      <ComercioHeader comercio={comercio} />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-gray">
          Beneficios disponibles
          <span className="ml-2 rounded-full bg-primary-red px-2 py-0.5 text-white">
            {comercio.benefits.length}
          </span>
        </h2>

        <div className="space-y-4">
          {comercio.benefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              comercio={comercio}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
