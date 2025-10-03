import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch articles by section, ensuring proper hierarchy
 */
export async function fetchArticlesBySection(sectionSlug: string) {
  // First get the section to know its path
  const { data: section } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', sectionSlug)
    .single()

  if (!section) {
    return []
  }

  // Use section path to query articles
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .eq('section_id', section.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data || []
}

/**
 * Fetch article by slug
 */
export async function fetchArticleBySlug(slug: string) {
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

/**
 * Fetch articles for a parent section including all child sections
 */
export async function fetchArticlesByParentSection(
  parentSlug: string,
  childSlugs: string[]
) {
  // First get the parent section to know its path
  const { data: section } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', parentSlug)
    .single()

  if (!section) {
    return []
  }

  // Use path to get all articles under this section hierarchy
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .like('section_path', `${section.path}%`) // This matches articles in this section and all subsections
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching parent section articles:', error)
    return []
  }

  return data || []
}
