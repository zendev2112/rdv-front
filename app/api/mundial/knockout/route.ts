import { NextResponse } from 'next/server'
import { buildKnockout, teamsByIdEs, type RondaKO } from '@/lib/mundial2026Api'

const GAMES = 'https://worldcup26.ir/get/games'
const TEAMS = 'https://worldcup26.ir/get/teams'

export const revalidate = 60

export async function GET() {
  let rondas: RondaKO[] = []

  try {
    const [gRes, tRes] = await Promise.all([
      fetch(GAMES, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) }),
      fetch(TEAMS, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }),
    ])

    if (gRes.ok && tRes.ok) {
      const gJson = await gRes.json()
      const tJson = await tRes.json()
      const games = Array.isArray(gJson) ? gJson : gJson.games
      const teams = Array.isArray(tJson) ? tJson : tJson.teams
      if (Array.isArray(games) && Array.isArray(teams)) {
        rondas = buildKnockout(games, teamsByIdEs(teams))
      }
    } else {
      console.error('Mundial knockout upstream:', gRes.status, tRes.status)
    }
  } catch (err) {
    console.error('Mundial knockout fetch failed:', (err as Error).message)
  }

  return NextResponse.json(
    { rondas, updatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  )
}
