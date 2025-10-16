'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useArticles } from '../hooks/useArticles' 
import OptimizedImage from './OptimizedImage' // Import the new component
import { getArticleUrl } from '@/lib/utils';


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
}

interface PrincipalSectionProps {
  serverData?: Article[] // New optional prop for server-side data
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
  const previousArticlesRef = useRef<Article[]>([])
  // We'll use a separate ref to track the lower row positions
  const lowerRowOrderRef = useRef<string[]>([])
  const [layout, setLayout] = useState({
    main: null,
    upper: [null, null],
    lower: [],
  })

  // Replace your entire processedArticles useMemo with this simpler version

  const processedArticles = useMemo(() => {
    // For first load, keep your existing initialization code
    if (previousArticlesRef.current.length === 0) {
      console.log('🔄 INITIAL LAYOUT - First Load')

      // Create a map of articles by their explicit orders
      const articlesByOrder = {
        principal: articles.filter((a) => a.order === 'principal'),
        secundario: articles.filter((a) => a.order === 'secundario'),
        normal: articles.filter((a) => a.order === 'normal'),
        other: articles.filter(
          (a) =>
            !a.order ||
            (a.order !== 'principal' &&
              a.order !== 'secundario' &&
              a.order !== 'normal')
        ),
      }

      // Sort each category by creation date
      Object.keys(articlesByOrder).forEach((key) => {
        articlesByOrder[key].sort((a, b) => {
          if (a.created_at && b.created_at) {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
          }
          return 0
        })
      })

      // Create initial layout ensuring we always have 6 positions
      const initialLayout = []
      const allAvailableArticles = [
        ...articlesByOrder.principal,
        ...articlesByOrder.secundario,
        ...articlesByOrder.normal,
        ...articlesByOrder.other,
      ]

      // Position 0: Principal
      if (articlesByOrder.principal.length > 0) {
        initialLayout.push({ ...articlesByOrder.principal[0] })
      } else if (allAvailableArticles.length > 0) {
        initialLayout.push({ ...allAvailableArticles[0], order: 'principal' })
      }

      // Position 1: Secundario
      if (articlesByOrder.secundario.length > 0) {
        initialLayout.push({ ...articlesByOrder.secundario[0] })
      } else {
        const available = allAvailableArticles.filter(
          (a) => !initialLayout.some((laid) => laid.id === a.id)
        )
        if (available.length > 0) {
          initialLayout.push({ ...available[0], order: 'secundario' })
        }
      }

      // Position 2: Normal
      if (articlesByOrder.normal.length > 0) {
        initialLayout.push({ ...articlesByOrder.normal[0] })
      } else {
        const available = allAvailableArticles.filter(
          (a) => !initialLayout.some((laid) => laid.id === a.id)
        )
        if (available.length > 0) {
          initialLayout.push({ ...available[0], order: 'normal' })
        }
      }

      // Positions 3-5: Lower row (fill remaining positions)
      const usedIds = new Set(initialLayout.map((a) => a.id))
      const remainingForLower = allAvailableArticles.filter(
        (a) => !usedIds.has(a.id)
      )

      for (let i = 0; i < 3 && i < remainingForLower.length; i++) {
        const lowerArticle = { ...remainingForLower[i] }
        delete lowerArticle.order
        initialLayout.push(lowerArticle)
      }

      // Update tracking
      const lowerRowArticles = initialLayout.slice(3)
      lowerRowOrderRef.current = lowerRowArticles.map((article) => article.id)

      return initialLayout
    }

    // Find new articles
    const newArticles = articles.filter(
      (article) =>
        !previousArticlesRef.current.some(
          (prevArticle) => prevArticle.id === article.id
        )
    )

    // If no new articles, return previous layout
    if (newArticles.length === 0) {
      return previousArticlesRef.current
    }

    console.log(
      '🆕 NEW ARTICLES DETECTED:',
      newArticles.length,
      newArticles.map((a) => a.title)
    )

    // **FIXED DISPLACEMENT LOGIC**
    const newArticle = newArticles[0]
    const newArticleType = newArticle.order || 'principal'

    // Get current layout positions
    const currentPrincipal = previousArticlesRef.current[0] // Position 0
    const currentSecundario = previousArticlesRef.current[1] // Position 1
    const currentNormal = previousArticlesRef.current[2] // Position 2
    const currentLower = previousArticlesRef.current.slice(3) // Positions 3-5

    // Create new layout array with exactly 6 positions
    const newLayout = new Array(6).fill(null)

    if (newArticleType === 'principal' || !newArticleType) {
      console.log('📊 NEW PRINCIPAL ARTICLE')

      // Position 0: New principal
      newLayout[0] = { ...newArticle, order: 'principal' }

      // Position 1: Former principal becomes secundario
      if (currentPrincipal) {
        newLayout[1] = { ...currentPrincipal, order: 'secundario' }
      }

      // Position 2: Former secundario becomes normal
      if (currentSecundario) {
        newLayout[2] = { ...currentSecundario, order: 'normal' }
      }

      // Positions 3-5: Former normal + existing lower articles
      let lowerIndex = 3
      if (currentNormal && lowerIndex < 6) {
        const normalToLower = { ...currentNormal }
        delete normalToLower.order
        newLayout[lowerIndex++] = normalToLower
      }

      // Add existing lower articles
      for (let i = 0; i < currentLower.length && lowerIndex < 6; i++) {
        const article = { ...currentLower[i] }
        delete article.order
        newLayout[lowerIndex++] = article
      }
    } else if (newArticleType === 'secundario') {
      console.log('📊 NEW SECUNDARIO ARTICLE')

      // Position 0: Keep principal
      newLayout[0] = currentPrincipal

      // Position 1: New secundario
      newLayout[1] = { ...newArticle, order: 'secundario' }

      // Position 2: Former secundario becomes normal
      if (currentSecundario) {
        newLayout[2] = { ...currentSecundario, order: 'normal' }
      }

      // Positions 3-5: Former normal + existing lower articles
      let lowerIndex = 3
      if (currentNormal && lowerIndex < 6) {
        const normalToLower = { ...currentNormal }
        delete normalToLower.order
        newLayout[lowerIndex++] = normalToLower
      }

      for (let i = 0; i < currentLower.length && lowerIndex < 6; i++) {
        const article = { ...currentLower[i] }
        delete article.order
        newLayout[lowerIndex++] = article
      }
    } else if (newArticleType === 'normal') {
      console.log('📊 NEW NORMAL ARTICLE')

      // Positions 0-1: Keep principal and secundario
      newLayout[0] = currentPrincipal
      newLayout[1] = currentSecundario

      // Position 2: New normal
      newLayout[2] = { ...newArticle, order: 'normal' }

      // Positions 3-5: Former normal + existing lower articles
      let lowerIndex = 3
      if (currentNormal && lowerIndex < 6) {
        const normalToLower = { ...currentNormal }
        delete normalToLower.order
        newLayout[lowerIndex++] = normalToLower
      }

      for (let i = 0; i < currentLower.length && lowerIndex < 6; i++) {
        const article = { ...currentLower[i] }
        delete article.order
        newLayout[lowerIndex++] = article
      }
    }

    // **CRITICAL FIX**: Fill any remaining null positions with available articles
    const usedIds = new Set(newLayout.filter(Boolean).map((a) => a.id))
    const availableArticles = articles.filter((a) => !usedIds.has(a.id))

    for (let i = 0; i < newLayout.length; i++) {
      if (newLayout[i] === null && availableArticles.length > 0) {
        const fallbackArticle = { ...availableArticles.shift() }

        // Assign appropriate order based on position
        if (i === 0) fallbackArticle.order = 'principal'
        else if (i === 1) fallbackArticle.order = 'secundario'
        else if (i === 2) fallbackArticle.order = 'normal'
        else delete fallbackArticle.order // Lower row

        newLayout[i] = fallbackArticle
      }
    }

    // Filter out any remaining nulls and update tracking
    const filteredLayout = newLayout.filter(Boolean)
    const lowerRowArticles = filteredLayout.slice(3)
    lowerRowOrderRef.current = lowerRowArticles.map((a) => a.id)

    // Save for next time
    previousArticlesRef.current = filteredLayout

    return filteredLayout
  }, [articles])

