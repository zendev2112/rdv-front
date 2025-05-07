'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: string
  featured: boolean
  imgUrl: string | null
  section: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export default function ArticlesDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState('all')
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // The exact sections you provided
  const sections = [
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

  // Categorize sections for better UI organization
  const sectionCategories = {
    'Localidades': [
      'Coronel Suárez',
      'Pueblos Alemanes / Santa Trinidad',
      'Pueblos Alemanes / San José',
      'Pueblos Alemanes / Santa María',
      'Huanguelén',
      'La Sexta'
    ],
    'Economía': [
      'Política',
      'Economía / IActualidad',
      'Economía / Dólar',
      'Economía / Propiedades',
      'Economía / Pymes y Emprendimientos / Inmuebles',
      'Economía / Pymes y Emprendimientos / Campos',
      'Economía / Pymes y Emprendimientos / Construcción y Diseño'
    ],
    'Agro': [
      'Agro / Agricultura',
      'Agro / Ganadería',
      'Agro / Tecnologías'
    ],
    'Sociedad': [
      'Sociedad / Educación',
      'Sociedad / Policiales',
      'Sociedad / Efemérides',
      'Sociedad / Ciencia'
    ],
    'Salud': [
      'Salud / Vida en Armonía',
      'Salud / Nutrición y energía',
      'Salud / Fitness',
      'Salud / Salud mental'
    ],
    'Otros': [
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
  }

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        
        let query = supabase
          .from('articles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(20)
        
        if (selectedSection !== 'all') {
          if (selectedSection === 'none') {
            query = query.is('section', null)
          } else {
            query = query.eq('section', selectedSection)
          }
        }
        
        const { data, error } = await query
        
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
  }, [selectedSection, supabase])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Artículos en Supabase</h1>
        <Link 
          href="/admin"
          className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700"
        >
          Volver al Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-lg font-semibold mb-4">Selecciona una sección</h2>
        
        <div className="mb-6">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">Todas las secciones</option>
            <option value="none">Sin sección</option>
            <optgroup label="──────────────────────────"></optgroup>
            
            {Object.entries(sectionCategories).map(([category, sectionList]) => (
              <optgroup key={category} label={category}>
                {sectionList.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando artículos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <p className="text-gray-500">No hay artículos en esta sección</p>
            {selectedSection !== 'all' && (
              <button
                onClick={() => setSelectedSection('all')}
                className="mt-2 text-primary-red hover:underline"
              >
                Ver todas las secciones
              </button>
            )}
          </div>
        ) : (
          <div>
            <h3 className="font-semibold mb-4">
              {articles.length} artículo{articles.length !== 1 ? 's' : ''} encontrado{articles.length !== 1 ? 's' : ''}
            </h3>
            
            <div className="divide-y">
              {articles.map((article) => (
                <div key={article.id} className="py-4">
                  <div className="flex items-start gap-4">
                    {article.imgUrl && (
                      <img 
                        src={article.imgUrl} 
                        alt={article.title}
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'
                        }}
                      />
                    )}
                    
                    <div className="flex-grow">
                      <h4 className="text-lg font-bold">{article.title}</h4>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                        
                        {article.featured && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Destacado
                          </span>
                        )}
                        
                        {article.section && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {article.section}
                          </span>
                        )}
                      </div>
                      
                      {article.excerpt && (
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">
                          Actualizado: {format(new Date(article.updated_at), 'dd MMM yyyy', { locale: es })}
                        </span>
                        
                        <div className="space-x-2">
                          <Link 
                            href={`/admin/articles/${article.id}/view`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Ver
                          </Link>
                          <Link 
                            href={`/admin/articles/${article.id}`}
                            className="text-indigo-600 hover:underline text-sm"
                          >
                            Editar
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Secciones Disponibles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sectionCategories).map(([category, sectionList]) => (
            <div key={category} className="p-4 border rounded-md">
              <h3 className="font-semibold text-lg mb-2">{category}</h3>
              <ul className="space-y-1 text-sm">
                {sectionList.map(section => (
                  <li key={section}>
                    <button
                      onClick={() => setSelectedSection(section)}
                      className="text-blue-600 hover:underline text-left"
                    >
                      {section}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}