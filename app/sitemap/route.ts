import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  try {
    const baseUrl = 'https://www.radiodelvolga.com.ar'

    // Fetch latest 100 articles for news sitemap
    const { data: articles, error } = await supabase
      .from('article_with_sections')
      .select('slug, section_path, updated_at, created_at, title, description')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching articles for news sitemap:', error)
      return new Response('Error generating sitemap', { status: 500 })
    }

    // Format date for sitemap (YYYY-MM-DD)
    const formatDate = (date: string | Date) => {
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    }

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${(articles || [])
    .map((article: any) => {
      const url = `${baseUrl}/${article.section_path}/${article.slug}`
      const title = article.title || 'Noticia de Coronel Suárez'
      const keywords = article.description
        ? article.description.substring(0, 100)
        : 'coronel suarez, noticias locales'

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${formatDate(article.updated_at || article.created_at)}</lastmod>
    <news:news>
      <news:publication>
        <news:name>Radio del Volga</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${formatDate(article.updated_at || article.created_at)}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
      <news:keywords>${escapeXml(keywords)}</news:keywords>
    </news:news>
  </url>`
    })
    .join('')}
</urlset>`

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating news sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
