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

interface MasNoticiasSectionProps {
  serverData?: Article[]
}

export default function MasNoticiasSection({
  serverData,
}: MasNoticiasSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('MasNoticiasSection', 3)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 3),
    [articles],
  )

  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">
            MÁS NOTICIAS
          </h2>
        </div>
      </div>

      {/* 12-column grid – 3 articles of 4 columns each */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {processedArticles.map((article, idx) => (
          <React.Fragment key={article.id}>
            <div className="md:col-span-4 relative">
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug,
                )}
                className="h-full flex flex-col group"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9]">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
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

              {/* Vertical divider between articles */}
              {idx < processedArticles.length - 1 && (
                <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
              )}

              {/* Mobile divider */}
              <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </main>
  )
}
