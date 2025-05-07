'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    section: '',
    status: '',
    search: ''
  })
  
  const searchParams = useSearchParams()
  const initialSection = searchParams.get('section') || ''
  
  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Fetch sections first
  useEffect(() => {
    async function loadSections() {
      try {
        const { data, error } = await supabase
          .from('sections')
          .select('id, name, slug')
          .order('name')
        
        if (error) throw error
        setSections(data || [])
      } catch (err) {
        console.error('Failed to load sections:', err)
      }
    }
    
    loadSections()
  }, [])
  
  // Fetch articles function
  async function fetchArticles() {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with query parameters
      const url = new URL('/api/articles', window.location.origin);
      
      // Add filter parameters if they exist
      if (filters.section) url.searchParams.append('section', filters.section);
      if (filters.status) url.searchParams.append('status', filters.status);
      if (filters.search) url.searchParams.append('search', filters.search);
      
      // Fetch from our secure API endpoint
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      setArticles(data || []);
      
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Error fetching articles: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }
  
  // Fetch articles when filters change
  useEffect(() => {
    // Add debounce for search to avoid too many requests
    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters]); // Re-fetch when filters change
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de artículos</h1>
        <Link 
          href="/admin/articles/new" 
          className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700"
        >
          Nuevo artículo
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full md:w-auto border rounded px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
            <select 
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              className="w-full md:w-auto border rounded px-3 py-2"
            >
              <option value="">Todas</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-auto flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input 
              type="text" 
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Buscar por título" 
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div className="w-full md:w-auto self-end">
            <button 
              onClick={fetchArticles}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refrescar
            </button>
          </div>
        </div>
      </div>
      
      {/* Articles List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          Cargando artículos...
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-red-50 text-red-600 p-4 rounded">
            {error}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          {articles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No se encontraron artículos
            </p>
          ) : (
            <div className="space-y-3">
              {articles.map(article => (
                <div key={article.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div className="font-medium">{article.title || 'Sin título'}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs">
                        {article.section_name || article.section || 'Sin sección'}
                      </span>
                      
                      {article.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                          Destacado
                        </span>
                      )}
                      
                      <span>•</span>
                      <span>{new Date(article.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
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
      )}
    </div>
  )
}