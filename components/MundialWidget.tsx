'use client'

import { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import { partidos, esFechaHoy, TV_COLORS, esArgentina } from '@/lib/mundial2026Data'
import { aplicarResultados, type PartidoConResultado } from '@/lib/mundial2026Api'
import { useMundialScores } from '@/lib/useMundialScores'

function TvBadge({ canal }: { canal: string }) {
  const color = TV_COLORS[canal] ?? 'bg-gray-500 text-white'
  return (
    <span className={`inline-block text-[9px] font-bold px-1 py-0.5 rounded ${color}`}>
      {canal}
    </span>
  )
}

export default function MundialWidget() {
  const { scores } = useMundialScores()
  // Avoid SSR/hydration mismatch: "today" depends on the client clock, but the
  // homepage is statically prerendered. Render only after mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { partidosMostrar, esHoy } = useMemo(() => {
    const hoy = new Date().toLocaleDateString('en-CA')
    const enriquecidos = aplicarResultados(partidos, scores)

    // Live matches first, then today's, else next 4 upcoming.
    const envivo = enriquecidos.filter(p => p.enVivo)
    const deHoy = enriquecidos.filter(p => esFechaHoy(p.fecha))

    if (deHoy.length > 0) {
      // Sort so live matches surface to the top of today's list.
      const ordenados = [...deHoy].sort(
        (a, b) => Number(b.enVivo) - Number(a.enVivo),
      )
      return { partidosMostrar: ordenados, esHoy: true }
    }
    if (envivo.length > 0) {
      return { partidosMostrar: envivo, esHoy: true }
    }
    const proximos = enriquecidos
      .filter(p => p.fecha > hoy && !p.finalizado)
      .slice(0, 4)
    return { partidosMostrar: proximos, esHoy: false }
  }, [scores])

  // Not yet mounted, or tournament ended (no live/today/upcoming) — don't render.
  if (!mounted || partidosMostrar.length === 0) return null

  return (
    <section className="border-t border-gray-200 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900">⚽ Mundial 2026</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {esHoy ? 'Partidos de hoy · Horarios Argentina' : 'Próximos partidos · Horarios Argentina'}
          </p>
        </div>
        <Link
          href="/mundial-2026"
          className="text-xs font-bold text-primary-red hover:underline shrink-0 ml-4"
        >
          Fixture completo →
        </Link>
      </div>

      <div className="space-y-2">
        {partidosMostrar.map((p: PartidoConResultado) => {
          const arg = esArgentina(p)
          const tieneResult = p.golLocal !== null && p.golVisitante !== null

          return (
            <div
              key={p.id}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm
                ${p.enVivo ? 'border-green-400 bg-green-50' : arg ? 'border-sky-300 bg-sky-50' : 'border-gray-100 bg-white'}
              `}
            >
              {/* Hour / live minute */}
              <span className="font-bold shrink-0 w-11 text-right">
                {p.enVivo ? (
                  <span className="text-green-600 text-xs flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                    {p.minuto ? `${p.minuto}'` : 'EN VIVO'}
                  </span>
                ) : p.finalizado ? (
                  <span className="text-gray-400 text-[11px] uppercase">Fin</span>
                ) : (
                  <span className="text-gray-700">{p.hora}</span>
                )}
              </span>

              {/* Teams + score */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className={`font-medium truncate text-right flex-1 ${p.local === 'Argentina' ? 'text-sky-700 font-bold' : 'text-gray-800'}`}>
                  {p.local}
                </span>
                {tieneResult ? (
                  <span className="font-black text-gray-900 shrink-0 text-base">
                    {p.golLocal}–{p.golVisitante}
                  </span>
                ) : (
                  <span className="text-gray-400 shrink-0 text-xs font-semibold">vs</span>
                )}
                <span className={`font-medium truncate flex-1 ${p.visitante === 'Argentina' ? 'text-sky-700 font-bold' : 'text-gray-800'}`}>
                  {p.visitante}
                </span>
              </div>

              {/* Group + TV */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Gr.{p.grupo}</span>
                <div className="flex gap-0.5 flex-wrap justify-end max-w-[120px]">
                  {p.tv.slice(0, 3).map(canal => <TvBadge key={canal} canal={canal} />)}
                  {p.tv.length > 3 && (
                    <span className="text-[9px] text-gray-400 self-center">+{p.tv.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 text-center">
        <Link
          href="/mundial-2026"
          className="inline-block text-xs font-bold text-primary-red border border-primary-red px-4 py-1.5 rounded-full hover:bg-primary-red hover:text-white transition-colors"
        >
          Ver fixture completo
        </Link>
      </div>
    </section>
  )
}
