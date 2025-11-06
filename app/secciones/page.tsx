import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { formatSectionPath } from '@/lib/utils'

type SectionRow = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  path: any
  breadcrumb_names: string[]
  breadcrumb_slugs: string[]
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
        <main className="pt-20 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Secciones</h1>
          <p className="text-sm text-red-600">Error cargando secciones.</p>
        </main>
      </>
    )
  }

  // normalize path and build parent->children map
  const byId = new Map<string, SectionRow>()
  sections.forEach((s) => byId.set(s.id, s))

  const parents = sections.filter((s) => !s.parent_id)
  const childrenMap = new Map<string, SectionRow[]>()
  sections.forEach((s) => {
    if (s.parent_id) {
      const arr = childrenMap.get(s.parent_id) || []
      arr.push(s)
      childrenMap.set(s.parent_id, arr)
    }
  })

  const toUrlPath = (section: SectionRow) => {
    // ✅ USE parent_id AS SOURCE OF TRUTH
    // If parent_id is null, it's a standalone parent - use only slug
    // If parent_id exists, use the full path

    if (!section.parent_id) {
      // ✅ Standalone section - use only slug
      return formatSectionPath(section.slug)
    }

    // ✅ Has parent - use full path
    if (section.path) {
      return formatSectionPath(String(section.path))
    }

    return formatSectionPath(section.slug)
  }

  return (
    <>
      <Header />
      <main className="pt-[80px] md:pt-[100px]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Secciones
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {parents.map((parent) => {
              const kids = childrenMap.get(parent.id) || []
              const parentPath = toUrlPath(parent)

              return (
                <article
                  key={parent.id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/${parentPath}`} className="block">
                    <h2 className="text-lg font-semibold text-gray-900 hover:text-primary-red">
                      {parent.name}
                    </h2>
                  </Link>

                  {kids.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {kids.map((c) => {
                        const childPath = toUrlPath(c)
                        return (
                          <Link
                            key={c.id}
                            href={`/${childPath}`}
                            className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-primary-red hover:text-white transition-colors"
                          >
                            {c.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
