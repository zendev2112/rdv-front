// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query || query.length < 3) {
      return NextResponse.json({ articles: [] })
    }

    // Search in title, excerpt, and overline
    const { data, error } = await supabase
      .from('article_with_sections')
      .select('*')
      .or(
        `title.ilike.%${query}%,excerpt.ilike.%${query}%,overline.ilike.%${query}%`
      )
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    return NextResponse.json({ articles: data || [] })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
