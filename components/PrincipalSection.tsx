'use client'

import { useMemo } from 'react'
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
}

interface PrincipalSectionProps {
  serverData?: Article[] // New optional prop for server-side data
}

export default function PrincipalSection({
  serverData,
}: PrincipalSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('PrincipalSection')
  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error
  const processedArticles = useMemo(
    () => sortArticlesForSlots(articles, 6),
    [articles],
  )

  const mainArticle = processedArticles[0]
  const upperRowArticles = processedArticles.slice(1, 3)
  const lowerRowArticles = processedArticles.slice(3, 6)

  if (isLoading && (!mainArticle || articles.length === 0)) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && (!mainArticle || articles.length === 0)) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!mainArticle) {
    return (
      <div className="container mx-auto p-4">
        No principal article available
      </div>
    )
  }

  return (
    <main className="py-0 md:py-6 -mt-16 md:mt-0">
      {/* Main container with CSS Grid - 12 columns with increased gap */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COLUMN - Main article (6 columns) */}
        <div className="md:col-span-6 relative">
          <Link
            href={getArticleUrl(
              mainArticle.section_path || mainArticle.section,
              mainArticle.slug,
            )}
            className="block h-full flex flex-col group"
          >
            {/* Main image - FULL WIDTH on mobile */}
            <div className="relative w-screen md:w-full -mx-4 md:mx-0 -mt-8 md:mt-0 aspect-[4/3] md:aspect-[3/2]">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover object-top transition-opacity duration-300 group-hover:opacity-90"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Main title and excerpt area - CONSISTENT SPACING */}
            <div className="bg-white pt-3 pb-6 md:pb-0">
              <h1 className="font-serif text-xl md:text-2xl font-semibold leading-7 sm:leading-tight">
                {mainArticle.overline && (
                  <span className="text-primary-red font-bold">
                    {mainArticle.overline}.{' '}
                  </span>
                )}
                {mainArticle.title}
              </h1>

              {/* ✅ AUTHOR - MAIN ARTICLE - BELOW EXCERPT */}
              {mainArticle.author && (
                <div className="text-sm text-gray-700 mt-2 font-medium">
                  Por {mainArticle.author}
                </div>
              )}

              <p className="font-serif text-sm md:text-sm text-gray-600 mt-2 leading-6 sm:leading-relaxed">
                {mainArticle.excerpt || 'No excerpt available'}
              </p>
            </div>
          </Link>
          {/* Vertical divider */}
          <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
          {/* Mobile divisory line - MATCHES NEXT ARTICLE WIDTH */}
          <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
        </div>

        {/* RIGHT COLUMN - Contains upper and lower rows (6 columns) */}
        <div className="md:col-span-6 flex flex-col gap-0">
          {/* UPPER ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-0">
            {/* First article */}
            <div className="relative">
              <Link
                href={getArticleUrl(
                  upperRowArticles[0].section_path ||
                    upperRowArticles[0].section,
                  upperRowArticles[0].slug,
                )}
                className="block h-full flex flex-col group"
              >
                {/* Top row first image */}
                <div className="relative w-full aspect-[16/9]">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={upperRowArticles[0].imgUrl}
                      alt={upperRowArticles[0].title}
                      fill
                      className="object-cover object-center transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>
                {/* Title area - CONSISTENT SPACING */}
                <div className="pt-2 pb-6 md:pb-0 flex-1">
                  <h2 className="font-serif text-base md:text-base font-semibold leading-6 sm:leading-tight">
                    {upperRowArticles[0].overline && (
                      <span className="text-primary-red font-bold">
                        {upperRowArticles[0].overline}.{' '}
                      </span>
                    )}
                    {upperRowArticles[0].title}
                  </h2>

                  {upperRowArticles[0].author && (
                    <div className="text-xs text-gray-700 mt-1 font-medium">
                      Por {upperRowArticles[0].author}
                    </div>
                  )}
                </div>
              </Link>
              <div className="absolute top-0 -right-3 w-[1px] h-full bg-gray-400 opacity-30 hidden sm:block"></div>
              {/* Mobile divisory line - MATCHES IMAGE WIDTH */}
              <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
            </div>

            {/* Second article */}
            <div className="relative">
              <Link
                href={getArticleUrl(
                  upperRowArticles[1].section_path ||
                    upperRowArticles[1].section,
                  upperRowArticles[1].slug,
                )}
                className="block h-full flex flex-col group"
              >
                {/* Top row second image */}
                <div className="relative w-full aspect-[16/9]">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={upperRowArticles[1].imgUrl}
                      alt={upperRowArticles[1].title}
                      fill
                      className="object-cover object-center transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>
                {/* Title area - CONSISTENT SPACING */}
                <div className="pt-2 pb-6 md:pb-0 flex-1">
                  <h2 className="font-serif text-base md:text-base font-semibold leading-6 sm:leading-tight">
                    {upperRowArticles[1].overline && (
                      <span className="text-primary-red font-bold">
                        {upperRowArticles[1].overline}.{' '}
                      </span>
                    )}
                    {upperRowArticles[1].title}
                  </h2>

                  {upperRowArticles[1].author && (
                    <div className="text-xs text-gray-700 mt-1 font-medium">
                      Por {upperRowArticles[1].author}
                    </div>
                  )}
                </div>
              </Link>
              {/* Mobile divisory line - MATCHES IMAGE WIDTH */}
            </div>
          </div>

          {/* Horizontal divider */}
          <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 my-6 md:opacity-50"></div>

          {/* LOWER ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {lowerRowArticles.map((article, index) => {
              return (
                <div key={article.id} className="relative">
                  <Link
                    href={getArticleUrl(
                      article.section_path || article.section,
                      article.slug,
                    )}
                    className="block h-full flex flex-col group"
                  >
                    {/* Bottom row images */}
                    <div className="relative w-full aspect-[16/9]">
                      <div className="relative w-full h-full overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                        <OptimizedImage
                          src={article.imgUrl}
                          alt={article.title}
                          fill
                          className="object-cover object-center transition-opacity duration-300 group-hover:opacity-90"
                          sizes="(max-width: 768px) 100vw, 16vw"
                        />
                      </div>
                    </div>
                    {/* Title area - CONSISTENT SPACING */}
                    <div className="pt-2 pb-6 md:pb-0 flex-1">
                      <h2 className="font-serif text-base md:text-base font-semibold leading-6 sm:leading-tight">
                        {article.overline && (
                          <span className="text-primary-red font-bold">
                            {article.overline}.{' '}
                          </span>
                        )}
                        {article.title}
                      </h2>

                      {article.author && (
                        <div className="text-xs text-gray-700 mt-1 font-medium">
                          Por {article.author}
                        </div>
                      )}
                    </div>
                  </Link>
                  {index < lowerRowArticles.length - 1 && (
                    <div className="absolute top-0 -right-3 w-[1px] h-full bg-gray-400 opacity-30 hidden sm:block"></div>
                  )}
                  {/* Mobile divisory line - MATCHES IMAGE WIDTH - ALWAYS SHOW */}
                  <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
