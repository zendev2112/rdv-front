'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useArticles } from '../hooks/useArticles'
import OptimizedImage from './OptimizedImage'
import { getArticleUrl } from '@/lib/utils'
import { sortArticlesForSlots } from '@/lib/articleSlots'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  imgUrl?: string
  overline?: string
  order?: string
  created_at?: string
  section?: string
  section_path?: string
  author?: string
  hasVideo?: boolean
}

interface DeportesSectionProps {
  serverData?: Article[]
}

export default function DeportesSection({ serverData }: DeportesSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('DeportesSection', 4)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 4),
    [articles],
  )

  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (processedArticles.length === 0) {
    return null
  }

  const [mainArticle, ...sideArticles] = processedArticles

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">DEPORTES</h2>
        </div>
      </div>

      {/* Main Article – text left, image right */}
      <div className="mb-6 md:mb-8">
        <Link
          href={getArticleUrl(
            mainArticle.section_path || mainArticle.section,
            mainArticle.slug,
          )}
          className="block group"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Text – Left */}
            <div className="md:w-1/2 pt-2 pb-6 md:pb-0">
              <h1 className="font-serif text-xl md:text-2xl font-bold leading-7 sm:leading-tight">
                {mainArticle.overline && (
                  <span className="text-primary-red">
                    {mainArticle.overline}.{' '}
                  </span>
                )}
                {mainArticle.title}
              </h1>
              {mainArticle.excerpt && (
                <p className="font-serif text-sm md:text-sm text-gray-600 mt-2 leading-6 sm:leading-relaxed">
                  {mainArticle.excerpt}
                </p>
              )}
            </div>

            {/* Image – Right */}
            <div className="md:w-1/2 relative w-full aspect-[16/9]">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {mainArticle.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    VIDEO
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Divider between main and side articles */}
      <div className="w-full h-[1px] bg-gray-400 opacity-50 mb-6 md:mb-8"></div>

      {/* Side Articles – 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {sideArticles.map((article, idx) => (
          <React.Fragment key={article.id}>
            <div className="relative">
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug,
                )}
                className="block group"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Text – Left */}
                  <div className="md:w-1/2 pt-2 pb-6 md:pb-0 md:order-1 flex-1">
                    <h2 className="font-serif text-base font-bold leading-6 sm:leading-tight">
                      {article.overline && (
                        <span className="text-primary-red">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h2>
                  </div>

                  {/* Image – Right */}
                  <div className="md:w-1/2 relative w-full aspect-[16/9] md:order-2 flex-shrink-0">
                    <div className="relative w-full h-full overflow-hidden">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                      <OptimizedImage
                        src={article.imgUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      {article.hasVideo && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                          VIDEO
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile divider */}
            <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
          </React.Fragment>
        ))}
      </div>
    </main>
  )
}