  // Add this NEW useEffect for detecting new articles from SWR
  useEffect(() => {
    // Reset displacement logic when we get completely new data set
    if (articles.length > 0 && previousArticlesRef.current.length === 0) {
      console.log(
        '🆕 SWR provided initial articles, ready for displacement logic'
      )
    }

    if (articles.length > 0 && previousArticlesRef.current.length > 0) {
      const existingIds = new Set(previousArticlesRef.current.map((a) => a.id))
      const hasNewArticles = articles.some((a) => !existingIds.has(a.id))

      if (hasNewArticles) {
        console.log(
          '🆕 SWR detected new articles, displacement logic will trigger'
        )
        // The processedArticles useMemo will handle the displacement automatically
      }
    }
  }, [articles])

  // Add this after the useEffect and before your return statements

  // Get main article (Principal)
  const mainArticle = processedArticles.find(
    (article) => article.order === 'principal'
  )

  // IMPORTANT: Very precisely select upper row articles
  const secundarioArticle = processedArticles.find(
    (article) => article.order === 'secundario'
  )
  const normalArticle = processedArticles.find(
    (article) => article.order === 'normal'
  )

  // Create array with exactly these two articles in correct order
  const upperRowArticles = []
  if (secundarioArticle) upperRowArticles.push(secundarioArticle)
  if (normalArticle) upperRowArticles.push(normalArticle)

