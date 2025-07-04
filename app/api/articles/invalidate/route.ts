import { NextRequest, NextResponse } from 'next/server'

// Simple shared cache Map - no classes needed!
const cache = new Map()

// Export the cache so other routes can use it
export { cache }

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const action = searchParams.get('action') || 'clear'

    // Simple authentication check
    const authHeader = request.headers.get('authorization')
    const validToken =
      process.env.CACHE_INVALIDATION_TOKEN || 'your-secret-token'

    if (!authHeader || authHeader !== `Bearer ${validToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized. Please provide valid authorization token.' },
        { status: 401 }
      )
    }

    switch (action) {
      case 'clear':
        let deletedCount = 0
        if (key) {
          deletedCount = cache.delete(key) ? 1 : 0
        } else {
          deletedCount = cache.size
          cache.clear()
        }

        return NextResponse.json({
          message: key
            ? `Cache cleared for key: ${key}`
            : `All cache cleared. Removed ${deletedCount} entries.`,
          deletedCount,
          timestamp: new Date().toISOString(),
        })

      case 'stats':
        const entries = Array.from(cache.entries()).map(([key, value]) => ({
          key,
          timestamp: value.timestamp,
          dataSize: Array.isArray(value.data) ? value.data.length : 0,
          age: Date.now() - value.timestamp,
        }))

        return NextResponse.json({
          message: 'Cache statistics retrieved',
          stats: {
            totalEntries: cache.size,
            entries,
          },
          timestamp: new Date().toISOString(),
        })

      case 'list':
        const keys = Array.from(cache.keys())
        return NextResponse.json({
          message: 'Cache keys listed',
          keys,
          totalKeys: keys.length,
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: clear, stats, or list' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Cache invalidation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'

    switch (action) {
      case 'stats':
        const entries = Array.from(cache.entries()).map(([key, value]) => ({
          key,
          timestamp: value.timestamp,
          dataSize: Array.isArray(value.data) ? value.data.length : 0,
          age: Date.now() - value.timestamp,
        }))

        return NextResponse.json({
          message: 'Cache statistics retrieved',
          stats: {
            totalEntries: cache.size,
            entries,
          },
          timestamp: new Date().toISOString(),
        })

      case 'list':
        const keys = Array.from(cache.keys())
        return NextResponse.json({
          message: 'Cache keys listed',
          keys,
          totalKeys: keys.length,
          timestamp: new Date().toISOString(),
        })

      case 'health':
        return NextResponse.json({
          message: 'Cache service is healthy',
          status: 'OK',
          cacheSize: cache.size,
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action for GET. Use: stats, list, or health' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Cache stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
