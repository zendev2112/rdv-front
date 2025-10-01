import { notFound } from 'next/navigation'
import {
  fetchArticlesBySection,
  fetchArticleBySlug,
  fetchArticlesByParentSection,
  supabase,
} from '@/lib/supabase'
import Header from '@/components/Header'
import SidelinesLayout from '@/components/SidelinesLayout'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import dynamic from 'next/dynamic'

const ClientSafeImage = dynamic(() => import('@/components/ClientSafeImage'), {
  ssr: false,
})

const sectionConfig: Record<
  string,
  { id: string; title: string; description?: string; children?: string[] }
> = {
  'radio-del-volga': { id: 'radio-del-volga', title: 'Radio del Volga' },
  'mapa-del-sitio': { id: 'mapa-del-sitio', title: 'Mapa del Sitio' },
  'coronel-suarez': { id: 'coronel-suarez', title: 'Coronel Suárez' },

  // Parent section: Pueblos Alemanes
  'pueblos-alemanes': {
    id: 'pueblos-alemanes',
    title: 'Pueblos Alemanes',
    description: 'Noticias de los pueblos alemanes de la zona',
    children: ['santa-trinidad', 'san-jose', 'santa-maria'],
  },
  'santa-trinidad': { id: 'santa-trinidad', title: 'Santa Trinidad' },
  'san-jose': { id: 'san-jose', title: 'San José' },
  'santa-maria': { id: 'santa-maria', title: 'Santa María' },

  huanguelen: { id: 'huanguelen', title: 'Huanguelén' },
  'la-sexta': { id: 'la-sexta', title: 'La Sexta' },
  politica: { id: 'politica', title: 'Política' },
  actualidad: { id: 'actualidad', title: 'Actualidad' },

  // Parent section: Economía
  economia: {
    id: 'economia',
    title: 'Economía',
    description: 'Todas las noticias de economía',
    children: ['economia-dolar', 'economia-propiedades'],
  },
  'economia/dolar': { id: 'economia-dolar', title: 'Dólar' },
  'economia/propiedades': { id: 'economia-propiedades', title: 'Propiedades' },

  // Parent section: Pymes
  pymes: {
    id: 'pymes',
    title: 'Pymes y Emprendimientos',
    description: 'Noticias para emprendedores y PyMEs',
    children: ['pymes-inmuebles', 'pymes-campos', 'pymes-construccion-diseno'],
  },
  'pymes/inmuebles': { id: 'pymes-inmuebles', title: 'Inmuebles' },
  'pymes/campos': { id: 'pymes-campos', title: 'Campos' },
  'pymes/construccion-diseno': {
    id: 'pymes-construccion-diseno',
    title: 'Construcción y Diseño',
  },

  // Parent section: Agro
  agro: {
    id: 'agro',
    title: 'Agro',
    description: 'Noticias del campo y la agricultura',
    children: ['agro-agricultura', 'agro-ganaderia', 'agro-tecnologias'],
  },
  'agro/agricultura': { id: 'agro-agricultura', title: 'Agricultura' },
  'agro/ganaderia': { id: 'agro-ganaderia', title: 'Ganadería' },
  'agro/tecnologias': { id: 'agro-tecnologias', title: 'Tecnologías' },

  // Parent section: Sociedad
  sociedad: {
    id: 'sociedad',
    title: 'Sociedad',
    description: 'Noticias de sociedad',
    children: [
      'sociedad-educacion',
      'sociedad-policiales',
      'sociedad-efemerides',
      'sociedad-ciencia',
    ],
  },
  'sociedad/educacion': { id: 'sociedad-educacion', title: 'Educación' },
  'sociedad/policiales': { id: 'sociedad-policiales', title: 'Policiales' },
  'sociedad/efemerides': { id: 'sociedad-efemerides', title: 'Efemérides' },
  'sociedad/ciencia': { id: 'sociedad-ciencia', title: 'Ciencia' },

  // Parent section: Salud
  salud: {
    id: 'salud',
    title: 'Salud',
    description: 'Consejos y noticias de salud',
    children: [
      'salud-vida-en-armonia',
      'salud-nutricion-energia',
      'salud-fitness',
      'salud-salud-mental',
    ],
  },
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

  // Parent section: Lifestyle
  lifestyle: {
    id: 'lifestyle',
    title: 'Lifestyle',
    description: 'Estilo de vida y entretenimiento',
    children: [
      'lifestyle-turismo',
      'lifestyle-horoscopo',
      'lifestyle-feriados',
      'lifestyle-loterias-quinielas',
      'lifestyle-moda-belleza',
      'lifestyle-mascotas',
    ],
  },
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

interface PageProps {
  params: {
    slug: string[]
  }
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const pathKey = params.slug.join('/')
  const articleSlug = params.slug[params.slug.length - 1]

  // Check if it's a section page
  const config = sectionConfig[pathKey]
  if (config) {
    return {
      title: `${config.title} | Radio del Volga`,
      description:
        config.description || `Todas las noticias de ${config.title}`,
    }
  }

  // Otherwise, fetch article metadata
  const article = await fetchArticleBySlug(articleSlug)
  if (article) {
    return {
      title: `${article.title} - Radio del Volga`,
      description:
        article.excerpt || `Read ${article.title} on Radio del Volga`,
    }
  }

  return { title: 'Radio del Volga' }
}

export default async function DynamicPage({ params }: PageProps) {
  const pathKey = params.slug.join('/')
  const articleSlug = params.slug[params.slug.length - 1]

  // First, check if this is a SECTION page
  const sectionConf = sectionConfig[pathKey]
  if (sectionConf) {
    // Fetch articles
    let articles: any[] = []

    if (sectionConf.children && sectionConf.children.length > 0) {
      // Parent section: fetch from all subsections using the helper
      articles = await fetchArticlesByParentSection(
        sectionConf.id,
        sectionConf.children
      )
    } else {
      // Single section: fetch normally
      articles = await fetchArticlesBySection(sectionConf.id)
    }

    return (
      <SidelinesLayout>
        <Header />
        <div className="pt-[80px] md:pt-[100px]">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 border-b-2 border-primary-red pb-4">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                {sectionConf.title}
              </h1>
              {sectionConf.description && (
                <p className="text-gray-600 text-lg mt-2">
                  {sectionConf.description}
                </p>
              )}

              {/* Show subsection links if parent has children */}
              {sectionConf.children && sectionConf.children.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {sectionConf.children.map((childId) => {
                    const childPath = Object.keys(sectionConfig).find(
                      (key) => sectionConfig[key].id === childId
                    )
                    const childConfig = childPath
                      ? sectionConfig[childPath]
                      : null

                    if (!childConfig) return null

                    return (
                      <Link
                        key={childId}
                        href={`/${childPath}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary-red hover:text-white transition-colors text-sm font-medium"
                      >
                        {childConfig.title}
                      </Link>
                    )
                  })}
                </div>
              )}

              <p className="text-gray-500 text-sm mt-3">
                {articles.length}{' '}
                {articles.length === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => {
                  // Use the converted section_path_url
                  const articlePath = article.section_path_url
                    ? `/${article.section_path_url}/${article.slug}`
                    : `/${article.section_slug}/${article.slug}` // fallback

                  return (
                    <article
                      key={article.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      {article.imgUrl && (
                        <Link href={articlePath}>
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={article.imgUrl}
                              alt={article.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                      )}
                      <div className="p-5">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-red transition-colors">
                          <Link href={articlePath}>{article.title}</Link>
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
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-2">
                  No hay artículos disponibles en esta sección.
                </p>
              </div>
            )}
          </div>
        </div>
      </SidelinesLayout>
    )
  }

  // Not a section page, so try to fetch as an ARTICLE
  const article = await fetchArticleBySlug(articleSlug)

  if (!article) {
    notFound()
  }

  // Render article detail page (your existing article code)
  const publishDate = article.published_at
    ? new Date(article.published_at)
    : null
  const formattedDate = publishDate
    ? new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(publishDate)
    : null

  return (
    <SidelinesLayout>
      <Header />
      <main className="container mx-auto px-4 py-8 pt-[80px] md:pt-[100px]">
        <article className="max-w-4xl mx-auto">
          {article.overline && (
            <div className="text-primary-red font-medium mb-2">
              {article.overline}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <div className="text-lg text-gray-700 mb-6">{article.excerpt}</div>
          )}

          <div className="flex items-center text-sm text-gray-600 mb-6">
            {article.source && <span className="mr-4">{article.source}</span>}
            {formattedDate && <time>{formattedDate}</time>}
          </div>

          {article.imgUrl && (
            <div className="relative h-[40vh] md:h-[60vh] mb-8">
              <ClientSafeImage
                src={article.imgUrl}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {article.article &&
              (article.article.startsWith('<') ? (
                <div dangerouslySetInnerHTML={{ __html: article.article }} />
              ) : (
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                >
                  {article.article}
                </ReactMarkdown>
              ))}
          </div>
        </article>
      </main>
    </SidelinesLayout>
  )
}
