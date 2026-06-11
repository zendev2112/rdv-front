import { NextResponse } from 'next/server'
import { buildStandings, type GrupoPosiciones } from '@/lib/mundial2026Api'
import { upstreamGet } from '@/lib/upstreamGet'

// Standings are computed from match results (/get/games), not the upstream
// /get/groups endpoint, which is unreliable (reverses results, mp=0).
const GAMES = 'https://worldcup26.ir/get/games'
const TEAMS = 'https://worldcup26.ir/get/teams'

// Run on every request; CDN s-maxage keeps it ~60s fresh without hammering upstream.
export const dynamic = 'force-dynamic'

let lastGood: GrupoPosiciones[] = []
let lastGoodAt: string | null = null

export async function GET() {
  let grupos: GrupoPosiciones[] | null = null

  try {
    const [gJson, tJson] = await Promise.all([
      upstreamGet(GAMES),
      upstreamGet(TEAMS),
    ])
    const games = Array.isArray(gJson) ? gJson : gJson.games
    const teams = Array.isArray(tJson) ? tJson : tJson.teams
    if (Array.isArray(games) && Array.isArray(teams)) {
      grupos = buildStandings(teams, games)
    }
  } catch (err) {
    console.warn('Mundial standings upstream slow/unreachable:', (err as Error).message)
  }

  if (grupos) {
    lastGood = grupos
    lastGoodAt = new Date().toISOString()
  }

  return NextResponse.json(
    {
      grupos: grupos ?? lastGood,
      updatedAt: lastGoodAt ?? new Date().toISOString(),
      stale: grupos === null,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  )
}
