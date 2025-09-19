import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for direct database calls
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// DEBUG: Add this function to test connection
export async function debugSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔑 Key exists:', !!supabaseKey)

    // Test basic connection
    const { data: tables, error: tablesError } = await supabase
      .from('articles')
      .select('count', { count: 'exact', head: true })

    console.log('📊 Total articles count:', tables)
    console.log('❌ Connection error:', tablesError)

    // Test if table exists
    const { data: sample, error: sampleError } = await supabase
      .from('articles')
      .select('*')
      .limit(5)

    console.log('📋 Sample data:', sample)
    console.log('❌ Sample error:', sampleError)

    // Test different status values
    const { data: allStatuses } = await supabase
      .from('articles')
      .select('status')
      .limit(10)

    console.log(
      '📝 Available statuses:',
      allStatuses?.map((a) => a.status)
    )

    return { tables, sample, allStatuses }
  } catch (error) {
    console.error('💥 Debug connection failed:', error)
    return null
  }
}

// Your existing functions...
export async function fetchSectionArticles(section: string) {
  try {
    console.log(`🔍 Direct DB fetch for section: ${section}`)

    // ADD DEBUG CALL
    await debugSupabaseConnection()

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('front', section)
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

    const headlines = Array.isArray(data)
      ? data.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          section: article.section || article.front,
          timestamp: article.created_at,
        }))
      : []

    console.log(`✅ Direct DB: Found ${headlines.length} headlines`)
    return headlines
  } catch (error) {
    console.error('❌ Error in direct fetch for headlines:', error)
    return []
  }
}
