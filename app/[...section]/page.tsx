import { notFound } from 'next/navigation'
import { fetchArticlesBySection } from '@/lib/supabase'
import Header from '@/components/Header'
import SidelinesLayout from '@/components/SidelinesLayout'
import Image from 'next/image'
import Link from 'next/link'

// Map URL paths to section identifiers and display names
const sectionConfig: Record<
  string,
  { id: string; title: string; description?: string }
> = {
  'radio-del-volga': { id: 'radio-del-volga', title: 'Radio del Volga' },
  'mapa-del-sitio': { id: 'mapa-del-sitio', title: 'Mapa del Sitio' },
  'coronel-suarez': { id: 'coronel-suarez', title: 'Coronel Suárez' },
  'santa-trinidad': { id: 'santa-trinidad', title: 'Santa Trinidad' },
  'san-jose': { id: 'san-jose', title: 'San José' },
  'santa-maria': { id: 'santa-maria', title: 'Santa María' },
  huanguelen: { id: 'huanguelen', title: 'Huanguelén' },
  'la-sexta': { id: 'la-sexta', title: 'La Sexta' },
  politica: { id: 'politica', title: 'Política' },
  actualidad: { id: 'actualidad', title: 'Actualidad' },
  'economia/dolar': { id: 'economia-dolar', title: 'Dólar' },
  'economia/propiedades': { id: 'economia-propiedades', title: 'Propiedades' },
  'pymes/inmuebles': { id: 'pymes-inmuebles', title: 'Inmuebles' },
  'pymes/campos': { id: 'pymes-campos', title: 'Campos' },
  'pymes/construccion-diseno': {
    id: 'pymes-construccion-diseno',
    title: 'Construcción y Diseño',
  },
  'agro/agricultura': { id: 'agro-agricultura', title: 'Agricultura' },
  'agro/ganaderia': { id: 'agro-ganaderia', title: 'Ganadería' },
  'agro/tecnologias': { id: 'agro-tecnologias', title: 'Tecnologías' },
  'sociedad/educacion': { id: 'sociedad-educacion', title: 'Educación' },
  'sociedad/policiales': { id: 'sociedad-policiales', title: 'Policiales' },
  'sociedad/efemerides': { id: 'sociedad-efemerides', title: 'Efemérides' },
  'sociedad/ciencia': { id: 'sociedad-ciencia', title: 'Ciencia' },
  'salud/vida-en-armonia': {
    id: 'salud-vida-en-armonia',
    title: 'Vida en Armonía',
  },
  'salud/nutricion-energia': {
    id: 'salud-nutricion-energia',
    title: 'Nutrición y Energía',
  },
  'salud/fitness': { id: 'salud-fitness', title: 'Fitness' },
  'salud/salud-mental': { id: 'salud-salud-mental', title: 'Salud Mental' },
  cultura: { id: 'cultura', title: 'Cultura' },
  opinion: { id: 'opinion', title: 'Opinión' },
  deportes: { id: 'deportes', title: 'Deportes' },
  'lifestyle/turismo': { id: 'lifestyle-turismo', title: 'Turismo' },
  'lifestyle/horoscopo': { id: 'lifestyle-horoscopo', title: 'Horóscopo' },
  'lifestyle/feriados': { id: 'lifestyle-feriados', title: 'Feriados' },
  'lifestyle/loterias-quinielas': {
    id: 'lifestyle-loterias-quinielas',
    title: 'Loterías y Quinielas',
  },
  'lifestyle/moda-belleza': {
    id: 'lifestyle-moda-belleza',
    title: 'Moda y Belleza',
  },
  'lifestyle/mascotas': { id: 'lifestyle-mascotas', title: 'Mascotas' },
  'volga-beneficios': { id: 'volga-beneficios', title: 'Volga Beneficios' },
  vinos: { id: 'vinos', title: 'Vinos' },
  'el-recetario': { id: 'el-recetario', title: 'El Recetario' },
}

// Generate static params for all sections
export async function generateStaticParams() {
  return Object.keys(sectionConfig).map((path) => ({
    section: path.split('/'),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { section: string[] }
}) {
  const pathKey = params.section.join('/')
  const config = sectionConfig[pathKey]

  if (!config) {
    return {
      title: 'Sección no encontrada',
    }
  }

  return {
    title: `${config.title} | Radio del Volga`,
    description: config.description || `Todas las noticias de ${config.title}`,
  }
}

interface PageProps {
  params: {
    section: string[]
  }
}

export default async function SectionPage({ params }: PageProps) {
  const pathKey = params.section.join('/')
  const config = sectionConfig[pathKey]

  if (!config) {
    notFound()
  }

  const articles = (await fetchArticlesBySection(config.id)) || []

  return (
    <SidelinesLayout>
      <Header />
      <div className="pt-[80px] md:pt-[100px]">
        <div className="container mx-auto px-4 py-8">
          {/* Section Header */}
          <div className="mb-8 border-b-2 border-primary-red pb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
            {config.description && (
              <p className="text-gray-600 text-lg mt-2">{config.description}</p>
            )}
            <p className="text-gray-500 text-sm mt-3">
              {articles.length}{' '}
              {articles.length === 1 ? 'artículo' : 'artículos'}
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {article.featured_image && (
                    <Link href={`/articulos/${article.slug}`}>
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={article.featured_image}
                          alt={article.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-red transition-colors">
                      <Link href={`/articulos/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                      <span>
                        {new Date(article.published_at).toLocaleDateString(
                          'es-AR'
                        )}
                      </span>
                      {article.author && (
                        <span className="font-medium">
                          Por {article.author}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg mb-2">
                No hay artículos disponibles en esta sección.
              </p>
              <p className="text-gray-500 text-sm">
                Vuelve pronto para ver nuevas publicaciones.
              </p>
            </div>
          )}
        </div>
      </div>
    </SidelinesLayout>
  )
}
