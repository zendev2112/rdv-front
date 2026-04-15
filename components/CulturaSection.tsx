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

interface CulturaSectionProps {
  serverData?: Article[]
}

export default function CulturaSection({ serverData }: CulturaSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('CulturaSection', 4)

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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-800">CULTURA</h2>
        <Link
          href="/secciones/cultura"
          className="text-sm text-blue-600 hover:underline flex items-center"
        >
          Ver más
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Article */}
        <div className="md:col-span-2 space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <Link
              href={getArticleUrl(
                mainArticle.section_path || mainArticle.section,
                mainArticle.slug,
              )}
            >
              <OptimizedImage
                src={mainArticle.imgUrl}
                alt={mainArticle.title}
                width={600}
                height={400}
                className="w-full object-cover rounded-lg"
              />
              {mainArticle.hasVideo && (
                <div className="absolute bottom-3 left-3 bg-red-600 text-white p-1 rounded-md flex items-center">
                  <span className="text-xs">VIDEO</span>
                </div>
              )}
              {mainArticle.section && (
                <div className="absolute top-3 left-3 bg-white/80 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                  {mainArticle.section.toUpperCase()}
                </div>
              )}
            </Link>
          </div>

          <div>
            <Link
              href={getArticleUrl(
                mainArticle.section_path || mainArticle.section,
                mainArticle.slug,
              )}
              className="hover:text-blue-600"
            >
              <h3 className="text-xl font-semibold mb-2">
                {mainArticle.overline && (
                  <>
                    <span className="font-bold">
                      {mainArticle.overline}.
                    </span>{' '}
                  </>
                )}
                {mainArticle.title}
              </h3>
            </Link>
            {mainArticle.excerpt && (
              <p className="text-gray-700 mb-3 line-clamp-3">
                {mainArticle.excerpt}
              </p>
            )}
            {mainArticle.author && (
              <p className="text-sm text-gray-500">Por {mainArticle.author}</p>
            )}
          </div>
        </div>

        {/* Side Articles */}
        <div className="space-y-6">
          {sideArticles.map((article) => (
            <div key={article.id} className="flex flex-col space-y-3">
              <div className="relative overflow-hidden rounded-lg">
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug,
                  )}
                >
                  <OptimizedImage
                    src={article.imgUrl}
                    alt={article.title}
                    width={300}
                    height={200}
                    className="w-full object-cover rounded-lg"
                  />
                  {article.hasVideo && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white p-1 rounded-md flex items-center">
                      <span className="text-xs">VIDEO</span>
                    </div>
                  )}
                  {article.section && (
                    <div className="absolute top-2 left-2 bg-white/80 text-primary-800 px-2 py-0.5 rounded text-xs font-medium">
                      {article.section.toUpperCase()}
                    </div>
                  )}
                </Link>
              </div>

              <div>
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug,
                  )}
                  className="hover:text-blue-600"
                >
                  <h4 className="text-base font-medium mb-1">
                    {article.overline && (
                      <>
                        <span className="font-bold">
                          {article.overline}.
                        </span>{' '}
                      </>
                    )}
                    {article.title}
                  </h4>
                </Link>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                {article.author && (
                  <p className="text-xs text-gray-500 mt-1">
                    Por {article.author}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
