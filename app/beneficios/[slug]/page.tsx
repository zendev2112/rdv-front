import { notFound } from 'next/navigation'
import { Comercio } from '../types'
import ComercioHeader from '../components/ComercioHeader'
import BenefitCard from '../components/BenefitCard'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'

export const dynamic = 'force-dynamic'

async function getComercio(slug: string): Promise<Comercio | null> {
  const { data, error } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('*')
    .eq('business_slug', slug)

  if (error || !data || data.length === 0) return null

  const first = data[0]

  return {
    id: first.business_id,
    slug: first.business_slug,
    nombre: first.business_nombre,
    descripcion: first.business_descripcion,
    direccion: first.direccion,
    telefono: first.business_telefono,
    logo_url: first.logo_url,
    website: first.website,
    categoria: {
      nombre: first.categoria_nombre,
      slug: first.categoria_slug,
      icono: first.categoria_icono,
    },
    benefits: data.map((b) => ({
      id: b.benefit_id,
      titulo: b.titulo,
      descripcion: b.benefit_descripcion,
      condiciones: b.condiciones,
      codigo_unico: b.codigo_unico,
      limite_tipo: b.limite_tipo,
      limite_cantidad: b.limite_cantidad,
      fecha_fin: b.fecha_fin,
    })),
  }
}

export default async function ComercioPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const comercio = await getComercio(slug)
  if (!comercio) notFound()

  return (
    <main className="min-h-screen bg-cream">
      <ComercioHeader comercio={comercio} />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h2 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-gray">
          Beneficios disponibles
          <span className="rounded-full bg-primary-red px-2.5 py-0.5 text-xs font-bold text-white">
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
