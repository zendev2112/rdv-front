'use client'

import { useState, useMemo } from 'react'
import { BeneficioActivo, Categoria } from '../types'
import CategoryFilter from './CategoryFilter'
import ComercioCard from './ComercioCard'

export default function ComercioGrid({
  beneficios,
}: {
  beneficios: BeneficioActivo[]
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Extract unique categories with counts
  const categorias = useMemo<Categoria[]>(() => {
    const map = new Map<string, Categoria>()
    const seenBusiness = new Map<string, Set<string>>()

    beneficios.forEach((b) => {
      if (!map.has(b.categoria_slug)) {
        map.set(b.categoria_slug, {
          id: b.categoria_id,
          nombre: b.categoria_nombre,
          slug: b.categoria_slug,
          icono: b.categoria_icono,
          count: 0,
        })
        seenBusiness.set(b.categoria_slug, new Set())
      }
      const seen = seenBusiness.get(b.categoria_slug)!
      if (!seen.has(b.business_slug)) {
        seen.add(b.business_slug)
        map.get(b.categoria_slug)!.count++
      }
    })

    return Array.from(map.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre),
    )
  }, [beneficios])

  // Build unique comercios for display
  const comercios = useMemo(() => {
    const filtered = activeCategory
      ? beneficios.filter((b) => b.categoria_slug === activeCategory)
      : beneficios

    const map = new Map<
      string,
      {
        slug: string
        nombre: string
        descripcion: string | null
        logo_url: string | null
        categoria_nombre: string
        categoria_icono: string | null
        benefitCount: number
      }
    >()

    filtered.forEach((b) => {
      if (!map.has(b.business_slug)) {
        map.set(b.business_slug, {
          slug: b.business_slug,
          nombre: b.business_nombre,
          descripcion: b.business_descripcion,
          logo_url: b.logo_url,
          categoria_nombre: b.categoria_nombre,
          categoria_icono: b.categoria_icono,
          benefitCount: 0,
        })
      }
      map.get(b.business_slug)!.benefitCount++
    })

    return Array.from(map.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre),
    )
  }, [beneficios, activeCategory])

  return (
    <>
      {/* Category filter */}
      <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
        <CategoryFilter categorias={categorias} onSelect={setActiveCategory} />
      </div>

      {/* Results count */}
      <p className="mb-4 mt-2 text-sm text-neutral-gray">
        {comercios.length} comercio{comercios.length !== 1 ? 's' : ''}{' '}
        {activeCategory ? 'en esta categoría' : 'disponibles'}
      </p>

      {/* Grid */}
      {comercios.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comercios.map((c) => (
            <ComercioCard key={c.slug} {...c} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-semibold text-dark-gray">
            No hay comercios en esta categoría
          </p>
          <p className="mt-1 text-sm text-neutral-gray">
            Probá con otra categoría o volvé pronto.
          </p>
        </div>
      )}
    </>
  )
}
