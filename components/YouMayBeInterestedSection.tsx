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
      <h2 className="text-2xl font-bold mb-8 uppercase text-gray-900">
        Te puede interesar
      </h2>

      {/* ✅ 3x4 GRID - 12 ARTICLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => {
          return (
            <Link
              key={article.id}
              href={`/${article.section_path.replace(/\./g, '/')}/${
                article.slug
              }`}
              className="group"
            >
              {/* ✅ IMAGE */}
              {article.imgUrl && (
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-lg mb-3">
                  <Image
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* ✅ OVERLINE. TITLE - ON SAME LINE */}
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-red transition-colors line-clamp-3">
                {article.overline && (
                  <span className="text-xs font-semibold text-primary-red uppercase tracking-wide">
                    {article.overline}.
                  </span>
                )}{' '}
                {article.title}
              </h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
