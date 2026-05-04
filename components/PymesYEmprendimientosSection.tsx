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

interface PymesYEmprendimientosSectionProps {
  serverData?: Article[]
}

export default function PymesYEmprendimientosSection({
  serverData,
}: PymesYEmprendimientosSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('PymesYEmprendimientosSection', 2)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 2),
    [articles],
  )

  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (processedArticles.length === 0) return null

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">
            PYMES Y EMPRENDIMIENTOS
          </h2>
        </div>
      </div>

      {/* 2 articles: image left, text top-right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {processedArticles.map((article, idx) => (
          <div key={article.id} className="relative">
            <Link
              href={getArticleUrl(
                article.section_path || article.section,
                article.slug,
              )}
              className="flex flex-col md:flex-row gap-4 group"
            >
              {/* Image left */}
              <div className="relative flex-shrink-0 w-full md:w-2/5 aspect-[16/9] md:aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                <OptimizedImage
                  src={article.imgUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  sizes="(max-width: 768px) 40vw, 20vw"
                />
              </div>
              {/* Text right, top-aligned */}
              <div className="flex-1 flex flex-col justify-start pt-2 md:pt-0">
                <h2 className="font-serif text-base font-bold leading-6 sm:leading-tight">
                  {article.overline && (
                    <span className="text-primary-red">
                      {article.overline}.{' '}
                    </span>
                  )}
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="hidden md:block mt-2 text-sm text-gray-600 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
            {/* Vertical divider on desktop */}
            {idx === 0 && (
              <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
            )}
            {/* Mobile divider */}
            {idx === 0 && (
              <div className="md:hidden w-full h-[1px] bg-gray-300 mt-6"></div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
