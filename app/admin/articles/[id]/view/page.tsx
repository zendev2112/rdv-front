import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import ArticleEmbeds from '@/app/components/embeds/ArticleEmbeds'

// Helper function for proxying social media images
function getProxiedImageUrl(url: string) {
  if (!url) return '';
  
  if (url.includes('instagram') || 
      url.includes('fbcdn.net') || 
      url.includes('cdninstagram') ||
      url.includes('facebook.com') ||
      url.includes('fbsbx.com') ||
      url.includes('fbcdn.com') ||
      url.includes('scontent') ||
      url.includes('xx.fbcdn')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=placeholder`;
  }
  
  return url;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  excerpt: string | null;
  article: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
  imgUrl: string | null;
  source: string | null;
  overline: string | null;
  section_id: string | null;
  section_name: string | null;
  section_slug: string | null;
  section_parent_id: string | null;
  section_level: number | null;
  url: string | null;
  'ig-post': string | null;
  'fb-post': string | null;
  'tw-post': string | null;
  'yt-video': string | null;
  [key: string]: any; // For bracket notation access
}

interface ParentSection {
  name: string;
  slug: string;
}

export default async function ArticleView({ params }: { params: { id: string } }) {
  // Prevent caching
  noStore();
  
  // Get article ID from route parameters
  const { id } = params;
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false }
    }
  );
  
  // First fetch from article_with_sections view - use the correct columns
  const { data: article, error } = await supabase
    .from('article_with_sections')
    .select(`
      id,
      title,
      slug,
      status,
      excerpt,
      article,
      featured,
      created_at,
      updated_at,
      published_at,
      imgUrl,
      source,
      overline,
      section_id,
      section_name,
      section_slug,
      section_parent_id,
      section_level,
      url,
      ig-post,
      fb-post,
      tw-post,
      yt-video
    `)
    .eq('id', id)
    .single();
  
  // Handle errors
  if (error || !article) {
    console.error('Error fetching article:', error);
    return notFound();
  }
  
  const typedArticle = article as unknown as Article;
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Get parent section info if available
  let parentSection: ParentSection | null = null;
  if (typedArticle.section_parent_id) {
    const { data } = await supabase
      .from('sections')
      .select('name, slug')
      .eq('id', typedArticle.section_parent_id)
      .single();
    
    parentSection = data as ParentSection;
  }
  
  // Fix property names for social media fields (use bracket notation for hyphenated keys)
  const igPost = typedArticle['ig-post'];
  const fbPost = typedArticle['fb-post'];
  const twPost = typedArticle['tw-post'];
  const ytVideo = typedArticle['yt-video'];
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Admin Toolbar */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-3 mb-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <Link 
            href="/admin/articles"
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <span className="text-sm font-medium text-gray-700">Vista previa</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link 
            href={`/admin/articles/${id}`}
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
          >
            Editar
          </Link>
          
          {typedArticle.status === 'published' && typedArticle.section_slug && (
            <a 
              href={`/${typedArticle.section_slug}/${typedArticle.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Ver publicado
            </a>
          )}
          
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            typedArticle.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {typedArticle.status === 'published' ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </div>
      
      {/* Article Container */}
      <article className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Section & Date */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              {typedArticle.section_name && typedArticle.section_id && (
                <Link 
                  href={`/admin/articles?section=${typedArticle.section_id}`}
                  className="text-primary-red hover:text-red-700 font-medium"
                >
                  {parentSection ? `${parentSection.name} › ` : ''}
                  {typedArticle.section_name}
                </Link>
              )}
            </div>
            
            <time dateTime={typedArticle.published_at || typedArticle.created_at}>
              {formatDate(typedArticle.published_at || typedArticle.created_at)}
            </time>
          </div>
          
          {/* Overline */}
          {typedArticle.overline && (
            <div className="text-primary-red font-medium uppercase text-sm tracking-wide mb-2">
              {typedArticle.overline}
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {typedArticle.title}
          </h1>
          
          {/* Author / Source */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            {typedArticle.source && (
              <span>Fuente: <span className="font-medium">{typedArticle.source}</span></span>
            )}
          </div>
        </div>
        
        {/* Featured Image */}
        {typedArticle.imgUrl && (
          <figure className="mb-6">
            <img 
              src={getProxiedImageUrl(typedArticle.imgUrl)} 
              alt={typedArticle.title}
              className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
            />
          </figure>
        )}
        
        {/* Excerpt */}
        {typedArticle.excerpt && (
          <div className="px-6 mb-6">
            <p className="text-lg font-medium text-gray-700 italic leading-relaxed">
              {typedArticle.excerpt}
            </p>
          </div>
        )}
        
        {/* Social Media Embeds - Fixed implementation */}
        <div className="px-6">
          <ArticleEmbeds 
            fbPost={fbPost} 
            igPost={igPost} 
            twPost={twPost} 
            ytVideo={ytVideo} 
          />
        </div>
        
        {/* Content */}
        <div className="px-6 pb-8">
          <div className="prose prose-lg max-w-none">
            {typedArticle.article ? (
              <div dangerouslySetInnerHTML={{ __html: typedArticle.article }} />
            ) : (
              <p className="text-gray-500 italic">No hay contenido disponible.</p>
            )}
          </div>
        </div>
        
        {/* Tags/Categories */}
        {typedArticle.featured && (
          <div className="px-6 pb-6 border-t border-gray-100 pt-4">
            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs mr-2">
              Destacado
            </span>
          </div>
        )}
      </article>
      
      {/* Metadata Panel (Collapsed by Default) */}
      <details className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
        <summary className="px-6 py-3 bg-gray-50 cursor-pointer text-sm font-medium text-gray-700">
          Detalles técnicos
        </summary>
        <div className="p-6">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">ID del artículo:</dt>
            <dd className="text-gray-900">{typedArticle.id}</dd>
            
            <dt className="text-gray-500">Slug:</dt>
            <dd className="text-gray-900">{typedArticle.slug}</dd>
            
            <dt className="text-gray-500">URL de la imagen:</dt>
            <dd className="text-gray-900 truncate">
              {typedArticle.imgUrl || 'Sin imagen'}
            </dd>
            
            <dt className="text-gray-500">Creado:</dt>
            <dd className="text-gray-900">{formatDate(typedArticle.created_at)}</dd>
            
            {typedArticle.published_at && (
              <>
                <dt className="text-gray-500">Publicado:</dt>
                <dd className="text-gray-900">{formatDate(typedArticle.published_at)}</dd>
              </>
            )}
            
            {typedArticle.updated_at && (
              <>
                <dt className="text-gray-500">Actualizado:</dt>
                <dd className="text-gray-900">{formatDate(typedArticle.updated_at)}</dd>
              </>
            )}
            
            <dt className="text-gray-500">URL completa:</dt>
            <dd className="text-gray-900 truncate">
              {typedArticle.status === 'published' && typedArticle.section_slug ? (
                <a 
                  href={`/${typedArticle.section_slug}/${typedArticle.slug}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  /{typedArticle.section_slug}/{typedArticle.slug}
                </a>
              ) : 'No publicado'}
            </dd>
            
            {/* Show social media links if they exist */}
            {fbPost && (
              <>
                <dt className="text-gray-500">Facebook Post:</dt>
                <dd className="text-gray-900 truncate">
                  <a 
                    href={fbPost} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver post
                  </a>
                </dd>
              </>
            )}
            
            {igPost && (
              <>
                <dt className="text-gray-500">Instagram Post:</dt>
                <dd className="text-gray-900 truncate">
                  <a 
                    href={igPost} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver post
                  </a>
                </dd>
              </>
            )}
            
            {twPost && (
              <>
                <dt className="text-gray-500">Twitter Post:</dt>
                <dd className="text-gray-900 truncate">
                  <a 
                    href={twPost} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver tweet
                  </a>
                </dd>
              </>
            )}
            
            {ytVideo && (
              <>
                <dt className="text-gray-500">YouTube Video:</dt>
                <dd className="text-gray-900 truncate">
                  <a 
                    href={ytVideo} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver video
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>
      </details>
    </div>
  );
}