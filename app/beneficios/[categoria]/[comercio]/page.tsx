import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'
import { Comercio } from '../../types'
import BeneficiosHeader from '../../components/BeneficiosHeader'
import BeneficiosFooter from '../../components/BeneficiosFooter'
import ComercioHeader from '../../components/ComercioHeader'
import BenefitCard from '../../components/BenefitCard'

interface Props {
  params: { categoria: string; comercio: string }
}

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comercio = await getComercio(params.comercio)
  if (!comercio) return {}
  return {
    title: `${comercio.nombre} | Volga Beneficios`,
    description: `Descuentos y beneficios de ${comercio.nombre} en Coronel Suárez. ${comercio.descripcion ?? ''}`,
    alternates: {
      canonical: `https://radiodelvolga.com.ar/beneficios/${params.categoria}/${params.comercio}`,
    },
  }
}

export async function generateStaticParams() {
  const { data } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('categoria_slug, business_slug')
  return Array.from(
    new Map(
      (data ?? []).map((d) => [`${d.categoria_slug}/${d.business_slug}`, d]),
    ).values(),
  ).map((d) => ({
    categoria: d.categoria_slug,
    comercio: d.business_slug,
  }))
}

export default async function ComercioPage({ params }: Props) {
  const comercio = await getComercio(params.comercio)
  if (!comercio) notFound()

  return (
    <>
      <BeneficiosHeader />
      <main
        style={{
          background: 'var(--rdv-bg-page)',
          minHeight: '100vh',
          paddingBottom: 80,
        }}
      >
        <div
          style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px 0' }}
          className="px-4 sm:px-6 lg:px-10"
        >
          {/* Breadcrumb */}
          <nav
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--rdv-text-muted)',
              marginBottom: 24,
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/beneficios"
              style={{ color: 'var(--rdv-primary)', textDecoration: 'none' }}
            >
              Beneficios
            </Link>
            <span>/</span>
            <Link
              href={`/beneficios/${params.categoria}`}
              style={{ color: 'var(--rdv-primary)', textDecoration: 'none' }}
            >
              {comercio.categoria.nombre}
            </Link>
            <span>/</span>
            <span>{comercio.nombre}</span>
          </nav>
        </div>

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
      <BeneficiosFooter />
    </>
  )
}
