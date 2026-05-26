import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const baseUrl = 'https://www.radiodelvolga.com.ar'

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return new Response('Missing env vars', { status: 500 })
  }

  // Google News sitemap: only articles from the last 2 days
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()

  const { data: articles, error } = await supabase
    .from('article_with_sections')
    .select('slug, section_path, section, created_at, updated_at, title')
    .eq('status', 'published')
    .gte('created_at', twoDaysAgo)
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error) {
    return new Response(`Supabase error: ${JSON.stringify(error)}`, { status: 500 })
  }

  const formatDate = (date: string) => new Date(date).toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${(articles || [])
  .map((article: any) => {
    const sectionUrl = article.section_path
      ? article.section_path.split('.').map((p: string) => p.replace(/_/g, '-')).join('/')
      : article.section || ''
    const url = `${baseUrl}/${sectionUrl}/${article.slug}`

    return `  <url>
    <loc>${escapeXml(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>Radio del Volga</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${formatDate(article.created_at)}</news:publication_date>
      <news:title>${escapeXml(article.title || '')}</news:title>
    </news:news>
  </url>`
  })
  .join('\n')}
</urlset>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
