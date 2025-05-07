'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

type SectionItem = {
  name: string;
  path: string;
  children?: SectionItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const router = useRouter()

  // Create the Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkAuth() {
      try {
        // Use getUser directly instead of getSession first
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          // Just redirect to login page instead of showing errors
          router.push('/login')
          return
        }
        
        setIsAuthenticated(true)
        setLoading(false)

        // Set active section based on URL
        const path = window.location.pathname
        const section = path.split('/')[2] || ''
        setActiveSection(section)
      } catch (err) {
        // Just redirect to login on any error
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router, supabase])
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto"></div>
        <p className="mt-3">Cargando...</p>
      </div>
    </div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  }
  
  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  // Main navigation items
  const mainNavItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Artículos', path: '/admin/articles' },
    { name: 'Gestión de Secciones', path: '/admin/sections/management' },
    { name: 'Multimedia', path: '/admin/media' },
    { name: 'Autores', path: '/admin/authors' },
    { name: 'Etiquetas', path: '/admin/tags' },
    { name: 'Constructor', path: '/admin/layout-builder' },
    { name: 'Ajustes', path: '/admin/settings' },
  ]
  
  // Hierarchical section structure
  const sections: SectionItem[] = [
    { name: 'Coronel Suárez', path: 'Coronel Suárez' },
    { 
      name: 'Pueblos Alemanes', 
      path: 'Pueblos Alemanes',
      children: [
        { name: 'Santa Trinidad', path: 'Pueblos Alemanes / Santa Trinidad' },
        { name: 'San José', path: 'Pueblos Alemanes / San José' },
        { name: 'Santa María', path: 'Pueblos Alemanes / Santa María' }
      ]
    },
    { name: 'Huanguelén', path: 'Huanguelén' },
    { name: 'La Sexta', path: 'La Sexta' },
    { name: 'Política', path: 'Política' },
    { 
      name: 'Economía', 
      path: 'Economía',
      children: [
        { name: 'Actualidad', path: 'Economía / IActualidad' },
        { name: 'Dólar', path: 'Economía / Dólar' },
        { name: 'Propiedades', path: 'Economía / Propiedades' },
        { 
          name: 'Pymes y Emprendimientos', 
          path: 'Economía / Pymes y Emprendimientos',
          children: [
            { name: 'Inmuebles', path: 'Economía / Pymes y Emprendimientos / Inmuebles' },
            { name: 'Campos', path: 'Economía / Pymes y Emprendimientos / Campos' },
            { name: 'Construcción y Diseño', path: 'Economía / Pymes y Emprendimientos / Construcción y Diseño' }
          ]
        }
      ]
    },
    { 
      name: 'Agro', 
      path: 'Agro',
      children: [
        { name: 'Agricultura', path: 'Agro / Agricultura' },
        { name: 'Ganadería', path: 'Agro / Ganadería' },
        { name: 'Tecnologías', path: 'Agro / Tecnologías' }
      ]
    },
    { 
      name: 'Sociedad', 
      path: 'Sociedad',
      children: [
        { name: 'Educación', path: 'Sociedad / Educación' },
        { name: 'Policiales', path: 'Sociedad / Policiales' },
        { name: 'Efemérides', path: 'Sociedad / Efemérides' },
        { name: 'Ciencia', path: 'Sociedad / Ciencia' }
      ]
    },
    { 
      name: 'Salud', 
      path: 'Salud',
      children: [
        { name: 'Vida en Armonía', path: 'Salud / Vida en Armonía' },
        { name: 'Nutrición y energía', path: 'Salud / Nutrición y energía' },
        { name: 'Fitness', path: 'Salud / Fitness' },
        { name: 'Salud mental', path: 'Salud / Salud mental' }
      ]
    },
    { name: 'Cultura', path: 'Cultura' },
    { name: 'Opinión', path: 'Opinión' },
    { name: 'Deportes', path: 'Deportes' },
    { 
      name: 'Lifestyle', 
      path: 'Lifestyle',
      children: [
        { name: 'Turismo', path: 'Lifestyle / Turismo' },
        { name: 'Horóscopo', path: 'Lifestyle / Horóscopo' },
        { name: 'Feriados', path: 'Lifestyle / Feriados' },
        { name: 'Loterías y Quinielas', path: 'Lifestyle / Loterías y Quinielas' },
        { name: 'Moda y Belleza', path: 'Lifestyle / Moda y Belleza' },
        { name: 'Mascotas', path: 'Lifestyle / Mascotas' }
      ]
    },
    { name: 'Vinos', path: 'Vinos' }
  ]

  // Recursive function to render section items with proper indentation
  const renderSectionItems = (items: SectionItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.path}>
        {item.children ? (
          <>
            <button 
              onClick={() => toggleCategory(item.path)}
              className={`w-full text-left px-${4 + level * 2} py-2 hover:bg-gray-800 transition-colors flex justify-between items-center`}
            >
              <span>{item.name}</span>
              <span>{expandedCategories[item.path] ? '−' : '+'}</span>
            </button>
            
            {expandedCategories[item.path] && item.children && (
              <div className="bg-gray-800">
                {renderSectionItems(item.children, level + 1)}
              </div>
            )}
          </>
        ) : (
          <Link 
            href={`/admin/sections/${encodeURIComponent(item.path)}`}
            className={`block px-${4 + level * 2} py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors`}
          >
            {item.name}
          </Link>
        )}
      </div>
    ))
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 text-white flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">RDV Admin</h1>
        </div>
        <nav className="flex-grow">
          <div className="py-4">
            <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-400">Menu Principal</p>
            {mainNavItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path} 
                className={`block px-4 py-2 hover:bg-gray-800 transition-colors ${
                  (activeSection === '' && item.path === '/admin') || 
                  (activeSection && item.path.includes(activeSection)) 
                    ? 'bg-gray-800 border-l-4 border-primary-red'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="py-4">
            <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-400">Secciones</p>
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {renderSectionItems(sections)}
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow bg-gray-100 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}