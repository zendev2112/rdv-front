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

    let layout = sorted.slice(0, 4)

    const principalArticle = sorted.find((a) => a.order === 'principal')
    const secundarioArticle = sorted.find((a) => a.order === 'secundario')
    const normalArticle = sorted.find((a) => a.order === 'normal')

    if (principalArticle) {
      const formerMain = layout[0]
      layout = layout.filter((a) => a.id !== principalArticle.id)
      layout[0] = principalArticle

      if (formerMain && formerMain.id !== principalArticle.id) {
        const formerFirst = layout[1]
        layout[1] = formerMain

        if (formerFirst && formerFirst.id !== formerMain.id) {
          const formerSecond = layout[2]
          layout[2] = formerFirst

          if (formerSecond && formerSecond.id !== formerFirst.id) {
            layout[3] = formerSecond
          }
        }
      }
    }

    if (secundarioArticle) {
      layout = layout.filter((a) => a.id !== secundarioArticle.id)
      layout[3] = secundarioArticle
    }

    if (normalArticle) {
      layout = layout.filter((a) => a.id !== normalArticle.id)
    }

    while (layout.length < 4) {
      const nextArticle = sorted.find(
        (a) =>
          !layout.some((l) => l && l.id === a.id) &&
          a.id !== normalArticle?.id
      )
      if (nextArticle) {
        layout.push(nextArticle)
      } else {
        break
      }
    }

    return layout.slice(0, 4).filter(Boolean)
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
      <div className="w-full md:w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">PUEBLOS ALEMANES</h2>
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
                <h1 className="text-xl md:text-2xl font-bold leading-7 sm:leading-tight">
                  {mainArticle.overline && (
                    <span className="text-primary-red">
                      {mainArticle.overline}.{' '}
                    </span>
                  )}
                  {mainArticle.title}
                </h1>
              </div>
            </Link>

            {/* Vertical divider */}
            <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
            {/* Mobile divisory line */}
            <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
          </div>
        )}

        {/* RIGHT COLUMN - Secondary articles (6 columns) */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {sideArticles.map((article, idx) => (
            <div key={article.id} className="relative">
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug
                )}
                className="block h-full flex flex-row group gap-4"
              >
                {/* Text on left */}
                <div className="pt-0 pb-0 md:pb-0 flex-1">
                  <h2 className="text-base md:text-base font-bold leading-6 sm:leading-tight">
                    {article.overline && (
                      <span className="text-primary-red">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h2>
                </div>

                {/* Image on right */}
                <div className="relative w-1/2 aspect-[16/9] flex-shrink-0">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </Link>

              {/* Mobile divisory line */}
              <div className="md:hidden w-full h-[1px] bg-gray-300 mt-6"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
