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

interface EspectaculosSectionProps {
  serverData?: Article[]
}

export default function EspectaculosSection({
  serverData,
}: EspectaculosSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('EspectaculosSection', 3)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 3),
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

  const [mainFeature, ...secondaryFeatures] = processedArticles

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Header */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">
            ESPECTÁCULOS
          </h2>
        </div>
      </div>

      {/* Main article: image left 50%, text right 50% */}
      <Link
        href={getArticleUrl(
          mainFeature.section_path || mainFeature.section,
          mainFeature.slug,
        )}
        className="flex flex-col md:flex-row gap-0 md:gap-6 group mb-6"
      >
        <div className="relative w-full md:w-1/2 aspect-[16/9] overflow-hidden flex-shrink-0">
          {mainFeature.hasVideo && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 z-20">
              VIDEO
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
          <OptimizedImage
            src={mainFeature.imgUrl}
            alt={mainFeature.title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="pt-3 md:pt-0 md:w-1/2 flex flex-col justify-start">
          <h2 className="font-serif text-xl font-bold leading-tight">
            {mainFeature.overline && (
              <span className="text-primary-red">{mainFeature.overline}. </span>
            )}
            {mainFeature.title}
          </h2>
          {mainFeature.excerpt && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {mainFeature.excerpt}
            </p>
          )}
        </div>
      </Link>

      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:opacity-50"></div>

      {/* Secondary articles: text left, image right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {secondaryFeatures.slice(0, 2).map((feature, idx) => (
          <div key={feature.id} className="relative">
            <Link
              href={getArticleUrl(
                feature.section_path || feature.section,
                feature.slug,
              )}
              className="flex gap-4 group"
            >
              {/* Text left */}
              <div className="flex-1 flex flex-col justify-start">
                <h2 className="font-serif text-base font-bold leading-6 sm:leading-tight">
                  {feature.overline && (
                    <span className="text-primary-red">
                      {feature.overline}.{' '}
                    </span>
                  )}
                  {feature.title}
                </h2>
              </div>
              {/* Image right */}
              <div className="relative flex-shrink-0 w-2/5 aspect-[4/3] overflow-hidden">
                {feature.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 z-20">
                    VIDEO
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                <OptimizedImage
                  src={feature.imgUrl}
                  alt={feature.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  sizes="(max-width: 768px) 40vw, 20vw"
                />
              </div>
            </Link>
            {/* Vertical divider */}
            {idx === 0 && (
              <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
            )}
            {/* Mobile divider */}
            {idx === 0 && (
              <div className="md:hidden w-full h-[1px] bg-gray-300 mt-4"></div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
