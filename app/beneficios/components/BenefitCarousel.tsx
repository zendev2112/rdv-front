'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BeneficioActivo } from '../types'

export default function BenefitCarousel({
  title,
  beneficios,
}: {
  title: string
  beneficios: BeneficioActivo[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('a')?.offsetWidth ?? 280
    el.scrollBy({
      left: dir === 'right' ? cardWidth + 24 : -(cardWidth + 24),
      behavior: 'smooth',
    })
  }

  if (!beneficios || beneficios.length === 0) return null

  return (
    <section>
      {/* Header row */}
      <div className="mb-5 flex items-end justify-between sm:mb-6">
        <h2 className="text-xl font-bold text-dark-gray sm:text-2xl">
          {title}
        </h2>
        <Link
          href="/beneficios/todos"
          className="text-xs font-bold uppercase tracking-wider text-primary-red hover:underline"
        >
          Más beneficios &gt;
        </Link>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Desktop arrows */}
        <button
          onClick={() => scrollBy('left')}
          className="absolute -left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl lg:flex"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          onClick={() => scrollBy('right')}
          className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl lg:flex"
          aria-label="Siguiente"
        >
          ›
        </button>

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {beneficios.map((b) => (
            <Link
              key={b.benefit_id}
              href={`/beneficios/${b.business_slug}`}
              className="group relative flex w-[260px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg sm:w-[280px] lg:w-auto"
            >
              {/* Image */}
              <div className="relative h-36 w-full bg-neutral-100 sm:h-40">
                {b.logo_url ? (
                  <Image
                    src={b.logo_url}
                    alt={b.business_nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-100 text-4xl">
                    🏪
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-dark-gray shadow-sm backdrop-blur-sm">
                  {b.categoria_icono && (
                    <span className="mr-1">{b.categoria_icono}</span>
                  )}
                  {b.categoria_nombre}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-gray line-clamp-1">
                  {b.business_nombre}
                </h3>
                <p className="text-base font-extrabold leading-snug text-primary-red line-clamp-2 sm:text-lg">
                  {b.titulo}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress bar — mobile & tablet only */}
      <div className="mx-auto mt-4 h-1 max-w-[120px] overflow-hidden rounded-full bg-neutral-200 sm:mt-5 lg:hidden">
        <div
          className="h-full rounded-full bg-primary-red transition-all duration-150"
          style={{ width: `${Math.max(20, progress * 100)}%` }}
        />
      </div>
    </section>
  )
}
