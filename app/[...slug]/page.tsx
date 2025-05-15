import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';

// Import client component with no SSR to avoid hydration mismatch
const ClientSafeImage = dynamic(() => import('@/components/ClientSafeImage'), { ssr: false });

// Initialize Supabase client directly (avoids cookie issues)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define types based on your database schema
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  article?: string;
  status?: string;
  featured?: boolean;
  imgUrl?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  image?: any;
  overline?: string;
  'ig-post'?: string;
  'fb-post'?: string;
  'tw-post'?: string;
  'yt-video'?: string;
  'article-images'?: string;
  url?: string;
  source?: string;
  section?: string;
  'airtable-id'?: string;
  tags?: string;
  social_media_text?: string;
  front?: string;
  order?: string;
}

interface SectionInfo {
  id: string;
  name: string;
  slug: string;
  parent_id: string;
  path: string;
  level: number;
  position: number;
  meta: any;
  breadcrumb_ids: string[];
  breadcrumb_names: string[];
  breadcrumb_slugs: string[];
}

// Type for page params
type PageParams = {
  slug: string[];
};

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: PageParams }
): Promise<Metadata> {
  // The last segment of the URL path is the article slug
  const articleSlug = params.slug[params.slug.length - 1];
  
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', articleSlug)
    .eq('status', 'published')
    .single();
  
  if (!article) {
    return {
      title: 'Article Not Found - Radio del Volga',
      description: 'The requested article could not be found'
    };
  }
  
  return {
    title: `${article.title} - Radio del Volga`,
    description: article.excerpt || `Read ${article.title} on Radio del Volga`,
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.imgUrl ? [{ url: article.imgUrl }] : [],
    },
  };
}

