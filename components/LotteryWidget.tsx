import { supabase } from '@/lib/supabase'

// Loterías y Quinielas panel for the /loterias-quinielas section page. Reads
// Supabase `lottery_results` (refreshed by the news-API lottery cron). Server
// component — rides the section page's ISR revalidate.

type LotteryRow = {
  game: string
  modality: string
  numbers: string
  draw: string | null
  draw_date: string | null
  source: string | null
  updated_at: string
}

const GAMES = [
  { key: 'quini6', label: 'Quini 6' },
  { key: 'brinco', label: 'Brinco' },
  { key: 'telekino', label: 'Telekino' },
]
const MOD_ORDER = ['Tradicional', 'La Segunda', 'Revancha', 'Siempre Sale', 'unica']

export async function getLottery(): Promise<LotteryRow[]> {
  const { data } = await supabase
    .from('lottery_results')
    .select('game, modality, numbers, draw, draw_date, source, updated_at')
  return (data || []) as LotteryRow[]
}

function dateLabel(r: LotteryRow): string {
  const iso = r.draw_date || r.updated_at
  const d = iso ? new Date(iso) : null
  const ds = d
    ? new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(d)
    : ''
  return r.draw ? `Sorteo ${r.draw} · ${ds}` : ds ? `Últ. sorteo · ${ds}` : ''
}

function Ball({ n }: { n: string }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-sm font-bold text-gray-900 tabular-nums">
      {n}
    </span>
  )
}

export default async function LotteryWidget() {
  const rows = await getLottery()
  if (!rows.length) return null

  const byGame: Record<string, LotteryRow[]> = {}
  for (const r of rows) (byGame[r.game] ||= []).push(r)

  const games = GAMES.filter((g) => byGame[g.key]?.length)
  if (!games.length) return null

  return (
    <section className="my-8">
      <h2 className="font-serif text-xl font-bold mb-1 text-gray-900">
        Loterías y Quinielas
      </h2>
      <div className="border-t border-gray-300 mb-5"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((g) => {
          const gr = [...byGame[g.key]].sort(
            (a, b) => MOD_ORDER.indexOf(a.modality) - MOD_ORDER.indexOf(b.modality),
          )
          return (
            <div key={g.key} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-baseline justify-between mb-3 gap-2">
                <h3 className="font-bold text-lg text-primary-red">{g.label}</h3>
                <span className="text-xs text-gray-500 text-right">
                  {dateLabel(gr[0])}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {gr.map((r) => (
                  <div key={r.modality}>
                    {r.modality !== 'unica' && (
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                        {r.modality}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {r.numbers.split(',').map((n, i) => (
                        <Ball key={i} n={n.trim()} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-gray-400 mt-3">
        Fuente: Lotería de Santa Fe · Telekino
      </p>
    </section>
  )
}
