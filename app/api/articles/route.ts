import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const front = searchParams.get('front');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '30');
    
    console.log("API request received:", { front, status, limit });
    
    // Build the query
    let query = supabase
      .from('articles')
      .select('*');
    
    // Add filters conditionally
    if (status) {
      query = query.eq('status', status);
    }
    
    if (front) {
      // Use ilike to be case-insensitive and match partial strings
      query = query.ilike('front', `%${front}%`);
    }
    
    // Add sorting by creation date
    query = query.order('created_at', { ascending: false });
    
    // Add limit
    query = query.limit(limit);
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
    }
    
    console.log(`Found ${data?.length || 0} articles`);
    
    // Return the results (always as an array, even if empty)
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error', data: [] }, { status: 500 });
  }
}