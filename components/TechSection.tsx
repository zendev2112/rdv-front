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

interface TechSectionProps {
  serverData?: Article[]
}

export default function TechSection({ serverData }: TechSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('TechSection', 3)

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

  if (processedArticles.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">TECNOLOGÍA</h2>
      </div>

      {/* Tech Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {processedArticles.map((article) => (
          <Link
            key={article.id}
            href={getArticleUrl(
              article.section_path || article.section,
              article.slug,
            )}
            className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
          >
            <div className="flex flex-col h-full">
              {/* Article Image */}
              <div className="relative w-full h-[200px] mb-4">
                <OptimizedImage
                  src={article.imgUrl}
                  alt={article.title}
                  fill
                  className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                {article.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white border-0 rounded px-2 py-1 text-xs">
                    VIDEO
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="px-4 pb-4">
                <h3 className="text-lg font-bold mb-2 leading-tight">
                  {article.overline && (
                    <span className="text-primary-red font-bold">
                      {article.overline}.
                    </span>
                  )}{' '}
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-dark-gray mb-2">
                    {article.excerpt}
                  </p>
                )}
                {article.author && (
                  <p className="text-sm text-dark-gray">Por {article.author}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
