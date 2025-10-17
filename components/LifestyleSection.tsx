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

interface LifestyleSectionProps {
  serverData?: Article[]
}

export default function LifestyleSection({
  serverData,
}: LifestyleSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('LifestyleSection', 4)

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

    let slots = sorted.slice(0, 4)

    const principal = sorted.find((a) => a.order === 'principal')
    const secundario = sorted.find((a) => a.order === 'secundario')
    const normal = sorted.find((a) => a.order === 'normal')

    if (principal) {
      slots = slots.filter((a) => a.id !== principal.id)
      slots.splice(0, 0, principal)
    }

    if (secundario) {
      slots = slots.filter((a) => a.id !== secundario.id)
      while (slots.length < 2) {
        const nextArticle = sorted.find(
          (a) => !slots.some((s) => s.id === a.id)
        )
        if (nextArticle) slots.push(nextArticle)
        else break
      }
      slots.splice(1, 0, secundario)
    }

    if (normal) {
      slots = slots.filter((a) => a.id !== normal.id)
      while (slots.length < 3) {
        const nextArticle = sorted.find(
          (a) => !slots.some((s) => s.id === a.id)
        )
        if (nextArticle) slots.push(nextArticle)
        else break
      }
      slots.splice(2, 0, normal)
    }

    while (slots.length < 4) {
      const nextArticle = sorted.find((a) => !slots.some((s) => s.id === a.id))
      if (nextArticle) slots.push(nextArticle)
      else break
    }

    return slots.slice(0, 4)
  }, [articles])

  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-[#2a9d8f] mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">LIFESTYLE</h2>
        </div>
      </div>

      {/* 12-column grid layout - 4 articles of 3 columns each */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {processedArticles.map((article, idx) => (
          <React.Fragment key={article.id}>
            <div className="md:col-span-3 relative">
              <Link
                href={getArticleUrl(
                  article.section_path || article.section,
                  article.slug
                )}
                className="block h-full flex flex-col group"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9]">
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

                {/* Title area */}
                <div className="pt-2 pb-6 md:pb-0 flex-1">
                  <h2 className="text-base md:text-base font-bold leading-6 sm:leading-tight">
                    {article.overline && (
                      <span className="text-[#2a9d8f]">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h2>
                </div>
              </Link>

              {/* Vertical divider between articles */}
              {idx < processedArticles.length - 1 && (
                <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
              )}

              {/* Mobile divisory line */}
              <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </main>
  )
}