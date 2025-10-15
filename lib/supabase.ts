import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch articles by section (child section only)
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
  
  console.log(`Section found:`, section);
  
  // Get total count for pagination
  const { count } = await supabase
    .from('article_with_sections')
    .select('*', { count: 'exact', head: true })
    .eq('section_id', section.id)
    .eq('status', 'published');
  
  console.log(`Count for section ${sectionSlug}:`, count);
  
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
  
  // Use the view to get article with primary section
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('is_primary', true)
    .single();
  
  if (error || !data) {
    console.error(`Article not found: ${slug}`, error);
    return null;
  }
  
  console.log(`Found article: ${data.title}`);
  return data;
}

/**
 * Fetch articles for a parent section including all child sections
 */
export async function fetchArticlesByParentSection(parentSlug: string, page = 1, pageSize = 12) {
  console.log(`Fetching parent section articles for: ${parentSlug}, page ${page}`);
  
  // Get the parent section
  const { data: section, error: sectionError } = await supabase
    .from('section_hierarchy')
    .select('*')
    .eq('slug', parentSlug)
    .single();
  
  if (sectionError || !section) {
    console.error(`Parent section not found: ${parentSlug}`, sectionError);
    return { articles: [], count: 0 };
  }
  
  console.log(`Parent section found:`, section);
  console.log(`Parent section ID: ${section.id}, Path: ${section.path}`);
  
  // Get all child sections + parent itself
  // Match: exact parent ID OR path starts with "parent_path."
  const { data: childSections, error: childError } = await supabase
    .from('section_hierarchy')
    .select('id, name, slug, path')
    .or(`id.eq.${section.id},path.like.${section.path}.%`);
  
  if (childError) {
    console.error('Error fetching child sections:', childError);
    return { articles: [], count: 0 };
  }
  
  console.log(`Found ${childSections?.length || 0} sections in hierarchy:`, childSections);
  
  // Extract section IDs (these are kebab-case like "coronel-suarez", "agro", etc.)
  const sectionIds = childSections?.map(s => s.id) || [];
  
  if (sectionIds.length === 0) {
    console.log('No sections found in hierarchy');
    return { articles: [], count: 0 };
  }
  
  console.log(`Querying articles with section_ids:`, sectionIds);
  
  // Get count of all articles in these sections
  const { count, error: countError } = await supabase
    .from('article_with_sections')
    .select('*', { count: 'exact', head: true })
    .in('section_id', sectionIds)
    .eq('status', 'published');
  
  if (countError) {
    console.error('Error counting articles:', countError);
  }
  
  console.log(`Total articles found in hierarchy: ${count}`);
  
  // Query for ALL articles under this parent (including children)
  const { data, error } = await supabase
    .from('article_with_sections')
    .select('*')
    .in('section_id', sectionIds)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  if (error) {
    console.error('Error fetching parent section articles:', error);
    return { articles: [], count: 0 };
  }
  
  console.log(`Found ${data?.length || 0} articles for page ${page}`);
  console.log(`Sample articles:`, data?.slice(0, 2));
  
  return { 
    articles: data || [], 
    count: count || 0 
  };
}
