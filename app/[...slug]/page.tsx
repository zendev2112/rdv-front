import { notFound } from 'next/navigation'
import {
  fetchArticlesBySection,
  fetchArticleBySlug,
  fetchArticlesByParentSection,
  supabase,
} from '@/lib/supabase'
import { formatSectionPath, getArticleUrl } from '@/lib/utils'
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

interface PageProps {
  params: {
    slug: string[]
  }
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const pathSlug = params.slug[params.slug.length - 1]

  // Check if it's a section page
  const sectionData = await getSectionData(pathSlug)
  if (sectionData) {
    return {
      title: `${sectionData.name} | Radio del Volga`,
      description: `Todas las noticias de ${sectionData.name}`,
    }
  }

  // Otherwise, fetch article metadata
  const article = await fetchArticleBySlug(pathSlug)
  if (article) {
    return {
      title: `${article.title} - Radio del Volga`,
      description: article.excerpt || `Lee ${article.title} en Radio del Volga`,
    }
  }

  return { title: 'Radio del Volga' }
}

async function getSectionData(slug: string) {
  const { data } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', slug)
    .single()

  return data
}

async function getChildSections(parentId: string) {
  const { data } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('parent_id', parentId)
    .order('position', { ascending: true })

  return data || []
}

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 12
  const sidelineWidth = 200

  const pathSlug = params.slug[params.slug.length - 1]
  const fullPath = params.slug.join('/')
  const sectionData = await getSectionData(pathSlug)

  if (sectionData) {
    // This is a section page
    let articlesResult: { articles: any[]; count: number }
    const childSections = await getChildSections(sectionData.id)

    // ALWAYS fetch parent section articles
    articlesResult = await fetchArticlesByParentSection(
      sectionData.slug,
      page,
      pageSize
    )

    const { articles, count } = articlesResult
    const totalPages = Math.ceil(count / pageSize)

    return (
      <SidelinesLayout sidelineWidth={sidelineWidth}>
        <Header />
        <div className="pt-[80px] md:pt-[100px]">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 border-b-2 border-primary-red pb-4">
              {/* Breadcrumbs */}
              <div className="text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-primary-red font-medium">
                  Inicio
                </Link>
                {sectionData.breadcrumb_slugs.map(
                  (slug: string, index: number) => (
                    <span key={slug}>
                      <span className="mx-2 text-gray-400">›</span>
                      <Link
                        href={`/${sectionData.breadcrumb_slugs
                          .slice(0, index + 1)
                          .join('/')}`}
                        className="hover:text-primary-red font-medium capitalize"
                      >
                        {sectionData.breadcrumb_names[index]}
                      </Link>
                    </span>
                  )
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                {sectionData.name}
              </h1>

              {/* Show subsection links if parent has children */}
              {childSections && childSections.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {childSections.map((child) => {
                    const childPath = sectionData.breadcrumb_slugs
                      .concat(child.slug)
                      .join('/')

                    return (
                      <Link
                        key={child.id}
                        href={`/${childPath}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary-red hover:text-white transition-colors text-sm font-medium"
                      >
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}

              <p className="text-gray-500 text-sm mt-3">
                {count} {count === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>

            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => {
                    const articlePath = getArticleUrl(
                      article.section_path,
                      article.slug
                    )

                    return (
                      <article
                        key={article.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
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
                          <h2 className="text-xl font-bold text-gray-900 mb-3">
                            <Link href={articlePath}>{article.title}</Link>
                          </h2>
                          {article.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                            <span>
                              {article.created_at
                                ? new Date(article.created_at).toLocaleDateString('es-AR')
                                : 'Fecha no disponible'}
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/${fullPath}?page=${page - 1}`}
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Anterior
                      </Link>
                    )}
                    <span className="px-4 py-2">
                      Página {page} de {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link
                        href={`/${fullPath}?page=${page + 1}`}
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Siguiente
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg">
                  No hay artículos disponibles en esta sección.
                </p>
              </div>
            )}
          </div>
        </div>
      </SidelinesLayout>
    )
  }

  // Article detail page logic
  const article = await fetchArticleBySlug(pathSlug)

  if (!article) {
    notFound()
  }

  // Use created_at for the date/time display
  const publishDate = article.created_at ? new Date(article.created_at) : null

  const formattedDate = publishDate
    ? new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(publishDate)
    : 'Fecha no disponible'

  return (
    <SidelinesLayout>
      <Header />
      <main className="container mx-auto px-4 py-8 pt-[80px] md:pt-[100px]">
        <article className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-red font-medium">
              Inicio
            </Link>
            {article.section_path && (
              <>
                {article.section_path.split('.').map(
                  (part: string, index: number, arr: string[]) => {
                    const sectionName = part.replace(/_/g, ' ')
                    const sectionUrl = `/${arr
                      .slice(0, index + 1)
                      .map((p) => p.replace(/_/g, '-'))
                      .join('/')}`

                    return (
                      <span key={part}>
                        <span className="mx-2 text-gray-400">›</span>
                        <Link
                          href={sectionUrl}
                          className="hover:text-primary-red font-medium capitalize"
                        >
                          {sectionName}
                        </Link>
                      </span>
                    )
                  }
                )}
              </>
            )}
          </nav>

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
            <time>{formattedDate}</time>
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
