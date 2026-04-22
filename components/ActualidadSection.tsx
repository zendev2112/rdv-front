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

interface ActualidadSectionProps {
  serverData?: Article[]
}

export default function ActualidadSection({
  serverData,
}: ActualidadSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('ActualidadSection', 13)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 13),
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

  const heroArticle = processedArticles[0]
  const gridArticles = processedArticles.slice(1, 13)

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">
            ACTUALIDAD
          </h2>
        </div>
      </div>

      {/* HERO — text left (6 cols), image right (6 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        <div className="md:col-span-12">
          <Link
            href={getArticleUrl(
              heroArticle.section_path || heroArticle.section,
              heroArticle.slug,
            )}
            className="flex flex-col md:flex-row gap-6 group"
          >
            {/* Text left */}
            <div className="md:w-1/2 flex flex-col justify-center order-2 md:order-1">
              <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight">
                {heroArticle.overline && (
                  <span className="text-primary-red">
                    {heroArticle.overline}.{' '}
                  </span>
                )}
                {heroArticle.title}
              </h2>
              {heroArticle.excerpt && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {heroArticle.excerpt}
                </p>
              )}
            </div>
            {/* Image right */}
            <div className="relative md:w-1/2 w-full aspect-[16/9] overflow-hidden order-1 md:order-2 flex-shrink-0">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
              <OptimizedImage
                src={heroArticle.imgUrl}
                alt={heroArticle.title}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Link>
          {/* Mobile divider below hero */}
          <div className="md:hidden w-full h-[1px] bg-gray-300 mt-6"></div>
        </div>
      </div>

      {/* Horizontal divider between hero and grid */}
      <div className="w-full h-[1px] bg-gray-400 opacity-50 hidden md:block mb-8"></div>

      {/* 4x3 GRID — 12 articles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {gridArticles.map((article, idx) => {
          const row = Math.floor(idx / 4)
          const isLastInRow = (idx + 1) % 4 === 0
          const isLastRow = row === 2

          return (
            <React.Fragment key={article.id}>
              <div className="md:col-span-3 relative">
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug,
                  )}
                  className="flex flex-col group"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>

                  {/* Title area */}
                  <div className="pt-2 pb-6 md:pb-0 flex-1">
                    <h2 className="font-serif text-base font-bold leading-6 sm:leading-tight">
                      {article.overline && (
                        <span className="text-primary-red">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h2>
                  </div>
                </Link>

                {/* Vertical divider between articles (not on last in row) */}
                {!isLastInRow && (
                  <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
                )}

                {/* Mobile divisory line */}
                <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
              </div>

              {/* Horizontal divider after each row - not after last row */}
              {isLastInRow && !isLastRow && (
                <div className="md:col-span-12 h-[1px] bg-gray-400 opacity-50 hidden md:block"></div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </main>
  )
}
