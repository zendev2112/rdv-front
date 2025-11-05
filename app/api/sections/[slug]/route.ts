import { NextRequest, NextResponse } from 'next/server'
import { fetchArticlesByParentSection } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    
    // Calculate page number from offset
    const page = Math.floor(offset / limit) + 1

    const { articles } = await fetchArticlesByParentSection(
      params.slug,
      page,
      limit
    )

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching section articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}