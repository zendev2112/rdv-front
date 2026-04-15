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

interface OpinionSectionProps {
  serverData?: Article[]
}

export default function OpinionSection({ serverData }: OpinionSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('OpinionSection', 8)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 8),
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

  const opinionCards = processedArticles.slice(0, 3)
  const featuredOpinion = processedArticles[3]
  const editorials = processedArticles.slice(4, 7)
  const smallOpinionCard = processedArticles[7]

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">OPINIÓN</h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Opinion cards */}
          <div className="space-y-6">
            {opinionCards.map((card) => (
              <Link
                key={card.id}
                href={getArticleUrl(
                  card.section_path || card.section,
                  card.slug,
                )}
                className="flex items-start hover:bg-gray-50 p-3 rounded-md transition-colors duration-300"
              >
                {card.imgUrl && (
                  <div className="mr-4 flex-shrink-0">
                    <OptimizedImage
                      src={card.imgUrl}
                      alt={card.author || card.title}
                      width={60}
                      height={60}
                      className="rounded-full h-14 w-14 object-cover"
                    />
                  </div>
                )}
                <div>
                  {card.author && (
                    <h3 className="font-medium text-dark-gray mb-1">
                      {card.author}
                    </h3>
                  )}
                  <h4 className="font-bold text-lg leading-tight text-[#292929] hover:text-primary-red transition-colors">
                    {card.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

          {/* Center column: Featured opinion */}
          {featuredOpinion && (
            <div className="border-l border-r border-gray-200 px-6">
              <Link
                href={getArticleUrl(
                  featuredOpinion.section_path || featuredOpinion.section,
                  featuredOpinion.slug,
                )}
                className="block group"
              >
                {featuredOpinion.imgUrl && (
                  <div className="mb-4 relative aspect-[4/3] w-full overflow-hidden rounded-md">
                    <OptimizedImage
                      src={featuredOpinion.imgUrl}
                      alt={featuredOpinion.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-4 leading-tight text-[#292929]">
                  {featuredOpinion.overline && (
                    <span className="text-primary-red font-bold">
                      {featuredOpinion.overline}.
                    </span>
                  )}{' '}
                  <span className="hover:text-primary-red transition-colors">
                    {featuredOpinion.title}
                  </span>
                </h3>

                {featuredOpinion.excerpt && (
                  <p className="text-dark-gray mb-4 line-clamp-3">
                    {featuredOpinion.excerpt}
                  </p>
                )}

                {featuredOpinion.author && (
                  <div className="text-sm text-dark-gray">
                    Por {featuredOpinion.author}
                  </div>
                )}
              </Link>
            </div>
          )}

          {/* Right column: Editorials and small card */}
          <div className="space-y-8">
            {/* Editorials */}
            {editorials.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
                <div className="border-l-4 border-primary-red pl-4 py-4 mb-2">
                  <h3 className="text-xl font-bold leading-tight text-[#292929]">
                    EDITORIALES
                  </h3>
                </div>

                <ul className="space-y-0">
                  {editorials.map((editorial, index) => (
                    <li
                      key={editorial.id}
                      className="relative pl-8 pr-4 py-3 border-t border-gray-100 first:border-t-0"
                    >
                      <div className="absolute left-4 top-0 bottom-0 flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary-red mt-4"></div>
                        {index < editorials.length - 1 && (
                          <div className="w-0.5 bg-gray-200 flex-grow"></div>
                        )}
                      </div>

                      <Link
                        href={getArticleUrl(
                          editorial.section_path || editorial.section,
                          editorial.slug,
                        )}
                        className="text-base font-medium leading-tight text-[#292929] hover:text-primary-red transition-colors block"
                      >
                        {editorial.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Small opinion card */}
            {smallOpinionCard && (
              <Link
                href={getArticleUrl(
                  smallOpinionCard.section_path || smallOpinionCard.section,
                  smallOpinionCard.slug,
                )}
                className="block bg-white border border-gray-100 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {smallOpinionCard.author && (
                  <h3 className="text-sm text-dark-gray mb-1">
                    {smallOpinionCard.author}
                  </h3>
                )}
                <h4 className="font-bold text-lg leading-tight text-[#292929] hover:text-primary-red transition-colors">
                  {smallOpinionCard.title}
                </h4>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
