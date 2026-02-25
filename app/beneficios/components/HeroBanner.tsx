'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BeneficioActivo } from '../types'

interface Props {
  featured: BeneficioActivo[]
}

const SLIDES = [
  {
    label1: '2x1',
    sub1: 'EN GASTRONOMÍA',
    label2: '35% OFF',
    sub2: 'EN MODA',
    label3: '20% OFF',
    sub3: 'EN SALUD',
  },
]

export default function HeroBanner({ featured }: Props) {
  const [active, setActive] = useState(0)
  const total = Math.max(featured.length, 1)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 420,
        overflow: 'hidden',
      }}
    >
      {/* Background image / gradient placeholder */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, #1A0000 0%, #8B0000 60%, #C0392B 100%)',
        }}
        aria-hidden="true"
      />

      {/* Offer pill — desktop top-left, tablet centered */}
      <div
        className="hidden md:flex"
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#FFFFFF',
          borderRadius: 50,
          padding: '16px 0',
          alignItems: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          zIndex: 10,
        }}
      >
        {/* Logo circle */}
        <div
          style={{
            padding: '0 24px',
            borderRight: '1px solid var(--rdv-border)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--rdv-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>
              RV
            </span>
          </div>
        </div>
        {/* Offer columns */}
        {[
          { val: '2x1', sub: 'EN GASTRO' },
          { val: '35% OFF', sub: 'EN MODA' },
          { val: '20% OFF', sub: 'EN SALUD' },
        ].map((o, i, arr) => (
          <div
            key={i}
            style={{
              padding: '0 24px',
              borderRight:
                i < arr.length - 1 ? '1px solid var(--rdv-border)' : undefined,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: 800,
                color: 'var(--rdv-text-primary)',
                lineHeight: 1.1,
              }}
            >
              {o.val}
            </div>
            <div
              style={{
                fontSize: 'var(--font-xs)',
                textTransform: 'uppercase',
                color: 'var(--rdv-text-muted)',
                marginTop: 4,
              }}
            >
              {o.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Left arrow */}
      <button
        onClick={() => setActive((a) => (a - 1 + total) % total)}
        aria-label="Anterior"
        style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => setActive((a) => (a + 1) % total)}
        aria-label="Siguiente"
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 10,
        }}
      >
        {Array.from({ length: Math.min(total, 5) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Diapositiva ${i + 1}`}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: i === active ? 4 : '50%',
              background: i === active ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Mobile overlay offer block */}
      <div
        className="md:hidden"
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 12,
          padding: '10px 14px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 'var(--font-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--rdv-text-primary)',
          }}
        >
          Volga Beneficios
        </div>
        <div
          style={{
            fontSize: 'var(--font-xl)',
            fontWeight: 800,
            color: 'var(--rdv-primary)',
          }}
        >
          35% OFF
        </div>
        <div
          style={{ fontSize: 'var(--font-xs)', color: 'var(--rdv-text-muted)' }}
        >
          Hasta el 30/06
        </div>
      </div>
    </div>
  )
}
