import Image from 'next/image'
import Link from 'next/link'

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

export default function BeneficiosFooter() {
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
        <div
          className="grid grid-cols-2 gap-10 md:grid-cols-4"
        >
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
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Radio del Volga"
                width={100}
                height={30}
                style={{ objectFit: 'contain', marginBottom: 8 }}
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
    </footer>
  )
}
