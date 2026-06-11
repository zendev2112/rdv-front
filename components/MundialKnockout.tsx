'use client'

import { useMundialKnockout } from '@/lib/useMundialKnockout'
import type { PartidoKO } from '@/lib/mundial2026Api'
import { formatFechaCorta } from '@/lib/mundial2026Data'
import MundialScorers from '@/components/MundialScorers'

function LadoKO({
  nombre,
  flag,
  align,
}: {
  nombre: string
  flag: string
  align: 'right' | 'left'
}) {
  const resuelto = !!flag
  const texto = (
    <span
      className={
        resuelto
          ? `font-semibold text-sm ${nombre === 'Argentina' ? 'text-sky-700' : 'text-gray-900'}`
          : 'text-xs italic text-gray-500'
      }
    >
      {nombre}
    </span>
  )
  const bandera = flag ? (
    <img src={flag} alt="" className="h-4 w-auto rounded-[2px] shrink-0 shadow-sm" loading="lazy" />
  ) : null

  return (
    <span className={`flex items-center gap-1.5 flex-1 min-w-0 ${align === 'right' ? 'justify-end text-right' : ''}`}>
      {align === 'left' && bandera}
      {texto}
      {align === 'right' && bandera}
    </span>
  )
}

function CardKO({ p }: { p: PartidoKO }) {
  const tieneResult = p.golLocal !== null && p.golVisitante !== null

  return (
    <div
      className={`border rounded-lg p-3 ${
        p.enVivo ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-2 text-[10px] font-bold uppercase">
        <span className="text-gray-500">
          {p.enVivo ? (
            <span className="text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
              {p.minuto || 'En vivo'}
            </span>
          ) : p.finalizado ? (
            'Final'
          ) : (
            `${formatFechaCorta(p.fecha)} · ${p.hora} hs`
          )}
        </span>
        {p.sede && <span className="text-gray-400 normal-case font-medium">{p.sede}</span>}
      </div>

      <div className="flex items-center gap-2">
        <LadoKO nombre={p.local} flag={p.localFlag} align="right" />
        {tieneResult ? (
          <span className="font-black text-gray-900 px-1 shrink-0">
            {p.golLocal}–{p.golVisitante}
          </span>
        ) : (
          <span className="text-gray-400 text-[11px] font-semibold px-1 shrink-0">vs</span>
        )}
        <LadoKO nombre={p.visitante} flag={p.visitanteFlag} align="left" />
      </div>

      {/* Goal scorers */}
      <MundialScorers local={p.golesLocal} visitante={p.golesVisitante} size="xs" />
    </div>
  )
}

export default function MundialKnockout() {
  const { rondas, isLoading } = useMundialKnockout()

  if (isLoading && !rondas) {
    return <p className="text-center text-gray-400 py-12">Cargando eliminatorias…</p>
  }
  if (!rondas || rondas.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        Las eliminatorias no están disponibles por el momento.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
        Los equipos se definen a medida que avanza la fase de grupos. Las llaves muestran
        los clasificados provisionales (por ejemplo, <strong>1º Grupo A</strong>) hasta
        que se conozcan los equipos.
      </p>
      {rondas.map((r) => (
        <section key={r.tipo}>
          <h2 className="font-serif text-base font-bold uppercase tracking-wide text-gray-700 mb-3 border-b border-gray-300 pb-2">
            {r.ronda}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {r.partidos.map((p) => (
              <CardKO key={p.id} p={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
