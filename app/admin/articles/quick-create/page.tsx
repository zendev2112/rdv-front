'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Article = {
  id: string
  title: string
  slug: string
  section: string | null
  status: string
  created_at: string
}

export default function QuickCreateArticle() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [section, setSection] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [fetchingArticles, setFetchingArticles] = useState(true)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Fetch recent articles on component mount
  useEffect(() => {
    async function fetchRecentArticles() {
      try {
        setFetchingArticles(true)
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, slug, section, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (error) throw error
        
        setRecentArticles(data || [])
      } catch (err) {
        console.error('Error fetching recent articles:', err)
      } finally {
        setFetchingArticles(false)
      }
    }
    
    fetchRecentArticles()
  }, [supabase])
  
  // The sections you provided
  const sectionOptions = [
    'Coronel Suárez',
    'Pueblos Alemanes / Santa Trinidad',
    'Pueblos Alemanes / San José',
    'Pueblos Alemanes / Santa María',
    'Huanguelén',
    'La Sexta',
    'Política',
    'Economía / IActualidad',
    'Economía / Dólar',
    'Economía / Propiedades',
    'Economía / Pymes y Emprendimientos / Inmuebles',
    'Economía / Pymes y Emprendimientos / Campos',
    'Economía / Pymes y Emprendimientos / Construcción y Diseño',
    'Agro / Agricultura',
    'Agro / Ganadería',
    'Agro / Tecnologías',
    'Sociedad / Educación',
    'Sociedad / Policiales',
    'Sociedad / Efemérides',
    'Sociedad / Ciencia',
    'Salud / Vida en Armonía',
    'Salud / Nutrición y energía',
    'Salud / Fitness',
    'Salud / Salud mental',
    'Cultura',
    'Opinión',
    'Deportes',
    'Lifestyle / Turismo',
    'Lifestyle / Horóscopo',
    'Lifestyle / Feriados',
    'Lifestyle / Loterías y Quinielas',
    'Lifestyle / Moda y Belleza',
    'Lifestyle / Mascotas',
    'Vinos'
  ]

  // Group sections for dropdown
  const groupedSections = sectionOptions.reduce((acc, section) => {
    const parts = section.split(' / ')
    const mainCategory = parts[0]
    
    if (!acc[mainCategory]) {
      acc[mainCategory] = []
    }
    
    acc[mainCategory].push(section)
    return acc
  }, {} as Record<string, string[]>)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Generate a slug from the title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
      
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            title,
            slug,
            article: content,
            section: section || null,
            status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) throw error
      
      console.log('Created article:', data)
      setSuccess('Artículo creado exitosamente')
      
      // Add the new article to the list of recent articles
      if (data && data[0]) {
        setRecentArticles([data[0], ...recentArticles.slice(0, 4)])
      }
      
      // Clear form
      setTitle('')
      setContent('')
      setSection('')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    } catch (err) {
      console.error('Error creating article:', err)
      setError('Error al crear el artículo: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/admin" className="mr-4 text-gray-500 hover:text-gray-700">
            ← Volver
          </Link>
          <h1 className="text-2xl font-bold">Crear artículo rápido</h1>
        </div>
      </div>
      
      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Título del artículo"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sección
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Sin sección</option>
                  
                  {Object.entries(groupedSections).map(([category, sections]) => (
                    <optgroup key={category} label={category}>
                      {sections.map(sectionOption => (
                        <option key={sectionOption} value={sectionOption}>
                          {sectionOption}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="draft"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                      className="form-radio h-4 w-4 text-primary-red"
                    />
                    <span className="ml-2">Borrador</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="published"
                      checked={status === 'published'}
                      onChange={() => setStatus('published')}
                      className="form-radio h-4 w-4 text-primary-red"
                    />
                    <span className="ml-2">Publicado</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded-md h-64"
                  placeholder="Contenido del artículo..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar artículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Recent Articles Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Artículos recientes</h2>
            
            {fetchingArticles ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-red"></div>
              </div>
            ) : recentArticles.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No hay artículos recientes</p>
            ) : (
              <div className="space-y-4">
                {recentArticles.map(article => (
                  <div key={article.id} className="border-b pb-4 last:border-b-0">
                    <Link 
                      href={`/admin/articles/${article.id}`}
                      className="font-medium hover:text-primary-red block mb-1"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                      <span>·</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      {article.section && (
                        <>
                          <span>·</span>
                          <span className="truncate">{article.section}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="pt-2">
                  <Link 
                    href="/admin/articles"
                    className="text-primary-red hover:underline text-sm"
                  >
                    Ver todos los artículos →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}