'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Article = {
  id: string
  title: string
  slug: string
  status: string
  featured: boolean
  imgUrl: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  section: string | null
  excerpt: string | null
}

type SectionData = {
  name: string
  articles: Article[]
}

export default function SectionsPage() {
  const [sectionData, setSectionData] = useState<SectionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchSections() {
      try {
        setLoading(true)
        
        // First fetch all published articles
        const { data: articles, error } = await supabase
          .from('articles')
          .select('*')
          .order('updated_at', { ascending: false })
        
        if (error) throw error
        
        if (!articles || articles.length === 0) {
          setSectionData([])
          return
        }
        
        // Group articles by section
        const sectionMap = new Map<string, Article[]>()
        
        // Add "Sin sección" group for null/undefined sections
        sectionMap.set('Sin sección', [])
        
        // Populate the map with articles grouped by section
        articles.forEach((article: Article) => {
          const sectionName = article.section || 'Sin sección'
          
          if (!sectionMap.has(sectionName)) {
            sectionMap.set(sectionName, [])
          }
          
          sectionMap.get(sectionName)!.push(article)
        })
        
        // Convert map to array for rendering
        const sectionArray = Array.from(sectionMap).map(([name, articles]) => ({
          name,
          articles
        }))
        
        // Sort sections alphabetically, but keep "Sin sección" at the end
        sectionArray.sort((a, b) => {
          if (a.name === 'Sin sección') return 1
          if (b.name === 'Sin sección') return -1
          return a.name.localeCompare(b.name)
        })
        
        setSectionData(sectionArray)
      } catch (err) {
        console.error('Error fetching sections:', err)
        setError('Failed to load sections')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSections()
  }, [supabase])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Artículos por Sección</h1>
        <Link 
          href="/admin/articles/new"
          className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700"
        >
          Nuevo Artículo
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : sectionData.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No hay artículos disponibles.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sectionData.map((section) => (
            <div key={section.name} className="bg-white rounded-lg shadow">
              <div className="border-b p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">{section.name}</h2>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  {section.articles.length} artículo{section.articles.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {section.articles.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No hay artículos en esta sección.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {section.articles.map((article) => (
                    <div 
                      key={article.id} 
                      className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {article.imgUrl && (
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={article.imgUrl} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{article.title}</h3>
                          <span className={`ml-2 px-2 text-xs rounded-full ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status === 'published' ? 'Publicado' : 'Borrador'}
                          </span>
                        </div>
                        
                        {article.excerpt && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(article.updated_at).toLocaleDateString()}
                          </span>
                          
                          <Link 
                            href={`/admin/articles/${article.id}`}
                            className="text-primary-red text-sm hover:underline"
                          >
                            Editar
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}