'use client'

import { useState } from 'react'
import { Categoria } from '../types'

export default function CategoryFilter({
  categorias,
  onSelect,
}: {
  categorias: Categoria[]
  onSelect: (slug: string | null) => void
}) {
  const [active, setActive] = useState<string | null>(null)

  const handleClick = (slug: string | null) => {
    setActive(slug)
    onSelect(slug)
  }

  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <button
        onClick={() => handleClick(null)}
        className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          active === null
            ? 'bg-primary-red text-white shadow-md shadow-primary-red/20'
            : 'bg-white text-dark-gray hover:bg-neutral-100 border border-neutral-200'
        }`}
      >
        Todos
      </button>

      {categorias.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleClick(cat.slug)}
          className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            active === cat.slug
              ? 'bg-primary-red text-white shadow-md shadow-primary-red/20'
              : 'bg-white text-dark-gray hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          {cat.icono && <span className="text-base">{cat.icono}</span>}
          {cat.nombre}
          <span
            className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
              active === cat.slug
                ? 'bg-white/20 text-white'
                : 'bg-neutral-100 text-neutral-gray'
            }`}
          >
            {cat.count}
          </span>
        </button>
      ))}
    </div>
  )
}
