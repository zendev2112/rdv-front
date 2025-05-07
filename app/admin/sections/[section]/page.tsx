'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function SectionDetailPage() {
  const [articles, setArticles] = useState([])
  const [childSections, setChildSections] = useState([])
  const [sectionInfo, setSectionInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const router = useRouter()
  
  const sectionPath = decodeURIComponent(params.section as string)
  const sectionSlug = sectionPath.split(' / ').pop() // Get the last part of the path
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // 1. First, get the current section information
        const { data: sectionData, error: sectionError } = await supabase
          .from('sections')
          .select('id, name, slug, description')
          .eq('id', sectionSlug)
          .single()
        
        if (sectionError) {
          console.error('Error fetching section info:', sectionError)
          // Continue even if we can't find the section info
        } else {
          setSectionInfo(sectionData)
        }
        
        // 2. Find all articles directly in this section
        const { data: articlesData, error: articlesError } = await supabase
          .from('article_with_sections') // Use the view that joins articles with sections
          .select('id, title, slug, status, featured, created_at, section_name')
          .eq('section_slug', sectionSlug) // Use the section slug to find articles
          .order('created_at', { ascending: false })
        
        if (articlesError) throw articlesError
        setArticles(articlesData || [])
        
        // 3. Find all child sections by querying the sections table directly
        const { data: childSectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('id, name, slug, path')
          .eq('parent_id', sectionSlug)
        
        if (sectionsError) throw sectionsError
        
        setChildSections(childSectionsData || [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching section data:', err)
        setError(err.message)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [sectionPath, sectionSlug, supabase])

  // Rest of your component remains the same, but update the rendering to use 
  // section_name from the fetched articles and proper section info

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/sections/management" className="text-gray-500 hover:text-gray-700 mr-2">
          <span>←</span> Volver a la gestión de secciones
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">
        Sección: {sectionInfo?.name || sectionSlug}
        {sectionInfo?.description && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({sectionInfo.description})
          </span>
        )}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Articles in this section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Artículos en esta sección</h2>
              <Link 
                href={`/admin/articles/new?section=${encodeURIComponent(sectionSlug)}`}
                className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700"
              >
                Nuevo artículo en esta sección
              </Link>
            </div>
            
            {articles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay artículos directamente en esta sección
              </p>
            ) : (
              <div className="space-y-3">
                {articles.map(article => (
                  <div key={article.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div className="font-medium">{article.title}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    
                    {/* Display section name from the join */}
                    <div className="text-sm text-gray-500 mt-1">
                      Sección: {article.section_name || 'Sin sección'}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t flex justify-end space-x-2">
                      <Link 
                        href={`/admin/articles/${article.id}/view`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Ver
                      </Link>
                      <Link 
                        href={`/admin/articles/${article.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Child sections */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Subsecciones</h2>
            
            {childSections.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay subsecciones
              </p>
            ) : (
              <div className="space-y-2">
                {childSections.map((section, index) => (
                  <Link
                    key={index}
                    href={`/admin/sections/${encodeURIComponent(section.id)}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                  >
                    {section.name}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <Link
                href={`/admin/sections/management?parent=${encodeURIComponent(sectionSlug)}`}
                className="text-primary-red hover:underline"
              >
                Añadir subsección →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}