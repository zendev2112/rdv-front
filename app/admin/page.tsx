'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalAuthors: 0,
    totalMedia: 0
  })
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchDashboardData() {
      // Fetch statistics
      const { count: totalArticles } = await supabase
        .from('articles')
        .select('id', { count: 'exact' })
      
      const { count: publishedArticles } = await supabase
        .from('articles')
        .select('id', { count: 'exact' })
        .eq('status', 'published')
      
      const { count: draftArticles } = await supabase
        .from('articles')
        .select('id', { count: 'exact' })
        .eq('status', 'draft')
      
      const { count: totalAuthors } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('role', 'author')
      
      const { count: totalMedia } = await supabase
        .from('media')
        .select('id', { count: 'exact' })
      
      // Fetch recent articles
      const { data: recent } = await supabase
        .from('articles')
        .select('id, title, status, created_at, section, author:profiles(name)')
        .order('created_at', { ascending: false })
        .limit(5)
      
      setStats({
        totalArticles: totalArticles || 0,
        publishedArticles: publishedArticles || 0,
        draftArticles: draftArticles || 0,
        totalAuthors: totalAuthors || 0,
        totalMedia: totalMedia || 0
      })
      
      setRecentArticles(recent || [])
      setLoading(false)
    }
    
    fetchDashboardData()
  }, [])
  
  if (loading) {
    return <div>Cargando datos del panel...</div>
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-600">Artículos</h2>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{stats.totalArticles}</span>
            <span className="text-sm text-gray-500 mb-1">total</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-green-600">{stats.publishedArticles} publicados</span>
            <span className="mx-2">•</span>
            <span className="text-amber-600">{stats.draftArticles} borradores</span>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-600">Autores</h2>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{stats.totalAuthors}</span>
            <span className="text-sm text-gray-500 mb-1">registrados</span>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-600">Multimedia</h2>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{stats.totalMedia}</span>
            <span className="text-sm text-gray-500 mb-1">archivos</span>
          </div>
        </Card>
      </div>
      
      {/* Recent articles */}
      <div className="bg-white shadow-sm rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Artículos Recientes</h2>
          <Link href="/admin/articles" className="text-sm text-primary-red hover:underline">
            Ver todos
          </Link>
        </div>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-semibold">Título</th>
              <th className="text-left py-2 font-semibold">Sección</th>
              <th className="text-left py-2 font-semibold">Autor</th>
              <th className="text-left py-2 font-semibold">Estado</th>
              <th className="text-left py-2 font-semibold">Fecha</th>
              <th className="text-left py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recentArticles.map(article => (
              <tr key={article.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{article.title}</td>
                <td className="py-2">{article.section}</td>
                <td className="py-2">{article.author?.name}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {article.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="py-2">
                  {new Date(article.created_at).toLocaleDateString('es-AR')}
                </td>
                <td className="py-2">
                  <Link href={`/admin/articles/${article.id}`} className="text-primary-red hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Quick actions section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/articles/new" className="bg-white p-4 rounded-md shadow-sm hover:shadow transition-shadow">
            <h3 className="font-semibold">Nuevo Artículo</h3>
            <p className="text-sm text-gray-600 mt-1">Crear y publicar un nuevo artículo</p>
          </Link>
          
          <Link href="/admin/sections/layout" className="bg-white p-4 rounded-md shadow-sm hover:shadow transition-shadow">
            <h3 className="font-semibold">Gestionar Portada</h3>
            <p className="text-sm text-gray-600 mt-1">Organizar artículos en la página principal</p>
          </Link>
          
          <Link href="/admin/media" className="bg-white p-4 rounded-md shadow-sm hover:shadow transition-shadow">
            <h3 className="font-semibold">Subir Multimedia</h3>
            <p className="text-sm text-gray-600 mt-1">Gestionar archivos multimedia</p>
          </Link>
        </div>
      </div>
    </div>
  )
}