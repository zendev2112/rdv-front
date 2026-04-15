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
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-5 pb-2 border-b border-[#292929]/20">
          <h2 className="text-xl font-bold text-[#292929]">BIENESTAR</h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>

        <div className="space-y-6">
          {/* Featured Article - slightly smaller */}
          <div className="w-full">
            <Link
              href={getArticleUrl(
                featuredArticle.section_path || featuredArticle.section,
                featuredArticle.slug,
              )}
              className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image container - slightly smaller */}
                <div className="relative md:w-2/5 aspect-[16/9] overflow-hidden">
                  <OptimizedImage
                    src={featuredArticle.imgUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Content area - with larger font */}
                <div className="p-4 md:p-5 md:w-3/5 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 leading-tight text-[#292929] line-clamp-2">
                    {featuredArticle.overline && (
                      <span className="text-primary-red font-bold">
                        {featuredArticle.overline}.{' '}
                      </span>
                    )}
                    {featuredArticle.title}
                  </h3>

                  {featuredArticle.author && (
                    <p className="text-sm text-dark-gray mt-auto">
                      Por {featuredArticle.author}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Small Articles - bigger size and more space between them */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {smallArticles.map((article) => (
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug,
                )}
                key={article.id}
                className="flex bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-32"
              >
                {/* Image container - slightly larger */}
                <div className="relative w-1/3 overflow-hidden">
                  <OptimizedImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Content area - bigger */}
                <div className="p-3 w-2/3 flex flex-col justify-center">
                  <h3 className="text-base font-bold leading-tight text-[#292929] line-clamp-2">
                    {article.overline && (
                      <span className="text-primary-red font-bold">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h3>

                  {article.author && (
                    <p className="text-xs text-dark-gray mt-2">
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
