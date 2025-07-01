'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useArticles } from '../hooks/useArticles' // Import our new hook
import OptimizedImage from './OptimizedImage' // Import the new component



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
  isVideo?: boolean
  hasVideo?: boolean
}



// Same getSectionPath function from PrincipalSection
function getSectionPath(section: string | undefined): string {
  if (!section) {
    return 'sin-categoria'
  }

  if (section.includes('.')) {
    return section.split('.').join('/')
  }

  return section
}

interface NoticiasImportantesSectionProps {
  sectionColor?: 'default' | 'red' | 'blue' | 'green'
}

export default function NoticiasImportantesSection({
  sectionColor = 'default',
}: NoticiasImportantesSectionProps) {
  const { articles, loading, error } = useArticles('NoticiasImportantesSection')

  const previousArticlesRef = useRef<Article[]>([])

  // ...existing code...
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
      // Remove it from current position if it exists
      slots = slots.filter((a) => a.id !== normal.id)
      // Ensure we have at least 3 slots before inserting at position 2
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
      // Remove it from current position if it exists
      slots = slots.filter((a) => a.id !== secundario.id)
      // Ensure we have at least 2 slots before inserting at position 1
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
      // Remove it from current position if it exists
      slots = slots.filter((a) => a.id !== principal.id)
      // Ensure we have at least 1 slot before inserting at position 0
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
  // ...existing code...

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

  if (loading && articles.length === 0) {
    return (
      <div className="container mx-auto p-4">
        Loading noticias importantes...
      </div>
    )
  }

  if (error && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  // Color theme mapping
  const colorClasses = {
    default: 'border-gray-200',
    red: 'border-red-200 bg-red-50',
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
  }

  // ...existing code...
  return (
    <section
      className={`container mx-auto px-4 py-6 border-t ${colorClasses[sectionColor]}`}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
        {processedArticles.slice(0, 4).map((article, index) => (
          <div
            key={article.id}
            className="group relative h-full flex flex-col bg-white rounded-md overflow-visible"
          >
            <Link
              href={`/${
                article.section
                  ? getSectionPath(article.section)
                  : 'sin-categoria'
              }/${article.slug}`}
              className="block h-full flex flex-col"
            >
              {/* REPLACE SafeImage with OptimizedImage */}
              <div className="relative w-full h-40 md:h-48 overflow-hidden">
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
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              {/* Text below */}
              <div className="flex-1 flex flex-col justify-between p-4">
                <h3 className="text-base font-bold leading-tight text-[#292929] mb-1">
                  {article.overline && (
                    <span className="text-primary-red font-bold">
                      {article.overline}.{' '}
                    </span>
                  )}
                  {article.title}
                </h3>
                {article.author && (
                  <p className="text-xs text-dark-gray mb-2">
                    Por {article.author}
                  </p>
                )}
              </div>
            </Link>
            {/* Vertical divider between articles, except last */}
            {index < 3 && (
              <div className="hidden md:block absolute top-0 right-[-12px] h-full w-px bg-gray-300 opacity-80 z-20 pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
 
}
