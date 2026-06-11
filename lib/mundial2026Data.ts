export interface Partido {
  id: number
  fecha: string       // "2026-06-11"
  hora: string        // "16:00"
  local: string
  visitante: string
  grupo: string       // "A" .. "L"
  golLocal: number | null
  golVisitante: number | null
  finalizado: boolean
  tv: string[]
}

export const TV = {
  TELEFE: 'Telefe',
  TYC: 'TyC Sports',
  DSPORTS: 'DSports',
  DISNEY: 'Disney+',
  DISNEY_P: 'Disney+ Premium',
  PARAMOUNT: 'Paramount+',
  PUBLICA: 'TV Pública',
} as const

export const partidos: Partido[] = [
  // ── JORNADA 1 ────────────────────────────────────────────────────────────
  // Jueves 11 de junio
  { id: 1,  fecha: '2026-06-11', hora: '16:00', local: 'México',          visitante: 'Sudáfrica',       grupo: 'A', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },
  { id: 2,  fecha: '2026-06-11', hora: '23:00', local: 'Corea del Sur',   visitante: 'Rep. Checa',      grupo: 'A', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.TYC] },
  // Viernes 12 de junio
  { id: 3,  fecha: '2026-06-12', hora: '16:00', local: 'Canadá',          visitante: 'Bosnia',          grupo: 'B', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.TYC] },
  { id: 4,  fecha: '2026-06-12', hora: '22:00', local: 'Estados Unidos',  visitante: 'Paraguay',        grupo: 'D', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  // Sábado 13 de junio
  { id: 5,  fecha: '2026-06-13', hora: '16:00', local: 'Catar',           visitante: 'Suiza',           grupo: 'B', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 6,  fecha: '2026-06-13', hora: '19:00', local: 'Brasil',          visitante: 'Marruecos',       grupo: 'C', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.TYC, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 7,  fecha: '2026-06-13', hora: '22:00', local: 'Haití',           visitante: 'Escocia',         grupo: 'C', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Domingo 14 de junio
  { id: 8,  fecha: '2026-06-14', hora: '01:00', local: 'Australia',       visitante: 'Turquía',         grupo: 'D', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TYC] },
  { id: 9,  fecha: '2026-06-14', hora: '14:00', local: 'Alemania',        visitante: 'Curazao',         grupo: 'E', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 10, fecha: '2026-06-14', hora: '17:00', local: 'Países Bajos',    visitante: 'Japón',           grupo: 'F', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.TYC, TV.PARAMOUNT] },
  { id: 11, fecha: '2026-06-14', hora: '20:00', local: 'Ecuador',         visitante: 'Costa de Marfil', grupo: 'E', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },
  { id: 12, fecha: '2026-06-14', hora: '23:00', local: 'Suecia',          visitante: 'Túnez',           grupo: 'F', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Lunes 15 de junio
  { id: 13, fecha: '2026-06-15', hora: '13:00', local: 'España',          visitante: 'Cabo Verde',      grupo: 'H', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 14, fecha: '2026-06-15', hora: '16:00', local: 'Bélgica',         visitante: 'Egipto',          grupo: 'G', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 15, fecha: '2026-06-15', hora: '19:00', local: 'Uruguay',         visitante: 'Arabia Saudita',  grupo: 'H', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.DISNEY, TV.TYC, TV.PARAMOUNT] },
  { id: 16, fecha: '2026-06-15', hora: '22:00', local: 'Irán',            visitante: 'Nueva Zelanda',   grupo: 'G', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Martes 16 de junio
  { id: 17, fecha: '2026-06-16', hora: '16:00', local: 'Francia',         visitante: 'Senegal',         grupo: 'I', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 18, fecha: '2026-06-16', hora: '19:00', local: 'Irak',            visitante: 'Noruega',         grupo: 'I', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 19, fecha: '2026-06-16', hora: '22:00', local: 'Argentina',       visitante: 'Argelia',         grupo: 'J', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.TYC, TV.DSPORTS, TV.PUBLICA, TV.DISNEY_P, TV.PARAMOUNT] },
  // Miércoles 17 de junio
  { id: 20, fecha: '2026-06-17', hora: '01:00', local: 'Austria',         visitante: 'Jordania',        grupo: 'J', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 21, fecha: '2026-06-17', hora: '14:00', local: 'Portugal',        visitante: 'RD del Congo',    grupo: 'K', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 22, fecha: '2026-06-17', hora: '17:00', local: 'Inglaterra',      visitante: 'Croacia',         grupo: 'L', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 23, fecha: '2026-06-17', hora: '20:00', local: 'Ghana',           visitante: 'Panamá',          grupo: 'L', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 24, fecha: '2026-06-17', hora: '23:00', local: 'Uzbekistán',      visitante: 'Colombia',        grupo: 'K', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },

  // ── JORNADA 2 ────────────────────────────────────────────────────────────
  // Jueves 18 de junio
  { id: 25, fecha: '2026-06-18', hora: '13:00', local: 'Rep. Checa',      visitante: 'Sudáfrica',       grupo: 'A', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 26, fecha: '2026-06-18', hora: '16:00', local: 'Suiza',           visitante: 'Bosnia',          grupo: 'B', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 27, fecha: '2026-06-18', hora: '19:00', local: 'Canadá',          visitante: 'Catar',           grupo: 'B', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 28, fecha: '2026-06-18', hora: '22:00', local: 'México',          visitante: 'Corea del Sur',   grupo: 'A', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Viernes 19 de junio
  { id: 29, fecha: '2026-06-19', hora: '16:00', local: 'Estados Unidos',  visitante: 'Australia',       grupo: 'D', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 30, fecha: '2026-06-19', hora: '19:00', local: 'Escocia',         visitante: 'Marruecos',       grupo: 'C', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 31, fecha: '2026-06-19', hora: '21:30', local: 'Brasil',          visitante: 'Haití',           grupo: 'C', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Sábado 20 de junio
  { id: 32, fecha: '2026-06-20', hora: '00:00', local: 'Turquía',         visitante: 'Paraguay',        grupo: 'D', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 33, fecha: '2026-06-20', hora: '14:00', local: 'Países Bajos',    visitante: 'Suecia',          grupo: 'F', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 34, fecha: '2026-06-20', hora: '17:00', local: 'Alemania',        visitante: 'Costa de Marfil', grupo: 'E', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 35, fecha: '2026-06-20', hora: '21:00', local: 'Curazao',         visitante: 'Ecuador',         grupo: 'E', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },
  // Domingo 21 de junio
  { id: 36, fecha: '2026-06-21', hora: '01:00', local: 'Túnez',           visitante: 'Japón',           grupo: 'F', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 37, fecha: '2026-06-21', hora: '13:00', local: 'España',          visitante: 'Arabia Saudita',  grupo: 'H', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 38, fecha: '2026-06-21', hora: '16:00', local: 'Bélgica',         visitante: 'Irán',            grupo: 'G', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 39, fecha: '2026-06-21', hora: '19:00', local: 'Uruguay',         visitante: 'Cabo Verde',      grupo: 'H', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },
  { id: 40, fecha: '2026-06-21', hora: '22:00', local: 'Nueva Zelanda',   visitante: 'Egipto',          grupo: 'G', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Lunes 22 de junio
  { id: 41, fecha: '2026-06-22', hora: '14:00', local: 'Argentina',       visitante: 'Austria',         grupo: 'J', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.TYC, TV.DSPORTS, TV.PUBLICA, TV.DISNEY_P, TV.PARAMOUNT] },
  { id: 42, fecha: '2026-06-22', hora: '18:00', local: 'Francia',         visitante: 'Irak',            grupo: 'I', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 43, fecha: '2026-06-22', hora: '21:00', local: 'Noruega',         visitante: 'Senegal',         grupo: 'I', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Martes 23 de junio
  { id: 44, fecha: '2026-06-23', hora: '00:00', local: 'Jordania',        visitante: 'Argelia',         grupo: 'J', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 45, fecha: '2026-06-23', hora: '14:00', local: 'Portugal',        visitante: 'Uzbekistán',      grupo: 'K', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 46, fecha: '2026-06-23', hora: '17:00', local: 'Inglaterra',      visitante: 'Ghana',           grupo: 'L', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 47, fecha: '2026-06-23', hora: '20:00', local: 'Panamá',          visitante: 'Croacia',         grupo: 'L', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 48, fecha: '2026-06-23', hora: '23:00', local: 'Colombia',        visitante: 'RD del Congo',    grupo: 'K', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },

  // ── JORNADA 3 ────────────────────────────────────────────────────────────
  // Miércoles 24 de junio
  { id: 49, fecha: '2026-06-24', hora: '16:00', local: 'Suiza',           visitante: 'Canadá',          grupo: 'B', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 50, fecha: '2026-06-24', hora: '16:00', local: 'Bosnia',          visitante: 'Catar',           grupo: 'B', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 51, fecha: '2026-06-24', hora: '19:00', local: 'Brasil',          visitante: 'Escocia',         grupo: 'C', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 52, fecha: '2026-06-24', hora: '19:00', local: 'Marruecos',       visitante: 'Haití',           grupo: 'C', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 53, fecha: '2026-06-24', hora: '22:00', local: 'Corea del Sur',   visitante: 'Sudáfrica',       grupo: 'A', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 54, fecha: '2026-06-24', hora: '22:00', local: 'Rep. Checa',      visitante: 'México',          grupo: 'A', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  // Jueves 25 de junio
  { id: 55, fecha: '2026-06-25', hora: '17:00', local: 'Ecuador',         visitante: 'Alemania',        grupo: 'E', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },
  { id: 56, fecha: '2026-06-25', hora: '17:00', local: 'Costa de Marfil', visitante: 'Curazao',         grupo: 'E', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 57, fecha: '2026-06-25', hora: '20:00', local: 'Japón',           visitante: 'Suecia',          grupo: 'F', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 58, fecha: '2026-06-25', hora: '20:00', local: 'Túnez',           visitante: 'Países Bajos',    grupo: 'F', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 59, fecha: '2026-06-25', hora: '23:00', local: 'Turquía',         visitante: 'Estados Unidos',  grupo: 'D', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 60, fecha: '2026-06-25', hora: '23:00', local: 'Paraguay',        visitante: 'Australia',       grupo: 'D', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  // Viernes 26 de junio
  { id: 61, fecha: '2026-06-26', hora: '16:00', local: 'Noruega',         visitante: 'Francia',         grupo: 'I', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.PARAMOUNT] },
  { id: 62, fecha: '2026-06-26', hora: '16:00', local: 'Senegal',         visitante: 'Irak',            grupo: 'I', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 63, fecha: '2026-06-26', hora: '21:00', local: 'Cabo Verde',      visitante: 'Arabia Saudita',  grupo: 'H', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 64, fecha: '2026-06-26', hora: '21:00', local: 'Uruguay',         visitante: 'España',          grupo: 'H', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.DSPORTS, TV.DISNEY, TV.TYC, TV.PARAMOUNT] },
  // Sábado 27 de junio
  { id: 65, fecha: '2026-06-27', hora: '00:00', local: 'Egipto',          visitante: 'Irán',            grupo: 'G', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 66, fecha: '2026-06-27', hora: '00:00', local: 'Nueva Zelanda',   visitante: 'Bélgica',         grupo: 'G', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 67, fecha: '2026-06-27', hora: '15:00', local: 'Panamá',          visitante: 'Inglaterra',      grupo: 'L', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 68, fecha: '2026-06-27', hora: '18:00', local: 'Croacia',         visitante: 'Ghana',           grupo: 'L', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 69, fecha: '2026-06-27', hora: '20:30', local: 'Colombia',        visitante: 'Portugal',        grupo: 'K', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.DISNEY, TV.PARAMOUNT] },
  { id: 70, fecha: '2026-06-27', hora: '20:30', local: 'RD del Congo',    visitante: 'Uzbekistán',      grupo: 'K', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 71, fecha: '2026-06-27', hora: '23:00', local: 'Argelia',         visitante: 'Austria',         grupo: 'J', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.DSPORTS, TV.PARAMOUNT] },
  { id: 72, fecha: '2026-06-27', hora: '23:00', local: 'Jordania',        visitante: 'Argentina',       grupo: 'J', golLocal: null, golVisitante: null, finalizado: false, tv: [TV.TELEFE, TV.TYC, TV.DSPORTS, TV.PUBLICA, TV.DISNEY_P, TV.PARAMOUNT] },
]

