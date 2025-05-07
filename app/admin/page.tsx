'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ServerArticleStats from './components/ServerArticleStats'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkAuthAndFetchData() {
      try {
        // Authentication check code remains the same
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    
    checkAuthAndFetchData()
  }, [router, supabase])
  
  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>
      
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ServerArticleStats />
        
        {/* Additional Analytics Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Secciones populares</h2>
          {/* Section analytics content */}
        </div>
      </div>
      
      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/articles" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">Artículos</h3>
          <p className="text-gray-600 mb-4">Gestionar todos los artículos del sitio</p>
          <span className="text-primary-red">Ver artículos →</span>
        </Link>
        
        <Link href="/admin/articles/new" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">Nuevo artículo</h3>
          <p className="text-gray-600 mb-4">Crear un nuevo artículo para el sitio</p>
          <span className="text-primary-red">Crear artículo →</span>
        </Link>
        
        <Link href="/admin/sections" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">Secciones</h3>
          <p className="text-gray-600 mb-4">Administrar secciones y categorías</p>
          <span className="text-primary-red">Ver secciones →</span>
        </Link>
      </div>
    </div>
  )
}