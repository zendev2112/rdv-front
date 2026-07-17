import Link from 'next/link'
import { getLatestMarketData, DeltaChip } from './MarketsPanel'

// Tiny markets strip for the portada (lives under the AGRO caja header):
// disponible prices for the three main grains + a link to the full panel.

const MINI_PRODUCTS = ['soja', 'maiz', 'trigo']
const LABEL: Record<string, string> = { soja: 'Soja', maiz: 'Maíz', trigo: 'Trigo' }

export default async function MarketsMini() {
  const rows = await getLatestMarketData()
  const minis = MINI_PRODUCTS.map((p) =>
    rows.find((r) => r.market === 'disponible' && r.product === p),
  ).filter(Boolean)
  if (!minis.length) return null

  return (
    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-sm mb-4 -mt-2">
      {minis.map((r) => (
        <span key={r!.symbol} className="whitespace-nowrap">
          <span className="font-semibold text-gray-700">{LABEL[r!.product]}</span>{' '}
          <span className="font-serif font-bold">
            US$ {r!.price.toLocaleString('es-AR', { maximumFractionDigits: 1 })}
          </span>{' '}
          <DeltaChip pct={r!.change_pct} />
        </span>
      ))}
      <Link
        href="/agro"
        className="text-xs font-semibold text-primary-red hover:underline whitespace-nowrap"
      >
        Ver mercados →
      </Link>
    </div>
  )
}
