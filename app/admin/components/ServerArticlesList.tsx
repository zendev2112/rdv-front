import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ServerArticlesList({ showAll = false }) {
  // Use service role key to bypass RLS
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  )
  
  // Use the article_with_sections view to get proper section names
  const query = supabase
    .from('article_with_sections')
    .select(`
      id, 
      title, 
      slug, 
      status, 
      featured, 
      created_at, 
      section_id,
      section_name
    `)
    .order('created_at', { ascending: false })
  
  // Only limit if we're showing preview on dashboard
  if (!showAll) {
    query.limit(10)
  }
  
  const { data: articles, error } = await query
  
  if (error) {
    console.error('Error fetching articles:', error)
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Artículos</h2>
        <div className="bg-red-50 text-red-600 p-4 rounded">
          Error al cargar artículos: {error.message}
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {!showAll && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Artículos recientes</h2>
          <Link 
            href="/admin/articles/new" 
            className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700"
          >
            Nuevo artículo
          </Link>
        </div>
      )}
      
      {!articles || articles.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay artículos</p>
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
              
              <div className="text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs">
                    {article.section_name || 'Sin sección'}
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
      
      {!showAll && (
        <div className="mt-4 text-right">
          <Link 
            href="/admin/articles" 
            className="text-primary-red hover:underline text-sm"
          >
            Ver todos los artículos →
          </Link>
        </div>
      )}
    </div>
  )
}