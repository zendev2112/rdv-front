'use client'

import { useMundialStandings } from '@/lib/useMundialStandings'
import type { FilaPosicion } from '@/lib/mundial2026Api'

function Tabla({ grupo, equipos }: { grupo: string; equipos: FilaPosicion[] }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
        <span className="font-serif font-bold text-gray-800">Grupo {grupo}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-100">
            <th className="py-1.5 px-2 text-left font-bold w-6">#</th>
            <th className="py-1.5 px-1 text-left font-bold">Equipo</th>
            <th className="py-1.5 px-1 text-center font-bold w-7">PJ</th>
            <th className="py-1.5 px-1 text-center font-bold w-7 hidden sm:table-cell">G</th>
            <th className="py-1.5 px-1 text-center font-bold w-7 hidden sm:table-cell">E</th>
            <th className="py-1.5 px-1 text-center font-bold w-7 hidden sm:table-cell">P</th>
            <th className="py-1.5 px-1 text-center font-bold w-7 hidden md:table-cell">GF</th>
            <th className="py-1.5 px-1 text-center font-bold w-7 hidden md:table-cell">GC</th>
            <th className="py-1.5 px-1 text-center font-bold w-8">DG</th>
            <th className="py-1.5 px-2 text-center font-bold w-8">Pts</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((e) => (
            <tr
              key={e.nombre}
              className={`border-b border-gray-50 last:border-0 ${
                e.pos <= 2 ? 'bg-green-50' : e.pos === 3 ? 'bg-amber-50' : ''
              }`}
            >
              <td className="py-1.5 px-2 text-gray-400 font-bold">{e.pos}</td>
              <td className="py-1.5 px-1">
                <span className="flex items-center gap-1.5">
                  {e.flag && (
                    <img src={e.flag} alt="" className="h-3.5 w-auto rounded-[1px] shrink-0 shadow-sm" loading="lazy" />
                  )}
                  <span className={`font-medium ${e.nombre === 'Argentina' ? 'text-sky-700 font-bold' : 'text-gray-800'}`}>
                    {e.nombre}
                  </span>
                </span>
              </td>
              <td className="text-center text-gray-600">{e.mp}</td>
              <td className="text-center text-gray-600 hidden sm:table-cell">{e.w}</td>
              <td className="text-center text-gray-600 hidden sm:table-cell">{e.d}</td>
              <td className="text-center text-gray-600 hidden sm:table-cell">{e.l}</td>
              <td className="text-center text-gray-600 hidden md:table-cell">{e.gf}</td>
              <td className="text-center text-gray-600 hidden md:table-cell">{e.ga}</td>
              <td className="text-center text-gray-600">{e.gd > 0 ? `+${e.gd}` : e.gd}</td>
              <td className="text-center font-black text-gray-900">{e.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function MundialStandings() {
  const { grupos, isLoading } = useMundialStandings()

  if (isLoading && !grupos) {
    return <p className="text-center text-gray-400 py-12">Cargando posiciones…</p>
  }
  if (!grupos || grupos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        Las posiciones no están disponibles por el momento.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {grupos.map((g) => (
          <Tabla key={g.grupo} grupo={g.grupo} equipos={g.equipos} />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-5 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-100 border border-green-300" />
          Clasifican (1º y 2º)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
          3º puesto: los 8 mejores avanzan
        </span>
      </div>
    </>
  )
}
