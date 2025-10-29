'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProperSpanishName } from '@/lib/spanishGrammar'

interface RelatedArticlesSidebarProps {
  currentArticleId: string
  sectionPath: string
}

export default function RelatedArticlesSidebar({
  currentArticleId,
  sectionPath,
}: RelatedArticlesSidebarProps) {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const sectionSlug = sectionPath.split('.').pop()?.replace(/_/g, '-') || ''
  const sectionName = getProperSpanishName(sectionSlug, { plural: true })

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(
          `https://btpuvblcktpeplfkwcbr.supabase.co/rest/v1/article_with_sections?section_path=eq.${sectionPath}&order=created_at.desc&limit=5`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            },
          }
        )

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          const filtered = data
            .filter((a: any) => a.id !== currentArticleId)
            .slice(0, 4)
          setArticles(filtered)
        }
      } catch (error) {
        console.error('Error fetching related articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [sectionPath, currentArticleId])

  if (loading) return <div className="text-gray-400 text-xs">Cargando...</div>

  if (articles.length === 0) {
    return (
      <div className="p-2">
        <p className="text-xs text-gray-500">No hay artículos disponibles</p>
      </div>
    )
  }

  return (
    <div className="pl-4 pt-0">
      {/* ✅ HEADER - TITLE + NAVIGATION ICON */}
      <div className="flex items-center justify-between py-3 pr-3 pl-0 border-b border-gray-200 -mt-3">
        <h3 className="text-base font-bold text-gray-900 leading-tight">
          Más leídas de {sectionName}
        </h3>
        <svg
          className="w-4 h-4 text-primary-red flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* ✅ FEATURED ITEM (#1) */}
      {articles[0] && (
        <Link
          href={`/${articles[0].section_path
            .replace(/\./g, '/')
            .replace(/_/g, '-')}/${articles[0].slug}`}
          className="block border-b border-gray-200 group"
        >
          {/* Full-width image */}
          {articles[0].imgUrl && (
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
              <Image
                src={articles[0].imgUrl}
                alt={articles[0].title}
                fill
                sizes="100vw"
                className="object-cover group-hover:opacity-60 transition-opacity"
              />
            </div>
          )}

          {/* Content with number and title - PERFECTLY ALIGNED */}
          <div className="py-3 pr-3 pl-0 flex gap-3 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-black text-gray-900">1</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{articles[0].title}</p>
            </div>
          </div>
        </Link>
      )}

      {/* ✅ LIST ITEMS (#2, #3, #4) - 3-COLUMN LAYOUT */}
      {articles.slice(1, 4).map((article, index) => (
        <Link
          key={article.id}
          href={`/${article.section_path
            .replace(/\./g, '/')
            .replace(/_/g, '-')}/${article.slug}`}
          className="flex gap-3 py-3 pr-0 pl-0 border-b border-gray-200 group last:border-b-0 items-center"
        >
          {/* ✅ COLUMN 1: NUMBER - BLACK */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-black text-gray-900">
              {index + 2}
            </span>
          </div>

          {/* ✅ COLUMN 2: TEXT - COMPLETE, NO BOLD */}
          <div className="flex-1">
            <p className="text-sm text-gray-900">{article.title}</p>
          </div>

          {/* ✅ COLUMN 3: THUMBNAIL - BIGGER, NO ROUNDED CORNERS */}
          {article.imgUrl && (
            <div className="flex-shrink-0 w-28 h-24 overflow-hidden bg-gray-100">
              <Image
                src={article.imgUrl}
                alt={article.title}
                width={112}
                height={96}
                sizes="112px"
                className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
              />
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
