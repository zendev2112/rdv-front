import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query || query.length < 3) {
      return NextResponse.json({ articles: [] })
    }

    // ✅ USE unaccent() function for accent-insensitive search
    // This converts "María" → "maria", "Pigüé" → "pigue", etc.
    // ✅ INCLUDED article field as well
    const { data, error } = await supabase
      .from('article_with_sections')
      .select('*')
      .or(
        `unaccent(title).ilike.unaccent(%${query}%),unaccent(excerpt).ilike.unaccent(%${query}%),unaccent(overline).ilike.unaccent(%${query}%),unaccent(article).ilike.unaccent(%${query}%)`
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
