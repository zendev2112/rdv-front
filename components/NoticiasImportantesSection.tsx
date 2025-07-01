'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

// Same SafeImage component from PrincipalSection
function SafeImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
}) {
  if (!src) {
    return (
      <div
        className={`relative w-full h-full bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400">No image</span>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full ${fill ? 'absolute inset-0' : ''}`}
      style={{ overflow: 'hidden' }}
    >
      <img
        src={src}
        alt={alt || 'Article image'}
        className={`w-full h-full object-cover ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        onError={(e) => {
          console.error('Direct image failed to load:', src)
          const proxyUrl = `/api/imageproxy?url=${encodeURIComponent(src)}`
          e.currentTarget.src = proxyUrl

          e.currentTarget.onerror = () => {
            console.error('Proxy image also failed:', proxyUrl)
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30 40 L50 65 L70 40' stroke='%23cccccc' fill='none' stroke-width='2'/%3E%3Ccircle cx='50' cy='30' r='10' fill='%23cccccc'/%3E%3C/svg%3E"
          }
        }}
      />
    </div>
  )
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
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const previousArticlesRef = useRef<Article[]>([])

  // Same fetching logic as PrincipalSection
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        const response = await fetch(
          '/api/articles?front=NoticiasImportantesSection&status=published'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch articles')
        }

        const result = await response.json()
        const apiArticles = Array.isArray(result) ? result : []

        // Same comparison logic as PrincipalSection
        const existingIds = new Set(articles.map((a) => a.id))
        const hasNewArticles = apiArticles.some((a) => !existingIds.has(a.id))

        if (hasNewArticles || articles.length === 0) {
          setArticles(apiArticles)
          previousArticlesRef.current = []
        }
      } catch (err) {
        console.error('Error fetching noticias importantes articles:', err)
        setError('Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
    const interval = setInterval(fetchArticles, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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
              {/* Image on top */}
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
                <SafeImage
                  src={article.imgUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  priority={index === 0}
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
