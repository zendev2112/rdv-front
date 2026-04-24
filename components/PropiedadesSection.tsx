'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useArticles } from '../hooks/useArticles'
import OptimizedImage from './OptimizedImage'
import { getArticleUrl } from '@/lib/utils'
import { sortArticlesForSlots } from '@/lib/articleSlots'

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

interface PropiedadesSectionProps {
  serverData?: Article[]
}

export default function PropiedadesSection({
  serverData,
}: PropiedadesSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('PropiedadesSection', 4)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 4),
    [articles],
  )

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
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-[#3498db] mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">
            PROPIEDADES
          </h2>
        </div>
      </div>

      {/* 12-column grid – 4 articles of 3 columns each */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {processedArticles.map((property, idx) => (
          <React.Fragment key={property.id}>
            <div className="md:col-span-3 relative">
              <Link
                href={getArticleUrl(
                  property.section_path || property.section,
                  property.slug,
                )}
                className="block h-full flex flex-col group"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3]">
                  <div className="relative w-full h-full overflow-hidden">
                    {property.hasVideo && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 z-20">
                        VIDEO
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={property.imgUrl}
                      alt={property.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>

                {/* Title area */}
                <div className="pt-2 pb-6 md:pb-0 flex-1">
                  <h2 className="font-serif text-base font-bold leading-6 sm:leading-tight">
                    {property.overline && (
                      <span className="text-[#3498db]">
                        {property.overline}.{' '}
                      </span>
                    )}
                    {property.title}
                  </h2>
                </div>
              </Link>

              {/* Vertical divider between articles */}
              {idx < processedArticles.length - 1 && (
                <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
              )}

              {/* Mobile divider */}
              <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </main>
  )
}
