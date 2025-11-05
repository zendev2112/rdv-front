'use client'

import { useState } from 'react'
import Link from 'next/link'
import OptimizedImage from './OptimizedImage'
import AdContainer from './AdContainer'
import { getArticleUrl } from '@/lib/utils'

// Add date formatter
function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

interface SectionArticlesGridProps {
  initialArticles: any[]
  sectionData: any
  sectionSlug: string
}

export default function SectionArticlesGrid({
  initialArticles,
  sectionData,
  sectionSlug,
}: SectionArticlesGridProps) {
  const [articles, setArticles] = useState(initialArticles)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialArticles.length >= 12)

  const loadMore = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/sections/${sectionSlug}?offset=${articles.length}&limit=12`
      )
      const newArticles = await response.json()
      
      if (newArticles.length > 0) {
        setArticles([...articles, ...newArticles])
        setHasMore(newArticles.length >= 12)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const gridArticles = articles.slice(3)

  return (
    <>
      {/* ✅ DIVISORY LINE - MATCH TOP GRID EXACTLY - FULL WIDTH */}
      <div className="px-8">
        <div className="border-t border-gray-300 my-4 px-4 md:px-0"></div>
      </div>

      {/* ✅ MORE NEWS SECTION - 9 COLS GRID + 3 COLS AD */}
      <div className="px-8">
        <h2 className="font-serif text-2xl font-bold mb-6 text-gray-900 text-left">
          Más noticias de {sectionData.name}
        </h2>

        <div className="border-t border-gray-300 my-4 px-4 md:px-0"></div>

        <div className="grid grid-cols-12 gap-8">
          {/* ✅ LEFT: 9 cols - ARTICLES GRID WITH PROGRESSIVE LOADING */}
          <div className="col-span-9 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
              {gridArticles.map((article, index) => {
                const isLastSix = hasMore && index >= gridArticles.length - 6
                const blurIntensity = isLastSix
                  ? (index - (gridArticles.length - 6)) / 6
                  : 0

                return (
                  <div key={article.id} className="relative">
                    <Link
                      href={getArticleUrl(
                        article.section_path || article.section,
                        article.slug
                      )}
                      className="group block"
                    >
                      {/* Image */}
                      {article.imgUrl && (
                        <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100 rounded-lg mb-3">
                          <OptimizedImage
                            src={article.imgUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:opacity-75 transition-opacity duration-300"
                            sizes="33vw"
                          />
                        </div>
                      )}

                      {/* Title with inline Overline */}
                      <h3 className="font-serif text-base font-semibold text-gray-900 mb-2">
                        {article.overline && (
                          <span className="text-primary-red font-semibold text-base">
                            {article.overline}.{' '}
                          </span>
                        )}
                        {article.title}
                      </h3>

                      {/* ✅ DATE BELOW TITLE */}
                      <div className="text-xs text-gray-500 mb-3">
                        {formatDateShort(article.created_at)}
                      </div>
                    </Link>

                    {/* ✅ BLUR OVERLAY ON LAST 6 ARTICLES */}
                    {isLastSix && (
                      <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none rounded-lg"
                        style={{
                          opacity: blurIntensity * 0.95,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* ✅ LOAD MORE BUTTON */}
            {hasMore && (
              <div className="flex justify-center mt-12 relative z-10">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-primary-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading
                    ? 'Cargando...'
                    : `Ver más notas de ${sectionData.name}`}
                </button>
              </div>
            )}
          </div>

          {/* ✅ RIGHT: 3 cols - AD CONTAINER */}
          <div className="col-span-3">
            <AdContainer />
          </div>
        </div>
      </div>
    </>
  )
}