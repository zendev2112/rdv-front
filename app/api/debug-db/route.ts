export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get ALL articles regardless of status
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('*')

    // Get count by status
    const { data: statusCount, error: statusError } = await supabase
      .from('articles')
      .select('status')

    // Get distinct statuses
    const { data: distinctStatuses } = await supabase
      .from('articles')
      .select('status')
      .not('status', 'is', null)

    // Get distinct sections/fronts
    const { data: distinctSections } = await supabase
      .from('articles')
      .select('section, front')

    const response = {
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      
      // Raw data
      totalArticles: allArticles?.length || 0,
      allArticles: allArticles || [],
      allError,
      
      // Status breakdown
      statusCount: statusCount?.length || 0,
      statuses: distinctStatuses?.map(s => s.status) || [],
      
      // Section breakdown
      sections: distinctSections?.map(s => ({ section: s.section, front: s.front })) || [],
      
      // First 3 articles for inspection
      sampleArticles: allArticles?.slice(0, 3) || []
    }
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}