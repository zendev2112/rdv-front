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
  flagUrl,
} from '@/lib/mundial2026Data'
import {
  aplicarResultados,
  type PartidoConResultado,
} from '@/lib/mundial2026Api'
import { useMundialScores } from '@/lib/useMundialScores'
import SidelinesLayout from '@/components/SidelinesLayout'
import MundialShareButtons from '@/components/MundialShareButtons'
import MundialStandings from '@/components/MundialStandings'
import MundialKnockout from '@/components/MundialKnockout'
import Footer from '@/components/Footer'

type Filtro = 'todos' | 'argentina' | 'hoy' | typeof GRUPOS[number]
type Vista = 'partidos' | 'posiciones' | 'eliminatorias'

const TABS: { key: Vista; label: string }[] = [
  { key: 'partidos', label: 'Partidos' },
  { key: 'posiciones', label: 'Posiciones' },
  { key: 'eliminatorias', label: 'Eliminatorias' },
]

const ETIQUETAS_FILTRO: { key: Filtro; label: string }[] = [
  { key: 'todos',     label: 'Todos' },
  { key: 'hoy',      label: 'Hoy' },
  { key: 'argentina', label: '🇦🇷 Argentina' },
  ...GRUPOS.map(g => ({ key: g as Filtro, label: `Grupo ${g}` })),
]

function TvBadge({ canal }: { canal: string }) {
  const color = TV_COLORS[canal] ?? 'bg-gray-200 text-gray-800'
  return (
    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border border-black/5 ${color}`}>
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
        <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
          <span className={`font-serif text-base font-bold leading-tight text-right ${p.local === 'Argentina' ? 'text-sky-700' : 'text-gray-900'}`}>
            {p.local}
          </span>
          {flagUrl(p.local) && (
            <img
              src={flagUrl(p.local)}
              alt={p.local}
              className="h-4 w-auto rounded-[2px] shrink-0 shadow-sm"
              loading="lazy"
            />
          )}
        </div>

        {tieneResult ? (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-black text-gray-900 w-6 text-center">{p.golLocal}</span>
            <span className="text-sm text-gray-400 font-bold">-</span>
            <span className="text-xl font-black text-gray-900 w-6 text-center">{p.golVisitante}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 font-semibold shrink-0 px-2">vs.</span>
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {flagUrl(p.visitante) && (
            <img
              src={flagUrl(p.visitante)}
              alt={p.visitante}
              className="h-4 w-auto rounded-[2px] shrink-0 shadow-sm"
              loading="lazy"
            />
          )}
          <span className={`font-serif text-base font-bold leading-tight text-left ${p.visitante === 'Argentina' ? 'text-sky-700' : 'text-gray-900'}`}>
            {p.visitante}
          </span>
        </div>
      </div>

      {/* TV channels */}
      {p.tv.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          <span className="text-[10px] text-gray-400 font-medium self-center mr-0.5">TV:</span>
          {p.tv.map(canal => <TvBadge key={canal} canal={canal} />)}
        </div>
      )}

      {/* Share */}
      <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
        <MundialShareButtons p={p} />
      </div>
    </div>
  )
}

export default function MundialPage() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [vista, setVista] = useState<Vista>('partidos')
  const { scores } = useMundialScores()
  // "Today" highlighting depends on the client clock; this page is prerendered.
  // Gate it behind mount so SSR and first hydration render match.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const sidelineWidth = 15

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

  // Partidos tab — filters + fixture by date + transmission note.
  const cuerpoPartidos = (
    <>
      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-4 mb-2 scrollbar-hide">
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

      {/* Fixture list */}
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

      {/* Transmission sources */}
      <div className="mt-12 bg-white border border-gray-200 rounded-lg p-5 text-sm text-gray-600">
        <p className="font-bold text-gray-800 mb-1">📡 Fuentes de transmisión</p>
        <p className="leading-relaxed">
          Los partidos de <strong>Argentina</strong> se transmiten por Telefe, TyC Sports, DSports, TV Pública y Disney+ Premium.
          La mayoría de los partidos están disponibles en <strong>DSports</strong> y <strong>Paramount+</strong>.
          Verificar disponibilidad según operador de cable/streaming.
        </p>
      </div>
    </>
  )

  // Shared body (tabs + active view), rendered in both the mobile and desktop
  // shells below — mirrors how the section page renders both trees.
  const cuerpo = (
    <>
      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setVista(t.key)}
            className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px transition-colors ${
              vista === t.key
                ? 'border-primary-red text-primary-red'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {vista === 'partidos' && cuerpoPartidos}
      {vista === 'posiciones' && <MundialStandings />}
      {vista === 'eliminatorias' && <MundialKnockout />}
    </>
  )

  return (
    <>
      {/* ✅ MOBILE — matches section page shell */}
      <div className="md:hidden pt-[184px] pb-24">
        <div className="container mx-auto max-w-[1600px] px-4">
          <div className="mb-0 pb-4 py-0 -mt-8">
            {/* Breadcrumbs */}
            <nav className="text-sm md:text-xs text-gray-500 mb-4 mt-0">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium">Mundial 2026</span>
            </nav>

            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 leading-tight mt-6 md:mt-8">
              Mundial 2026
            </h1>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          {cuerpo}

          <Footer />
        </div>
      </div>

      {/* ✅ DESKTOP — matches section page shell */}
      <div className="hidden md:block pt-[80px]">
        <SidelinesLayout sidelineWidth={sidelineWidth}>
          <div className="mb-0 pb-4 px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="text-base md:text-sm text-gray-500 mb-4 mt-4">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium">Mundial 2026</span>
            </nav>

            <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-4 leading-tight mt-4 md:mt-6">
              Mundial 2026
            </h1>

            <div className="border-t border-gray-300 my-4 px-4 md:px-0"></div>
          </div>

          <div className="px-8">{cuerpo}</div>

          <div className="px-8">
            <Footer />
          </div>
        </SidelinesLayout>
      </div>
    </>
  )
}
