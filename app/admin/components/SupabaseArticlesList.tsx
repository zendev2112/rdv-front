'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

type Article = {
  id: string
  title: string
  slug: string
  status: string
  section: string | null
  created_at: string
  updated_at: string
}

export default function SupabaseArticlesList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, slug, status, section, created_at, updated_at')
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (error) throw error
        
        console.log('Fetched articles:', data)
        setArticles(data || [])
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError('Failed to load articles')
      } finally {
        setLoading(false)
      }
    }
    
    fetchArticles()
  }, [supabase])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Artículos en Supabase</h2>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-red mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando artículos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded">
          <p>{error}</p>
          <p className="text-sm mt-2">Verifica la conexión a Supabase y tus credenciales.</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron artículos en la base de datos</p>
          <p className="text-sm mt-1">
            Añade algunos artículos o verifica tu conexión a Supabase.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {article.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link href={`/admin/articles/${article.id}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {article.section || 'Sin sección'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}