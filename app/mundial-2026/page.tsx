'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  partidos,
  GRUPOS,
  esArgentina,
  esFechaHoy,
  formatFechaLarga,
  TV_COLORS,
} from '@/lib/mundial2026Data'
import {
  aplicarResultados,
  type PartidoConResultado,
} from '@/lib/mundial2026Api'
import { useMundialScores } from '@/lib/useMundialScores'
import Footer from '@/components/Footer'

type Filtro = 'todos' | 'argentina' | 'hoy' | typeof GRUPOS[number]

const ETIQUETAS_FILTRO: { key: Filtro; label: string }[] = [
  { key: 'todos',     label: 'Todos' },
  { key: 'hoy',      label: 'Hoy' },
  { key: 'argentina', label: '🇦🇷 Argentina' },
  ...GRUPOS.map(g => ({ key: g as Filtro, label: `Grupo ${g}` })),
]

function TvBadge({ canal }: { canal: string }) {
  const color = TV_COLORS[canal] ?? 'bg-gray-500 text-white'
  return (
    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${color}`}>
      {canal}
    </span>
  )
}

function PartidoCard({ p, hoy }: { p: PartidoConResultado; hoy: boolean }) {
  const arg = esArgentina(p)
  const tieneResult = p.golLocal !== null && p.golVisitante !== null

  return (
    <div className={`
      border rounded-lg p-4 transition-shadow hover:shadow-md
      ${arg ? 'border-sky-400 bg-sky-50' : 'border-gray-200 bg-white'}
      ${p.enVivo ? 'ring-2 ring-green-500 ring-offset-1' : hoy && !p.finalizado ? 'ring-2 ring-primary-red ring-offset-1' : ''}
    `}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Grupo {p.grupo}
        </span>
        <div className="flex items-center gap-2">
          {p.enVivo ? (
            <span className="text-[10px] font-bold uppercase bg-green-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              En vivo{p.minuto ? ` ${p.minuto}'` : ''}
            </span>
          ) : hoy && !p.finalizado ? (
            <span className="text-[10px] font-bold uppercase bg-primary-red text-white px-2 py-0.5 rounded-full animate-pulse">
              Hoy
            </span>
          ) : null}
          {p.finalizado ? (
            <span className="text-[10px] font-bold uppercase bg-gray-500 text-white px-2 py-0.5 rounded-full">
              Final
            </span>
          ) : !p.enVivo ? (
            <span className="text-sm font-bold text-gray-800">{p.hora} hs</span>
          ) : null}
        </div>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-2">
        <span className={`font-serif text-base font-bold leading-tight flex-1 text-right ${p.local === 'Argentina' ? 'text-sky-700' : 'text-gray-900'}`}>
          {p.local}
        </span>

        {tieneResult ? (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-black text-gray-900 w-6 text-center">{p.golLocal}</span>
            <span className="text-sm text-gray-400 font-bold">-</span>
            <span className="text-xl font-black text-gray-900 w-6 text-center">{p.golVisitante}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 font-semibold shrink-0 px-2">vs.</span>
        )}

        <span className={`font-serif text-base font-bold leading-tight flex-1 text-left ${p.visitante === 'Argentina' ? 'text-sky-700' : 'text-gray-900'}`}>
          {p.visitante}
        </span>
      </div>

      {/* TV channels */}
      {p.tv.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          <span className="text-[10px] text-gray-400 font-medium self-center mr-0.5">TV:</span>
          {p.tv.map(canal => <TvBadge key={canal} canal={canal} />)}
        </div>
      )}
    </div>
  )
}

export default function MundialPage() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const { scores } = useMundialScores()
  // "Today" highlighting depends on the client clock; this page is prerendered.
  // Gate it behind mount so SSR and first hydration render match.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Overlay live scores onto the static fixture (recomputes when scores poll in).
  const conResultados = useMemo(
    () => aplicarResultados(partidos, scores),
    [scores],
  )

  const filtrados = useMemo(() => {
    if (filtro === 'todos')     return conResultados
    if (filtro === 'argentina') return conResultados.filter(esArgentina)
    if (filtro === 'hoy')       return conResultados.filter(p => esFechaHoy(p.fecha))
    return conResultados.filter(p => p.grupo === filtro)
  }, [filtro, conResultados])

  // Group by date
  const porFecha = useMemo(() => {
    const map = new Map<string, PartidoConResultado[]>()
    for (const p of filtrados) {
      if (!map.has(p.fecha)) map.set(p.fecha, [])
      map.get(p.fecha)!.push(p)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtrados])

  const hayHoy = mounted && partidos.some(p => esFechaHoy(p.fecha))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 pt-[80px] md:pt-[88px]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-red font-medium">Radio del Volga</Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="font-medium">Mundial 2026</span>
          </nav>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-1">
            ⚽ Fixture Mundial 2026
          </h1>
          <p className="text-gray-500 text-sm">
            Horarios en Argentina (UTC−3) · Fase de Grupos · 11 jun — 27 jun 2026
          </p>

          <div className="flex gap-3 mt-4 text-xs text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded font-medium">48 equipos</span>
            <span className="bg-gray-100 px-2 py-1 rounded font-medium">12 grupos</span>
            <span className="bg-gray-100 px-2 py-1 rounded font-medium">72 partidos de fase de grupos</span>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-hide">
            {ETIQUETAS_FILTRO.map(({ key, label }) => {
              if (key === 'hoy' && !hayHoy) return null
              return (
                <button
                  key={key}
                  onClick={() => setFiltro(key)}
                  className={`
                    shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors
                    ${filtro === key
                      ? 'bg-primary-red text-white border-primary-red'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary-red hover:text-primary-red'
                    }
                  `}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── FIXTURE LIST ── */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {porFecha.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">⚽</p>
            <p className="text-lg font-medium">No hay partidos para este filtro</p>
          </div>
        ) : (
          porFecha.map(([fecha, ps]) => (
            <section key={fecha} className="mb-8">
              <h2 className="font-serif text-base font-bold uppercase tracking-wide text-gray-700 mb-3 capitalize border-b border-gray-300 pb-2">
                {formatFechaLarga(fecha)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ps.map(p => (
                  <PartidoCard key={p.id} p={p} hoy={mounted && esFechaHoy(p.fecha)} />
                ))}
              </div>
            </section>
          ))
        )}

        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-5 text-sm text-gray-600">
          <p className="font-bold text-gray-800 mb-1">📡 Fuentes de transmisión</p>
          <p className="leading-relaxed">
            Los partidos de <strong>Argentina</strong> se transmiten por Telefe, TyC Sports, DSports, TV Pública y Disney+ Premium.
            La mayoría de los partidos están disponibles en <strong>DSports</strong> y <strong>Paramount+</strong>.
            Verificar disponibilidad según operador de cable/streaming.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