  // Get lower row articles using a simpler, more reliable approach
  const lowerRowArticles = processedArticles.filter((article) => {
    // An article is in the lower row if:
    // 1. It has no order property at all (order property has been deleted)
    // 2. AND its ID is in the lowerRowOrderRef.current array
    return (
      !Object.prototype.hasOwnProperty.call(article, 'order') &&
      lowerRowOrderRef.current.includes(article.id)
    )
  })

  // Sort them according to lowerRowOrderRef order
  lowerRowArticles.sort((a, b) => {
    const indexA = lowerRowOrderRef.current.indexOf(a.id)
    const indexB = lowerRowOrderRef.current.indexOf(b.id)
    return indexA - indexB
  })

  // Fallback only if absolutely necessary
  if (lowerRowArticles.length === 0) {
    const fallbackLowerRow = processedArticles
      .filter(
        (article) => !Object.prototype.hasOwnProperty.call(article, 'order')
      )
      .slice(0, 3)

    // Make sure these have no order property
    fallbackLowerRow.forEach((article) => {
      delete article.order
    })

    lowerRowArticles.push(...fallbackLowerRow)
  }

  // MOVE DEBUG USEEFFECT HERE - before any conditional returns
  // Debug logs for article movement (can be removed in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PrincipalSection - Current Layout:')
      console.log('Main Article:', mainArticle?.title)
      console.log(
        'Upper Row:',
        upperRowArticles.map((a) => ({
          id: a.id,
          title: a.title,
          order: a.order,
        }))
      )
      console.log(
        'Lower Row:',
        lowerRowArticles.map((a) => ({ id: a.id, title: a.title }))
      )
      console.log('Lower Row Order:', lowerRowOrderRef.current)
    }
  }, [mainArticle, upperRowArticles, lowerRowArticles])

  // UPDATED: Change loading to isLoading, error to hasError
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

  // UPDATED: Change loading to isLoading, error to hasError
  if (isLoading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (hasError && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  return (
    <main className="py-6">
      {/* Main container with CSS Grid - INCREASED gap to 8 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COLUMN - Main article (6 columns) */}
        <div className="md:col-span-6 relative">
          <Link
            href={getArticleUrl(
              mainArticle.section_path || mainArticle.section,
              mainArticle.slug
            )}
            className="block h-full flex flex-col group"
          >
            {/* Main image - takes most of the space */}
            <div className="relative w-full aspect-[4/3] md:aspect-[3/2]">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                <OptimizedImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Main title and excerpt area */}
            <div className="bg-white pt-3">
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                {mainArticle.overline && (
                  <span className="text-primary-red">
                    {mainArticle.overline}.{' '}
                  </span>
                )}
                {mainArticle.title}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
                {mainArticle.excerpt || 'No excerpt available'}
              </p>
            </div>
          </Link>
          {/* Vertical divider - ADJUSTED position for larger gap */}
          <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
        </div>

        {/* RIGHT COLUMN - Contains upper and lower rows (6 columns) */}
        <div className="md:col-span-6 flex flex-col gap-0">
          {/* UPPER ROW - INCREASED gap to 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-0">
            {/* First article */}
            <div className="relative">
              <Link
                href={getArticleUrl(
                  upperRowArticles[0].section_path ||
                    upperRowArticles[0].section,
                  upperRowArticles[0].slug
                )}
                className="block h-full flex flex-col group"
              >
                {/* Top row first image - landscape 16:9 */}
                <div className="relative w-full aspect-[16/9]">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={upperRowArticles[0].imgUrl}
                      alt={upperRowArticles[0].title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>
                {/* Title area */}
                <div className="pt-2 flex-1">
                  <h2 className="text-sm md:text-base font-bold leading-tight">
                    {upperRowArticles[0].overline && (
                      <span className="text-primary-red">
                        {upperRowArticles[0].overline}.{' '}
                      </span>
                    )}
                    {upperRowArticles[0].title}
                  </h2>
                </div>
              </Link>
              <div className="absolute top-0 -right-3 w-[1px] h-full bg-gray-400 opacity-30 hidden sm:block"></div>
            </div>

            {/* Second article */}
            <div className="relative">
              <Link
                href={getArticleUrl(
                  upperRowArticles[1].section_path ||
                    upperRowArticles[1].section,
                  upperRowArticles[1].slug
                )}
                className="block h-full flex flex-col group"
              >
                {/* Top row second image - landscape 16:9 */}
                <div className="relative w-full aspect-[16/9]">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={upperRowArticles[1].imgUrl}
                      alt={upperRowArticles[1].title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>
                {/* Title area */}
                <div className="pt-2 flex-1">
                  <h2 className="text-sm md:text-base font-bold leading-tight">
                    {upperRowArticles[1].overline && (
                      <span className="text-primary-red">
                        {upperRowArticles[1].overline}.{' '}
                      </span>
                    )}
                    {upperRowArticles[1].title}
                  </h2>
                </div>
              </Link>
            </div>
          </div>

          {/* Horizontal divider - INCREASED margin */}
          <div className="w-full h-[1px] bg-gray-400 opacity-50 my-6 hidden md:block"></div>

          {/* LOWER ROW - INCREASED gap to 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {lowerRowArticles.map((article, index) => {
              return (
                <div key={article.id} className="relative">
                  <Link
                    href={getArticleUrl(
                      article.section_path || article.section,
                      article.slug
                    )}
                    className="block h-full flex flex-col group"
                  >
                    {/* Bottom row images - landscape 16:9 */}
                    <div className="relative w-full aspect-[16/9]">
                      <div className="relative w-full h-full overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                        <OptimizedImage
                          src={article.imgUrl}
                          alt={article.title}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                          sizes="(max-width: 768px) 100vw, 16vw"
                        />
                      </div>
                    </div>
                    {/* Title area - matched font size with upper row */}
                    <div className="pt-2 flex-1">
                      <h2 className="text-sm md:text-base font-bold leading-tight">
                        {article.overline && (
                          <span className="text-primary-red">
                            {article.overline}.{' '}
                          </span>
                        )}
                        {article.title}
                      </h2>
                    </div>
                  </Link>
                  {index < lowerRowArticles.length - 1 && (
                    <div className="absolute top-0 -right-3 w-[1px] h-full bg-gray-400 opacity-30 hidden sm:block"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
