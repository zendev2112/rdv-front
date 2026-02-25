import Link from 'next/link'
import { BeneficioActivo } from '../types'
import BeneficioCarousel from './BeneficioCarousel'

interface Props {
  beneficios: BeneficioActivo[]
}

export default function SociosDestacados({ beneficios }: Props) {
  return (
    <section
      style={{
        background: 'var(--rdv-premium-bg)',
        padding: '64px 0',
        marginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 3,
              color: 'rgba(255,255,255,0.5)',
              margin: '0 0 12px',
            }}
          >
            PROGRAMA
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 5vw, var(--font-4xl))',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 2,
              margin: '0 0 8px',
            }}
          >
            SOCIOS DESTACADOS
          </h2>
          <p
            style={{
              fontSize: 'var(--font-md)',
              color: 'rgba(255,255,255,0.7)',
              margin: 0,
            }}
          >
            Beneficios exclusivos para socios de Radio del Volga
          </p>
        </div>

        {/* More link */}
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}
        >
          <Link
            href="/beneficios"
            style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textDecoration: 'none',
            }}
          >
            MÁS BENEFICIOS &gt;
          </Link>
        </div>

        {/* Carousel */}
        <div style={{ marginTop: 8 }}>
          <BeneficioCarousel
            title=""
            beneficios={beneficios}
            dark={true}
            moreHref="/beneficios"
          />
        </div>

        {/* Mobile utility pill */}
        <div className="md:hidden" style={{ margin: '24px 16px 0' }}>
          <Link
            href="/beneficios"
            style={{
              borderRadius: 50,
              background: 'rgba(255,255,255,0.1)',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              color: '#FFFFFF',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 'var(--font-base)',
              }}
            >
              <span style={{ fontSize: 18 }}>👑</span>
              Ver todos los Socios Destacados
            </span>
            <span style={{ fontSize: 18 }}>&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
