import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { formatSectionPath } from '@/lib/utils'
import Image from 'next/image'
import Footer from '@/components/Footer'

type SectionRow = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  path: any
  breadcrumb_names: string[]
  breadcrumb_slugs: string[]
  image?: string
}

export default async function SeccionesPage() {
  // fetch section hierarchy
  const { data, error } = await supabase
    .from('section_hierarchy')
    .select('*')
    .order('path', { ascending: true })

  // cast returned data to our local type
  const sections = (data || []) as SectionRow[]

  if (error) {
    // fallback UI for fetch error
    return (
      <>
        <Header />
        <main className="pt-[184px] pb-24 md:hidden">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Secciones</h1>
            <p className="text-sm text-red-600">Error cargando secciones.</p>
          </div>
        </main>
      </>
    )
  }

  // normalize path and build parent->children map
  const byId = new Map<string, SectionRow>()
  sections.forEach((s) => byId.set(s.id, s))

  const parents = sections.filter((s) => !s.parent_id)

  // ✅ Define the desired order (same as Header nav, excluding 'Inicio')
  const sectionOrder = [
    'Coronel Suárez',
    'Pueblos Alemanes',
    'Farmacias de Turno',
    'Huanguelén',
    'La Sexta',
    'Actualidad',
    'Agro',
    'Economia',
    'Lifestyle',
    'Deportes',
  ]

  // ✅ Sort sections by the desired order, then append remaining sections
  const sortedParents = parents.sort((a: SectionRow, b: SectionRow) => {
    const indexA = sectionOrder.indexOf(a.name)
    const indexB = sectionOrder.indexOf(b.name)
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })

  const toUrlPath = (section: SectionRow) => {
    if (!section.parent_id) {
      return formatSectionPath(section.slug)
    }

    if (section.path) {
      return formatSectionPath(String(section.path))
    }

    return formatSectionPath(section.slug)
  }

  // ✅ HELPER: Generate image path from section slug
  const getImagePath = (slug: string) => {
    return `/images/sections/${slug}.webp`
  }

  return (
    <>
      <Header />
      <main className="md:hidden pt-[184px] pb-24">
        <div className="container mx-auto px-4">
          <div className="mb-0 pb-4 py-0 -mt-8">
            {/* Breadcrumbs */}
            <nav className="text-sm md:text-xs text-gray-500 mb-4 mt-0">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium">Secciones</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 leading-tight mt-6 md:mt-8">
              Secciones
            </h1>
          </div>

          {/* Divisory Line */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* ✅ 2 COLUMN GRID - ALL SECTIONS */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {sortedParents.map((parent) => {
              const parentPath = toUrlPath(parent)
              const sectionImage = getImagePath(parent.slug)

              return (
                <Link key={parent.id} href={`/${parentPath}`} className="group">
                  <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-16 flex">
                    {/* Left Half - Image */}
                    <div className="w-1/2 relative overflow-hidden bg-gray-200">
                      <Image
                        src={sectionImage}
                        alt={parent.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw"
                      />
                    </div>

                    {/* Right Half - Title */}
                    <div className="w-1/2 flex items-center justify-center p-2">
                      <h2 className="text-xs font-bold text-gray-900 text-center group-hover:text-primary-red transition-colors break-words">
                        {parent.name}
                      </h2>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>

      {/* Desktop Hidden */}
      <div className="hidden md:block pt-[80px]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Secciones</h1>
          <p className="text-sm text-gray-600">
            Esta página está disponible solo en dispositivos móviles.
          </p>
        </div>
      </div>
    </>
  )
}
