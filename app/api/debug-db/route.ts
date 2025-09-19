export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Try with ANON key
    const supabaseAnon = createClient(supabaseUrl, supabaseKey)

    // Try with SERVICE ROLE key if available
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseService = serviceKey
      ? createClient(supabaseUrl, serviceKey)
      : null

    console.log('🔍 Testing both keys...')

    // Test with ANON key
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('articles')
      .select('*')

    // Test with SERVICE key if available
    let serviceData = null,
      serviceError = null
    if (supabaseService) {
      const result = await supabaseService.from('articles').select('*')
      serviceData = result.data
      serviceError = result.error
    }

    // Remove the problematic RPC call
    let tableInfo = null
    let tableError = null

    const response = {
      timestamp: new Date().toISOString(),
      supabaseUrl,

      // ANON key results
      anonResults: {
        count: anonData?.length || 0,
        error: anonError?.message || null,
        errorCode: anonError?.code || null,
        errorDetails: anonError?.details || null,
        fullError: anonError,
      },

      // SERVICE key results
      serviceResults: serviceKey
        ? {
            count: serviceData?.length || 0,
            error: serviceError?.message || null,
            errorCode: serviceError?.code || null,
            errorDetails: serviceError?.details || null,
            hasServiceKey: true,
            fullError: serviceError,
          }
        : { hasServiceKey: false },

      // Environment check
      environment: {
        hasAnonKey: !!supabaseKey,
        hasServiceKey: !!serviceKey,
        anonKeyLength: supabaseKey?.length,
        serviceKeyLength: serviceKey?.length,
      },

      tableInfo,
      tableError,
    }

    console.log('📊 Debug results:', response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('💥 Debug failed:', error)
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
