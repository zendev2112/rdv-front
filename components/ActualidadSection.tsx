'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useArticles } from '../hooks/useArticles'
import OptimizedImage from './OptimizedImage'
import { getArticleUrl } from '@/lib/utils'

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

interface ActualidadSectionProps {
  serverData?: Article[]
}

export default function ActualidadSection({
  serverData,
}: ActualidadSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('ActualidadSection', 16) // ✅ Fetch 16 articles for 4x4 grid

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(() => {
    if (!articles.length) return []

    const sorted = [...articles].sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : 0
    )

    return sorted.slice(0, 16) // ✅ Take first 16 articles
  }, [articles])

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
    <>
      {/* ✅ MOBILE VERSION */}
      <section className="md:hidden container mx-auto px-4 py-8 border-t border-gray-300">
        {/* Header */}
        <div className="mb-6">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">ACTUALIDAD</h2>
        </div>

        {/* Stacked Articles */}
        <div className="space-y-6">
          {processedArticles.map((article, idx) => (
            <React.Fragment key={article.id}>
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug
                )}
                className="block group"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-3">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                  <OptimizedImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="100vw"
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-semibold leading-tight">
                  {article.overline && (
                    <span className="text-primary-red">
                      {article.overline}.{' '}
                    </span>
                  )}
                  {article.title}
                </h3>

                {/* Author (if available) */}
                {article.author && (
                  <p className="text-sm text-gray-500 mt-1">{article.author}</p>
                )}
              </Link>

              {/* Divider */}
              {idx < processedArticles.length - 1 && (
                <div className="w-full h-[1px] bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ✅ DESKTOP VERSION - 4x4 GRID */}
      <section className="hidden md:block container mx-auto px-8 py-8 border-t border-gray-300">
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">ACTUALIDAD</h2>
        </div>

        {/* 4x4 Grid */}
        <div className="grid grid-cols-4 gap-x-8 gap-y-8">
          {processedArticles.map((article, idx) => {
            const col = idx % 4
            const row = Math.floor(idx / 4)
            const isLastInRow = col === 3
            const isLastRow = row === 3

            return (
              <div key={article.id} className="relative">
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug
                  )}
                  className="block group h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg mb-3">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="25vw"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-base font-semibold leading-tight flex-1">
                    {article.overline && (
                      <span className="text-primary-red">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h3>

                  {/* Author (if available) */}
                  {article.author && (
                    <p className="text-sm text-gray-500 mt-2">
                      {article.author}
                    </p>
                  )}
                </Link>

                {/* Vertical divider between columns */}
                {!isLastInRow && (
                  <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-300"></div>
                )}

                {/* Horizontal divider between rows */}
                {!isLastRow && (
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300 -mb-4"></div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
