import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'
import { BeneficioActivo } from '../types'
import BeneficiosHeader from '../components/BeneficiosHeader'
import BeneficiosFooter from '../components/BeneficiosFooter'
import ComercioCard from '../components/ComercioCard'

interface Props {
  params: { categoria: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('categoria_nombre')
    .eq('categoria_slug', params.categoria)
    .limit(1)
    .single()

  const nombre = data?.categoria_nombre ?? params.categoria
  return {
    title: `Descuentos en ${nombre} en Coronel Suárez | Volga Beneficios`,
    description: `Encontrá todos los descuentos y beneficios de ${nombre} en Coronel Suárez. Ahorrá con Volga Beneficios, Radio del Volga.`,
    alternates: {
      canonical: `https://radiodelvolga.com.ar/beneficios/${params.categoria}`,
    },
  }
}

export async function generateStaticParams() {
  const { data } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('categoria_slug')
  const slugs = Array.from(new Set((data ?? []).map((d) => d.categoria_slug)))
  return slugs.map((slug) => ({ categoria: slug }))
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
  const beneficios = await getBeneficiosByCategoria(params.categoria)
  if (beneficios.length === 0) notFound()

  // Unique comercios
  const comerciosMap = new Map<string, BeneficioActivo>()
  beneficios.forEach((b) => {
    if (!comerciosMap.has(b.business_slug)) comerciosMap.set(b.business_slug, b)
  })
  const comercios = Array.from(comerciosMap.values())

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
          {/* Breadcrumb */}
          <nav
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--rdv-text-muted)',
              marginBottom: 24,
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <Link
              href="/beneficios"
              style={{ color: 'var(--rdv-primary)', textDecoration: 'none' }}
            >
              Beneficios
            </Link>
            <span>/</span>
            <span>{categoria.nombre}</span>
          </nav>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 'var(--font-3xl)',
                fontWeight: 800,
                color: 'var(--rdv-text-primary)',
                margin: '0 0 8px',
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
              {comercios.length}{' '}
              {comercios.length === 1 ? 'comercio' : 'comercios'} con descuentos
              activos
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {comercios.map((b) => (
              <ComercioCard
                key={b.business_slug}
                slug={b.business_slug}
                nombre={b.business_nombre}
                descripcion={b.business_descripcion}
                logo_url={b.logo_url}
                categoria_nombre={b.categoria_nombre}
                categoria_icono={b.categoria_icono}
                benefitCount={
                  beneficios.filter((x) => x.business_slug === b.business_slug)
                    .length
                }
                href={`/beneficios/${params.categoria}/${b.business_slug}`}
              />
            ))}
          </div>
        </div>
      </main>
      <BeneficiosFooter />
    </>
  )
}
