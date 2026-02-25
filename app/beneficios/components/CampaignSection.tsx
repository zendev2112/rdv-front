// filepath: /home/zen/Documents/rdv-frontend/app/beneficios/components/CampaignSection.tsx
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BeneficioActivo } from '../types'
import BeneficioCard from './BeneficioCard'

interface Props {
  eyebrow?: string
  title?: string
  beneficios: BeneficioActivo[]
}

export default function CampaignSection({
  eyebrow = 'DESCUBRÍ',
  title = '¡Comercios de temporada!',
  beneficios,
}: Props) {
  return (
    <section style={{ marginTop: 80 }}>
      {/* Mobile/Tablet: stacked text then carousel */}
      <div className="lg:hidden">
        <div style={{ padding: '0 16px', marginBottom: 20 }}>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--rdv-text-muted)',
              letterSpacing: '1.5px',
              margin: '0 0 8px',
            }}
          >
            {eyebrow}
          </p>
          <h2
            style={{
              fontSize: 'var(--font-3xl)',
              fontWeight: 800,
              color: 'var(--rdv-text-primary)',
              lineHeight: 1.1,
              margin: '0 0 12px',
            }}
          >
            {title}
          </h2>
          <Link
            href="/beneficios"
            style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--rdv-primary)',
              textDecoration: 'none',
            }}
          >
            MÁS BENEFICIOS &gt;
          </Link>
        </div>
        <div className="rdv-carousel-track" style={{ paddingLeft: 16 }}>
          {beneficios.map((b) => (
            <div
              key={b.benefit_id}
              className="rdv-carousel-card"
              style={{ minWidth: 'clamp(220px, 70vw, 300px)' }}
            >
              <BeneficioCard beneficio={b} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: split layout */}
      <div
        className="hidden lg:grid"
        style={{
          gridTemplateColumns: '1fr 2fr',
          gap: '10%',
          alignItems: 'center',
        }}
      >
        {/* Left — text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--rdv-text-muted)',
              letterSpacing: '1.5px',
              margin: '0 0 12px',
            }}
          >
            {eyebrow}
          </p>
          <h2
            style={{
              fontSize: 'var(--font-3xl)',
              fontWeight: 800,
              color: 'var(--rdv-text-primary)',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            {title}
          </h2>
          <Link
            href="/beneficios"
            style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--rdv-primary)',
              textDecoration: 'none',
            }}
          >
            MÁS BENEFICIOS &gt;
          </Link>
        </div>

        {/* Right — 2x2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {beneficios.slice(0, 4).map((b) => (
            <BeneficioCard key={b.benefit_id} beneficio={b} />
          ))}
        </div>
      </div>
    </section>
  )
}
