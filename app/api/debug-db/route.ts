export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { debugSupabaseConnection } from '@/utils/api'

export async function GET() {
  try {
    console.log('🔍 Starting debug check...')
    
    const debugInfo = await debugSupabaseConnection()
    
    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      debugResults: debugInfo
    }
    
    console.log('📊 Debug response:', response)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('💥 Debug API failed:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}