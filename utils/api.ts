import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use SERVICE ROLE key for server-side operations to bypass RLS
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function debugSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    console.log('🌐 URL:', supabaseUrl)
    console.log(
      '🔑 Using SERVICE key:',
      !!process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get total count
    const { count, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })

    console.log('📊 Total articles:', count)

    // Get sample data
    const { data: sample, error: sampleError } = await supabase
      .from('articles')
      .select('*')
      .limit(5)

    console.log('📋 Sample data count:', sample?.length || 0)

    // Get distinct statuses
    const { data: allStatuses } = await supabase
      .from('articles')
      .select('status')
      .limit(10)

    console.log(
      '📝 Available statuses:',
      allStatuses?.map((a) => a.status)
    )

    return {
      count,
      countError,
      sample,
      sampleError,
      allStatuses,
      usingServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  } catch (error) {
    console.error('💥 Debug connection failed:', error)
    return { error: error.message }
  }
}

export async function fetchSectionArticles(section: string) {
  try {
    console.log(`🔍 Fetching ${section} with SERVICE key...`)

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('front', section)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)

    console.log(
      `📊 Query result: ${data?.length || 0} articles, error: ${
        error?.message || 'none'
      }`
    )

    if (error) {
      console.error('❌ Primary query failed:', error)

      // Try fallback with 'section' column
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('articles')
        .select('*')
        .eq('section', section)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

      if (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError)
        return []
      }

      console.log(`✅ Fallback success: ${fallbackData?.length || 0} articles`)
      return fallbackData || []
    }

    console.log(`✅ Primary success: ${data?.length || 0} articles`)
    return data || []
  } catch (error) {
    console.error(`❌ Exception in fetchSectionArticles:`, error)
    return []
  }
}

export async function fetchLatestHeadlines() {
  try {
    console.log('🔍 Fetching headlines with SERVICE key...')

    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, section, created_at, front')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Headlines query failed:', error)
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

    console.log(`✅ Headlines success: ${headlines.length} headlines`)
    return headlines
  } catch (error) {
    console.error('❌ Exception in fetchLatestHeadlines:', error)
    return []
  }
}
