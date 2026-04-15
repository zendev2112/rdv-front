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

interface CienciaYSaludSectionProps {
  serverData?: Article[]
}

export default function CienciaYSaludSection({
  serverData,
}: CienciaYSaludSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('CienciaYSaludSection', 4)

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

  const [mainArticle, ...smallArticles] = processedArticles

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Divisory line */}
        <div className="border-b border-[#292929]/20 mb-6"></div>

        {/* Section title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">CIENCIA Y SALUD</h2>
        </div>

        {/* Main content layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main article - full width */}
          <div className="md:col-span-12">
            <Link
              href={getArticleUrl(
                mainArticle.section_path || mainArticle.section,
                mainArticle.slug,
              )}
              className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image container */}
                <div className="md:w-1/2 relative aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                  <OptimizedImage
                    src={mainArticle.imgUrl}
                    alt={mainArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Content area */}
                <div className="md:w-1/2 p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                    {mainArticle.overline && (
                      <span className="text-primary-red font-bold">
                        {mainArticle.overline}.
                      </span>
                    )}{' '}
                    {mainArticle.title}
                  </h2>

                  {mainArticle.excerpt && (
                    <p className="text-dark-gray mb-3">{mainArticle.excerpt}</p>
                  )}

                  {mainArticle.author && (
                    <p className="text-sm text-dark-gray">
                      Por {mainArticle.author}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Side articles - three columns */}
          <div className="md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {smallArticles.map((article) => (
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug,
                  )}
                  key={article.id}
                  className="flex flex-col bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                >
                  {/* Image container - TOP */}
                  <div className="relative w-full h-[160px] overflow-hidden">
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>

                  {/* Content area - BOTTOM */}
                  <div className="p-4 flex-grow">
                    <h3 className="text-base font-bold leading-tight mb-2">
                      {article.overline && (
                        <span className="text-primary-red font-bold">
                          {article.overline}.
                        </span>
                      )}{' '}
                      {article.title}
                    </h3>

                    {article.author && (
                      <p className="text-sm text-dark-gray">
                        Por {article.author}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
