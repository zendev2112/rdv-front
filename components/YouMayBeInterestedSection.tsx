'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface YouMayBeInterestedSectionProps {
  currentArticleId: string
  currentSectionPath: string
}

export default function YouMayBeInterestedSection({
  currentArticleId,
  currentSectionPath,
}: YouMayBeInterestedSectionProps) {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(
          `https://btpuvblcktpeplfkwcbr.supabase.co/rest/v1/article_with_sections?section_path=neq.${currentSectionPath}&order=created_at.desc&limit=15`,
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
            .slice(0, 12)
          setArticles(filtered)
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [currentArticleId, currentSectionPath])

  if (loading || articles.length === 0) return null

  return (
    <section className="py-12 border-t border-gray-200 mt-16">
      {/* ✅ H2 TITLE + DIVISORY LINE - EXACT SAME AS PAGE.TSX */}
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 text-left px-4 md:px-0 -ml-3 md:ml-0">
          Te puede interesar
        </h2>
        <div className="border-t border-gray-300 my-4 px-4 md:px-0"></div>
      </div>

      {/* ✅ RESPONSIVE GRID: 1 COLUMN MOBILE, 3 MD, 3 LG - INCREASED GAP */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 px-4 md:px-0">
        {articles.map((article) => {
          return (
            <Link
              key={article.id}
              href={`/${article.section_path.replace(/\./g, '/')}/${
                article.slug
              }`}
              className="group mb-8 md:mb-0"
            >
              {/* ✅ IMAGE - FULL WIDTH MOBILE, NO OFFSET */}
              {article.imgUrl && (
                <div className="relative w-full md:w-full aspect-[3/2] overflow-hidden bg-gray-100 md:rounded-lg mb-3 md:mb-3">
                  <Image
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                    className="object-cover group-hover:opacity-75 transition-opacity duration-300"
                  />
                </div>
              )}

              {/* ✅ TITLE - NO EXTRA PADDING ON MOBILE */}
              <h3 className="font-serif text-base font-bold text-gray-900 px-0 md:px-0 text-left">
                {article.overline && (
                  <span className="text-base font-semibold text-primary-red">
                    {article.overline}.{' '}
                  </span>
                )}
                {article.title}
              </h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
