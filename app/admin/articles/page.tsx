'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSection, setFilterSection] = useState('all')
  const [sections, setSections] = useState([])
  
  const pageSize = 15
  
  useEffect(() => {
    // Fetch available sections for filter
    async function fetchSections() {
      const { data } = await supabase
        .from('sections')
        .select('id, name, slug')
        .order('name')
      
      setSections(data || [])
    }
    
    fetchSections()
  }, [])
  
  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      
      // Count query for pagination
      let countQuery = supabase
        .from('articles')
        .select('id', { count: 'exact' })
        
      // Base data query
      let query = supabase
        .from('articles')
        .select(`
          id, 
          title, 
          slug,
          status, 
          created_at, 
          published_at,
          section,
          author:profiles(id, name)
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1)
      
      // Apply filters
      if (searchQuery) {
        countQuery = countQuery.ilike('title', `%${searchQuery}%`)
        query = query.ilike('title', `%${searchQuery}%`)
      }
      
      if (filterStatus !== 'all') {
        countQuery = countQuery.eq('status', filterStatus)
        query = query.eq('status', filterStatus)
      }
      
      if (filterSection !== 'all') {
        countQuery = countQuery.eq('section', filterSection)
        query = query.eq('section', filterSection)
      }
      
      const [countResult, dataResult] = await Promise.all([
        countQuery,
        query
      ])
      
      setTotalPages(Math.ceil((countResult.count || 0) / pageSize))
      setArticles(dataResult.data || [])
      setLoading(false)
    }
    
    fetchArticles()
  }, [currentPage, searchQuery, filterStatus, filterSection])
  
  function handleSearch(e) {
    e.preventDefault()
    setCurrentPage(0) // Reset to first page on new search
    // Search query is already captured by the input's onChange
  }
  
  function handleFilterChange(type, value) {
    setCurrentPage(0) // Reset to first page on new filter
    if (type === 'status') {
      setFilterStatus(value)
    } else if (type === 'section') {
      setFilterSection(value)
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Artículos</h1>
        <Link href="/admin/articles/new">
          <Button>Nuevo Artículo</Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-grow min-w-[200px]">
            <Input
              type="text"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select
            value={filterStatus}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </Select>
          
          <Select
            value={filterSection}
            onChange={(e) => handleFilterChange('section', e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">Todas las secciones</option>
            {sections.map(section => (
              <option key={section.id} value={section.slug}>
                {section.name}
              </option>
            ))}
          </Select>
          
          <Button type="submit">Buscar</Button>
        </form>
      </div>
      
      {/* Articles table */}
      <div className="bg-white rounded-md shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-2">Cargando artículos...</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Título</th>
                  <th className="text-left p-4 font-semibold">Sección</th>
                  <th className="text-left p-4 font-semibold">Autor</th>
                  <th className="text-left p-4 font-semibold">Estado</th>
                  <th className="text-left p-4 font-semibold">Fecha</th>
                  <th className="text-left p-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No se encontraron artículos
                    </td>
                  </tr>
                ) : (
                  articles.map(article => (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Link href={`/admin/articles/${article.id}`} className="hover:text-primary-red">
                          {article.title}
                        </Link>
                      </td>
                      <td className="p-4">{article.section}</td>
                      <td className="p-4">{article.author?.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {article.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="p-4">
                        {new Date(article.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/articles/${article.id}`} className="text-primary-red hover:underline">
                            Editar
                          </Link>
                          <Link href={`/articulo/${article.slug}`} target="_blank" className="text-gray-600 hover:underline">
                            Ver
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 flex justify-between items-center border-t">
                <div>
                  Página {currentPage + 1} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    variant="outline"
                    size="sm"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    variant="outline"
                    size="sm"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}