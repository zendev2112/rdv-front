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

interface DeportesSectionProps {
  serverData?: Article[]
}

export default function DeportesSection({ serverData }: DeportesSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('DeportesSection', 4)

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
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">
        ACTUALIDAD DEPORTIVA
      </h2>

      {/* Main Article */}
      <Link
        href={getArticleUrl(
          mainArticle.section_path || mainArticle.section,
          mainArticle.slug,
        )}
        className="block overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group mb-8"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Text Content - Left */}
          <div className="p-4 md:w-1/2">
            <h3 className="text-3xl font-bold mb-3 leading-tight">
              {mainArticle.overline && (
                <span className="text-primary-red font-bold">
                  {mainArticle.overline}.
                </span>
              )}{' '}
              {mainArticle.title}
            </h3>
            {mainArticle.excerpt && (
              <p className="text-base text-dark-gray mb-4">
                {mainArticle.excerpt}
              </p>
            )}
            {mainArticle.author && (
              <p className="text-sm text-dark-gray">Por {mainArticle.author}</p>
            )}
          </div>

          {/* Image - Right */}
          <div className="md:w-1/2">
            <div className="relative w-full h-[300px] overflow-hidden">
              <OptimizedImage
                src={mainArticle.imgUrl}
                alt={mainArticle.title}
                fill
                className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              {mainArticle.hasVideo && (
                <div className="absolute top-2 left-2 bg-black text-white border-0 rounded px-2 py-1 text-xs z-10">
                  VIDEO
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <hr className="my-6 border-gray-200" />

      {/* Side Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sideArticles.map((article) => (
          <Link
            key={article.id}
            href={getArticleUrl(
              article.section_path || article.section,
              article.slug,
            )}
            className="block overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Text Content - Left */}
              <div className="p-4 md:w-2/3">
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

              {/* Image - Right */}
              <div className="md:w-1/3">
                <div className="relative w-full h-[180px] overflow-hidden">
                  <OptimizedImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  {article.hasVideo && (
                    <div className="absolute top-2 left-2 bg-black text-white border-0 rounded px-2 py-1 text-xs z-10">
                      VIDEO
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
