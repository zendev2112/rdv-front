import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch articles by section, ensuring proper hierarchy
 */
export async function fetchArticlesBySection(sectionSlug: string, page = 1, pageSize = 12) {
  console.log(`Fetching articles for section: ${sectionSlug}, page ${page}`);
  
  // Get the section first
  const { data: section } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', sectionSlug)
    .single();
  
  if (!section) {
    console.error(`Section not found: ${sectionSlug}`);
    return { articles: [], count: 0 };
  }
  
  // Get total count for pagination
  const { count } = await supabase
    .from('article_with_sections')
    .select('*', { count: 'exact', head: true })
    .eq('section_id', section.id)
    .eq('status', 'published');
  
  // Query with proper date ordering
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
  
  console.log(`Found ${data?.length || 0} articles for section ${sectionSlug}`);
  return { 
    articles: data || [], 
    count: count || 0 
  };
}

/**
 * Fetch article by slug
 */
export async function fetchArticleBySlug(slug: string) {
  console.log(`Fetching article with slug: ${slug}`);
  
  // First try to find the article with primary section
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .order('is_primary', { ascending: false })
    .limit(1);
  
  if (error || !data || data.length === 0) {
    console.error(`Article not found: ${slug}`, error);
    return null;
  }
  
  console.log(`Found article: ${data[0].title} with section path: ${data[0].section_path}`);
  return data[0];
}

/**
 * Fetch articles for a parent section including all child sections
 */
export async function fetchArticlesByParentSection(parentSlug: string, page = 1, pageSize = 12) {
  console.log(`Fetching parent section articles for: ${parentSlug}, page ${page}`);
  
  // Get the parent section
  const { data: section } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', parentSlug)
    .single();
  
  if (!section) {
    console.error(`Parent section not found: ${parentSlug}`);
    return { articles: [], count: 0 };
  }
  
  console.log(`Using path pattern: ${section.path}%`);
  
  // Get count of all articles in this path tree
  const { count } = await supabase
    .from('article_with_sections')
    .select('*', { count: 'exact', head: true })
    .like('section_path', `${section.path}%`)
    .eq('status', 'published');
  
  // Query for ALL articles under this parent (including children)
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .like('section_path', `${section.path}%`)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  if (error) {
    console.error('Error fetching parent section articles:', error);
    return { articles: [], count: 0 };
  }
  
  console.log(`Found ${data?.length || 0} articles in section tree ${parentSlug}`);
  return { 
    articles: data || [], 
    count: count || 0 
  };
}
