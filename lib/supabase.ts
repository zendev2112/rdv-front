import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchArticlesBySection(sectionSlug: string) {
  // Use the article_with_sections view to get articles with their paths
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .eq('section_slug', sectionSlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data || []
}

export async function fetchArticleBySlug(slug: string) {
  // Fetch article with its primary section path
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('is_primary', true)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return data
}

// New helper function to fetch all articles from parent + child sections
export async function fetchArticlesByParentSection(
  parentSlug: string,
  childSlugs: string[]
) {
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .in('section_slug', childSlugs)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching parent section articles:', error)
    return []
  }

  return data || []
}
