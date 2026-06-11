// Live-score integration with worldcup26.ir.
// The public API exposes /get/games WITHOUT auth. Match IDs there do NOT align
// with our chronological ordering, so we merge by team pair (each pairing plays
// exactly once in the group stage — verified: all 72 matches resolve).

import type { Partido } from './mundial2026Data'

// English (API) → Spanish (our display) for all 48 teams.
export const EN_TO_ES: Record<string, string> = {
  Algeria: 'Argelia',
  Argentina: 'Argentina',
  Australia: 'Australia',
  Austria: 'Austria',
  Belgium: 'Bélgica',
  'Bosnia and Herzegovina': 'Bosnia',
  Brazil: 'Brasil',
  Canada: 'Canadá',
  'Cape Verde': 'Cabo Verde',
  Colombia: 'Colombia',
  Croatia: 'Croacia',
  'Curaçao': 'Curazao',
  'Czech Republic': 'Rep. Checa',
  'Democratic Republic of the Congo': 'RD del Congo',
  Ecuador: 'Ecuador',
  Egypt: 'Egipto',
  England: 'Inglaterra',
  France: 'Francia',
  Germany: 'Alemania',
  Ghana: 'Ghana',
  Haiti: 'Haití',
  Iran: 'Irán',
  Iraq: 'Irak',
  'Ivory Coast': 'Costa de Marfil',
  Japan: 'Japón',
  Jordan: 'Jordania',
  Mexico: 'México',
  Morocco: 'Marruecos',
  Netherlands: 'Países Bajos',
  'New Zealand': 'Nueva Zelanda',
  Norway: 'Noruega',
  Panama: 'Panamá',
  Paraguay: 'Paraguay',
  Portugal: 'Portugal',
  Qatar: 'Catar',
  'Saudi Arabia': 'Arabia Saudita',
  Scotland: 'Escocia',
  Senegal: 'Senegal',
  'South Africa': 'Sudáfrica',
  'South Korea': 'Corea del Sur',
  Spain: 'España',
  Sweden: 'Suecia',
  Switzerland: 'Suiza',
  Tunisia: 'Túnez',
  Turkey: 'Turquía',
  'United States': 'Estados Unidos',
  Uruguay: 'Uruguay',
  Uzbekistan: 'Uzbekistán',
}

// Normalize a Spanish team name to an accent-insensitive, lowercase token.
export function normTeam(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// Order-independent key for a match (home/away may be flipped between sources).
export function pairKey(a: string, b: string): string {
  return [normTeam(a), normTeam(b)].sort().join('|')
}

// One team's live result as exposed by our proxy route.
export interface Resultado {
  homeEs: string        // API home team, translated to Spanish
  awayEs: string        // API away team, translated to Spanish
  homeScore: number
  awayScore: number
  finished: boolean
  enVivo: boolean       // started but not finished
  minuto: string | null // e.g. "67" while live, else null
}

// Map keyed by pairKey → Resultado. This is what /api/mundial/scores returns.
export type ScoresMap = Record<string, Resultado>

// Raw game shape from worldcup26.ir /get/games
interface ApiGame {
  id: string
  home_team_name_en?: string
  away_team_name_en?: string
  home_score: string
  away_score: string
  finished: string        // "TRUE" | "FALSE"
  time_elapsed: string    // "notstarted" | "45" | "90" | "HT" | ...
  type: string
}

// Build a ScoresMap from the raw API payload (server-side only).
export function buildScoresMap(games: ApiGame[]): ScoresMap {
  const map: ScoresMap = {}
  for (const g of games) {
    if (g.type !== 'group') continue // knockout teams are TBD (undefined names)
    const homeEs = g.home_team_name_en ? EN_TO_ES[g.home_team_name_en] : undefined
    const awayEs = g.away_team_name_en ? EN_TO_ES[g.away_team_name_en] : undefined
    if (!homeEs || !awayEs) continue

    const finished = g.finished === 'TRUE'
    const started = g.time_elapsed !== 'notstarted' && g.time_elapsed !== ''
    map[pairKey(homeEs, awayEs)] = {
      homeEs,
      awayEs,
      homeScore: Number(g.home_score) || 0,
      awayScore: Number(g.away_score) || 0,
      finished,
      enVivo: started && !finished,
      minuto: started && !finished ? g.time_elapsed : null,
    }
  }
  return map
}

// A Partido enriched with live data from the scores map.
export interface PartidoConResultado extends Partido {
  enVivo: boolean
  minuto: string | null
}

// Overlay live scores onto our static fixture, respecting home/away orientation.
// Scores are only applied once a match has started (or finished); upcoming
// matches keep golLocal/golVisitante = null so the UI shows the kickoff time.
export function aplicarResultados(
  lista: Partido[],
  scores: ScoresMap | undefined,
): PartidoConResultado[] {
  return lista.map((p) => {
    const base: PartidoConResultado = { ...p, enVivo: false, minuto: null }
    if (!scores) return base

    const r = scores[pairKey(p.local, p.visitante)]
    if (!r) return base

    // Only surface a score once the match is live or finished.
    if (!r.finished && !r.enVivo) return base

    // Orient: does our `local` match the API's home team?
    const localEsHome = normTeam(p.local) === normTeam(r.homeEs)
    return {
      ...base,
      golLocal: localEsHome ? r.homeScore : r.awayScore,
      golVisitante: localEsHome ? r.awayScore : r.homeScore,
      finalizado: r.finished,
      enVivo: r.enVivo,
      minuto: r.minuto,
    }
  })
}