// Breadcrumbs component with null checking
function Breadcrumbs({ section }: { section: SectionInfo }) {
  // Check if breadcrumb_slugs exists before trying to map it
  if (!section || !section.breadcrumb_slugs || !section.breadcrumb_names) {
    return (
      <nav className="text-sm mb-4">
        <ol className="flex flex-wrap items-center">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary-red">
              Inicio
            </Link>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav className="text-sm mb-4">
      <ol className="flex flex-wrap items-center space-x-1">
        <li>
          <Link href="/" className="text-gray-500 hover:text-primary-red">
            Inicio
          </Link>
        </li>
        {section.breadcrumb_slugs.map((slug, index) => (
          <li key={slug} className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <Link 
              href={`/${section.breadcrumb_slugs.slice(0, index + 1).join('/')}`}
              className={`${
                index === section.breadcrumb_slugs.length - 1 
                  ? 'text-primary-red font-medium' 
                  : 'text-gray-500 hover:text-primary-red'
              }`}
            >
              {section.breadcrumb_names[index]}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Simple breadcrumbs when we don't have section data
function SimpleBreadcrumbs({ slugs }: { slugs: string[] }) {
  return (
    <nav className="text-sm mb-4">
      <ol className="flex flex-wrap items-center">
        <li>
          <Link href="/" className="text-gray-500 hover:text-primary-red">
            Inicio
          </Link>
        </li>
        
        {slugs.slice(0, -1).map((slug, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <Link 
              href={`/${slugs.slice(0, index + 1).join('/')}`}
              className="text-gray-500 hover:text-primary-red capitalize"
            >
              {slug.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Function to render social media embeds
function renderSocialMediaEmbeds(article: Article) {
  if (!article) return null;
  
  // Check if any embeds exist
  const hasEmbeds = article['ig-post'] || article['fb-post'] || article['tw-post'] || article['yt-video'];
  if (!hasEmbeds) return null;
  
  return (
    <>
      {/* Instagram embed */}
      {article['ig-post'] && (
        <div className="my-6 instagram-embed">
          <div dangerouslySetInnerHTML={{ __html: article['ig-post'] }} />
        </div>
      )}
      
      {/* Facebook embed */}
      {article['fb-post'] && (
        <div className="my-6 facebook-embed">
          <div dangerouslySetInnerHTML={{ __html: article['fb-post'] }} />
        </div>
      )}
      
      {/* Twitter embed */}
      {article['tw-post'] && (
        <div className="my-6 twitter-embed">
          <div dangerouslySetInnerHTML={{ __html: article['tw-post'] }} />
        </div>
      )}
      
      {/* YouTube embed */}
      {article['yt-video'] && (
        <div className="my-6 aspect-video">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${article['yt-video']}`} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="aspect-video"
          ></iframe>
        </div>
      )}
    </>
  );
}

export default async function ArticlePage({ 
  params 
}: { 
  params: PageParams  
}) {
  // The last segment of the URL path is the article slug
  const articleSlug = params.slug[params.slug.length - 1];
  
  // Fetch the article data
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', articleSlug)
    .eq('status', 'published')
    .single();
  
  if (error || !article) {
    console.error("Article not found:", error);
    notFound();
  }
  
  // Get section info (either from URL or article)
  let sectionSlug = article.section || '';
  
  // Fetch section data for breadcrumbs if we have a section
  let sectionData = null;
  if (sectionSlug) {
    try {
      // Try to get the last part of the section path
      const lastSectionSlug = sectionSlug.split('.').pop() || sectionSlug;
      
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('slug', lastSectionSlug)
        .single();
      
      if (!error && data) {
        sectionData = data;
      } else {
        console.error("Section not found:", error);
      }
    } catch (error) {
      console.error("Error fetching section:", error);
    }
  }
  
  // Format the publication date
  const publishDate = article.published_at 
    ? new Date(article.published_at)
    : null;
    
  const formattedDate = publishDate 
    ? new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(publishDate)
    : null;
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Use full breadcrumbs if we have valid section data with breadcrumb_slugs, otherwise use simple ones */}
      {sectionData && sectionData.breadcrumb_slugs ? (
        <Breadcrumbs section={sectionData} />
      ) : (
        <SimpleBreadcrumbs slugs={params.slug} />
      )}

      <article className="max-w-4xl mx-auto">
        {article.overline && (
          <div className="text-primary-red font-medium mb-2">
            {article.overline}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <div className="text-lg text-gray-700 mb-6">{article.excerpt}</div>
        )}

        <div className="flex items-center text-sm text-gray-600 mb-6">
          {article.source && <span className="mr-4">{article.source}</span>}
          {formattedDate && <time>{formattedDate}</time>}
        </div>

        {article.imgUrl && (
          <div className="relative h-[40vh] md:h-[60vh] mb-8">
            {/* Use client component for the image */}
            <ClientSafeImage
              src={article.imgUrl}
              alt={article.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {/* Social media embeds */}
          {renderSocialMediaEmbeds(article)}
          
          {article.article ? (
            article.article.startsWith('<') ? (
              // If content appears to be HTML, use dangerouslySetInnerHTML
              <div dangerouslySetInnerHTML={{ __html: article.article }} />
            ) : (
              // Otherwise, treat as markdown
              <div
                className="prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl 
                  prose-p:my-4 prose-a:text-primary-red hover:prose-a:underline
                  prose-img:rounded-lg prose-img:my-6 
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-red 
                  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
                  prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6"
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                >
                  {article.article}
                </ReactMarkdown>
              </div>
            )
          ) : (
            <p className="text-gray-600">
              {article.excerpt ||
                'No hay contenido disponible para este artículo.'}
            </p>
          )}
        </div>

        {article.tags && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.split(',').map((tag) => (
                <span
                  key={tag.trim()}
                  className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social media sharing */}
        <div className="mt-8 flex space-x-4">
          <h3 className="text-sm font-medium">Compartir:</h3>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              `https://radiodelvolga.com/${params.slug.join('/')}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              `https://radiodelvolga.com/${params.slug.join('/')}`
            )}&text=${encodeURIComponent(
              article.social_media_text || article.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            Twitter
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${article.title} - https://radiodelvolga.com/${params.slug.join('/')}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800"
          >
            WhatsApp
          </a>
        </div>
      </article>
    </main>
  );
}