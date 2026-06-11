import { NextResponse } from 'next/server'
import { buildStandings, type GrupoPosiciones } from '@/lib/mundial2026Api'

const GROUPS = 'https://worldcup26.ir/get/groups'
const TEAMS = 'https://worldcup26.ir/get/teams'

// Standings change only when a match finishes — 60s is plenty.
export const revalidate = 60

export async function GET() {
  let grupos: GrupoPosiciones[] = []

  try {
    const [gRes, tRes] = await Promise.all([
      fetch(GROUPS, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) }),
      fetch(TEAMS, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }),
    ])

    if (gRes.ok && tRes.ok) {
      const gJson = await gRes.json()
      const tJson = await tRes.json()
      const groups = Array.isArray(gJson) ? gJson : gJson.groups
      const teams = Array.isArray(tJson) ? tJson : tJson.teams
      if (Array.isArray(groups) && Array.isArray(teams)) {
        grupos = buildStandings(groups, teams)
      }
    } else {
      console.error('Mundial standings upstream:', gRes.status, tRes.status)
    }
  } catch (err) {
    console.error('Mundial standings fetch failed:', (err as Error).message)
  }

  return NextResponse.json(
    { grupos, updatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  )
}
