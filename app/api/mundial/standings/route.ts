import { NextResponse } from 'next/server'
import { buildStandings, type GrupoPosiciones } from '@/lib/mundial2026Api'

const GROUPS = 'https://worldcup26.ir/get/groups'
const TEAMS = 'https://worldcup26.ir/get/teams'

// Run on every request; CDN s-maxage keeps it ~60s fresh without hammering upstream.
export const dynamic = 'force-dynamic'

let lastGood: GrupoPosiciones[] = []
let lastGoodAt: string | null = null

export async function GET() {
  let grupos: GrupoPosiciones[] | null = null

  try {
    const [gRes, tRes] = await Promise.all([
      fetch(GROUPS, { cache: 'no-store', signal: AbortSignal.timeout(9000) }),
      fetch(TEAMS, { cache: 'no-store', signal: AbortSignal.timeout(9000) }),
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
      console.warn('Mundial standings upstream:', gRes.status, tRes.status)
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
