import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cache } from './invalidate/route'; // Import shared cache

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: any;
  timestamp: number;
  etag: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const front = searchParams.get('front');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '30');
    
    console.log("API request received:", { front, status, limit });
    
    // Create cache key from query parameters
    const cacheKey = `${front || 'all'}-${status || 'all'}-${limit}`;
    
    // Check if we have valid cached data
    const cached = cache.get(cacheKey) as CacheEntry;
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      console.log(`🎯 Cache HIT for ${cacheKey}`);
      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'ETag': cached.etag,
          'X-Cache': 'HIT'
        }
      });
    }

    console.log(`🔄 Cache MISS for ${cacheKey} - Fetching from Supabase`);
    
    // Build the query
    let query = supabase
      .from('articles')
      .select('*');
    
    // Add filters conditionally
    if (status) {
      query = query.eq('status', status);
    }
    
    if (front) {
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
      
      // Return stale data if available
      if (cached) {
        console.log(`⚠️ Supabase error occurred, returning stale cache for ${cacheKey}`);
        return NextResponse.json(cached.data, {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60',
            'X-Cache': 'STALE'
          }
        });
      }
      
      return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
    }
    
    console.log(`Found ${data?.length || 0} articles`);
    
    // Generate ETag for cache validation
    const etag = `"${Date.now()}-${data?.length || 0}"`;
    
    // Cache the result
    cache.set(cacheKey, {
      data: data || [],
      timestamp: now,
      etag
    });

    // Clean up old cache entries
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'ETag': etag,
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    
    // Try to return cached data on server error
    const searchParams = request.nextUrl.searchParams;
    const front = searchParams.get('front');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '30');
    const cacheKey = `${front || 'all'}-${status || 'all'}-${limit}`;
    const cached = cache.get(cacheKey) as CacheEntry;
    
    if (cached) {
      console.log(`⚠️ Server error occurred, returning stale cache for ${cacheKey}`);
      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
          'X-Cache': 'STALE'
        }
      });
    }
    
    return NextResponse.json({ error: 'Internal server error', data: [] }, { status: 500 });
  }
}