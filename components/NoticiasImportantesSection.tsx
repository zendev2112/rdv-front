'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
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
  isVideo?: boolean
  hasVideo?: boolean
}

interface NoticiasImportantesSectionProps {
  serverData?: Article[]
}

export default function NoticiasImportantesSection({
  serverData,
}: NoticiasImportantesSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('NoticiasImportantesSection', 8)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(() => {
    // Sort all articles by created_at desc (most recent first)
    const sorted = [...articles].sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : 0
    )

    // Start with the 4 most recent articles as base
    let slots = sorted.slice(0, 4)

    // Find the most recent for each order
    const normal = sorted.find((a) => a.order === 'normal')
    const secundario = sorted.find((a) => a.order === 'secundario')
    const principal = sorted.find((a) => a.order === 'principal')

    // DISPLACEMENT LOGIC - Remove first, then place in correct position

    // If we have a "normal" article, place it at position 2
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

    // If we have a "secundario" article, place it at position 1
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

    // If we have a "principal" article, place it at position 0
    if (principal) {
      slots = slots.filter((a) => a.id !== principal.id)
      while (slots.length < 1) {
        const nextArticle = sorted.find(
          (a) => !slots.some((s) => s.id === a.id)
        )
        if (nextArticle) slots.push(nextArticle)
        else break
      }
      slots.splice(0, 0, principal)
    }

    // Fill to exactly 4 slots
    while (slots.length < 4) {
      const nextArticle = sorted.find((a) => !slots.some((s) => s.id === a.id))
      if (nextArticle) slots.push(nextArticle)
      else break
    }

    return slots.slice(0, 4)
  }, [articles])

  // Debug logs
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('NoticiasImportantesSection - Current Layout:')
      processedArticles.forEach((article, index) => {
        console.log(
          `Position ${index + 1}:`,
          article?.title,
          `(${article?.order || 'no-order'})`
        )
      })
    }
  }, [processedArticles])

  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!processedArticles || processedArticles.length === 0) {
    return <div className="container mx-auto p-4">No articles available</div>
  }

  return (
    <main className="py-0 md:py-6">
      <div className="w-full md:w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>
      {/* Single row with 4 articles, 3 columns each (12-column grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {processedArticles.map((article, index) => (
          <div key={article.id} className="md:col-span-3 relative">
            <Link
              href={getArticleUrl(
                article.section_path || article.section,
                article.slug
              )}
              className="block h-full flex flex-col group"
            >
              {/* Image - ALL use aspect-[16/9] */}
              <div className="relative w-full aspect-[16/9]">
                <div className="relative w-full h-full overflow-hidden">
                  {article.hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-primary-red rounded-full p-1">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  )}
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

              {/* Title area - CONSISTENT SPACING */}
              <div className="pt-2 pb-6 md:pb-0 flex-1">
                <h2 className="text-base md:text-base font-bold leading-tight">
                  {article.overline && (
                    <span className="text-primary-red">
                      {article.overline}.{' '}
                    </span>
                  )}
                  {article.title}
                </h2>
              </div>
            </Link>

            {/* Vertical divider between articles (desktop) */}
            {index < processedArticles.length - 1 && (
              <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
            )}

            {/* Mobile divisory line */}
            <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
          </div>
        ))}
      </div>
    </main>
  )
}
