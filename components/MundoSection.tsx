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

interface MundoSectionProps {
  serverData?: Article[]
}

export default function MundoSection({ serverData }: MundoSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('MundoSection', 4)

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

  if (processedArticles.length === 0) return null

  const [mainArticle, ...sideArticles] = processedArticles

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">MUNDO</h2>
        </div>
      </div>

      {/* 12-column grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT — Main article (6 cols): image top, title + excerpt below */}
        {mainArticle && (
          <div className="md:col-span-6 relative">
            <Link
              href={getArticleUrl(
                mainArticle.section_path || mainArticle.section,
                mainArticle.slug,
              )}
              className="flex flex-col h-full group"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="pt-3 pb-6 md:pb-0">
                <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight">
                  {mainArticle.overline && (
                    <span className="text-primary-red">
                      {mainArticle.overline}.{' '}
                    </span>
                  )}
                  {mainArticle.title}
                </h2>
                <p className="font-serif text-sm text-gray-600 mt-2 leading-relaxed">
                  {mainArticle.excerpt || ''}
                </p>
              </div>
            </Link>
            {/* Vertical divider */}
            <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
            {/* Mobile divider */}
            <div className="md:hidden w-full h-[1px] bg-gray-300 mb-6"></div>
          </div>
        )}

        {/* RIGHT — Side articles (6 cols): text left, image right */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {sideArticles.map((article, idx) => (
            <React.Fragment key={article.id}>
              <div className="relative">
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug,
                  )}
                  className="flex flex-col md:flex-row group gap-4"
                >
                  {/* Image right on desktop */}
                  <div className="relative w-full md:w-1/2 aspect-[16/9] md:order-2 flex-shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  {/* Text left on desktop */}
                  <div className="pt-2 md:pt-0 md:order-1 flex-1">
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
              </div>

              {/* Mobile divider */}
              <div className="md:hidden w-full h-[1px] bg-gray-300"></div>

              {/* Desktop divider between side articles */}
              {idx < sideArticles.length - 1 && (
                <div className="hidden md:block w-full h-[1px] bg-gray-400 opacity-50"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  )
}
