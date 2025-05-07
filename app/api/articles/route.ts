import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create a Supabase client with the service role key (only used server-side)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url)
    let section = url.searchParams.get('section')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')
    
    // In your API endpoint, add handling for this specific case
    if (section === 'educacion-') {
      section = 'educacion';
    }

    // Build query using the article_with_sections view
    let query = supabase
      .from('article_with_sections')
      .select(`
        id, 
        title, 
        slug, 
        status, 
        featured, 
        created_at,
        section_id,
        section_name,
        section_slug,
        is_primary
      `)
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    if (section) {
      const normalizedSection = section === 'educacion-' ? 'educacion' : section;
      query = query.eq('section_id', normalizedSection);
    }
    
    // Only retrieve primary section associations to avoid duplicates
    query = query.eq('is_primary', true)
    
    // Limit results
    query = query.limit(100)
    
    // Execute query
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching articles:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}