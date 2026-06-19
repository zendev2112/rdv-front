'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BeneficioActivo } from '../types'
import BeneficioCard from './BeneficioCard'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  beneficios: BeneficioActivo[]
  dark?: boolean
  moreHref?: string
}

// One horizontally-scrollable row at every breakpoint (Club La Nación style).
// Desktop gets arrow buttons that scroll the SAME track — the previous version
// only showed 4 cards and the arrow scrolled a hidden element (dead on desktop).
export default function BeneficioCarousel({
  title,
  beneficios,
  dark = false,
  moreHref = '/beneficios',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const showArrows = beneficios.length > 4

  return (
    <section className="relative">
      {title && (
        <div className="mb-5 flex items-baseline justify-between gap-4 pr-2">
          <h2
            className={cn(
              'text-balance text-xl font-bold sm:text-2xl',
              dark ? 'text-white' : 'text-dark-gray',
            )}
          >
            {title}
          </h2>
          <Link
            href={moreHref}
            className={cn(
              'whitespace-nowrap text-xs font-bold uppercase tracking-wide',
              dark ? 'text-white' : 'text-brand',
            )}
          >
            Más beneficios ›
          </Link>
        </div>
      )}

      <div className="relative">
        {showArrows && (
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="absolute -left-4 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-gray shadow-md ring-1 ring-black/5 transition-colors hover:bg-gray-50 lg:flex"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div
          ref={trackRef}
          className="flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {beneficios.map((b) => (
            <div
              key={b.benefit_id}
              className="w-[78vw] shrink-0 snap-start sm:w-[300px] lg:w-[calc((100%-3rem)/4)]"
            >
              <BeneficioCard beneficio={b} dark={dark} />
            </div>
          ))}
        </div>

        {showArrows && (
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className="absolute -right-4 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-gray shadow-md ring-1 ring-black/5 transition-colors hover:bg-gray-50 lg:flex"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </section>
  )
}
