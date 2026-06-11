import { NextResponse } from 'next/server'
import { buildScoresMap, type ScoresMap } from '@/lib/mundial2026Api'

// Public, no-auth upstream. Revalidate every 30s so live scores stay fresh
// without hammering the source. Client polls this route via SWR.
const UPSTREAM = 'https://worldcup26.ir/get/games'

export const revalidate = 30

export async function GET() {
  let scores: ScoresMap = {}

  try {
    const res = await fetch(UPSTREAM, {
      next: { revalidate: 30 },
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })

    if (res.ok) {
      const json = await res.json()
      const games = Array.isArray(json) ? json : json.games
      if (Array.isArray(games)) {
        scores = buildScoresMap(games)
      }
    } else {
      console.error('Mundial scores upstream returned', res.status)
    }
  } catch (err) {
    // Upstream down/slow — return an empty map so the page falls back to the
    // static fixture (kickoff times) instead of erroring.
    console.error('Mundial scores fetch failed:', (err as Error).message)
  }

  return NextResponse.json(
    { scores, updatedAt: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    },
  )
}
