'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchArticlesBySection } from '@/lib/supabase'
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

  // Get the last section slug from the path
  const sectionSlug = sectionPath.split('.').pop()?.replace(/_/g, '-') || ''
  const sectionName = getProperSpanishName(sectionSlug, { plural: true })

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const result = await fetchArticlesBySection(sectionPath, 1, 5)
        const filtered = result.articles
          .filter((a: any) => a.id !== currentArticleId)
          .slice(0, 4)
        setArticles(filtered)
      } catch (error) {
        console.error('Error fetching related articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [sectionPath, currentArticleId])

  if (loading) return <div className="text-gray-400 text-xs">Cargando...</div>

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h3 className="text-sm font-bold mb-3 text-primary-red">
        Más leídas de {sectionName}
      </h3>

      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.section_path.replace(/\./g, '/')}/${article.slug}`}
            className="block hover:text-primary-red transition group"
          >
            {article.imgUrl && (
              <div className="relative h-16 w-full mb-2 rounded overflow-hidden">
                <Image
                  src={article.imgUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <p className="text-xs font-medium text-gray-900 group-hover:text-primary-red line-clamp-2">
              {article.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(article.created_at).toLocaleDateString('es-AR')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
