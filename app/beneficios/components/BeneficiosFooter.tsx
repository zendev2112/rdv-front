'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const COLS = [
  {
    heading: 'Volga Beneficios',
    links: [
      { label: 'Inicio', href: '/beneficios' },
      { label: 'Categorías', href: '/beneficios#categorias' },
      { label: 'Todos los beneficios', href: '/beneficios/todos' },
    ],
  },
  {
    heading: 'Ayuda',
    links: [
      { label: 'Cómo funciona', href: '/beneficios/como-funciona' },
      { label: 'Preguntas frecuentes', href: '/beneficios/faq' },
      { label: 'Reglamento', href: '/beneficios/reglamento' },
    ],
  },
  {
    heading: 'Comercios',
    links: [
      { label: 'Sumar negocio', href: '/beneficios/sumar-negocio' },
      { label: 'Renovar oferta', href: '/beneficios/renovar' },
      { label: 'Estadísticas', href: '/beneficios/estadisticas' },
    ],
  },
  {
    heading: 'Contacto',
    phone: '2926-XXXXXX',
    hours: 'Lun-Vie 8-18hs',
    links: [],
  },
]

const SOCIALS = [
  { label: 'Facebook', icon: '🇫', href: 'https://facebook.com/radiodelvolga' },
  {
    label: 'Instagram',
    icon: '📸',
    href: 'https://instagram.com/radiodelvolga',
  },
  { label: 'YouTube', icon: '▶', href: 'https://youtube.com/@radiodelvolga' },
  { label: 'TikTok', icon: '🎵', href: 'https://tiktok.com/@radiodelvolga' },
]

const NAV_ITEMS = [
  { icon: '🏠', label: 'Inicio', href: '/beneficios' },
  { icon: '🔍', label: 'Buscar', href: '/beneficios/buscar' },
  { icon: '❤️', label: 'Favoritos', href: '/beneficios/favoritos' },
  { icon: '👤', label: 'Perfil', href: '/beneficios/perfil' },
  { icon: '⋯', label: 'Más', href: '/beneficios/mas' },
]

export default function BeneficiosFooter() {
  const pathname = usePathname()

  return (
    <footer
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid var(--rdv-border)',
        padding: '60px 0 40px',
      }}
    >
      <div
        style={{ maxWidth: 1280, margin: '0 auto' }}
        className="px-4 sm:px-6 lg:px-10"
      >
        {/* Row 1 — 4-col link directory */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {COLS.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontSize: 'var(--font-sm)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--rdv-text-primary)',
                  margin: '0 0 16px',
                  letterSpacing: '0.5px',
                }}
              >
                {col.heading}
              </p>

              {col.phone && (
                <>
                  <p
                    style={{
                      fontSize: 'var(--font-2xl)',
                      fontWeight: 800,
                      color: 'var(--rdv-primary)',
                      margin: '0 0 4px',
                    }}
                  >
                    {col.phone}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--rdv-text-secondary)',
                      margin: '0 0 8px',
                      lineHeight: 2,
                    }}
                  >
                    {col.hours}
                  </p>
                </>
              )}

              {col.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'block',
                    fontSize: 13,
                    color: 'var(--rdv-text-secondary)',
                    textDecoration: 'none',
                    lineHeight: 2,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--rdv-border)',
            margin: '40px 0',
          }}
        />

        {/* Row 2 — social + logo */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Social icons */}
          <div>
            <p
              style={{
                fontSize: 'var(--font-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--rdv-text-primary)',
                margin: '0 0 12px',
                letterSpacing: '0.5px',
              }}
            >
              SEGUINOS EN NUESTRAS REDES
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--rdv-bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Logo + copyright */}
          <div style={{ textAlign: 'right' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: 8 }}>
              <Image
                src="https://res.cloudinary.com/dwhu22onh/image/upload/v1772054267/ChatGPT_Image_Feb_25_2026_06_17_02_PM_dn1q21.png"
                alt="Radio del Volga"
                width={120}
                height={38}
                style={{ objectFit: 'contain', height: 'auto' }}
              />
            </Link>
            <p
              style={{
                fontSize: 12,
                color: 'var(--rdv-text-muted)',
                margin: 0,
              }}
            >
              © 2026 Radio del Volga. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Navegación inferior */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid var(--rdv-border)',
          padding: '0 0 max(0px, env(safe-area-inset-bottom))',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)',
        }}
        aria-label="Navegación inferior"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'stretch',
            height: 64,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  flex: 1,
                  textDecoration: 'none',
                  color: isActive
                    ? 'var(--rdv-primary)'
                    : 'var(--rdv-text-muted)',
                  transition: 'all 0.2s ease',
                  borderTop: isActive
                    ? '3px solid var(--rdv-primary)'
                    : '3px solid transparent',
                  paddingTop: 0,
                  position: 'relative',
                }}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    lineHeight: 1,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: isActive ? 700 : 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    color: 'inherit',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </footer>
  )
}
