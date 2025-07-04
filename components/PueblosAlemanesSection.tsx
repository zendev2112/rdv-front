'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useArticles } from '../hooks/useArticles'
import OptimizedImage from './OptimizedImage'

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
  author?: string
  hasVideo?: boolean
}

interface PueblosAlemanesSectionProps {
  serverData?: Article[]
}

function getSectionPath(section: string | undefined): string {
  if (!section) {
    return 'sin-categoria'
  }
  if (section.includes('.')) {
    return section.split('.').join('/')
  }
  return section
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

    // Sort by created_at desc (most recent first)
    const sorted = [...articles].sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : 0
    )

    // Start with the 3 most recent articles as base
    let layout = sorted.slice(0, 4)

    // Find special order articles
    const principalArticle = sorted.find((a) => a.order === 'principal')
    const secundarioArticle = sorted.find((a) => a.order === 'secundario')
    const normalArticle = sorted.find((a) => a.order === 'normal')

  // 1. "principal" takes position 0 (main), displaces former main to position 1
  if (principalArticle) {
    const formerMain = layout[0]
    layout = layout.filter((a) => a.id !== principalArticle.id) // Remove if already present
    layout[0] = principalArticle // Place principal at main position

    if (formerMain && formerMain.id !== principalArticle.id) {
      // Former main moves to first side position (position 1), displaces what was there
      const formerFirst = layout[1]
      layout[1] = formerMain

      // What was in first side moves to second side (position 2), etc.
      if (formerFirst && formerFirst.id !== formerMain.id) {
        const formerSecond = layout[2]
        layout[2] = formerFirst
        
        // What was in second side moves to third side (position 3)
        if (formerSecond && formerSecond.id !== formerFirst.id) {
          layout[3] = formerSecond
        }
      }
    }
  }

  // 2. "secundario" takes position 3 (last side article), displaces former last away
  if (secundarioArticle) {
    layout = layout.filter((a) => a.id !== secundarioArticle.id) // Remove if already present
    layout[3] = secundarioArticle // Place secundario at last side position
  }

  // 3. "normal" gets completely displaced (removed from layout)
  if (normalArticle) {
    layout = layout.filter((a) => a.id !== normalArticle.id)
  }

  // Fill gaps if needed, but exclude the displaced normal article
  while (layout.length < 4) {
    const nextArticle = sorted.find(
      (a) =>
        !layout.some((l) => l && l.id === a.id) && a.id !== normalArticle?.id // Don't add the displaced normal article
    )
    if (nextArticle) {
      layout.push(nextArticle)
    } else {
      break
    }
  }

  return layout.slice(0, 4).filter(Boolean) // Exactly 4 articles (1 main + 3 side)
}, [articles])

  // Debug logs
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PueblosAlemanesSection - Displacement Layout:')
      console.log(
        'Main (0):',
        processedArticles[0]?.title,
        `(${processedArticles[0]?.order || 'no-order'})`
      )
      console.log(
        'Top Right (1):',
        processedArticles[1]?.title,
        `(${processedArticles[1]?.order || 'no-order'})`
      )
      console.log(
        'Bottom Right (2):',
        processedArticles[2]?.title,
        `(${processedArticles[2]?.order || 'no-order'})`
      )
    }
  }, [processedArticles])

  if (isLoading && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        Loading pueblos alemanes...
      </div>
    )
  }

  if (hasError && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-red-500">{error}</div>
    )
  }

  // Extract the 4 articles: 1 main + 3 side articles
  const [mainArticle, ...sideArticles] = processedArticles

  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      {/* header */}
      <div className="mb-6 border-b border-light-gray pb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-5 w-1 bg-primary-red mr-3" />
          <h2 className="text-xl font-bold uppercase">Pueblos Alemanes</h2>
        </div>
        <Link
          href="/pueblos-alemanes"
          className="text-primary-red hover:underline text-sm font-medium flex items-center"
        >
          Ver todos <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* main article */}
        {mainArticle && (
          <div className="md:w-2/5 relative bg-white rounded-md overflow-hidden group">
            <Link
              href={`/${getSectionPath(mainArticle.section)}/${
                mainArticle.slug
              }`}
              className="block h-full flex flex-col"
            >
              <div className="relative w-full h-64 md:h-80">
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between p-4">
                <h3 className="text-2xl font-bold leading-tight text-[#292929] mb-2">
                  {mainArticle.overline && (
                    <span className="text-primary-red font-bold">
                      {mainArticle.overline}.{' '}
                    </span>
                  )}
                  {mainArticle.title}
                </h3>
                <div className="flex items-center text-xs">
                  {mainArticle.author && (
                    <p className="text-dark-gray">Por {mainArticle.author}</p>
                  )}
                  {/* date removed */}
                </div>
              </div>
            </Link>
            {/* vertical divider */}
            <div className="absolute top-0 -right-3 w-px h-full bg-gray-300 opacity-80"></div>
          </div>
        )}

        {/* vertical divider between main and side articles */}
        <div className="hidden md:block w-px bg-gray-300 opacity-80 mx-6"></div>

        {/* side articles (3 items) */}
        <div className="md:w-3/5 flex flex-col">
          {sideArticles.map((article, idx) => (
            <React.Fragment key={article.id}>
              <div className="flex bg-white rounded-md overflow-hidden group">
                <Link
                  href={`/${getSectionPath(article.section)}/${article.slug}`}
                  className="flex flex-1"
                >
                  {/* text left */}
                  <div className="flex-1 flex flex-col justify-between p-4">
                    <h4 className="text-base font-bold leading-tight text-[#292929] mb-1">
                      {article.overline && (
                        <span className="text-primary-red font-bold">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h4>
                    <div className="flex items-center text-xs">
                      {article.author && (
                        <p className="text-dark-gray">Por {article.author}</p>
                      )}
                      {/* date removed */}
                    </div>
                  </div>

                  {/* image right */}
                  <div className="relative w-full md:w-1/3 p-4 pb-1">
                    <div className="relative w-full h-48 sm:h-32 overflow-hidden rounded">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded" />
                      <OptimizedImage
                        src={article.imgUrl}
                        alt={article.title}
                        fill
                        className="object-cover rounded transition-opacity duration-300 group-hover:opacity-90"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                </Link>
              </div>
              {/* horizontal divider between side articles */}
              {idx < sideArticles.length - 1 && (
                <div className="w-full h-px bg-gray-300 opacity-80 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
