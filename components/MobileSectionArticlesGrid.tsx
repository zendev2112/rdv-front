'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getArticleUrl } from '@/lib/utils'

function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

interface MobileSectionArticlesGridProps {
  initialArticles: any[]
  sectionData: any
  sectionSlug: string
}

export default function MobileSectionArticlesGrid({
  initialArticles,
  sectionData,
  sectionSlug,
}: MobileSectionArticlesGridProps) {
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

  return (
    <>
      {/* ✅ ARTICLES GRID - EXACTLY LIKE YouMayBeInterestedSection MOBILE */}
      <div className="grid grid-cols-1 gap-0 px-0">
        {articles.map((article, index) => {
          const isLastSix = hasMore && index >= articles.length - 6
          const blurIntensity = isLastSix
            ? (index - (articles.length - 6)) / 6
            : 0

          return (
            <div key={article.id} className="relative mb-8">
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug
                )}
                className="group block"
              >
                {/* ✅ IMAGE - 100% VIEWPORT WIDTH MOBILE */}
                {article.imgUrl && (
                  <div className="relative w-screen aspect-[3/2] overflow-hidden bg-gray-100 mb-3 -mx-4">
                    <Image
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      sizes="100vw"
                      className="object-cover group-hover:opacity-75 transition-opacity duration-300"
                    />
                  </div>
                )}

                {/* ✅ TITLE - ALIGNED WITH ARTICLE H1 */}
                <h3 className="font-serif text-base font-bold text-gray-900 px-0 text-left mb-2">
                  {article.overline && (
                    <span className="text-base font-semibold text-primary-red">
                      {article.overline}.{' '}
                    </span>
                  )}
                  {article.title}
                </h3>

                {/* ✅ DATE BELOW TITLE */}
                <div className="text-xs text-gray-500 mb-3 px-0">
                  {formatDateShort(article.created_at)}
                </div>
              </Link>

              {/* ✅ BLUR OVERLAY ON LAST 6 ARTICLES */}
              {isLastSix && (
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none"
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
        <div className="flex justify-center mt-8 relative z-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-primary-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Cargando...' : `Ver más notas de ${sectionData.name}`}
          </button>
        </div>
      )}
    </>
  )
}
