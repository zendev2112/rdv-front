import type { Metadata } from 'next'
import { BeneficioActivo } from './types'
import BeneficiosHeader from './components/BeneficiosHeader'
import HeroBanner from './components/HeroBanner'
import CategoryScroller from './components/CategoryScroller'
import BeneficioCarousel from './components/BeneficioCarousel'
import CampaignSection from './components/CampaignSection'
import SociosDestacados from './components/SociosDestacados'
import SorteosSection from './components/SorteosSection'
import NoticiasSection from './components/NoticiasSection'
import BeneficiosFooter from './components/BeneficiosFooter'
import EmptyState from './components/EmptyState'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'

export const metadata: Metadata = {
  title: 'Volga Beneficios | Descuentos en Coronel Suárez',
  description:
    'Descuentos y beneficios exclusivos en comercios de Coronel Suárez. Gastronomía, salud, deportes, indumentaria y más.',
  alternates: { canonical: 'https://radiodelvolga.com.ar/beneficios' },
}

export const dynamic = 'force-dynamic'

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

export default async function BeneficiosPage() {
  const beneficios = await getBeneficios()

  if (beneficios.length === 0) {
    return (
      <>
        <BeneficiosHeader />
        <main
          className="min-h-screen"
          style={{ background: 'var(--rdv-bg-page)' }}
        >
          <EmptyState />
        </main>
        <BeneficiosFooter />
      </>
    )
  }

  // Unique categories with count
  const categoriasMap = new Map<
    string,
    { id: number; nombre: string; slug: string; icono: string; count: number }
  >()
  beneficios.forEach((b) => {
    if (!categoriasMap.has(b.categoria_slug)) {
      categoriasMap.set(b.categoria_slug, {
        id: b.categoria_id,
        nombre: b.categoria_nombre,
        slug: b.categoria_slug,
        icono: b.categoria_icono ?? '',
        count: 0,
      })
    }
    categoriasMap.get(b.categoria_slug)!.count++
  })
  const categorias = Array.from(categoriasMap.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre),
  )

  // Thematic grouping — rotate through all items so nothing is hidden
  const relevantes = beneficios.slice(0, 8)
  const destacados = beneficios.slice(8, 16)
  const campaign = beneficios.slice(16, 20)
  const premium = beneficios.slice(20, 28)
  const nuevos = beneficios.slice(28, 36)

  return (
    <>
      <BeneficiosHeader />

      <main style={{ background: 'var(--rdv-bg-page)', paddingBottom: 80 }}>
        {/* ── Hero ── */}
        <HeroBanner />

        {/* ── Container ── */}
        <div
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}
          className="px-4 sm:px-6 lg:px-10"
        >
          {/* Category scroller — overlaps hero on desktop */}
          <CategoryScroller categorias={categorias} />

          {/* ── Beneficios Relevantes ── */}
          <div style={{ marginTop: 48 }}>
            <BeneficioCarousel
              title="Beneficios Relevantes"
              beneficios={relevantes}
            />
          </div>

          {/* ── Beneficios Destacados ── */}
          {destacados.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <BeneficioCarousel
                title="Beneficios Destacados"
                beneficios={destacados}
              />
            </div>
          )}

          {/* ── Comercios de Temporada ── */}
          {campaign.length > 0 && (
            <CampaignSection
              eyebrow="DESCUBRÍ"
              title="¡Comercios de temporada!"
              beneficios={campaign}
            />
          )}
        </div>

        {/* ── Socios Destacados (full-bleed dark) ── */}
        {premium.length > 0 && <SociosDestacados beneficios={premium} />}

        {/* ── Sorteos Volga (full-bleed dark) ── */}
        <SorteosSection />

        {/* ── Noticias de Suárez + Nuevos Comercios ── */}
        <div
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}
          className="mt-32 px-4 sm:px-6 lg:px-10"
        >
          <NoticiasSection />

          {nuevos.length > 0 && (
            <div className="mt-16">
              <BeneficioCarousel title="Nuevos Comercios" beneficios={nuevos} />
            </div>
          )}
        </div>
      </main>

      <BeneficiosFooter />
    </>
  )
}
