'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  imgUrl?: string
  overline?: string
  created_at?: string
  section?: string
  author?: string
  hasVideo?: boolean
}

// Same SafeImage component from other sections
function SafeImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
}) {
  if (!src) {
    return (
      <div
        className={`relative w-full h-full bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400">No image</span>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full ${fill ? 'absolute inset-0' : ''}`}
      style={{ overflow: 'hidden' }}
    >
      <img
        src={src}
        alt={alt || 'Article image'}
        className={`w-full h-full object-cover ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        onError={(e) => {
          console.error('Direct image failed to load:', src)
          const proxyUrl = `/api/imageproxy?url=${encodeURIComponent(src)}`
          e.currentTarget.src = proxyUrl

          e.currentTarget.onerror = () => {
            console.error('Proxy image also failed:', proxyUrl)
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30 40 L50 65 L70 40' stroke='%23cccccc' fill='none' stroke-width='2'/%3E%3Ccircle cx='50' cy='30' r='10' fill='%23cccccc'/%3E%3C/svg%3E"
          }
        }}
      />
    </div>
  )
}

function getSectionPath(section: string | undefined): string {
  if (!section) {
    return 'sin-categoria'
  }
  if (section.includes('.')) {
    return section.split('.').join('/')
  }
  return section
}

export default function PueblosAlemanesSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        const response = await fetch(
          '/api/articles?front=PueblosAlemanesSection&status=published'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch articles')
        }
        const result = await response.json()
        const apiArticles = Array.isArray(result) ? result : []
        setArticles(apiArticles.slice(0, 3)) // Only take first 3 articles
      } catch (err) {
        console.error('Error fetching pueblos alemanes articles:', err)
        setError('Failed to load articles')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
    const interval = setInterval(fetchArticles, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        Loading pueblos alemanes...
      </div>
    )
  }

  if (error && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-red-500">{error}</div>
    )
  }

  // Use sample data if no articles available
  const displayArticles =
    articles.length > 0
      ? articles
      : [
          {
            id: '1',
            title:
              'La histórica ruta alemana: un recorrido por los pueblos de inmigrantes',
            slug: 'ruta-alemana-pueblos-inmigrantes',
            overline: 'HISTORIA Y TRADICIÓN',
            imgUrl:
              '/placeholder.svg?height=400&width=600&text=Pueblos+Alemanes',
            excerpt:
              'Descubre la rica herencia cultural de los pueblos fundados por inmigrantes alemanes del Volga en la región pampeana.',
            created_at: '2025-05-06T10:00:00Z',
            section: 'pueblos-alemanes',
          },
          {
            id: '2',
            title: 'Platos típicos que se conservan en las familias locales',
            slug: 'platos-tipicos-familias-locales',
            overline: 'GASTRONOMÍA',
            imgUrl: '/placeholder.svg?height=300&width=400&text=Gastronomía',
            created_at: '2025-05-01T10:00:00Z',
            section: 'pueblos-alemanes',
          },
          {
            id: '3',
            title: 'Calendario 2025 de celebraciones alemanas en la región',
            slug: 'calendario-celebraciones-alemanas-2025',
            overline: 'FESTIVIDADES',
            imgUrl: '/placeholder.svg?height=300&width=400&text=Tradiciones',
            created_at: '2025-05-03T10:00:00Z',
            section: 'pueblos-alemanes',
          },
        ]

  // Always 3 articles
  const [mainArticle, ...sideArticles] = displayArticles

  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      {/* Section header */}
      <div className="mb-6 border-b border-light-gray pb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-5 w-1 bg-primary-red mr-3"></div>
          <h2 className="text-xl font-bold uppercase">Pueblos Alemanes</h2>
        </div>
        <Link
          href="/pueblos-alemanes"
          className="text-primary-red hover:underline flex items-center text-sm font-medium"
        >
          Ver todos <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Articles flex layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main article */}
        <div className="md:w-1/2 flex flex-col bg-white rounded-md overflow-hidden shadow-sm">
          <Link
            href={`/${
              mainArticle.section
                ? getSectionPath(mainArticle.section)
                : 'sin-categoria'
            }/${mainArticle.slug}`}
            className="block h-full flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full h-48 md:h-56">
              <SafeImage
                src={mainArticle.imgUrl}
                alt={mainArticle.title}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                priority
              />
            </div>
            {/* Text */}
            <div className="flex-1 flex flex-col justify-between p-4">
              <div>
                <h3 className="text-lg font-bold leading-tight text-[#292929] mb-1">
                  {mainArticle.overline && (
                    <span className="text-primary-red font-bold text-xs block mb-1">
                      {mainArticle.overline}
                    </span>
                  )}
                  {mainArticle.title}
                </h3>
                {mainArticle.excerpt && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {mainArticle.excerpt}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                {mainArticle.author && (
                  <p className="text-xs text-dark-gray">
                    Por {mainArticle.author}
                  </p>
                )}
                {mainArticle.created_at && (
                  <span className="text-xs text-gray-500">
                    {new Date(mainArticle.created_at).toLocaleDateString(
                      'es-AR',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Side articles */}
        <div className="md:w-1/2 flex flex-col gap-6">
          {sideArticles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col md:flex-row bg-white rounded-md overflow-hidden shadow-sm h-full"
            >
              <Link
                href={`/${
                  article.section
                    ? getSectionPath(article.section)
                    : 'sin-categoria'
                }/${article.slug}`}
                className="flex flex-1"
              >
                {/* Image */}
                <div className="relative w-full md:w-1/3 h-32 md:h-auto">
                  <SafeImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Text */}
                <div className="flex-1 flex flex-col justify-between p-4">
                  <div>
                    <h4 className="text-base font-bold leading-tight text-[#292929] mb-1">
                      {article.overline && (
                        <span className="text-primary-red font-bold text-xs block mb-1">
                          {article.overline}
                        </span>
                      )}
                      {article.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {article.author && (
                      <p className="text-xs text-dark-gray">
                        Por {article.author}
                      </p>
                    )}
                    {article.created_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(article.created_at).toLocaleDateString(
                          'es-AR',
                          {
                            day: 'numeric',
                            month: 'long',
                          }
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
