'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { BeneficioActivo } from '../types'
import BeneficioCard from './BeneficioCard'

interface Props {
  title: string
  beneficios: BeneficioActivo[]
  dark?: boolean
  moreHref?: string
}

export default function BeneficioCarousel({
  title,
  beneficios,
  dark = false,
  moreHref = '/beneficios',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollNext = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({
        left: trackRef.current.offsetWidth * 0.8,
        behavior: 'smooth',
      })
    }
  }

  const textColor = dark ? '#FFFFFF' : 'var(--rdv-text-primary)'
  const linkColor = dark ? '#FFFFFF' : 'var(--rdv-primary)'

  return (
    <section>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 24,
          paddingRight: 16,
        }}
      >
        <h2
          style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 700,
            color: textColor,
            margin: 0,
          }}
        >
          {title}
        </h2>
        <Link
          href={moreHref}
          style={{
            fontSize: 'var(--font-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: linkColor,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          MÁS BENEFICIOS &gt;
        </Link>
      </div>

      {/* Desktop: 4-col grid with floating chevron */}
      <div className="hidden lg:block" style={{ position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
        >
          {beneficios.slice(0, 4).map((b) => (
            <BeneficioCard key={b.benefit_id} beneficio={b} dark={dark} />
          ))}
        </div>
        {/* Floating chevron */}
        <button
          onClick={scrollNext}
          aria-label="Ver más beneficios"
          style={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: dark ? 'rgba(255,255,255,0.15)' : '#FFFFFF',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight
            size={18}
            color={dark ? '#FFFFFF' : 'var(--rdv-text-primary)'}
          />
        </button>
        {/* Progress bar */}
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}
        >
          <div
            style={{
              width: 80,
              height: 4,
              borderRadius: 2,
              background: dark ? 'rgba(255,255,255,0.15)' : 'var(--rdv-border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '33%',
                height: '100%',
                background: 'var(--rdv-primary)',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* Tablet/Mobile: scroll carousel */}
      <div className="lg:hidden" style={{ paddingLeft: 0 }}>
        <div
          ref={trackRef}
          className="rdv-carousel-track"
          style={{ paddingBottom: 8 }}
        >
          {beneficios.map((b) => (
            <div
              key={b.benefit_id}
              className="rdv-carousel-card"
              style={{ minWidth: 'clamp(240px, 70vw, 320px)' }}
            >
              <BeneficioCard beneficio={b} dark={dark} />
            </div>
          ))}
        </div>
        {/* Progress bar — tablet only */}
        <div
          className="hidden md:flex"
          style={{ justifyContent: 'center', marginTop: 16 }}
        >
          <div
            style={{
              width: 80,
              height: 4,
              borderRadius: 2,
              background: dark ? 'rgba(255,255,255,0.2)' : 'var(--rdv-border)',
            }}
          >
            <div
              style={{
                width: '33%',
                height: '100%',
                background: 'var(--rdv-primary)',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
