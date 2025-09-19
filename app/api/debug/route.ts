export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { debugSupabaseConnection } from '@/utils/api'

export async function GET() {
  try {
    const debugInfo = await debugSupabaseConnection()

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      debugResults: debugInfo,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
