'use client'

import React, { useMemo, useEffect } from 'react'
import Link from 'next/link'
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

interface ActualidadSectionProps {
  serverData?: Article[]
}

function getSectionPath(section: string | undefined): string {
  if (!section) return 'sin-categoria'
  if (section.includes('.')) return section.split('.').join('/')
  return section
}

export default function ActualidadSection({
  serverData,
}: ActualidadSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('ActualidadSection', 8)

  const articles =
    serverData && serverData.length > 0 ? serverData : clientArticles
  const isLoading = !serverData && loading
  const hasError = !serverData && error

  // --- Same processing logic as PueblosAlemanesSection but for 8 articles ---
  const processedArticles = useMemo(() => {
    if (!articles.length) return []

    const sorted = [...articles].sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : 0
    )

    const principalArticle = sorted.find((a) => a.order === 'principal')
    const secundarioArticle = sorted.find((a) => a.order === 'secundario')
    const normalArticle = sorted.find((a) => a.order === 'normal')

    // Remove already selected articles
    let rest = sorted.filter(
      (a) =>
        a.id !== principalArticle?.id &&
        a.id !== secundarioArticle?.id &&
        a.id !== normalArticle?.id
    )

    // Compose slots: [main, side1, side2, side3, bottom1, bottom2, bottom3, bottom4]
    const slots: (Article | undefined)[] = [
      principalArticle || rest.shift(),
      rest.shift(),
      rest.shift(),
      secundarioArticle || rest.shift(),
      normalArticle || rest.shift(),
      rest.shift(),
      rest.shift(),
      rest.shift(),
    ]

    return slots.filter(Boolean) // Remove undefined slots
  }, [articles])

  // Debug logs
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ActualidadSection - Layout:')
      console.log(
        'Main (0):',
        processedArticles[0]?.title,
        `(${processedArticles[0]?.order || 'no-order'})`
      )
      console.log(
        'Side Articles (1-3):',
        processedArticles.slice(1, 4).map((a) => a?.title)
      )
      console.log(
        'Bottom Row (4-7):',
        processedArticles.slice(4, 8).map((a) => a?.title)
      )
    }
  }, [processedArticles])

  if (isLoading && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">Loading actualidad...</div>
    )
  }

  if (hasError && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-red-500">{error}</div>
    )
  }

  // Extract articles: 1 main + 3 side + 4 bottom
  const [mainArticle, ...restArticles] = processedArticles
  const sideArticles = restArticles.slice(0, 3)
  const bottomArticles = restArticles.slice(3, 7)

  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      {/* Header */}
      <div className="mb-6 border-b border-light-gray pb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-5 w-1 bg-primary-red mr-3" />
          <h2 className="text-xl font-bold uppercase">Actualidad</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main article */}
        {mainArticle && (
          <div className="w-full relative bg-white rounded-md overflow-visible group md:w-2/5 md:overflow-hidden">
            <Link
              href={`/${getSectionPath(mainArticle.section)}/${
                mainArticle.slug
              }`}
              className="block h-full flex flex-col"
            >
              <div className="relative w-screen -mx-4 p-0 md:w-full md:mx-0 md:p-4 h-64 md:h-80">
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
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
                </div>
              </div>
            </Link>
            {/* vertical divider */}
            <div className="absolute top-0 -right-3 w-px h-full bg-gray-300 opacity-80"></div>
          </div>
        )}

        {/* vertical divider between main and side articles */}
        <div className="hidden md:block w-px bg-gray-300 opacity-80 mx-6"></div>

        {/* Side articles (3 items) */}
        <div className="md:w-3/5 flex flex-col md:-mt-4">
          {sideArticles.map((article, idx) => (
            <React.Fragment key={article.id}>
              <div className="bg-white rounded-md overflow-hidden group">
                <Link
                  href={`/${getSectionPath(article.section)}/${article.slug}`}
                  className="flex flex-col md:flex-row flex-1 w-full"
                >
                  {/* text left */}
                  <div className="flex-1 flex flex-col justify-between p-4 order-2 md:order-1">
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
                    </div>
                  </div>
                  {/* image right */}
                  <div className="relative w-full md:w-1/3 p-4 pb-1 order-1 md:order-2">
                    <div className="relative w-full h-48 sm:h-32 overflow-hidden rounded">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded" />
                      <OptimizedImage
                        src={article.imgUrl}
                        alt={article.title}
                        fill
                        className="object-cover md:rounded transition-opacity duration-300 group-hover:opacity-90"
                        sizes="(max-width: 768px) 100vw, 20vw"
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

      {/* Bottom row: 4 articles spanning full width */}
      {bottomArticles.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {bottomArticles.map((article, idx) => (
              <div
                key={article.id}
                className={`
            flex flex-col h-full px-4 py-2
            ${
              idx !== bottomArticles.length - 1
                ? 'border-r border-gray-200'
                : ''
            }
          `}
              >
                <Link
                  href={`/${getSectionPath(article.section)}/${article.slug}`}
                  className="flex flex-col h-full group"
                >
                  {/* Square image */}
                  <div className="relative w-full aspect-square bg-gray-200 mb-3">
                    <OptimizedImage
                      src={article.imgUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h5 className="text-base font-bold leading-tight text-[#292929]">
                      {article.overline && (
                        <span className="text-primary-red font-bold">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h5>
                    <div className="text-xs text-dark-gray mt-auto">
                      {article.author && <>Por {article.author}</>}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
