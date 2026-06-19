'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Categoria {
  id: number
  nombre: string
  slug: string
  icono: string
}

interface Props {
  categorias: Categoria[]
}

// A single horizontal scroll row of category tiles at every breakpoint (Club La
// Nación style). Desktop adds slide arrows; touch devices just swipe.
export default function CategoryScroller({ categorias }: Props) {
  const pathname = usePathname()
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Slide arrows — desktop only */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Categorías anteriores"
        className="absolute -left-3 top-7 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-gray shadow-md ring-1 ring-black/5 transition-colors hover:bg-gray-50 lg:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Más categorías"
        className="absolute -right-3 top-7 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-gray shadow-md ring-1 ring-black/5 transition-colors hover:bg-gray-50 lg:flex"
      >
        <ChevronRight size={18} />
      </button>

      <nav
        ref={trackRef}
        aria-label="Categorías"
        className="-mx-4 flex gap-3 overflow-x-auto px-4 py-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:scroll-px-2 lg:px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categorias.map((cat) => {
          const active = pathname.startsWith(`/beneficios/${cat.slug}`)
          return (
            <Link
              key={cat.slug}
              href={`/beneficios/${cat.slug}`}
              aria-label={cat.nombre}
              aria-current={active ? 'page' : undefined}
              className="group flex w-[76px] shrink-0 snap-start flex-col items-center gap-2"
            >
              <span
                className={cn(
                  'flex size-16 items-center justify-center rounded-2xl text-2xl transition-all',
                  active
                    ? 'bg-brand text-white shadow-md shadow-brand/25'
                    : 'bg-white shadow-sm ring-1 ring-black/[0.06] group-hover:-translate-y-0.5 group-hover:shadow-md',
                )}
              >
                {cat.icono}
              </span>
              <span
                className={cn(
                  'line-clamp-2 text-center text-[11px] font-semibold leading-tight',
                  active ? 'text-brand' : 'text-dark-gray',
                )}
              >
                {cat.nombre}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
