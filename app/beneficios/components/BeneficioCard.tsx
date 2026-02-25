'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BeneficioActivo } from '../types'

interface Props {
  beneficio: BeneficioActivo
  dark?: boolean
}

export default function BeneficioCard({ beneficio, dark = false }: Props) {
  const cardStyle: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.05)' : 'var(--rdv-bg-white)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'var(--rdv-border)'}`,
    borderRadius: 12,
    boxShadow: dark ? 'none' : '0 2px 8px var(--rdv-shadow)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    transition: 'box-shadow 0.2s',
  }

  return (
    <Link
      href={`/beneficios/${beneficio.business_slug}`}
      style={cardStyle}
      className="rdv-carousel-card group"
      aria-label={`Ver beneficio de ${beneficio.business_nombre}`}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)' }}>
        {beneficio.logo_url ? (
          <Image
            src={beneficio.logo_url}
            alt={beneficio.business_nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 70vw, (max-width: 1200px) 40vw, 25vw"
          />
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>
            {beneficio.categoria_icono}
          </span>
        )}
      </div>

      {/* Text */}
      <div style={{ padding: '12px 14px 14px', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{
            fontSize: 'var(--font-sm)', fontWeight: 700,
            textTransform: 'uppercase',
            color: dark ? '#FFFFFF' : 'var(--rdv-text-primary)',
            maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {beneficio.business_nombre}
          </span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.4)' : 'var(--rdv-text-muted)' }}>
              HASTA
            </div>
            <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: dark ? 'var(--rdv-primary-light)' : 'var(--rdv-primary)', lineHeight: 1.1 }}>
              {beneficio.titulo.match(/\d+%/)?.[0] ?? beneficio.categoria_icono}
            </div>
          </div>
        </div>
        <p style={{ marginTop: 6, fontSize: 'var(--font-xs)', color: dark ? 'rgba(255,255,255,0.6)' : 'var(--rdv-text-secondary)', lineHeight: 1.4 }}
          className="line-clamp-2">
          {beneficio.titulo}
        </p>
      </div>
    </Link>
  )
}