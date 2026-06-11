import { NextResponse } from 'next/server'
import { buildKnockout, teamsByIdEs, type RondaKO } from '@/lib/mundial2026Api'
import { upstreamGet } from '@/lib/upstreamGet'

const GAMES = 'https://worldcup26.ir/get/games'
const TEAMS = 'https://worldcup26.ir/get/teams'

// Run on every request; CDN s-maxage keeps it ~60s fresh without hammering upstream.
export const dynamic = 'force-dynamic'

let lastGood: RondaKO[] = []
let lastGoodAt: string | null = null

export async function GET() {
  let rondas: RondaKO[] | null = null

  try {
    const [gJson, tJson] = await Promise.all([
      upstreamGet(GAMES),
      upstreamGet(TEAMS),
    ])
    const games = Array.isArray(gJson) ? gJson : gJson.games
    const teams = Array.isArray(tJson) ? tJson : tJson.teams
    if (Array.isArray(games) && Array.isArray(teams)) {
      rondas = buildKnockout(games, teamsByIdEs(teams))
    }
  } catch (err) {
    console.warn('Mundial knockout upstream slow/unreachable:', (err as Error).message)
  }

  if (rondas) {
    lastGood = rondas
    lastGoodAt = new Date().toISOString()
  }

  return NextResponse.json(
    {
      rondas: rondas ?? lastGood,
      updatedAt: lastGoodAt ?? new Date().toISOString(),
      stale: rondas === null,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  )
}
