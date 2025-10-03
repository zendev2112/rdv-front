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
    .single();
  
  if (!section) {
    return { articles: [], count: 0 };
  }
  
  // Get total count for pagination
  const { count, error: countError } = await supabase
    .from('article_with_sections')
    .select('*', { count: 'exact', head: true })
    .eq('section_id', section.id)
    .eq('status', 'published');

  // Fetch articles with pagination
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .eq('section_id', section.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], count: 0 };
  }

  return { 
    articles: data || [], 
    count: count || 0 
  };
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
    .order('is_primary', { ascending: false }) // Prioritize primary section
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data[0];
}

/**
 * Fetch articles for a parent section including all child sections
 */
export async function fetchArticlesByParentSection(parentSlug: string, page = 1, pageSize = 12) {
  // First get the parent section
  const { data: section } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', parentSlug)
    .single();
  
  if (!section) {
    return { articles: [], count: 0 };
  }
  
  // Get count for pagination
  const { count, error: countError } = await supabase
    .from('article_with_sections')
    .select('*', { count: 'exact', head: true })
    .like('section_path', `${section.path}%`) // This gets the parent + all child sections
    .eq('status', 'published');
  
  // Query for parent section + all child section articles
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .like('section_path', `${section.path}%`) // This gets parent + children
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error('Error fetching parent section articles:', error);
    return { articles: [], count: 0 };
  }

  return {
    articles: data || [],
    count: count || 0
  };
}
