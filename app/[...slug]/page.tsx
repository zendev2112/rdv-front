import { notFound } from 'next/navigation'
import {
  fetchArticlesBySection,
  fetchArticleBySlug,
  fetchArticlesByParentSection,
  supabase,
} from '@/lib/supabase'
import { formatSectionPath, getArticleUrl } from '@/lib/utils'
import SidelinesLayout from '@/components/SidelinesLayout'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import dynamic from 'next/dynamic'
import ArticleShareSidebar from '@/components/ArticleShareSidebar'
import RelatedArticlesSidebar from '@/components/RelatedArticlesSidebar'
import { getProperSpanishName } from '@/lib/spanishGrammar'
import YouMayBeInterestedSection from '@/components/YouMayBeInterestedSection'
import { intercalateEmbeds } from '@/lib/articleEmbeds'
import EmbedRenderer from '@/components/EmbedRenderer'
import { applyCloudinaryTransform } from '@/lib/cloudinaryTransforms'
import { detectImageOrientation } from '@/lib/imageOrientation'
import StickyShareSidebar from '@/components/StickyShareSidebar'
import AdContainer from '@/components/AdContainer'

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

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
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
  const sidelineWidth = 15

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
      <>
        <div className="hidden md:block pt-[80px]">
          {/* Desktop version - WITH SidelinesLayout */}
          <SidelinesLayout sidelineWidth={sidelineWidth}>
            <div className="mb-0 pb-4 px-8 py-8">
              {/* Breadcrumbs */}
              <nav className="text-sm md:text-xs text-gray-500 mb-4 mt-4">
                <Link href="/" className="hover:text-primary-red font-medium">
                  RADIO DEL VOLGA
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
              </nav>

              <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-4 leading-tight mt-4 md:mt-6">
                {sectionData.name}
              </h1>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
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
                          <h2 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                            <Link href={articlePath}>{article.title}</Link>
                          </h2>
                          {article.excerpt && (
                            <p className="font-serif text-gray-600 text-sm mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                            <span>
                              {article.created_at
                                ? new Date(
                                    article.created_at
                                  ).toLocaleDateString('es-AR')
                                : 'Fecha no disponible'}
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2 px-8">
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
          </SidelinesLayout>
        </div>

        <div className="hidden md:block pt-[80px]">
          {/* Desktop version - WITH SidelinesLayout */}
          <SidelinesLayout sidelineWidth={sidelineWidth}>
            <div className="mb-0 pb-4 px-8 py-8">
              {/* Breadcrumbs */}
              <div className="text-sm md:text-xs text-gray-500 mb-4">
                <Link href="/" className="hover:text-primary-red font-medium">
                  RADIO DEL VOLGA
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

              <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-4 leading-tight mt-4 md:mt-6">
                {sectionData.name}
              </h1>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
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
                                ? new Date(
                                    article.created_at
                                  ).toLocaleDateString('es-AR')
                                : 'Fecha no disponible'}
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2 px-8">
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
          </SidelinesLayout>
        </div>
      </>
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
    ? (() => {
        const date = new Intl.DateTimeFormat('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(publishDate)

        const time = new Intl.DateTimeFormat('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(publishDate)

        return `${date}   ·   ${time}`
      })()
    : 'Fecha no disponible'

  const readingTimeMinutes = calculateReadingTime(article.article || '')

  return (
    <>
      <div className="md:hidden pt-[184px]">
        <div className="container mx-auto max-w-[1600px] px-4">
          <div className="mb-0 pb-4 py-0 -mt-8">
            {/* Breadcrumbs */}
            <nav className="text-sm md:text-xs text-gray-500 mb-4 mt-0">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              {article.section_path && (
                <>
                  {article.section_path
                    .split('.')
                    .map((part: string, index: number, arr: string[]) => {
                      const sectionSlug = part.replace(/_/g, '-')
                      const sectionName = getProperSpanishName(sectionSlug)
                      const sectionUrl = `/${arr
                        .slice(0, index + 1)
                        .map((p) => p.replace(/_/g, '-'))
                        .join('/')}`

                      return (
                        <span key={part}>
                          <span className="mx-2 text-gray-400">›</span>
                          <Link
                            href={sectionUrl}
                            className="hover:text-primary-red font-medium"
                          >
                            {sectionName}
                          </Link>
                        </span>
                      )
                    })}
                </>
              )}
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 leading-tight mt-6 md:mt-8">
              {article.title}
            </h1>
          </div>

          <article>
            {/* Article content */}
            {article.excerpt && (
              <div className="font-serif text-xl text-gray-700 mb-6 mt-0 md:-mt-14">
                {article.excerpt}
              </div>
            )}

            <div className="text-base text-gray-600 mb-6 whitespace-pre-wrap">
              {formattedDate}
              {'   '}·{'   '}
              <span className="inline-flex items-center gap-1">
                ⏱️ {readingTimeMinutes}'
              </span>
            </div>

            {article.imgUrl &&
              (() => {
                const orientation = detectImageOrientation(article.imgUrl)

                return (
                  <ClientSafeImage
                    src={applyCloudinaryTransform(article.imgUrl, 'hq')}
                    alt={article.title}
                    priority
                    orientation={orientation}
                  />
                )
              })()}

            <div className="border-t border-gray-300 my-4"></div>

            {/* ✅ SHARE SIDEBAR - HORIZONTAL FOR MOBILE */}
            <div className="flex justify-start my-6">
              <ArticleShareSidebar
                title={article.title}
                url={typeof window !== 'undefined' ? window.location.href : ''}
              />
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            {/* ✅ MOBILE: INTERCALATED EMBEDS */}
            <div className="prose prose-2xl max-w-none prose-p:text-left prose-p:text-lg prose-p:leading-[1.8] prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-5 prose-h3:mb-3 prose-h4:text-lg prose-h4:font-bold prose-h4:mt-4 prose-h4:mb-2 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-5 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-5 prose-li:text-lg prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:mb-5 prose-strong:font-bold prose-a:text-primary-red prose-a:underline first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:pr-2 first-letter:leading-[0.8]">
              {article.article &&
                (() => {
                  const contentParts = intercalateEmbeds(article.article, {
                    igPost: article['ig-post'],
                    fbPost: article['fb-post'],
                    twPost: article['tw-post'],
                    ytVideo: article['yt-video'],
                    articleImages: article['article-images'],
                  })

                  return contentParts.map((part, index) => {
                    if (part.type === 'embed') {
                      return (
                        <EmbedRenderer
                          key={`embed-${index}`}
                          embedType={part.embedType!}
                          content={part.content}
                        />
                      )
                    }

                    // Render text content
                    if (article.article.startsWith('<')) {
                      return (
                        <div
                          key={`text-${index}`}
                          dangerouslySetInnerHTML={{ __html: part.content }}
                        />
                      )
                    }

                    return (
                      <ReactMarkdown
                        key={`text-${index}`}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        remarkPlugins={[remarkGfm]}
                      >
                        {part.content}
                      </ReactMarkdown>
                    )
                  })
                })()}
            </div>
          </article>
          {/* ✅ YOU MAY BE INTERESTED SECTION - MOBILE */}
          <div className="mt-12">
            <YouMayBeInterestedSection
              currentArticleId={article.id}
              currentSectionPath={article.section_path}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block pt-[80px]">
        <SidelinesLayout sidelineWidth={sidelineWidth}>
          <div className="mb-0 pb-4 px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="text-base md:text-sm text-gray-500 mb-4 mt-4">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              {article.section_path && (
                <>
                  {article.section_path
                    .split('.')
                    .map((part: string, index: number, arr: string[]) => {
                      const sectionSlug = part.replace(/_/g, '-')
                      const sectionName = getProperSpanishName(sectionSlug)
                      const sectionUrl = `/${arr
                        .slice(0, index + 1)
                        .map((p) => p.replace(/_/g, '-'))
                        .join('/')}`

                      return (
                        <span key={part}>
                          <span className="mx-2 text-gray-400">›</span>
                          <Link
                            href={sectionUrl}
                            className="hover:text-primary-red font-medium"
                          >
                            {sectionName}
                          </Link>
                        </span>
                      )
                    })}
                </>
              )}
            </nav>

            {/* ✅ TITLE - FULL WIDTH */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 leading-tight mt-6 md:mt-8">
              {article.title}
            </h1>
          </div>

          {/* ✅ NEW 2-COLUMN CONTAINER: EXCERPT + DATE + IMAGE */}
          <div className="grid grid-cols-12 gap-4 px-8 mb-8">
            {/* ✅ LEFT: 8 columns - EXCERPT + DATE + IMAGE */}
            <div className="col-span-8">
              {/* EXCERPT */}
              {article.excerpt && (
                <p className="font-serif text-xl text-gray-700 mb-4">
                  {article.excerpt}
                </p>
              )}

              {/* DATE AND READING TIME */}
              <div className="text-base text-gray-600 mb-6 whitespace-pre-wrap">
                {formattedDate}
                {'   '}·{'   '}
                <span className="inline-flex items-center gap-1">
                  ⏱️ {readingTimeMinutes} minutos de lectura
                </span>
              </div>

              {/* MAIN IMAGE */}
              {article.imgUrl &&
                (() => {
                  const orientation = detectImageOrientation(article.imgUrl)

                  return (
                    <ClientSafeImage
                      src={applyCloudinaryTransform(article.imgUrl, 'hq')}
                      alt={article.title}
                      priority
                      orientation={orientation}
                    />
                  )
                })()}

              {/* ✅ DIVISORY LINE */}
              <div className="border-t border-gray-300 my-8"></div>
            </div>

            {/* ✅ RIGHT: 4 columns - AD CONTAINER */}
            <div className="col-span-4">
              <AdContainer sticky={true} />
            </div>
          </div>

          {/* ✅ 3-COLUMN GRID: SHARE + ARTICLE + RELATED */}
          <div className="relative grid grid-cols-12 gap-4 px-8">
            {/* ✅ LEFT: 1 column - SHARE SIDEBAR */}
            <div className="col-span-1 -ml-4 mt-4 ">
              <div
                style={{ position: 'sticky', top: '120px' }}
                className="h-fit flex justify-center"
              >
                <StickyShareSidebar
                  title={article.title}
                  url={
                    typeof window !== 'undefined' ? window.location.href : ''
                  }
                />
              </div>
            </div>

            {/* ✅ MIDDLE: 7 columns - ARTICLE CONTENT */}
            <article className="col-span-7">
              <div className="prose prose-xl max-w-none prose-p:leading-[1.8] pt-0">
                <style>{`
  .prose {
    --tw-prose-body: 18px;
    max-width: 65ch;
    font-family: Georgia, Times New Roman, serif;
  }
  .prose p {
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 1.25rem;
    font-family: Georgia, Times New Roman, serif;
  }
  .prose h2 {
    font-size: 1.875rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-family: Georgia, Times New Roman, serif;
  }
  .prose h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    font-family: Georgia, Times New Roman, serif;
  }
  .prose h4 {
    font-size: 1.125rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-family: Georgia, Times New Roman, serif;
  }
  .prose ul {
    list-style-type: disc;
    margin-left: 1.5rem;
    margin-bottom: 1.25rem;
    font-size: 1.125rem;
  }
  .prose ol {
    list-style-type: decimal;
    margin-left: 1.5rem;
    margin-bottom: 1.25rem;
    font-size: 1.125rem;
  }
  .prose li {
    margin-bottom: 0.5rem;
    font-family: Georgia, Times New Roman, serif;
    font-size: 1.125rem;
    line-height: 1.7;
  }
  .prose blockquote {
    border-left: 4px solid #ccc;
    padding-left: 1rem;
    margin-left: 0;
    margin-bottom: 1.25rem;
    font-style: italic;
    color: #666;
    font-size: 1.125rem;
  }
  .prose strong {
    font-weight: bold;
  }
  .prose em {
    font-style: italic;
  }
  .prose a {
    color: #d32f2f;
    text-decoration: underline;
  }
  .prose p:first-of-type::first-letter {
    font-size: 3.45rem;
    font-family: Georgia, Times New Roman, serif;
    font-weight: bold;
    float: left;
    line-height: 1;
    padding-right: 0.5rem;
    margin-top: 0.29rem;
  }
`}</style>
                {article.article &&
                  (() => {
                    const contentParts = intercalateEmbeds(article.article, {
                      igPost: article['ig-post'],
                      fbPost: article['fb-post'],
                      twPost: article['tw-post'],
                      ytVideo: article['yt-video'],
                      articleImages: article['article-images'],
                    })

                    return contentParts.map((part, index) => {
                      if (part.type === 'embed') {
                        return (
                          <EmbedRenderer
                            key={`embed-${index}`}
                            embedType={part.embedType!}
                            content={part.content}
                          />
                        )
                      }

                      if (article.article.startsWith('<')) {
                        return (
                          <div
                            key={`text-${index}`}
                            dangerouslySetInnerHTML={{ __html: part.content }}
                          />
                        )
                      }

                      return (
                        <ReactMarkdown
                          key={`text-${index}`}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          remarkPlugins={[remarkGfm]}
                        >
                          {part.content}
                        </ReactMarkdown>
                      )
                    })
                  })()}
                {/* SOURCE */}
                {article.source && (
                  <div className="text-sm text-gray-600 mb-6">
                    {article.source}
                  </div>
                )}
              </div>
            </article>

            {/* ✅ RIGHT: 4 columns - RELATED ARTICLES */}
            <div className="col-span-4 mt-1">
              <RelatedArticlesSidebar
                currentArticleId={article.id}
                sectionPath={article.section_path}
              />
              {/* ✅ AD CONTAINER - BELOW RELATED ARTICLES */}
              <div className="mt-8">
                <AdContainer sticky={true} />
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-12 px-8">
            <YouMayBeInterestedSection
              currentArticleId={article.id}
              currentSectionPath={article.section_path}
            />
          </div>
        </SidelinesLayout>
      </div>
    </>
  )
}
