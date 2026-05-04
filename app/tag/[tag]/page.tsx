import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import SidelinesLayout from '@/components/SidelinesLayout'
import OptimizedImage from '@/components/OptimizedImage'
import Footer from '@/components/Footer'
import { getArticleUrl } from '@/lib/utils'

export const revalidate = 300

interface PageProps {
  params: { tag: string }
}

function slugToTag(slug: string): string {
  return slug.replace(/-/g, ' ').toUpperCase()
}

export async function generateMetadata({ params }: PageProps) {
  const tag = slugToTag(params.tag)
  return {
    title: `${tag} | Radio del Volga`,
    description: `Todas las noticias sobre ${tag} en Radio del Volga`,
  }
}

async function fetchArticlesByTag(tag: string) {
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .ilike('tags', `%${tag}%`)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(48)

  if (error) return []
  return data || []
}

function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export default async function TagPage({ params }: PageProps) {
  const tag = slugToTag(params.tag)
  const articles = await fetchArticlesByTag(tag)

  if (articles.length === 0) notFound()

  const sidelineWidth = 15

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden pt-[184px] pb-24">
        <div className="container mx-auto max-w-[1600px] px-4">
          <div className="mb-0 pb-4 py-0 -mt-8">
            <nav className="text-sm text-gray-500 mb-4 mt-0">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium">{tag}</span>
            </nav>
            <h1 className="font-serif text-4xl font-bold mb-2 leading-tight mt-6">
              {tag}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {articles.length} artículos
            </p>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          <div className="flex flex-col gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug,
                )}
                className="flex flex-col gap-3 group"
              >
                {article.imgUrl && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10" />
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="100vw"
                    />
                  </div>
                )}
                <div>
                  <h2 className="font-serif text-base font-bold leading-6">
                    {article.overline && (
                      <span className="text-primary-red">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateShort(article.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Footer />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block pt-[80px]">
        <SidelinesLayout sidelineWidth={sidelineWidth}>
          <div className="mb-0 pb-4 px-8 py-8">
            <nav className="text-sm text-gray-500 mb-4 mt-4">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium">{tag}</span>
            </nav>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2 leading-tight mt-4 md:mt-6">
              {tag}
            </h1>
            <p className="text-gray-500 text-sm">{articles.length} artículos</p>
            <div className="border-t border-gray-300 my-4"></div>
          </div>

          <div className="px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {articles.map((article, idx) => (
              <div key={article.id} className="md:col-span-3 relative">
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug,
                  )}
                  className="flex flex-col gap-3 group"
                >
                  {article.imgUrl && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10" />
                      <OptimizedImage
                        src={article.imgUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                        sizes="25vw"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="font-serif text-base font-bold leading-6">
                      {article.overline && (
                        <span className="text-primary-red">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateShort(article.created_at)}
                    </p>
                  </div>
                </Link>
                {(idx + 1) % 4 !== 0 && idx !== articles.length - 1 && (
                  <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="px-8 mt-12">
            <Footer />
          </div>
        </SidelinesLayout>
      </div>
    </>
  )
}
