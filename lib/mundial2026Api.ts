// Live-score integration with worldcup26.ir.
// The public API exposes /get/games WITHOUT auth. Match IDs there do NOT align
// with our chronological ordering, so we merge by team pair (each pairing plays
// exactly once in the group stage — verified: all 72 matches resolve).

import type { Partido } from './mundial2026Data'
import { flagUrl } from './mundial2026Data'

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

// Parse the API scorers field — e.g. `{"J. Quiñones 9'"}` (curly braces +
// smart quotes) — into a clean list like ["J. Quiñones 9'"]. Player names are
// proper nouns and stay as-is. Returns [] for "null"/empty.
export function parseScorers(raw: string | undefined | null): string[] {
  if (!raw) return []
  const t = raw.trim()
  if (t === '' || t === 'null' || t === '{}' || t === '{null}') return []

  // Prefer text inside any double-quote variant (straight or curly).
  const quoted = t.match(/[“"„]([^”"“„]+)[”"]/g)
  const items = quoted
    ? quoted.map((s) => s.replace(/[“”"„{}]/g, '').trim())
    : t.replace(/[{}“”"„]/g, '').split(',').map((s) => s.trim())

  return items.filter((s) => s && s.toLowerCase() !== 'null')
}

// The API reports time_elapsed as "live" (a string, not a minute) during play,
// or a numeric minute when available, or "HT"/"FT". Return a Spanish-safe
// minute label (numbers keep a "'"; everything else has no English leak).
export function minutoLive(timeElapsed: string): string | null {
  if (/^\d+$/.test(timeElapsed)) return `${timeElapsed}'`
  if (timeElapsed === 'HT') return 'Entretiempo'
  return null // "live" / unknown → badge already says "En vivo"
}

// One team's live result as exposed by our proxy route.
export interface Resultado {
  homeEs: string        // API home team, translated to Spanish
  awayEs: string        // API away team, translated to Spanish
  homeScore: number
  awayScore: number
  finished: boolean
  enVivo: boolean       // started but not finished
  minuto: string | null // "67'" / "Entretiempo" while live, else null
  homeScorers: string[]
  awayScorers: string[]
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
  home_scorers?: string
  away_scorers?: string
  finished: string        // "TRUE" | "FALSE"
  time_elapsed: string    // "notstarted" | "live" | "45" | "HT" | ...
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
      minuto: started && !finished ? minutoLive(g.time_elapsed) : null,
      homeScorers: parseScorers(g.home_scorers),
      awayScorers: parseScorers(g.away_scorers),
    }
  }
  return map
}

// A Partido enriched with live data from the scores map.
export interface PartidoConResultado extends Partido {
  enVivo: boolean
  minuto: string | null
  golesLocal: string[]      // scorer labels for the local team
  golesVisitante: string[]  // scorer labels for the visiting team
}

// Overlay live scores onto our static fixture, respecting home/away orientation.
// Scores are only applied once a match has started (or finished); upcoming
// matches keep golLocal/golVisitante = null so the UI shows the kickoff time.
export function aplicarResultados(
  lista: Partido[],
  scores: ScoresMap | undefined,
): PartidoConResultado[] {
  return lista.map((p) => {
    const base: PartidoConResultado = {
      ...p,
      enVivo: false,
      minuto: null,
      golesLocal: [],
      golesVisitante: [],
    }
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
      golesLocal: localEsHome ? r.homeScorers : r.awayScorers,
      golesVisitante: localEsHome ? r.awayScorers : r.homeScorers,
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────
// STANDINGS  (/get/groups + /get/teams)
// ─────────────────────────────────────────────────────────────────────────

export interface FilaPosicion {
  pos: number
  nombre: string
  flag: string
  mp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
  enVivo?: boolean // row affected by a match currently in progress (provisional)
}
export interface GrupoPosiciones {
  grupo: string
  equipos: FilaPosicion[]
}

interface ApiTeam {
  id: string
  name_en: string
  flag?: string
  groups?: string // single group letter, e.g. "A"
}
interface ApiStandingsGame {
  type: string
  group: string
  home_team_id: string
  away_team_id: string
  home_score: string
  away_score: string
  finished: string
}

// Map team id → Spanish name (server-side helper for standings/knockout).
export function teamsByIdEs(teams: ApiTeam[]): Record<string, string> {
  const m: Record<string, string> = {}
  for (const t of teams) m[t.id] = EN_TO_ES[t.name_en] ?? t.name_en
  return m
}

// Compute standings from MATCH RESULTS rather than the upstream /get/groups
// endpoint — the latter is unreliable (observed reversing winners/losers and
// reporting mp=0 for finished matches). /get/games is correct, so we tally
// finished group matches ourselves. Live matches are layered on the client
// (aplicarEnVivo); here we count finished games only.
export function buildStandings(
  teams: ApiTeam[],
  games: ApiStandingsGame[],
): GrupoPosiciones[] {
  // Seed every team into its group with zeroed stats.
  const filaPorId: Record<string, FilaPosicion> = {}
  const grupos: Record<string, Record<string, FilaPosicion>> = {}
  const grupoDeId: Record<string, string> = {}

  for (const t of teams) {
    const grupo = (t.groups || '').trim().toUpperCase()
    if (!grupo) continue
    const nombre = EN_TO_ES[t.name_en] ?? t.name_en
    const fila: FilaPosicion = {
      pos: 0, nombre, flag: flagUrl(nombre),
      mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    }
    filaPorId[t.id] = fila
    grupoDeId[t.id] = grupo
    ;(grupos[grupo] ??= {})[t.id] = fila
  }

  const sumar = (row: FilaPosicion, gf: number, ga: number) => {
    row.mp += 1
    row.gf += gf
    row.ga += ga
    row.gd = row.gf - row.ga
    if (gf > ga) {
      row.w += 1
      row.pts += 3
    } else if (gf < ga) {
      row.l += 1
    } else {
      row.d += 1
      row.pts += 1
    }
  }

  for (const g of games) {
    if (g.type !== 'group' || g.finished !== 'TRUE') continue
    const home = filaPorId[g.home_team_id]
    const away = filaPorId[g.away_team_id]
    if (!home || !away) continue
    const hg = Number(g.home_score) || 0
    const ag = Number(g.away_score) || 0
    sumar(home, hg, ag)
    sumar(away, ag, hg)
  }

  const out = Object.keys(grupos).map((letra) => {
    const equipos = Object.values(grupos[letra])
    equipos.sort(
      (a, b) =>
        b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.nombre.localeCompare(b.nombre),
    )
    equipos.forEach((e, i) => (e.pos = i + 1))
    return { grupo: letra, equipos }
  })

  out.sort((a, b) => a.grupo.localeCompare(b.grupo))
  return out
}

// Layer in-progress matches onto the official standings to produce PROVISIONAL,
// real-time tables. The official /get/groups only counts finished matches, so
// for each live match we add its current result (as if it ended now) to both
// teams, then re-sort. Rows touched by a live match are flagged enVivo.
// Returns a new array; the input is not mutated.
export function aplicarEnVivo(
  grupos: GrupoPosiciones[],
  scores: ScoresMap | undefined,
): GrupoPosiciones[] {
  if (!scores) return grupos
  const enJuego = Object.values(scores).filter((r) => r.enVivo)
  if (enJuego.length === 0) return grupos

  const sumar = (row: FilaPosicion, gf: number, ga: number) => {
    row.mp += 1
    row.gf += gf
    row.ga += ga
    row.gd = row.gf - row.ga
    if (gf > ga) {
      row.w += 1
      row.pts += 3
    } else if (gf < ga) {
      row.l += 1
    } else {
      row.d += 1
      row.pts += 1
    }
    row.enVivo = true
  }

  return grupos.map((g) => {
    const equipos = g.equipos.map((e) => ({ ...e, enVivo: false }))
    let tocado = false

    for (const r of enJuego) {
      const local = equipos.find((x) => normTeam(x.nombre) === normTeam(r.homeEs))
      const visita = equipos.find((x) => normTeam(x.nombre) === normTeam(r.awayEs))
      if (!local || !visita) continue // live match belongs to another group
      sumar(local, r.homeScore, r.awayScore)
      sumar(visita, r.awayScore, r.homeScore)
      tocado = true
    }

    if (!tocado) return g

    equipos.sort(
      (a, b) =>
        b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.nombre.localeCompare(b.nombre),
    )
    equipos.forEach((e, i) => (e.pos = i + 1))
    return { grupo: g.grupo, equipos }
  })
}

// ─────────────────────────────────────────────────────────────────────────
// KNOCKOUT  (/get/games where type != 'group')
// ─────────────────────────────────────────────────────────────────────────

// Hours to ADD to stadium-local time to reach Argentina time (UTC-3), for
// Jun–Jul 2026 (US/Canada on DST; Mexico no DST). Verified vs 70/72 known
// group-stage kickoffs.
const STADIUM_ART_DIFF: Record<number, number> = {
  1: 3, 2: 3, 3: 3,                     // Mexico (UTC-6)
  4: 2, 5: 2, 6: 2,                     // US Central (UTC-5 CDT)
  7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, // Eastern (UTC-4 EDT)
  13: 4, 14: 4, 15: 4, 16: 4,          // Pacific (UTC-7 PDT)
}

export const STADIUM_CITY: Record<number, string> = {
  1: 'Ciudad de México', 2: 'Guadalajara', 3: 'Monterrey', 4: 'Dallas',
  5: 'Houston', 6: 'Kansas City', 7: 'Atlanta', 8: 'Miami', 9: 'Boston',
  10: 'Filadelfia', 11: 'Nueva York/NJ', 12: 'Toronto', 13: 'Vancouver',
  14: 'Seattle', 15: 'San Francisco', 16: 'Los Ángeles',
}

// Convert API "MM/DD/YYYY HH:MM" (stadium-local) → Argentina date + time.
export function toArgentina(
  localDate: string,
  stadiumId: number,
): { fecha: string; hora: string } {
  const [datePart, timePart] = localDate.split(' ')
  const [mm, dd, yyyy] = datePart.split('/').map(Number)
  const [hh, min] = timePart.split(':').map(Number)
  const diff = STADIUM_ART_DIFF[stadiumId] ?? 0
  const d = new Date(Date.UTC(yyyy, mm - 1, dd, hh + diff, min))
  const fecha = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  const hora = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
  return { fecha, hora }
}

export const RONDA_NOMBRE: Record<string, string> = {
  r32: 'Ronda de 32',
  r16: 'Octavos de final',
  qf: 'Cuartos de final',
  sf: 'Semifinales',
  third: 'Tercer puesto',
  final: 'Final',
}
const RONDA_ORDEN = ['r32', 'r16', 'qf', 'sf', 'third', 'final']

// Translate API placeholder labels to Spanish (used until teams are decided).
export function traducirEtiqueta(label: string): string {
  if (!label) return 'A definir'
  return label
    .replace(/^Winner Group /, '1º Grupo ')
    .replace(/^Runner-up Group /, '2º Grupo ')
    .replace(/^3rd Group /, '3º Grupo ')
    .replace(/^Winner Match /, 'Ganador P')
    .replace(/^Loser Match /, 'Perdedor P')
}

export interface PartidoKO {
  id: number
  fecha: string
  hora: string
  local: string
  localFlag: string
  visitante: string
  visitanteFlag: string
  golLocal: number | null
  golVisitante: number | null
  golesLocal: string[]
  golesVisitante: string[]
  finalizado: boolean
  enVivo: boolean
  minuto: string | null
  sede: string
  tipo: string
}
export interface RondaKO {
  ronda: string
  tipo: string
  partidos: PartidoKO[]
}

interface ApiKoGame {
  id: string
  type: string
  local_date: string
  stadium_id: string
  home_team_id: string
  away_team_id: string
  home_team_name_en?: string
  away_team_name_en?: string
  home_team_label?: string
  away_team_label?: string
  home_score: string
  away_score: string
  home_scorers?: string
  away_scorers?: string
  finished: string
  time_elapsed: string
}

export function buildKnockout(
  games: ApiKoGame[],
  byId: Record<string, string>,
): RondaKO[] {
  const porRonda: Record<string, PartidoKO[]> = {}

  for (const g of games) {
    if (g.type === 'group') continue
    const { fecha, hora } = toArgentina(g.local_date, Number(g.stadium_id))

    const lado = (id: string, nameEn: string | undefined, label: string | undefined) => {
      if (id && id !== '0') {
        const es = byId[id] ?? (nameEn ? EN_TO_ES[nameEn] ?? nameEn : '?')
        return { nombre: es, flag: flagUrl(es) }
      }
      return { nombre: traducirEtiqueta(label || ''), flag: '' }
    }

    const L = lado(g.home_team_id, g.home_team_name_en, g.home_team_label)
    const V = lado(g.away_team_id, g.away_team_name_en, g.away_team_label)
    const finished = g.finished === 'TRUE'
    const started = g.time_elapsed !== 'notstarted' && g.time_elapsed !== ''
    const conResultado = finished || started

    ;(porRonda[g.type] ??= []).push({
      id: Number(g.id),
      fecha,
      hora,
      local: L.nombre,
      localFlag: L.flag,
      visitante: V.nombre,
      visitanteFlag: V.flag,
      golLocal: conResultado ? Number(g.home_score) || 0 : null,
      golVisitante: conResultado ? Number(g.away_score) || 0 : null,
      golesLocal: parseScorers(g.home_scorers),
      golesVisitante: parseScorers(g.away_scorers),
      finalizado: finished,
      enVivo: started && !finished,
      minuto: started && !finished ? minutoLive(g.time_elapsed) : null,
      sede: STADIUM_CITY[Number(g.stadium_id)] ?? '',
      tipo: g.type,
    })
  }

  return RONDA_ORDEN.filter((t) => porRonda[t]).map((t) => ({
    ronda: RONDA_NOMBRE[t],
    tipo: t,
    partidos: porRonda[t].sort(
      (a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora) || a.id - b.id,
    ),
  }))
}
