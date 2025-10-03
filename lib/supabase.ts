import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch articles by section, ensuring proper hierarchy
 */
export async function fetchArticlesBySection(sectionSlug: string, page = 1, pageSize = 12) {
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
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  // Normalize the published_at field
  return (data || []).map(article => ({
    ...article,
    // Ensure published_at is a valid date or null
    published_at: article.published_at && article.published_at !== '1970-01-01T00:00:00Z' && article.published_at !== '1970-01-01T00:00:00.000Z'
      ? article.published_at
      : null
  }))
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
export async function fetchArticlesByParentSection(parentSlug: string) {
  // First get the parent section to know its path
  const { data: section } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', parentSlug)
    .single();
  
  if (!section) {
    return [];
  }
  
  // Use section.path (which is an ltree) to fetch articles from this section and all its children
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .filter('section_path', 'like', `${section.path}%`)  // This gets parent and all child sections
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching parent section articles:', error);
    return [];
  }

  return (data || []).map(article => ({
    ...article,
    published_at: article.published_at && article.published_at !== '1970-01-01T00:00:00Z'
      ? article.published_at
      : null
  }));
}
