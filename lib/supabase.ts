import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchArticlesBySection(sectionSlug: string) {
  // Query with path conversion: replace dots with slashes
  const { data, error } = await supabase
    .from('article_with_sections')
    .select(
      `
      *,
      section_path_url:section_path
    `
    )
    .eq('section_slug', sectionSlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  // Convert ltree path (dots) to URL path (slashes)
  return (data || []).map((article) => ({
    ...article,
    section_path_url: article.section_path
      ? String(article.section_path).replace(/\./g, '/')
      : null,
  }))
}

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

  // Convert ltree path to URL path
  if (data && data.section_path) {
    data.section_path_url = String(data.section_path).replace(/\./g, '/')
  }

  return data
}

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

  // Convert ltree paths to URL paths
  return (data || []).map((article) => ({
    ...article,
    section_path_url: article.section_path
      ? String(article.section_path).replace(/\./g, '/')
      : null,
  }))
}
