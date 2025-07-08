'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useArticles } from '../hooks/useArticles'

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

function getSectionPath(section: string | undefined): string {
  if (!section) {
    return 'sin-categoria'
  }

  if (section.includes('.')) {
    return section.split('.').join('/')
  }

  return section
}

interface LaSextaSectionProps {
  serverData?: Article[]
}

export default function LaSextaSection({
  serverData,
}: LaSextaSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('LaSextaSection', 4)

  const articles = serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(() => {
    // Sort by created_at descending
    const sorted = [...articles].sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : 0
    )

    // Find the most recent for each order
    const principal = sorted.find((a) => a.order === 'principal')
    const secundario = sorted.find((a) => a.order === 'secundario')
    const normal = sorted.find((a) => a.order === 'normal')

    // Start with the 4 most recent articles as base
    let slots = sorted.slice(0, 4)

    // Place "principal" at position 0
    if (principal) {
      slots = slots.filter((a) => a.id !== principal.id)
      slots.unshift(principal)
    }

    // Place "secundario" at position 1
    if (secundario) {
      slots = slots.filter((a) => a.id !== secundario.id)
      if (slots.length < 1) slots.push(secundario)
      else slots.splice(1, 0, secundario)
    }

    // Place "normal" at position 2
    if (normal) {
      slots = slots.filter((a) => a.id !== normal.id)
      if (slots.length < 2) slots.push(normal)
      else slots.splice(2, 0, normal)
    }

    // Fill to exactly 4 slots
    while (slots.length < 4) {
      const nextArticle = sorted.find((a) => !slots.some((s) => s.id === a.id))
      if (nextArticle) slots.push(nextArticle)
      else break
    }

    return slots.slice(0, 4)
  }, [articles])

  if (isLoading && articles.length === 0) {
    return (
      <div className="container mx-auto p-4">
        Loading La Sexta...
      </div>
    )
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      {/* Section header */}
      <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
        <h2 className="text-2xl font-bold text-[#292929]">LA SEXTA</h2>
        <div className="ml-auto h-1 w-24 bg-primary-red"></div>
      </div>

      {/* Four column grid layout for articles */}
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
                <Image
                  src={article.imgUrl || '/placeholder.svg?height=200&width=300'}
                  alt={article.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
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