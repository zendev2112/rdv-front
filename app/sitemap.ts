import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.radiodelvolga.com.ar'

  // Fetch all articles
  const { data: articles } = await supabase
    .from('article_with_sections')
    .select('slug, section_path, updated_at, created_at')
    .order('created_at', { ascending: false })
    .limit(5000)

  const articleUrls = (articles || []).map((article) => ({
    url: `${baseUrl}/${article.section_path}/${article.slug}`,
    lastModified: new Date(article.updated_at || article.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/secciones`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  return [...staticPages, ...articleUrls]
}
