'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Slide = {
  image: string
  alt: string
  icono: string
  categoria: string
  titulo: string
  comercio: string
  href: string
}

// Curated rotating hero. Each slide is a real seeded product; the info card is
// synced to the photo behind it (same product), so the card "reads" the image.
const SLIDES: Slide[] = [
  {
    image:
      'https://res.cloudinary.com/dptdloagw/image/upload/v1781814765/megan-thomas-xMh_ww8HN_Q-unsplash_fvdezo.jpg',
    alt: 'Frutas y verduras frescas',
    icono: '🥬',
    categoria: 'Verdulería',
    titulo: '20% en frutas y verduras',
    comercio: 'Verdulería La Huerta',
    href: '/beneficios/verduleria/verduleria-la-huerta',
  },
  {
    image:
      'https://res.cloudinary.com/dptdloagw/image/upload/v1781814596/premium_photo-1719530458136-b55f1cbcb034_joovgt.avif',
    alt: 'Pescado fresco en la pescadería',
    icono: '🐟',
    categoria: 'Pescadería',
    titulo: '2x1 en pescado fresco',
    comercio: 'Pescadería Mar del Sur',
    href: '/beneficios/pescaderia/pescaderia-mar-del-sur',
  },
  {
    image:
      'https://res.cloudinary.com/dptdloagw/image/upload/v1781814603/close-up-dispenser-liquid-soap-female-hands-store_ihjdia.jpg',
    alt: 'Productos de limpieza',
    icono: '🧴',
    categoria: 'Limpieza',
    titulo: '15% en artículos de limpieza',
    comercio: 'Brillo Total',
    href: '/beneficios/limpieza/limpieza-brillo-total',
  },
  {
    image:
      'https://res.cloudinary.com/dptdloagw/image/upload/v1781814596/premium_photo-1661726457110-c43a88d74567_omsntv.avif',
    alt: 'Productos de cosmética',
    icono: '💄',
    categoria: 'Cosmética',
    titulo: '30% en cosmética',
    comercio: 'Cosmética Bella',
    href: '/beneficios/cosmetica/cosmetica-bella-suarez',
  },
]

export default function HeroBanner() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = SLIDES.length

  useEffect(() => {
    if (paused) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((p) => (p + 1) % n), 5500)
    return () => clearInterval(t)
  }, [paused, n])

  const go = (d: number) => setI((p) => (p + d + n) % n)
  const active = SLIDES[i]

  return (
    <section
      aria-label="Beneficios destacados"
      className="relative h-[440px] w-full overflow-hidden bg-dark-gray sm:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Rotating photos (opacity crossfade — GPU-friendly) */}
      {SLIDES.map((s, idx) => (
        <Image
          key={s.href}
          src={s.image}
          alt={s.alt}
          fill
          priority={idx === 0}
          sizes="100vw"
          className={cn(
            'object-cover transition-opacity duration-700 ease-out',
            idx === i ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}

      {/* Legibility scrim — darker toward the bottom-left where the card sits */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/25 to-transparent"
      />

      {/* Arrows (desktop) */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Anterior"
        className="absolute right-16 top-6 z-20 hidden size-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25 md:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Siguiente"
        className="absolute right-4 top-6 z-20 hidden size-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25 md:flex"
      >
        <ChevronRight size={18} />
      </button>

      {/* Info card — the evolved "pill", synced to the active photo.
          overflow-hidden clips children to the radius (fixes the squared-corner
          hover from the old multi-button pill). */}
      <div className="absolute inset-x-4 bottom-5 z-10 sm:inset-x-auto sm:left-10 sm:max-w-[420px]">
        <div className="overflow-hidden rounded-2xl bg-white/95 p-5 shadow-xl ring-1 ring-black/5 backdrop-blur-sm sm:p-6">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand">
            <span aria-hidden>{active.icono}</span>
            {active.categoria}
          </p>
          <h1 className="mt-1 text-balance text-2xl font-extrabold leading-tight text-dark-gray sm:text-3xl">
            {active.titulo}
          </h1>
          <p className="mt-1 text-sm text-neutral-gray">{active.comercio}</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Link
              href={active.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Ver beneficio
              <ArrowRight size={16} />
            </Link>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.href}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Ir a ${s.categoria}`}
                  aria-current={idx === i}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    idx === i ? 'w-5 bg-brand' : 'w-2 bg-neutral-gray/40 hover:bg-neutral-gray/60',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
