'use client'

import { useState, useMemo } from 'react'
import { BeneficioActivo } from '../types'
import ComercioCard from './ComercioCard'

interface Props {
  comerciosPorCategoria: Record<string, BeneficioActivo[]>
}

export default function BeneficiosGrid({ comerciosPorCategoria }: Props) {
  const [search, setSearch] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)

  const categorias = Object.keys(comerciosPorCategoria)

  const filtered = useMemo(() => {
    const base = categoriaActiva
      ? { [categoriaActiva]: comerciosPorCategoria[categoriaActiva] }
      : comerciosPorCategoria

    if (!search.trim()) return base

    const q = search.toLowerCase()
    return Object.entries(base).reduce<Record<string, BeneficioActivo[]>>(
      (acc, [cat, items]) => {
        const matches = items.filter(
          (i) =>
            i.business_nombre.toLowerCase().includes(q) ||
            i.titulo.toLowerCase().includes(q) ||
            i.categoria_nombre.toLowerCase().includes(q),
        )
        if (matches.length > 0) acc[cat] = matches
        return acc
      },
      {},
    )
  }, [search, categoriaActiva, comerciosPorCategoria])

  return (
    <div className="space-y-6">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray">
          🔍
        </span>
        <input
          type="search"
          placeholder="Buscar comercio o beneficio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-light-gray bg-white py-3 pl-9 pr-4 text-sm text-dark-gray placeholder:text-neutral-gray focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20"
        />
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          <FilterPill
            label="Todos"
            active={categoriaActiva === null}
            onClick={() => setCategoriaActiva(null)}
          />
          {categorias.map((cat) => {
            const icono = comerciosPorCategoria[cat][0]?.categoria_icono ?? '🏪'
            return (
              <FilterPill
                key={cat}
                label={`${icono} ${cat}`}
                active={categoriaActiva === cat}
                onClick={() =>
                  setCategoriaActiva((prev) => (prev === cat ? null : cat))
                }
              />
            )
          })}
        </div>
      </div>

      {Object.keys(filtered).length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-gray">
          Sin resultados para &ldquo;{search}&rdquo;
        </p>
      ) : (
        Object.entries(filtered).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-gray">
              <span>{items[0]?.categoria_icono}</span>
              {cat}
              <span className="ml-auto rounded-full bg-light-gray px-2 py-0.5 text-xs font-normal text-neutral-gray">
                {items.length}
              </span>
            </h2>
            <div className="space-y-3">
              {items.map((comercio) => (
                <ComercioCard
                  key={comercio.business_slug}
                  comercio={comercio}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'bg-primary-red text-white shadow-sm'
          : 'border border-light-gray bg-white text-dark-gray hover:border-primary-red/40'
      }`}
    >
      {label}
    </button>
  )
}
