'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

type ArticleStats = {
  total: number
  published: number
  draft: number
  featured: number
  recentArticles: {
    id: string
    title: string
    created_at: string
    status: string
  }[]
}

export default function ArticlesStatsCard() {
  const [stats, setStats] = useState<ArticleStats>({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    recentArticles: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        
        // Get total count
        const { count: total, error: errorTotal } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
        
        if (errorTotal) throw errorTotal
        
        // Get published count
        const { count: published, error: errorPublished } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
        
        if (errorPublished) throw errorPublished
        
        // Get draft count
        const { count: draft, error: errorDraft } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'draft')
        
        if (errorDraft) throw errorDraft
        
        // Get featured count
        const { count: featured, error: errorFeatured } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('featured', true)
        
        if (errorFeatured) throw errorFeatured
        
        // Get recent articles
        const { data: recent, error: errorRecent } = await supabase
          .from('articles')
          .select('id, title, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (errorRecent) throw errorRecent
        
        setStats({
          total: total || 0,
          published: published || 0,
          draft: draft || 0,
          featured: featured || 0,
          recentArticles: recent || []
        })
      } catch (err) {
        console.error('Error fetching article stats:', err)
        setError('Failed to load article statistics')
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded mb-3"></div>
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Artículos</h2>
        <Link href="/admin/articles" className="text-primary-red text-sm hover:underline">
          Ver todos
        </Link>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-primary-red text-2xl font-bold">{stats.total}</div>
            <div className="text-gray-500 text-sm">Total</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 text-2xl font-bold">{stats.published}</div>
            <div className="text-gray-500 text-sm">Publicados</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-yellow-600 text-2xl font-bold">{stats.draft}</div>
            <div className="text-gray-500 text-sm">Borradores</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 text-2xl font-bold">{stats.featured}</div>
            <div className="text-gray-500 text-sm">Destacados</div>
          </div>
        </div>
        
        <h3 className="font-medium mb-3">Artículos recientes</h3>
        {stats.recentArticles.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay artículos recientes</p>
        ) : (
          <div className="space-y-3">
            {stats.recentArticles.map(article => (
              <Link 
                key={article.id}
                href={`/admin/articles/${article.id}/view`}
                className="block p-3 rounded-lg border hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium line-clamp-1">{article.title}</div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}