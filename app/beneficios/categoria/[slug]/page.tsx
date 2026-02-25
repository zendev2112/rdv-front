import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'
import { BeneficioActivo } from '../../types'
import BeneficiosHeader from '../../components/BeneficiosHeader'
import BeneficiosFooter from '../../components/BeneficiosFooter'
import BeneficioCard from '../../components/BeneficioCard'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('categoria_nombre')
    .eq('categoria_slug', params.slug)
    .limit(1)
    .single()

  const nombre = data?.categoria_nombre ?? params.slug
  return {
    title: `Descuentos en ${nombre} en Coronel Suárez | Volga Beneficios`,
    description: `Encontrá todos los descuentos y beneficios de ${nombre} en Coronel Suárez. Ahorrá con Volga Beneficios, Radio del Volga.`,
    alternates: {
      canonical: `https://radiodelvolga.com.ar/beneficios/categoria/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const { data } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('categoria_slug')
  const slugs = Array.from(new Set((data ?? []).map((d) => d.categoria_slug)))
  return slugs.map((slug) => ({ slug }))
}

async function getBeneficiosByCategoria(
  slug: string,
): Promise<BeneficioActivo[]> {
  const { data, error } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('*')
    .eq('categoria_slug', slug)
    .order('business_nombre', { ascending: true })
  if (error) return []
  return data ?? []
}

export default async function CategoriaPage({ params }: Props) {
  const beneficios = await getBeneficiosByCategoria(params.slug)
  if (beneficios.length === 0) notFound()

  const categoria = {
    nombre: beneficios[0].categoria_nombre,
    icono: beneficios[0].categoria_icono,
  }

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
          style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 0' }}
          className="px-4 sm:px-6 lg:px-10"
        >
          {/* Page heading */}
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontSize: 'var(--font-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--rdv-text-muted)',
                letterSpacing: '1.5px',
                margin: '0 0 8px',
              }}
            >
              VOLGA BENEFICIOS
            </p>
            <h1
              style={{
                fontSize: 'var(--font-3xl)',
                fontWeight: 800,
                color: 'var(--rdv-text-primary)',
                margin: '0 0 4px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {categoria.icono && <span>{categoria.icono}</span>}
              {categoria.nombre}
            </h1>
            <p
              style={{
                fontSize: 'var(--font-base)',
                color: 'var(--rdv-text-secondary)',
                margin: 0,
              }}
            >
              {beneficios.length}{' '}
              {beneficios.length === 1 ? 'comercio' : 'comercios'} con
              descuentos activos
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b) => (
              <BeneficioCard key={b.benefit_id} beneficio={b} />
            ))}
          </div>
        </div>
      </main>
      <BeneficiosFooter />
    </>
  )
}
