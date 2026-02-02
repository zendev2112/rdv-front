'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
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

interface PueblosAlemanesSectionProps {
  serverData?: Article[]
}

export default function PueblosAlemanesSection({
  serverData,
}: PueblosAlemanesSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('PueblosAlemanesSection', 8)

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

    let layout: (Article | undefined)[] = [undefined, undefined, undefined, undefined]

    const principalArticle = sorted.find((a) => a.order === 'principal')
    const secundarioArticle = sorted.find((a) => a.order === 'secundario')
    const normalArticles = sorted.filter((a) => a.order === 'normal')

    // Position [0]: PRINCIPAL
    layout[0] = principalArticle || sorted[0]

    // Position [1]: SECUNDARIO ← GOES HERE NOW
    layout[1] = secundarioArticle || sorted.find((a) => a.id !== layout[0]?.id)

    // Position [2]: FIRST NORMAL
    layout[2] = normalArticles[0] || sorted.find((a) =>
      a.id !== layout[0]?.id && a.id !== layout[1]?.id
    )

    // Position [3]: SECOND NORMAL
    layout[3] = normalArticles[1] || sorted.find((a) =>
      a.id !== layout[0]?.id && a.id !== layout[1]?.id && a.id !== layout[2]?.id
    )

    return layout.filter(Boolean) as Article[]
  }, [articles])

  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  const [mainArticle, ...sideArticles] = processedArticles

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">PUEBLOS ALEMANES</h2>
        </div>
      </div>

      {/* 12-column grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COLUMN - Main article (6 columns) */}
        {mainArticle && (
          <div className="md:col-span-6 relative">
            <Link
              href={getArticleUrl(
                mainArticle.section_path || mainArticle.section,
                mainArticle.slug
              )}
              className="block h-full flex flex-col group"
            >
              {/* Main article image */}
              <div className="relative w-full aspect-[16/9]">
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                  <OptimizedImage
                    src={mainArticle.imgUrl}
                    alt={mainArticle.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Title area - CONSISTENT SPACING */}
              <div className="bg-white pt-3 pb-6 md:pb-0">
                <h1 className="font-serif text-xl md:text-2xl font-bold leading-7 sm:leading-tight">
                  {mainArticle.overline && (
                    <span className="text-primary-red">
                      {mainArticle.overline}.{' '}
                    </span>
                  )}
                  {mainArticle.title}
                </h1>
                <p className="font-serif text-sm md:text-sm text-gray-600 mt-2 leading-6 sm:leading-relaxed">
                  {mainArticle.excerpt || 'No excerpt available'}
                </p>
              </div>
            </Link>

            {/* Vertical divider */}
            <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
            {/* Mobile divisory line */}
            <div className="md:hidden w-full h-[1px] bg-gray-300 mb-6"></div>
          </div>
        )}

        {/* RIGHT COLUMN - Secondary articles (6 columns) */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {sideArticles.map((article, idx) => (
            <React.Fragment key={article.id}>
              <div className="relative">
                <Link
                  href={getArticleUrl(
                    article.section_path || article.section,
                    article.slug
                  )}
                  className="block h-full flex flex-col md:flex-row group gap-4"
                >
                  {/* Image - Full width on mobile, right side on desktop */}
                  <div className="relative w-full md:w-1/2 aspect-[16/9] md:order-2 flex-shrink-0">
                    <div className="relative w-full h-full overflow-hidden">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                      <OptimizedImage
                        src={article.imgUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                  </div>

                  {/* Text - Below image on mobile, left side on desktop */}
                  <div className="pt-2 md:pt-0 pb-0 md:pb-0 md:order-1 flex-1">
                    <h2 className="font-serif text-base md:text-base font-bold leading-6 sm:leading-tight">
                      {article.overline && (
                        <span className="text-primary-red">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h2>
                  </div>
                </Link>
              </div>

              {/* Mobile divisory line - After article content */}
              <div className="md:hidden w-full h-[1px] bg-gray-300"></div>

              {/* Desktop horizontal divider - Between articles */}
              {idx < sideArticles.length - 1 && (
                <div className="hidden md:block w-full h-[1px] bg-gray-400 opacity-50"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  )
}
