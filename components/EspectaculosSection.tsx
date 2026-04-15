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
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* Title and red accent line */}
          <div className="flex items-center pb-2 border-b border-[#292929]/20">
            <h2 className="text-2xl font-bold text-[#292929]">ESPECTÁCULOS</h2>
            <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
          </div>
        </div>

        {/* Content layout */}
        <div className="flex flex-col space-y-6">
          {/* Main article - full width, image on left, text on right */}
          <div className="overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group">
            <Link
              href={getArticleUrl(
                mainFeature.section_path || mainFeature.section,
                mainFeature.slug,
              )}
              className="flex flex-col md:flex-row"
            >
              {/* Image on the left - fixed height on desktop */}
              <div className="relative md:w-1/2 aspect-video md:aspect-[4/3] h-auto overflow-hidden">
                {mainFeature.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    VIDEO
                  </div>
                )}
                <OptimizedImage
                  src={mainFeature.imgUrl}
                  alt={mainFeature.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Text content on the right */}
              <div className="md:w-1/2 p-5 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-3 leading-tight text-[#292929]">
                  {mainFeature.overline && (
                    <span className="text-primary-red font-bold">
                      {mainFeature.overline}.{' '}
                    </span>
                  )}
                  {mainFeature.title}
                </h3>

                {mainFeature.excerpt && (
                  <p className="text-dark-gray text-base mb-4 line-clamp-3">
                    {mainFeature.excerpt}
                  </p>
                )}

                {mainFeature.author && (
                  <div className="flex items-center">
                    <p className="text-sm text-dark-gray">
                      Por{' '}
                      <span className="font-medium">{mainFeature.author}</span>
                    </p>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Secondary articles row - 2 articles side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryFeatures.slice(0, 2).map((feature) => (
              <div
                key={feature.id}
                className="overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group h-full"
              >
                <Link
                  href={getArticleUrl(
                    feature.section_path || feature.section,
                    feature.slug,
                  )}
                  className="flex items-center h-full"
                >
                  {/* Text on the left */}
                  <div className="p-4 w-2/3 flex flex-col justify-center">
                    <h4 className="text-lg font-bold mb-2 leading-tight text-[#292929]">
                      {feature.overline && (
                        <span className="text-primary-red font-bold">
                          {feature.overline}.{' '}
                        </span>
                      )}
                      {feature.title}
                    </h4>

                    {feature.author && (
                      <p className="text-sm text-dark-gray mt-auto">
                        Por{' '}
                        <span className="font-medium">{feature.author}</span>
                      </p>
                    )}
                  </div>

                  {/* Image on the right */}
                  <div className="relative w-1/3 aspect-square overflow-hidden">
                    {feature.hasVideo && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                        VIDEO
                      </div>
                    )}
                    <OptimizedImage
                      src={feature.imgUrl}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
