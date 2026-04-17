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

interface OpinionSectionProps {
  serverData?: Article[]
}

export default function OpinionSection({ serverData }: OpinionSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('OpinionSection', 3)

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
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">OPINIÓN</h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>

        {/* 3-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processedArticles.map((article) => (
            <Link
              key={article.id}
              href={getArticleUrl(
                article.section_path || article.section,
                article.slug,
              )}
              className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full"
            >
              <div className="flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <OptimizedImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929]">
                    {article.overline && (
                      <span className="text-primary-red font-bold">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-sm text-dark-gray mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  {article.author && (
                    <p className="text-xs text-dark-gray mt-auto">
                      Por {article.author}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
