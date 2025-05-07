import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Create server client using the current package
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )
    
    // Validate the user is authenticated using getUser
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('API route - Not authenticated:', userError?.message)
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      )
    }
    
    // Get dashboard data - replace with your actual dashboard data logic
    const dashboardData = {
      stats: {
        articles: 42,
        views: 12345,
        authors: 8
      },
      recentArticles: [
        { id: 1, title: 'Example Article 1', views: 123 },
        { id: 2, title: 'Example Article 2', views: 456 }
      ]
    }
    
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}