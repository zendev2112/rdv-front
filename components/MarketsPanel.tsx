import { supabase } from '@/lib/supabase'

// Mercados panel for the Agro section page: grain prices (disponible +
// futuros MATba) from Supabase `market_data`, refreshed by the news-API cron.
// Server component — rides the section page's ISR revalidate.

type MarketRow = {
  day: string
  market: string
  product: string
  symbol: string
  price: number
  currency: string
  change_pct: number | null
  source: string
}

const PRODUCT_LABEL: Record<string, string> = {
  soja: 'Soja',
  maiz: 'Maíz',
  trigo: 'Trigo',
  girasol: 'Girasol',
  cebada: 'Cebada',
  sorgo: 'Sorgo',
}
const PRODUCT_ICON: Record<string, string> = {
  soja: '🌱',
  maiz: '🌽',
  trigo: '🌾',
  girasol: '🌻',
  cebada: '🍺',
  sorgo: '🌾',
}

export async function getLatestMarketData(): Promise<MarketRow[]> {
  const { data } = await supabase
    .from('market_data')
    .select('day, market, product, symbol, price, currency, change_pct, source')
    .order('day', { ascending: false })
    .limit(40)
  const rows = (data || []) as MarketRow[]
  if (!rows.length) return []
  // keep only the freshest day per market group
  const latestDay = rows[0].day
  return rows.filter((r) => r.day === latestDay)
}

function fmtPrice(r: MarketRow) {
  return `US$ ${r.price.toLocaleString('es-AR', { maximumFractionDigits: 1 })}`
}

export function DeltaChip({ pct }: { pct: number | null }) {
  if (pct === null || pct === undefined)
    return <span className="text-xs text-gray-400">—</span>
  const up = pct > 0.001
  const down = pct < -0.001
  const cls = up
    ? 'text-green-700 bg-green-50'
    : down
      ? 'text-red-600 bg-red-50'
      : 'text-gray-500 bg-gray-100'
  const arrow = up ? '▲' : down ? '▼' : '='
  return (
    <span className={`inline-block text-xs font-bold px-1.5 py-0.5 rounded ${cls}`}>
      {arrow} {Math.abs(pct).toLocaleString('es-AR', { maximumFractionDigits: 2 })}%
    </span>
  )
}

function fmtDay(day: string) {
  return new Date(`${day}T12:00:00-03:00`).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })
}

function positionOf(symbol: string) {
  const m = symbol.match(/\/([A-Z]{3})(\d{2})$/)
  return m ? `${m[1]} ${m[2]}` : symbol
}

export default async function MarketsPanel() {
  const rows = await getLatestMarketData()
  if (!rows.length) return null

  const disponible = rows.filter((r) => r.market === 'disponible')
  const futuros = rows.filter((r) => r.market === 'futuros')
  const day = rows[0].day

  return (
    <section className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 bg-[#f7faf5] border-b border-gray-200">
        <h2 className="font-serif text-xl font-bold uppercase">
          📈 Mercados
        </h2>
        <span className="text-xs text-gray-500">
          Cierre del {fmtDay(day)} · Fuente: A3 Mercados (Matba-Rofex)
        </span>
      </div>

      {disponible.length > 0 && (
        <div className="px-4 pt-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            Disponible · Rosario
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {disponible.map((r) => (
              <div key={r.symbol} className="border border-gray-100 rounded-md p-3 bg-white">
                <div className="text-xs font-semibold text-gray-600">
                  {PRODUCT_ICON[r.product] || ''} {PRODUCT_LABEL[r.product] || r.product}
                </div>
                <div className="font-serif text-xl font-bold mt-1">{fmtPrice(r)}</div>
                <div className="mt-1">
                  <DeltaChip pct={r.change_pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {futuros.length > 0 && (
        <div className="px-4 py-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 mt-2">
            Futuros MATba
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {futuros.map((r) => (
              <div key={r.symbol} className="border border-gray-100 rounded-md p-3 bg-white">
                <div className="text-xs font-semibold text-gray-600">
                  {PRODUCT_ICON[r.product] || ''} {PRODUCT_LABEL[r.product] || r.product}
                  <span className="ml-1 text-gray-400 font-normal">{positionOf(r.symbol)}</span>
                </div>
                <div className="font-serif text-lg font-bold mt-1">{fmtPrice(r)}</div>
                <div className="mt-1">
                  <DeltaChip pct={r.change_pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-100">
        Precios por tonelada. Girasol y cebada se muestran cuando el mercado opera esas posiciones.
      </div>
    </section>
  )
}
