import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ServerArticleStats() {
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
  
  // Get total count
  const { count: total, error: errorTotal } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
  
  // Get published count
  const { count: published, error: errorPublished } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
  
  // Get draft count
  const { count: draft, error: errorDraft } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')
  
  // Get featured count
  const { count: featured, error: errorFeatured } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('featured', true)
  
  // Get recent articles
  const { data: recent, error: errorRecent } = await supabase
    .from('articles')
    .select('id, title, created_at, status')
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (errorTotal || errorPublished || errorDraft || errorFeatured || errorRecent) {
    console.error('Error fetching stats:', 
      errorTotal || errorPublished || errorDraft || errorFeatured || errorRecent)
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Estadísticas de artículos</h2>
        <div className="bg-red-50 text-red-600 p-4 rounded">
          Error al cargar estadísticas
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Artículos</h2>
        <Link href="/admin/articles" className="text-primary-red text-sm hover:underline">
          Ver todos
        </Link>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-primary-red text-2xl font-bold">{total || 0}</div>
            <div className="text-gray-500 text-sm">Total</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 text-2xl font-bold">{published || 0}</div>
            <div className="text-gray-500 text-sm">Publicados</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-yellow-600 text-2xl font-bold">{draft || 0}</div>
            <div className="text-gray-500 text-sm">Borradores</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 text-2xl font-bold">{featured || 0}</div>
            <div className="text-gray-500 text-sm">Destacados</div>
          </div>
        </div>
        
        <h3 className="font-medium mb-3">Artículos recientes</h3>
        {!recent || recent.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay artículos recientes</p>
        ) : (
          <div className="space-y-3">
            {recent.map(article => (
              <Link 
                key={article.id}
                href={`/admin/articles/${article.id}/view`}
                className="block p-3 rounded-lg border hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium line-clamp-1">{article.title}</div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(article.created_at).toLocaleDateString('es-ES')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}