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

export default function PoliticaYEconomiaSection({
  serverData,
}: PoliticaYEconomiaSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('PoliticaYEconomiaSection', 4)

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
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            POLÍTICA Y ECONOMÍA
          </h2>
          <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
        </div>

        {/* Two 50/50 column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Article - 50% width on desktop */}
          <div>
            <Link
              href={getArticleUrl(
                mainArticle.section_path || mainArticle.section,
                mainArticle.slug,
              )}
              className="block overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group h-full"
            >
              {/* Main article image on top */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {mainArticle.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    VIDEO
                  </div>
                )}
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Hover effect with gray overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Text content below */}
              <div className="p-5">
                {/* Title with highlighted part */}
                <h3 className="text-3xl font-bold mb-3 leading-tight text-[#292929]">
                  {mainArticle.overline && (
                    <span className="text-primary-red font-bold">
                      {mainArticle.overline}.{' '}
                    </span>
                  )}
                  {mainArticle.title}
                </h3>

                {/* Summary */}
                {mainArticle.excerpt && (
                  <p className="text-dark-gray text-base mb-4 line-clamp-3">
                    {mainArticle.excerpt}
                  </p>
                )}

                {/* Author name */}
                {mainArticle.author && (
                  <p className="text-sm text-dark-gray">
                    Por {mainArticle.author}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Side Articles - 50% width container */}
          <div className="space-y-4">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug,
                )}
                className="block overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group"
              >
                {/* Layout with text left, image right */}
                <div className="flex flex-col sm:flex-row">
                  {/* Text content */}
                  <div className="p-4 sm:w-2/3 flex flex-col justify-center">
                    <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929]">
                      {article.overline && (
                        <span className="text-primary-red font-bold">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h3>

                    {article.author && (
                      <p className="text-sm text-dark-gray mt-auto">
                        Por {article.author}
                      </p>
                    )}
                  </div>

                  {/* Article image */}
                  <div className="relative sm:w-1/3 aspect-video sm:aspect-square overflow-hidden">
                    {article.hasVideo && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                        VIDEO
                      </div>
                    )}
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover effect with gray overlay */}
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
