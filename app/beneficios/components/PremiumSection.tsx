// filepath: /home/zen/Documents/rdv-frontend/app/beneficios/components/DarkCarousel.tsx
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BeneficioActivo } from '../types'

export default function DarkCarousel({
  eyebrow,
  title,
  subtitle,
  beneficios,
}: {
  eyebrow: string
  title: string
  subtitle: string
  beneficios: BeneficioActivo[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (!beneficios || beneficios.length === 0) return null

  return (
    <section className="-mx-4 bg-dark-gray px-4 py-12 sm:-mx-6 sm:px-6 sm:py-16 lg:-mx-8 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-gray">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-gray sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* "More" link */}
        <div className="mb-5 flex justify-end">
          <Link
            href="/beneficios/todos"
            className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white"
          >
            Más beneficios &gt;
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Desktop arrow */}
          <button
            onClick={() => {
              const el = scrollRef.current
              if (!el) return
              const w = el.querySelector('a')?.offsetWidth ?? 280
              el.scrollBy({ left: w + 24, behavior: 'smooth' })
            }}
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-gray shadow-lg transition-all hover:shadow-xl lg:flex"
            aria-label="Siguiente"
          >
            ›
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0"
          >
            {beneficios.map((b) => (
              <Link
                key={b.benefit_id}
                href={`/beneficios/${b.business_slug}`}
                className="group flex w-[260px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-dark-gray ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-white/25 sm:w-[280px] lg:w-auto"
              >
                <div className="relative h-36 w-full bg-neutral-800 sm:h-40">
                  {b.logo_url ? (
                    <Image
                      src={b.logo_url}
                      alt={b.business_nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-800 text-4xl">
                      🏪
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70 line-clamp-1">
                    {b.business_nombre}
                  </span>
                  <span className="text-lg font-extrabold text-primary-red">
                    {b.titulo}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-5 h-1 max-w-[120px] overflow-hidden rounded-full bg-white/10 lg:hidden">
          <div
            className="h-full rounded-full bg-primary-red transition-all duration-150"
            style={{ width: `${Math.max(20, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  )
}
