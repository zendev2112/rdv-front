import { NextResponse } from 'next/server'
import { buildScoresMap, type ScoresMap } from '@/lib/mundial2026Api'

// Public, no-auth upstream. Revalidate every 30s so live scores stay fresh
// without hammering the source. Client polls this route via SWR.
const UPSTREAM = 'https://worldcup26.ir/get/games'

// Run on every request (never prerender at build) and fetch fresh upstream
// data. The response Cache-Control (s-maxage) still shields the upstream at the
// CDN, so live scores stay ~30s fresh without hammering the source.
export const dynamic = 'force-dynamic'

// Upstream is occasionally slow/unreachable from Vercel. Keep the last good
// scores in warm-instance memory and serve them on a transient timeout so the
// UI doesn't flicker to "no scores".
let lastGood: ScoresMap = {}
let lastGoodAt: string | null = null

export async function GET() {
  let scores: ScoresMap | null = null

  try {
    const res = await fetch(UPSTREAM, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(9000),
    })

    if (res.ok) {
      const json = await res.json()
      const games = Array.isArray(json) ? json : json.games
      if (Array.isArray(games)) {
        scores = buildScoresMap(games)
      }
    } else {
      console.warn('Mundial scores upstream returned', res.status)
    }
  } catch (err) {
    // Slow/unreachable upstream — fall through to last-good (or empty) below.
    console.warn('Mundial scores upstream slow/unreachable:', (err as Error).message)
  }

  if (scores) {
    lastGood = scores
    lastGoodAt = new Date().toISOString()
  }

  return NextResponse.json(
    {
      scores: scores ?? lastGood,
      updatedAt: lastGoodAt ?? new Date().toISOString(),
      stale: scores === null,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
  )
}
