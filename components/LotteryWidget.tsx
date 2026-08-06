import { supabase } from '@/lib/supabase'

// Loterías y Quinielas — full mirror of clarin.com/loterias-y-quinielas. Reads the
// Supabase `lottery_snapshot` row (one JSONB row refreshed by the news-API lottery
// cron): every game with its modalities + every quiniela jurisdiction with its turnos
// and 20 positioned numbers. Server component — rides the section page's ISR.

type Modality = { label: string; date: string | null; numbers: string[] }
type Game = { name: string; slug: string; modalities: Modality[] }
type Turno = { label: string; date: string | null; numbers: string[] }
type Quiniela = { name: string; slug: string; turnos: Turno[] }
type Snapshot = {
  games: Game[]
  quinielas: Quiniela[]
  updated_at: string
}

async function getSnapshot(): Promise<Snapshot | null> {
  const { data } = await supabase
    .from('lottery_snapshot')
    .select('games, quinielas, updated_at')
    .eq('id', 'latest')
    .single()
  return (data as Snapshot) || null
}

function shortDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit' }).format(d)
}

function Ball({ n }: { n: string }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-sm font-bold text-gray-900 tabular-nums">
      {n}
    </span>
  )
}

function GameCard({ g }: { g: Game }) {
  const date = g.modalities[0]?.date
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white break-inside-avoid">
      <div className="flex items-baseline justify-between mb-3 gap-2">
        <h3 className="font-bold text-lg text-primary-red">{g.name}</h3>
        {date && <span className="text-xs text-gray-500">{shortDate(date)}</span>}
      </div>
      <div className="flex flex-col gap-3">
        {g.modalities.map((m) => (
          <div key={m.label}>
            {m.label !== g.name && (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                {m.label}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {m.numbers.map((n, i) => (
                <Ball key={i} n={n} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuinielaCard({ q }: { q: Quiniela }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white break-inside-avoid">
      <h3 className="font-bold text-lg text-primary-red mb-3">{q.name}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {q.turnos.map((t) => (
          <div
            key={t.label}
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-3"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {t.label}
            </span>
            <span className="text-2xl font-bold text-gray-900 tabular-nums leading-tight my-0.5">
              {t.numbers[0]}
            </span>
            {t.date && <span className="text-[10px] text-gray-400">{shortDate(t.date)}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function LotteryWidget() {
  const snap = await getSnapshot()
  const games = snap?.games ?? []
  const quinielas = snap?.quinielas ?? []
  if (!games.length && !quinielas.length) return null

  return (
    <section className="my-8">
      <h2 className="font-serif text-2xl font-bold mb-1 text-gray-900">
        Loterías y Quinielas
      </h2>
      <div className="border-t border-gray-300 mb-5"></div>

      {games.length > 0 && (
        <>
          <h3 className="font-serif text-lg font-bold text-gray-700 mb-3">Loterías</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {games.map((g) => (
              <GameCard key={g.slug} g={g} />
            ))}
          </div>
        </>
      )}

      {quinielas.length > 0 && (
        <>
          <h3 className="font-serif text-lg font-bold text-gray-700 mb-3">Quinielas</h3>
          <div className="grid grid-cols-1 gap-4">
            {quinielas.map((q) => (
              <QuinielaCard key={q.slug} q={q} />
            ))}
          </div>
        </>
      )}

      <p className="text-[11px] text-gray-400 mt-4">Fuente: Clarín</p>
    </section>
  )
}
