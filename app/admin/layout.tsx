'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login') // Redirect to login page
        return
      }
      
      // Optional: Check if user has admin role
      const { data: user } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        
      if (user?.role !== 'admin') {
        router.push('/') // Redirect non-admins
        return
      }
      
      setIsAuthenticated(true)
      setLoading(false)

      // Set active section based on URL
      const path = window.location.pathname
      const section = path.split('/')[2] || ''
      setActiveSection(section)
    }
    
    checkAuth()
  }, [router])
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto"></div>
        <p className="mt-3">Cargando...</p>
      </div>
    </div>
  }
  
  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Artículos', path: '/admin/articles' },
    { name: 'Secciones', path: '/admin/sections' },
    { name: 'Multimedia', path: '/admin/media' },
    { name: 'Autores', path: '/admin/authors' },
    { name: 'Etiquetas', path: '/admin/tags' },
    { name: 'Constructor', path: '/admin/layout-builder' },
    { name: 'Ajustes', path: '/admin/settings' },
  ]
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">RDV Admin</h1>
        </div>
        <nav className="flex-grow">
          <ul className="py-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
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
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow bg-gray-100">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}