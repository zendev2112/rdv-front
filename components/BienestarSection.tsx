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

interface BienestarSectionProps {
  serverData?: Article[]
}

export default function BienestarSection({
  serverData,
}: BienestarSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('BienestarSection', 5)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 5),
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

  const [featuredArticle, ...smallArticles] = processedArticles

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">BIENESTAR</h2>
        </div>
      </div>

      {/* Featured Article */}
      <Link
        href={getArticleUrl(
          featuredArticle.section_path || featuredArticle.section,
          featuredArticle.slug,
        )}
        className="flex flex-col md:flex-row gap-0 md:gap-6 group mb-6"
      >
        <div className="relative w-full md:w-1/2 aspect-[16/9] overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
          <OptimizedImage
            src={featuredArticle.imgUrl}
            alt={featuredArticle.title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="pt-3 md:pt-0 flex-1 flex flex-col justify-start">
          <h2 className="font-serif text-xl font-bold leading-tight">
            {featuredArticle.overline && (
              <span className="text-primary-red">
                {featuredArticle.overline}.{' '}
              </span>
            )}
            {featuredArticle.title}
          </h2>
          {featuredArticle.excerpt && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {featuredArticle.excerpt}
            </p>
          )}
        </div>
      </Link>

      {/* Horizontal divider before small articles */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* 4 small articles in 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {smallArticles.map((article, idx) => {
          const isLastInRow = (idx + 1) % 2 === 0
          const isLastRow = idx >= 2

          return (
            <React.Fragment key={article.id}>
              <div className="md:col-span-6 relative">
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug,
                  )}
                  className="flex gap-4 group"
                >
                  <div className="relative flex-shrink-0 w-2/5 aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 40vw, 20vw"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-start">
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

                {/* Vertical divider between columns */}
                {!isLastInRow && (
                  <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
                )}

                {/* Mobile divider */}
                <div className="md:hidden w-full h-[1px] bg-gray-300 mt-4"></div>
              </div>

              {/* Horizontal divider between rows on desktop */}
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
