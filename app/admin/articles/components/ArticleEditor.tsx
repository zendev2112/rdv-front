'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { slugify } from '@/lib/utils' // You'll need to create this utility function

// Import a WYSIWYG editor dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

type ArticleEditorProps = {
  articleId?: string // If provided, we're editing an existing article
}

type ArticleData = {
  title: string
  slug: string
  excerpt: string
  section: string
  article: string
  status: 'draft' | 'published'
  featured: boolean
  imgUrl: string
  overline: string
}

export default function ArticleEditor({ articleId }: ArticleEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)
  const [sections, setSections] = useState<string[]>([])
  
  const [formData, setFormData] = useState<ArticleData>({
    title: '',
    slug: '',
    excerpt: '',
    section: '',
    article: '',
    status: 'draft',
    featured: false,
    imgUrl: '',
    overline: ''
  })
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch article data if editing
  useEffect(() => {
    async function fetchArticle() {
      if (!articleId) return
      
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single()
        
        if (error) throw error
        
        if (data) {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            section: data.section || '',
            article: data.article || '',
            status: data.status || 'draft',
            featured: data.featured || false,
            imgUrl: data.imgUrl || '',
            overline: data.overline || ''
          })
          
          // If we have a custom slug, disable auto-generation
          if (data.slug && data.slug !== slugify(data.title)) {
            setAutoSlug(false)
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    
    async function fetchSections() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('section')
          .not('section', 'is', null)
        
        if (error) throw error
        
        if (data) {
          // Extract unique sections
          const uniqueSections = Array.from(
            new Set(data.map(item => item.section).filter(Boolean))
          ) as string[]
          setSections(uniqueSections)
        }
      } catch (err) {
        console.error('Error fetching sections:', err)
      }
    }
    
    fetchArticle()
    fetchSections()
  }, [articleId, supabase])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Auto-generate slug when title changes if autoSlug is enabled
    if (name === 'title' && autoSlug) {
      setFormData(prev => ({
        ...prev,
        slug: slugify(value)
      }))
    }
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handleEditorChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      article: value
    }))
  }
  
  const handleSlugToggle = () => {
    setAutoSlug(!autoSlug)
    if (autoSlug) {
      // If turning off auto-slug, don't change the current slug
    } else {
      // If turning on auto-slug, regenerate from current title
      setFormData(prev => ({
        ...prev,
        slug: slugify(prev.title)
      }))
    }
  }
  
  const handleNewSection = (newSection: string) => {
    if (!newSection.trim() || sections.includes(newSection)) return
    
    setSections([...sections, newSection])
    setFormData(prev => ({
      ...prev,
      section: newSection
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    
    try {
      const articleData = {
        ...formData,
        updated_at: new Date().toISOString(),
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      }
      
      let result
      
      if (articleId) {
        // Update existing article
        result = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId)
      } else {
        // Create new article
        result = await supabase
          .from('articles')
          .insert([{
            ...articleData,
            created_at: new Date().toISOString()
          }])
      }
      
      if (result.error) throw result.error
      
      // Redirect to articles list
      router.push('/admin/articles')
      router.refresh()
    } catch (err) {
      console.error('Error saving article:', err)
      setError('Failed to save article')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        {articleId ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <button
                type="button"
                onClick={handleSlugToggle}
                className="text-xs text-blue-600"
              >
                {autoSlug ? 'Editar manualmente' : 'Generar automáticamente'}
              </button>
            </div>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
              disabled={autoSlug}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extracto
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sección
            </label>
            <div className="flex gap-2">
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="flex-grow p-2 border rounded-md"
              >
                <option value="">Seleccionar sección</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
              
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const newSection = prompt('Ingresa el nombre de la nueva sección:')
                    if (newSection) handleNewSection(newSection)
                  }}
                  className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  + Nueva
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen principal (URL)
            </label>
            <input
              type="text"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            {formData.imgUrl && (
              <div className="mt-2">
                <img 
                  src={formData.imgUrl} 
                  alt="Preview" 
                  className="h-40 object-cover rounded"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overline
            </label>
            <input
              type="text"
              name="overline"
              value={formData.overline}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contenido
            </label>
            {typeof window !== 'undefined' && (
              <ReactQuill
                theme="snow"
                value={formData.article}
                onChange={handleEditorChange}
                className="h-64 mb-12"
              />
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-red focus:ring-primary-red border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Destacado
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
          >
            {isSaving ? 'Guardando...' : articleId ? 'Guardar cambios' : 'Crear artículo'}
          </button>
        </div>
      </form>
    </div>
  )
}