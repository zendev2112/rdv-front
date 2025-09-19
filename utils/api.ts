import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for direct database calls
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Direct database implementation replacing the original function
export async function fetchSectionArticles(section: string) {
  try {
    console.log(`🔍 Direct DB fetch for section: ${section}`)

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('front', section) // Using 'front' based on your logs
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Supabase error:', error)

      // Fallback: try 'section' column instead of 'front'
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('articles')
        .select('*')
        .eq('section', section)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

      if (fallbackError) {
        console.error('❌ Fallback query also failed:', fallbackError)
        return []
      }

      console.log(
        `✅ Fallback: Found ${
          fallbackData?.length || 0
        } articles for ${section}`
      )
      return fallbackData || []
    }

    console.log(
      `✅ Direct DB: Found ${data?.length || 0} articles for ${section}`
    )
    return data || []
  } catch (error) {
    console.error(`❌ Error in direct fetch for ${section}:`, error)
    return []
  }
}

// Direct database implementation replacing the original function
export async function fetchLatestHeadlines() {
  try {
    console.log('🔍 Direct DB fetch for latest headlines')

    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, section, created_at, front')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Supabase error for headlines:', error)
      return []
    }

    // Transform to HeadlineItem format (same as your existing function)
    const headlines = Array.isArray(data)
      ? data.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          section: article.section || article.front, // Use section or front
          timestamp: article.created_at, // Keep the original ISO date string
        }))
      : []

    console.log(`✅ Direct DB: Found ${headlines.length} headlines`)
    return headlines
  } catch (error) {
    console.error('❌ Error in direct fetch for headlines:', error)
    return []
  }
}
