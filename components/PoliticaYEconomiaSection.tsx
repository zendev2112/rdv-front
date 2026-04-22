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

interface PoliticaYEconomiaSectionProps {
  serverData?: Article[]
}

// Static arrays so Tailwind JIT picks up the full class names
const SIDE_ROW_CLASSES = ['md:row-start-1', 'md:row-start-2', 'md:row-start-3']
const BOTTOM_COL_CLASSES = [
  'md:col-start-1',
  'md:col-start-2',
  'md:col-start-3',
  'md:col-start-4',
]

export default function PoliticaYEconomiaSection({
  serverData,
}: PoliticaYEconomiaSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('PoliticaYEconomiaSection', 8)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 8),
    [articles],
  )

  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (processedArticles.length === 0) return null

  const heroArticle = processedArticles[0]
  const sideArticles = processedArticles.slice(1, 4)
  const bottomArticles = processedArticles.slice(4, 8)

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">
            POLÍTICA Y ECONOMÍA
          </h2>
        </div>
      </div>

      {/* 4-column grid: hero col 1-2 rows 1-3 | side col 3-4 rows 1-3 | bottom row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* HERO — col 1-2, rows 1-3 */}
        <div className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3">
          <Link
            href={getArticleUrl(
              heroArticle.section_path || heroArticle.section,
              heroArticle.slug,
            )}
            className="flex flex-col h-full group"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
              <OptimizedImage
                src={heroArticle.imgUrl}
                alt={heroArticle.title}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="pt-3 flex-1 pb-6 md:pb-0">
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
          </Link>
        </div>

        {/* SIDE ARTICLES — col 3-4, rows 1-3 */}
        {sideArticles.map((article, idx) => (
          <div
            key={article.id}
            className={`md:col-start-3 md:col-span-2 ${SIDE_ROW_CLASSES[idx]} ${
              idx < sideArticles.length - 1
                ? 'md:border-b md:border-gray-200 md:pb-4'
                : ''
            }`}
          >
            <Link
              href={getArticleUrl(
                article.section_path || article.section,
                article.slug,
              )}
              className="flex gap-4 group"
            >
              {/* Text left */}
              <div className="w-1/2 min-w-0">
                <h3 className="font-serif text-sm md:text-base font-bold leading-tight">
                  {article.overline && (
                    <span className="text-primary-red">
                      {article.overline}.{' '}
                    </span>
                  )}
                  {article.title}
                </h3>
              </div>
              {/* Image right */}
              <div className="relative w-1/2 aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                <OptimizedImage
                  src={article.imgUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  sizes="(max-width: 768px) 112px, 128px"
                />
              </div>
            </Link>
            {/* Mobile divider */}
            <div className="md:hidden w-full h-[1px] bg-gray-300 mt-4"></div>
          </div>
        ))}

        {/* BOTTOM ARTICLES — row 4, one per column */}
        {bottomArticles.map((article, idx) => (
          <div
            key={article.id}
            className={`${BOTTOM_COL_CLASSES[idx]} md:row-start-4 md:border-t md:border-gray-200 md:pt-4`}
          >
            <Link
              href={getArticleUrl(
                article.section_path || article.section,
                article.slug,
              )}
              className="flex flex-col group"
            >
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
              <div className="pt-2 pb-6 md:pb-0">
                <h3 className="font-serif text-sm md:text-base font-bold leading-tight">
                  {article.overline && (
                    <span className="text-primary-red">
                      {article.overline}.{' '}
                    </span>
                  )}
                  {article.title}
                </h3>
              </div>
            </Link>
            {/* Mobile divider */}
            {idx < bottomArticles.length - 1 && (
              <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
