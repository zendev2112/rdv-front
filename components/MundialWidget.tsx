'use client'

import { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import { partidos, esFechaHoy, TV_COLORS, esArgentina, flagUrl } from '@/lib/mundial2026Data'
import { aplicarResultados, type PartidoConResultado } from '@/lib/mundial2026Api'
import { useMundialScores } from '@/lib/useMundialScores'
import MundialShareButtons from '@/components/MundialShareButtons'

function TvBadge({ canal }: { canal: string }) {
  const color = TV_COLORS[canal] ?? 'bg-gray-500 text-white'
  return (
    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${color}`}>
      {canal}
    </span>
  )
}

function Bandera({ team }: { team: string }) {
  const url = flagUrl(team)
  if (!url) return null
  return (
    <img
      src={url}
      alt={team}
      className="h-4 w-auto rounded-[2px] shrink-0 shadow-sm"
      loading="lazy"
    />
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
          <div className="flex items-center gap-2">
            <img src="/images/mundial-2026.svg" alt="Mundial 2026" className="w-6 h-6" />
            <h2 className="font-serif text-xl font-bold text-gray-900">Mundial 2026</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {esHoy ? `Partidos de hoy · ${new Date().toLocaleDateString('es-AR', { weekday: 'short', month: 'short', day: 'numeric' })}` : 'Próximos partidos'}
          </p>
        </div>

      </div>

      <div className="space-y-2.5">
        {partidosMostrar.map((p: PartidoConResultado) => {
          const arg = esArgentina(p)
          const tieneResult = p.golLocal !== null && p.golVisitante !== null

          return (
            <div
              key={p.id}
              className={`
                rounded-lg border px-3 py-2.5
                ${p.enVivo ? 'border-green-400 bg-green-50' : arg ? 'border-sky-300 bg-sky-50' : 'border-gray-200 bg-white'}
              `}
            >
              {/* Header: group + status/time */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Grupo {p.grupo}
                </span>
                {p.enVivo ? (
                  <span className="text-green-600 text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                    {p.minuto ? `${p.minuto}'` : 'EN VIVO'}
                  </span>
                ) : p.finalizado ? (
                  <span className="text-gray-400 text-[10px] font-bold uppercase">Final</span>
                ) : (
                  <span className="text-gray-700 text-xs font-bold">{p.hora} hs</span>
                )}
              </div>

              {/* Teams + score (full names, with flags) */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-end gap-1.5 flex-1 min-w-0">
                  <span className={`font-semibold text-sm text-right ${p.local === 'Argentina' ? 'text-sky-700' : 'text-gray-900'}`}>
                    {p.local}
                  </span>
                  <Bandera team={p.local} />
                </div>

                {tieneResult ? (
                  <span className="font-black text-gray-900 shrink-0 text-base px-1">
                    {p.golLocal}–{p.golVisitante}
                  </span>
                ) : (
                  <span className="text-gray-400 shrink-0 text-[11px] font-semibold px-1">vs</span>
                )}

                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Bandera team={p.visitante} />
                  <span className={`font-semibold text-sm text-left ${p.visitante === 'Argentina' ? 'text-sky-700' : 'text-gray-900'}`}>
                    {p.visitante}
                  </span>
                </div>
              </div>

              {/* TV channels + share */}
              <div className="flex items-end justify-between gap-2 mt-2">
                {p.tv.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-medium mr-0.5">TV:</span>
                    {p.tv.map(canal => <TvBadge key={canal} canal={canal} />)}
                  </div>
                ) : (
                  <span />
                )}
                <MundialShareButtons p={p} compact />
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
