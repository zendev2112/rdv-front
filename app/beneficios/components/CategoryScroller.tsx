'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Categoria {
  id: number
  nombre: string
  slug: string
  icono: string
}

interface Props {
  categorias: Categoria[]
}

export default function CategoryScroller({ categorias }: Props) {
  const searchParams = useSearchParams()
  const activeSlug = searchParams.get('categoria')

  return (
    <div>
      {/* Desktop: 9-col grid overlapping hero */}
      <div
        className="hidden lg:grid"
        style={{
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: 12,
          position: 'relative',
          zIndex: 10,
          marginTop: -48,
        }}
      >
        {categorias.map((cat) => (
          <CategoryCard
            key={cat.slug}
            cat={cat}
            active={activeSlug === cat.slug}
          />
        ))}
      </div>

      {/* Tablet: ~6.5 visible */}
      <div
        className="hidden md:flex lg:hidden"
        style={{
          overflowX: 'auto',
          gap: 12,
          paddingBottom: 16,
          scrollbarWidth: 'none',
          position: 'relative',
          zIndex: 10,
          marginTop: -48,
        }}
      >
        {categorias.map((cat) => (
          <div
            key={cat.slug}
            style={{ minWidth: 'calc((100vw - 32px) / 6.5)', flexShrink: 0 }}
          >
            <CategoryCard cat={cat} active={activeSlug === cat.slug} />
          </div>
        ))}
      </div>

      {/* Mobile: ~3.5 visible, below header */}
      <div
        className="flex md:hidden"
        style={{
          overflowX: 'auto',
          gap: 12,
          padding: '20px 0 20px 16px',
          scrollbarWidth: 'none',
        }}
      >
        {categorias.map((cat) => (
          <div
            key={cat.slug}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              minWidth: 72,
            }}
          >
            <Link
              href={`/beneficios?categoria=${cat.slug}`}
              aria-label={cat.nombre}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background:
                    activeSlug === cat.slug ? 'var(--rdv-primary)' : '#FFFFFF',
                  boxShadow: '0 2px 8px var(--rdv-shadow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                {cat.icono}
              </div>
            </Link>
            <span
              style={{
                fontSize: 'var(--font-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                textAlign: 'center',
                color: 'var(--rdv-text-primary)',
              }}
            >
              {cat.nombre}
            </span>
          </div>
        ))}
      </div>

      {/* "Atención a Socios" pill */}
      <div className="hidden md:flex" style={{ marginTop: 16 }}>
        <button
          style={{
            borderRadius: 50,
            border: '1px solid var(--rdv-border)',
            padding: '10px 20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 'var(--font-sm)',
            color: 'var(--rdv-text-primary)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              background: 'var(--rdv-primary)',
              color: '#fff',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            ?
          </span>
          Atención a Socios
        </button>
      </div>
    </div>
  )
}

function CategoryCard({
  cat,
  active,
}: {
  cat: { nombre: string; slug: string; icono: string }
  active: boolean
}) {
  return (
    <Link
      href={`/beneficios?categoria=${cat.slug}`}
      aria-label={cat.nombre}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: active
            ? `0 4px 16px rgba(139,0,0,0.25)`
            : '0 4px 16px rgba(0,0,0,0.12)',
          padding: '16px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          border: active
            ? '2px solid var(--rdv-primary)'
            : '2px solid transparent',
          transition: 'all 0.15s',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: active ? 'var(--rdv-primary)' : 'var(--rdv-bg-input)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          {cat.icono}
        </div>
        <span
          style={{
            fontSize: 'var(--font-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--rdv-text-primary)',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {cat.nombre}
        </span>
      </div>
    </Link>
  )
}
