import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { unstable_noStore as noStore } from 'next/cache'

// Define a proper type for searchParams
type SearchParams = {
  section?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | string[] | undefined;
};

/**
 * Formats image URLs to handle Instagram and other problematic sources
 * @param {string} url The original image URL
 * @returns {string} A properly formatted URL that will display correctly
 */
function getProxiedImageUrl(url: string) {
  // Skip processing if no URL provided
  if (!url) return '';
  
  // Check if this is a social media URL that needs proxying
  if (url.includes('instagram') || 
      url.includes('fbcdn.net') || 
      url.includes('cdninstagram') ||
      url.includes('facebook.com') ||
      url.includes('fbsbx.com') ||
      url.includes('fbcdn.com') ||
      url.includes('scontent') ||
      url.includes('xx.fbcdn')) {
    // Use a reliable public image proxy service
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=placeholder`;
  }
  
  return url;
}

export default async function ServerArticlesList({ 
  showAll = false,
  searchParams = {} as SearchParams
}) {
  // Prevent caching of this component to always show fresh data
  noStore();

  // Extract search parameters with proper typing
  const section = searchParams.section || '';
  const status = searchParams.status || '';
  const search = searchParams.search || '';
  const dateFrom = searchParams.dateFrom || '';
  const dateTo = searchParams.dateTo || '';

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
  
  // Use the article_with_sections view with additional fields
  let query = supabase
    .from('article_with_sections')
    .select(`
      id, 
      title, 
      slug, 
      status, 
      featured, 
      created_at,
      published_at,
      "imgUrl",
      source,
      section_id,
      section_name,
      section_slug,
      section_parent_id,
      section_level
    `) // Removed social media fields and excerpt
    .order('created_at', { ascending: false })
  
  // Apply filters if provided
  if (section) {
    query = query.eq('section_id', section);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }
  
  // Apply date filters
  if (dateFrom) {
    query = query.gte('created_at', dateFrom);
  }
  
  if (dateTo) {
    // Add one day to include the end date fully
    const nextDay = new Date(dateTo);
    nextDay.setDate(nextDay.getDate() + 1);
    const dateToPlusOne = nextDay.toISOString().split('T')[0];
    query = query.lt('created_at', dateToPlusOne);
  }
  
  // Only limit if we're showing preview on dashboard and no filters applied
  if (!showAll && !section && !status && !search && !dateFrom && !dateTo) {
    query.limit(10)
  }
  
  const { data: articles, error } = await query
  
  // Fetch parent section names for hierarchical display
  let sectionNamesMap = {}
  if (articles && articles.some(a => a.section_parent_id)) {
    const parentIds = Array.from(new Set(
      articles
        .filter(a => a.section_parent_id)
        .map(a => a.section_parent_id)
    ))
    
    if (parentIds.length > 0) {
      const { data: parentSections } = await supabase
        .from('sections')
        .select('id, name')
        .in('id', parentIds)
      
      if (parentSections) {
        sectionNamesMap = Object.fromEntries(
          parentSections.map(s => [s.id, s.name])
        )
      }
    }
  }
  
  // Get all sections for filter dropdown
  const { data: allSections } = await supabase
    .from('sections')
    .select('id, name')
    .order('name', { ascending: true })
  
  if (error) {
    console.error('Error fetching articles:', error)
    return (
      <div className="bg-white rounded-lg shadow p-3">
        <h2 className="text-base font-semibold mb-2">Artículos</h2>
        <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
          Error al cargar artículos: {error.message}
        </div>
      </div>
    )
  }
  
  // Format publication date nicely - shorter version without time
  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  // Display active filters
  const hasFilters = section || status || search || dateFrom || dateTo;
  
  return (
    <div className="bg-white rounded-lg shadow p-3">
      {/* Show filter form when viewing all articles */}
      {showAll && (
        <div className="mb-3">
          <form className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div>
              <label htmlFor="section" className="block text-xs font-medium text-gray-700 mb-1">
                Sección
              </label>
              <select 
                id="section" 
                name="section" 
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                defaultValue={section}
              >
                <option value="">Todas</option>
                {allSections?.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select 
                id="status" 
                name="status" 
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                defaultValue={status}
              >
                <option value="">Todos</option>
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                defaultValue={dateFrom}
              />
            </div>
            
            <div>
              <label htmlFor="dateTo" className="block text-xs font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                defaultValue={dateTo}
              />
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-xs"
              >
                Filtrar
              </button>
            </div>
          </form>

          {/* Search field in separate row */}
          <div className="mt-2">
            <div className="relative">
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Buscar por título"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 pr-16 text-sm"
                defaultValue={search}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full bg-gray-200 px-3 rounded-r-md text-gray-700 text-xs font-medium hover:bg-gray-300"
              >
                Buscar
              </button>
            </div>
          </div>
          
          {/* Active filters display */}
          {hasFilters && (
            <div className="mt-2 flex flex-wrap items-center text-xs gap-1">
              <span className="text-gray-500">Filtros:</span>
              {section && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {allSections?.find(s => s.id === section)?.name || section}
                  <Link href={`?${new URLSearchParams({
                    ...(status ? { status } : {}),
                    ...(search ? { search } : {}),
                    ...(dateFrom ? { dateFrom } : {}),
                    ...(dateTo ? { dateTo } : {})
                  })}`} className="ml-1 text-blue-500 hover:text-blue-700">×</Link>
                </span>
              )}
              
              {status && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 text-green-800">
                  {status === 'published' ? 'Publicado' : 'Borrador'}
                  <Link href={`?${new URLSearchParams({
                    ...(section ? { section } : {}),
                    ...(search ? { search } : {}),
                    ...(dateFrom ? { dateFrom } : {}),
                    ...(dateTo ? { dateTo } : {})
                  })}`} className="ml-1 text-green-500 hover:text-green-700">×</Link>
                </span>
              )}
              
              {dateFrom && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Desde: {dateFrom}
                  <Link href={`?${new URLSearchParams({
                    ...(section ? { section } : {}),
                    ...(status ? { status } : {}),
                    ...(search ? { search } : {}),
                    ...(dateTo ? { dateTo } : {})
                  })}`} className="ml-1 text-amber-500 hover:text-amber-700">×</Link>
                </span>
              )}
              
              {dateTo && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Hasta: {dateTo}
                  <Link href={`?${new URLSearchParams({
                    ...(section ? { section } : {}),
                    ...(status ? { status } : {}),
                    ...(search ? { search } : {}),
                    ...(dateFrom ? { dateFrom } : {})
                  })}`} className="ml-1 text-amber-500 hover:text-amber-700">×</Link>
                </span>
              )}
              
              {search && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {search}
                  <Link href={`?${new URLSearchParams({
                    ...(section ? { section } : {}),
                    ...(status ? { status } : {}),
                    ...(dateFrom ? { dateFrom } : {}),
                    ...(dateTo ? { dateTo } : {})
                  })}`} className="ml-1 text-purple-500 hover:text-purple-700">×</Link>
                </span>
              )}
              
              <Link 
                href="/admin/articles" 
                className="ml-1 text-xs text-red-600 hover:underline"
              >
                Limpiar
              </Link>
            </div>
          )}
        </div>
      )}
      
      {!showAll && (
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-medium">Artículos recientes</h2>
          <Link 
            href="/admin/articles/new" 
            className="px-2 py-1 bg-primary-red text-white rounded text-xs hover:bg-red-700"
          >
            Nuevo artículo
          </Link>
        </div>
      )}
      
      {!articles || articles.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-gray-500 text-sm">No se encontraron artículos{hasFilters ? ' con los filtros seleccionados' : ''}.</p>
          {hasFilters && (
            <Link href="/admin/articles" className="text-blue-600 hover:underline text-xs">
              Ver todos los artículos
            </Link>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {articles.map(article => (
            <div key={article.id} className="py-4 hover:bg-gray-50 rounded-md px-3 transition duration-150">
              <div className="flex items-start gap-4">
                {/* Larger Thumbnail with better proportions */}
                {article.imgUrl ? (
                  <div className="flex-shrink-0">
                    <img 
                      src={getProxiedImageUrl(article.imgUrl)} 
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-md shadow-sm border border-gray-200"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="flex-grow min-w-0">
                  {/* Title and status */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium line-clamp-2">{article.title}</h3>
                    <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full ${
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  
                  {/* Section and date info */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                        {article.section_parent_id && sectionNamesMap[article.section_parent_id] ? 
                          `${sectionNamesMap[article.section_parent_id]} › ${article.section_name}` : 
                          article.section_name || 'Sin sección'}
                      </span>
                      {article.featured && (
                        <span className="inline-block px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Destacado
                        </span>
                      )}
                    </div>
                    
                    <span className="whitespace-nowrap">
                      {formatDate(article.published_at || article.created_at)}
                    </span>
                  </div>
                </div>
                
                {/* Actions with social media share option */}
                <div className="ml-2 flex flex-col items-end space-y-1.5">
                  <div className="flex space-x-1">
                    <Link 
                      href={`/admin/articles/${article.id}/view`}
                      className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                    >
                      Ver
                    </Link>
                    <Link 
                      href={`/admin/articles/${article.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-xs bg-indigo-50 px-2 py-1 rounded"
                    >
                      Editar
                    </Link>
                  </div>
                  

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!showAll && articles && articles.length > 0 && (
        <div className="mt-2 text-right">
          <Link 
            href="/admin/articles" 
            className="text-primary-red hover:underline text-xs"
          >
            Ver todos →
          </Link>
        </div>
      )}
    </div>
  )
}