// ISO 3166-1 alpha-2 codes (flagcdn) per Spanish team name. England/Scotland
// use GB subdivision codes so they render reliably on Android (emoji flags don't).
export const FLAG_CODE: Record<string, string> = {
  Argelia: 'dz',
  Argentina: 'ar',
  Australia: 'au',
  Austria: 'at',
  'Bélgica': 'be',
  Bosnia: 'ba',
  Brasil: 'br',
  'Canadá': 'ca',
  'Cabo Verde': 'cv',
  Colombia: 'co',
  Croacia: 'hr',
  Curazao: 'cw',
  'Rep. Checa': 'cz',
  'RD del Congo': 'cd',
  Ecuador: 'ec',
  Egipto: 'eg',
  Inglaterra: 'gb-eng',
  Francia: 'fr',
  Alemania: 'de',
  Ghana: 'gh',
  'Haití': 'ht',
  'Irán': 'ir',
  Irak: 'iq',
  'Costa de Marfil': 'ci',
  'Japón': 'jp',
  Jordania: 'jo',
  'México': 'mx',
  Marruecos: 'ma',
  'Países Bajos': 'nl',
  'Nueva Zelanda': 'nz',
  Noruega: 'no',
  'Panamá': 'pa',
  Paraguay: 'py',
  Portugal: 'pt',
  Catar: 'qa',
  'Arabia Saudita': 'sa',
  Escocia: 'gb-sct',
  Senegal: 'sn',
  'Sudáfrica': 'za',
  'Corea del Sur': 'kr',
  'España': 'es',
  Suecia: 'se',
  Suiza: 'ch',
  'Túnez': 'tn',
  'Turquía': 'tr',
  'Estados Unidos': 'us',
  Uruguay: 'uy',
  'Uzbekistán': 'uz',
}

// flagcdn returns a 4:3 PNG. w40 = 40×30; display at ~20px wide.
export function flagUrl(team: string, w: 20 | 40 | 80 = 40): string {
  const code = FLAG_CODE[team]
  return code ? `https://flagcdn.com/w${w}/${code}.png` : ''
}

export const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const

export function esArgentina(p: Partido) {
  return p.local === 'Argentina' || p.visitante === 'Argentina'
}

export function esFechaHoy(fecha: string): boolean {
  const hoy = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
  return fecha === hoy
}

export function formatFechaLarga(fecha: string): string {
  const [year, month, day] = fecha.split('-').map(Number)
  // Use UTC to avoid timezone shifts on the label
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

export const TV_COLORS: Record<string, string> = {
  [TV.TELEFE]:    'bg-blue-600 text-white',
  [TV.TYC]:       'bg-green-700 text-white',
  [TV.DSPORTS]:   'bg-slate-700 text-white',
  [TV.DISNEY]:    'bg-blue-800 text-white',
  [TV.DISNEY_P]:  'bg-indigo-700 text-white',
  [TV.PARAMOUNT]: 'bg-sky-600 text-white',
  [TV.PUBLICA]:   'bg-teal-700 text-white',
}
