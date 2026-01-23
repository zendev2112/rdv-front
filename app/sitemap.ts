import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Function to validate and clean URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.radiodelvolga.com.ar'

  try {
    // Fetch all articles
    const { data: articles, error } = await supabase
      .from('article_with_sections')
      .select('slug, section_path, updated_at, created_at')
      .order('created_at', { ascending: false })
      .limit(5000)

    if (error) {
      console.error('Error fetching articles for sitemap:', error)
      return getStaticPages(baseUrl)
    }

    const articleUrls = (articles || [])
      .filter((article) => {
        // Filter out invalid entries
        if (!article.slug || !article.section_path) return false

        // Check if slug contains problematic characters
        const url = `${baseUrl}/${article.section_path}/${article.slug}`
        return isValidUrl(url)
      })
      .map((article) => {
        // Clean the URL by encoding special characters
        const cleanSlug = encodeURIComponent(article.slug).replace(/%2F/g, '/')
        const cleanSectionPath = encodeURIComponent(
          article.section_path,
        ).replace(/%2F/g, '/')

        return {
          url: `${baseUrl}/${cleanSectionPath}/${cleanSlug}`,
          lastModified: new Date(article.updated_at || article.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }
      })

    return [...getStaticPages(baseUrl), ...articleUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return getStaticPages(baseUrl)
  }
}

function getStaticPages(baseUrl: string): MetadataRoute.Sitemap {
  return [
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
}
