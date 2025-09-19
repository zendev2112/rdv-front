export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const { searchParams } = request.nextUrl;
    const section = searchParams.get('section') || searchParams.get('front');
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status') || 'published';

    // DEBUG: Check total articles count
    const { count: totalCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    console.log('🔢 TOTAL ARTICLES IN DB:', totalCount);

    // DEBUG: Get sample articles
    const { data: sampleArticles } = await supabase
      .from('articles')
      .select('id, title, section, status')
      .limit(5);

    console.log('📋 SAMPLE ARTICLES:', sampleArticles);

    // Your original query
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (section) {
      query = query.eq('section', section);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    console.log('📡 QUERY RESULT:', {
      requested_section: section,
      requested_status: status,
      found_count: data?.length || 0,
      error: error?.message || 'none'
    });

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('❌ API ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const revalidate = 60;