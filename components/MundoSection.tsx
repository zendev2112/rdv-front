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

  if (processedArticles.length === 0) {
    return null
  }

  const [mainArticle, ...sideArticles] = processedArticles

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-5 pb-2 border-b border-[#292929]/20">
          <h2 className="text-xl font-bold text-[#292929]">MUNDO</h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Main article with image on top, text on bottom */}
          <div>
            <Link
              href={getArticleUrl(
                mainArticle.section_path || mainArticle.section,
                mainArticle.slug,
              )}
              className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              {/* Image container - Full width on top */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Content area - Below image */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 leading-tight text-[#292929] line-clamp-3">
                  {mainArticle.overline && (
                    <span className="text-primary-red font-bold">
                      {mainArticle.overline}.{' '}
                    </span>
                  )}
                  {mainArticle.title}
                </h3>

                {mainArticle.excerpt && (
                  <p className="text-sm text-dark-gray mb-2 line-clamp-3">
                    {mainArticle.excerpt}
                  </p>
                )}

                {mainArticle.author && (
                  <p className="text-sm text-dark-gray mt-2">
                    Por {mainArticle.author}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Right Column: Stacked side articles with image on left, text on right */}
          <div className="space-y-4">
            {sideArticles.map((article, index) => (
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug,
                )}
                key={article.id}
                className="flex bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-32"
              >
                {/* Image container - Left side */}
                <div className="relative w-1/3 overflow-hidden">
                  <OptimizedImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Content area - Right side */}
                <div className="p-3 w-2/3 flex flex-col justify-center">
                  <h3 className="text-base font-bold leading-tight text-[#292929] line-clamp-2">
                    {article.overline && (
                      <span className="text-primary-red font-bold">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-xs text-dark-gray line-clamp-1 mb-1">
                      {article.excerpt}
                    </p>
                  )}

                  {article.author && (
                    <p className="text-xs text-dark-gray mt-auto">
                      Por {article.author}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
