'use client'

import React, { useMemo, useRef } from 'react'
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
  const previousArticlesRef = useRef<Article[]>([])

  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('ActualidadSection', 20)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(() => {
    if (!articles.length) return []

    // ✅ FIRST LOAD - Create initial layout with principal/secundario/normal
    if (previousArticlesRef.current.length === 0) {
      console.log('🔄 ACTUALIDAD - First Load')

      const articlesByOrder = {
        principal: articles.filter((a) => a.order === 'principal'),
        secundario: articles.filter((a) => a.order === 'secundario'),
        normal: articles.filter((a) => a.order === 'normal'),
        other: articles.filter(
          (a) =>
            !a.order ||
            (a.order !== 'principal' &&
              a.order !== 'secundario' &&
              a.order !== 'normal')
        ),
      }

      // Sort each category by creation date
      Object.keys(articlesByOrder).forEach((key) => {
        articlesByOrder[key as keyof typeof articlesByOrder].sort((a, b) => {
          if (a.created_at && b.created_at) {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
          }
          return 0
        })
      })

      const initialLayout: Article[] = []
      const allAvailableArticles = [
        ...articlesByOrder.principal,
        ...articlesByOrder.secundario,
        ...articlesByOrder.normal,
        ...articlesByOrder.other,
      ]

      // Position 0: Principal
      if (articlesByOrder.principal.length > 0) {
        initialLayout.push({ ...articlesByOrder.principal[0] })
      } else if (allAvailableArticles.length > 0) {
        initialLayout.push({ ...allAvailableArticles[0], order: 'principal' })
      }

      // Position 1: Secundario
      if (articlesByOrder.secundario.length > 0) {
        initialLayout.push({ ...articlesByOrder.secundario[0] })
      } else {
        const available = allAvailableArticles.filter(
          (a) => !initialLayout.some((laid) => laid.id === a.id)
        )
        if (available.length > 0) {
          initialLayout.push({ ...available[0], order: 'secundario' })
        }
      }

      // Position 2: Normal
      if (articlesByOrder.normal.length > 0) {
        initialLayout.push({ ...articlesByOrder.normal[0] })
      } else {
        const available = allAvailableArticles.filter(
          (a) => !initialLayout.some((laid) => laid.id === a.id)
        )
        if (available.length > 0) {
          initialLayout.push({ ...available[0], order: 'normal' })
        }
      }

      // Positions 3-15: Fill remaining 13 positions
      const usedIds = new Set(initialLayout.map((a) => a.id))
      const remainingArticles = allAvailableArticles.filter(
        (a) => !usedIds.has(a.id)
      )

      for (let i = 0; i < 13 && i < remainingArticles.length; i++) {
        const article = { ...remainingArticles[i] }
        delete article.order
        initialLayout.push(article)
      }

      previousArticlesRef.current = initialLayout
      return initialLayout
    }

    // ✅ SUBSEQUENT UPDATES - Handle new articles with displacement
    console.log('🔄 ACTUALIDAD - Update with displacement')

    const newArticles = articles.filter(
      (article) =>
        !previousArticlesRef.current.some((prev) => prev.id === article.id)
    )

    if (newArticles.length === 0) {
      return previousArticlesRef.current.slice(0, 16)
    }

    const newLayout = [...previousArticlesRef.current]

    newArticles.forEach((newArticle) => {
      if (newArticle.order === 'principal') {
        // New principal pushes everything down
        const oldPrincipal = newLayout[0]
        const oldSecundario = newLayout[1]
        const oldNormal = newLayout[2]

        newLayout[0] = { ...newArticle }
        newLayout[1] = { ...oldPrincipal, order: 'secundario' }
        newLayout[2] = { ...oldSecundario, order: 'normal' }

        const displaced = { ...oldNormal }
        delete displaced.order
        newLayout.splice(3, 0, displaced)
      } else if (newArticle.order === 'secundario') {
        // New secundario displaces old secundario to normal
        const oldSecundario = newLayout[1]
        const oldNormal = newLayout[2]

        newLayout[1] = { ...newArticle }
        newLayout[2] = { ...oldSecundario, order: 'normal' }

        const displaced = { ...oldNormal }
        delete displaced.order
        newLayout.splice(3, 0, displaced)
      } else if (newArticle.order === 'normal') {
        // New normal displaces old normal to grid
        const oldNormal = newLayout[2]

        newLayout[2] = { ...newArticle }

        const displaced = { ...oldNormal }
        delete displaced.order
        newLayout.splice(3, 0, displaced)
      } else {
        // No order - add to end
        newLayout.push({ ...newArticle })
      }
    })

    const finalLayout = newLayout.slice(0, 16)
    previousArticlesRef.current = finalLayout
    return finalLayout
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
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">
            ACTUALIDAD
          </h2>
        </div>
      </div>

      {/* 12-column grid layout - 4 articles of 3 columns each (4x4 = 16 articles) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {processedArticles.map((article, idx) => {
          const row = Math.floor(idx / 4)
          const isLastInRow = (idx + 1) % 4 === 0
          const isLastRow = row === 3

          return (
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
                    <h2 className="font-serif text-base md:text-base font-bold leading-6 sm:leading-tight">
                      {article.overline && (
                        <span className="text-primary-red">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h2>
                    {article.author && (
                      <p className="text-sm text-gray-500 mt-2">
                        {article.author}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Vertical divider between articles (not on last in row) */}
                {!isLastInRow && (
                  <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
                )}

                {/* Mobile divisory line */}
                <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
              </div>

              {/* Horizontal divider after each row (every 4 articles) - not after last row */}
              {isLastInRow && !isLastRow && (
                <div className="md:col-span-12 h-[1px] bg-gray-400 opacity-50 hidden md:block"></div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </main>
  )
}
