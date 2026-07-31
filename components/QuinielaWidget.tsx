'use client'

import { useEffect, useState } from 'react'

// Quiniela — every jurisdiction's cabezas, from tujugada.com.ar (the aggregator
// that carries them all). tujugada publishes this as a webmaster-embed file
// ("Cabezas Quinielas de hoy para Webmasters") and sits behind Cloudflare, which
// a browser passes but a server does not — so this fetches CLIENT-SIDE through
// corsproxy, mirroring how the file is meant to be embedded. We keep the tujugada
// credit + backlink (the implicit deal for using their feed).
//
// Stale-but-dated: the last good board is cached in localStorage and shown
// instantly; a background refresh updates it, and if the refresh fails the cached
// board stays (never blank, never broken).

const TUJUGADA = 'https://www.tujugada.com.ar/data/qlas/cabezas_web.htm'
const PROXY = 'https://corsproxy.io/?'
const CACHE_KEY = 'rdv-quiniela-cache-v1'

const TURNOS: [string, string][] = [
  ['previa', 'Previa'],
  ['primera', 'Primera'],
  ['matutina', 'Matutina'],
  ['vespertina', 'Vespertina'],
  ['nocturna', 'Nocturna'],
]

type Row = { jurisdiction: string; cells: (string | null)[] }
type Board = { date: string | null; rows: Row[]; ts: number }

function parseCabezas(html: string): { date: string | null; rows: Row[] } {
  const t = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
  const date = (t.match(/FECHA:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i) || [])[1] || null
  const rows: Row[] = []
  const re =
    /([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ ]*?) (\d{4}|----) (\d{4}|----) (\d{4}|----) (\d{4}|----) (\d{4}|----)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(t))) {
    rows.push({
      jurisdiction: m[1].trim(),
      cells: [m[2], m[3], m[4], m[5], m[6]].map((c) => (/^\d{4}$/.test(c) ? c : null)),
    })
  }
  return { date, rows }
}

export default function QuinielaWidget() {
  const [board, setBoard] = useState<Board | null>(null)

  useEffect(() => {
    // Show cached board immediately (stale-but-dated).
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) setBoard(JSON.parse(cached))
    } catch {}

    let alive = true
    fetch(PROXY + TUJUGADA, { signal: AbortSignal.timeout(20000) })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((html) => {
        const { date, rows } = parseCabezas(html)
        if (!rows.length) throw new Error('empty parse')
        const fresh: Board = { date, rows, ts: Date.now() }
        if (alive) setBoard(fresh)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(fresh))
        } catch {}
      })
      .catch(() => {
        // Keep whatever cached board is already shown; never blank it.
      })
    return () => {
      alive = false
    }
  }, [])

  if (!board || !board.rows.length) return null

  return (
    <section className="my-8">
      <h2 className="font-serif text-xl font-bold mb-1 text-gray-900">
        Quiniela
        {board.date && (
          <span className="text-sm font-normal text-gray-500"> · {board.date}</span>
        )}
      </h2>
      <div className="border-t border-gray-300 mb-4"></div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="py-2 pr-3 text-left font-semibold text-gray-700">
                Quiniela
              </th>
              {TURNOS.map(([k, label]) => (
                <th
                  key={k}
                  className="py-2 px-2 text-center font-semibold text-gray-600 whitespace-nowrap"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {board.rows.map((r) => (
              <tr key={r.jurisdiction} className="border-t border-gray-100">
                <td className="py-2 pr-3 font-semibold text-gray-900 whitespace-nowrap">
                  {r.jurisdiction}
                </td>
                {r.cells.map((c, i) => (
                  <td
                    key={i}
                    className="py-2 px-2 text-center tabular-nums font-bold text-primary-red"
                  >
                    {c || <span className="text-gray-300 font-normal">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-gray-400 mt-2">
        Cabezas · Fuente:{' '}
        <a
          href="https://www.tujugada.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          tujugada.com.ar
        </a>
      </p>
    </section>
  )
}
