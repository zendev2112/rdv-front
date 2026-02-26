'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Bell, Search, MapPin, X } from 'lucide-react'

const SUB_NAV = [
  { label: 'INICIO', href: '/beneficios' },
  { label: 'CORONEL SUÁREZ', href: '/beneficios?categoria=coronel-suarez' },
  { label: 'GASTRO', href: '/beneficios?categoria=gastronomia' },
  { label: 'SALUD', href: '/beneficios?categoria=salud' },
  { label: 'MODA', href: '/beneficios?categoria=moda' },
  { label: 'AGRO', href: '/beneficios?categoria=agro' },
  { label: 'DEPORTES', href: '/beneficios?categoria=deportes' },
]

export default function BeneficiosHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return '¡Buenos días!'
    if (h < 18) return '¡Buenas tardes!'
    return '¡Buenas noches!'
  })()

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--rdv-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* ── DESKTOP main navbar ── */}
      <div
        className="hidden lg:flex"
        style={{
          height: 64,
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 40px',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexShrink: 0,
          }}
        >
          <button
            aria-label="Menú"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <Menu size={24} color="var(--rdv-text-primary)" />
          </button>
          <Link
            href="/beneficios"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Image
              src="https://res.cloudinary.com/dwhu22onh/image/upload/v1772054267/ChatGPT_Image_Feb_25_2026_06_17_02_PM_dn1q21.png"
              alt="Radio del Volga"
              width={120}
              height={40}
              style={{ objectFit: 'contain', maxHeight: 40, width: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Center search */}
        <div style={{ flex: 1, maxWidth: 480 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              color="var(--rdv-text-muted)"
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="search"
              placeholder="Buscá un beneficio..."
              aria-label="Buscar beneficio"
              style={{
                width: '100%',
                height: 40,
                borderRadius: 50,
                background: 'var(--rdv-bg-input)',
                border: 'none',
                paddingLeft: 44,
                paddingRight: 16,
                fontSize: 'var(--font-base)',
                color: 'var(--rdv-text-primary)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            style={{
              borderRadius: 50,
              border: '1px solid var(--rdv-border)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 'var(--font-sm)',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--rdv-text-primary)',
            }}
          >
            <MapPin size={14} />
            Cerca Mío
          </button>
          <a
            href="#sumarse"
            style={{
              borderRadius: 50,
              padding: '8px 20px',
              background: 'var(--rdv-cta)',
              color: 'var(--rdv-cta-text)',
              fontWeight: 700,
              fontSize: 'var(--font-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textDecoration: 'none',
            }}
          >
            Sumarse
          </a>
          <button
            aria-label="Notificaciones"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <Bell size={24} color="var(--rdv-text-primary)" />
          </button>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--rdv-bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-sm)',
              fontWeight: 700,
              color: 'var(--rdv-text-primary)',
              userSelect: 'none',
            }}
          >
            RV
          </div>
        </div>
      </div>

      {/* ── DESKTOP sub-nav ── */}
      <div
        className="hidden lg:flex"
        style={{
          borderTop: '1px solid var(--rdv-border)',
          height: 48,
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 40px',
          alignItems: 'center',
        }}
      >
        {SUB_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--rdv-text-primary)',
              padding: '0 20px',
              height: 48,
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '0.5px',
              textDecoration: 'none',
              borderBottom: '2px solid transparent',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderBottomColor = 'var(--rdv-primary)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderBottomColor = 'transparent')
            }
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/beneficios/newsletters"
          style={{
            marginLeft: 'auto',
            fontSize: 'var(--font-sm)',
            fontWeight: 700,
            color: 'var(--rdv-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
            padding: '0 0 0 20px',
          }}
        >
          ✉ Newsletters
        </Link>
      </div>

      {/* ── TABLET navbar ── */}
      <div
        className="hidden md:flex lg:hidden"
        style={{
          height: 64,
          padding: '0 24px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          aria-label="Menú"
          onClick={() => setMenuOpen(true)}
          style={{
            minWidth: 44,
            minHeight: 44,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Menu size={24} color="var(--rdv-text-primary)" />
        </button>
        <Link
          href="/beneficios"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image
            src="https://res.cloudinary.com/dwhu22onh/image/upload/v1772054267/ChatGPT_Image_Feb_25_2026_06_17_02_PM_dn1q21.png"
            alt="Radio del Volga"
            width={100}
            height={34}
            style={{ objectFit: 'contain', maxHeight: 34, width: 'auto' }}
            priority
          />
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            aria-label="Notificaciones"
            style={{
              minWidth: 44,
              minHeight: 44,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={22} color="var(--rdv-text-primary)" />
          </button>
          <div
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--rdv-bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-sm)',
                fontWeight: 700,
              }}
            >
              RV
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE header (2-row) ── */}
      <div className="md:hidden">
        {/* Row 1 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 8px',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 700,
              color: 'var(--rdv-text-primary)',
            }}
          >
            {greeting}
          </span>
          <button
            aria-label="Notificaciones"
            style={{
              minWidth: 44,
              minHeight: 44,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={24} color="var(--rdv-text-primary)" />
          </button>
        </div>
        {/* Row 2 — search */}
        <div style={{ padding: '0 16px 12px', position: 'relative' }}>
          <Search
            size={16}
            color="var(--rdv-text-muted)"
            style={{
              position: 'absolute',
              left: 32,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="search"
            placeholder="Buscá un beneficio..."
            aria-label="Buscar beneficio"
            style={{
              width: '100%',
              height: 44,
              borderRadius: 50,
              background: 'var(--rdv-bg-input)',
              border: 'none',
              paddingLeft: 44,
              paddingRight: 16,
              fontSize: 'var(--font-base)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* ── Hamburger overlay menu ── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '80%',
              maxWidth: 320,
              background: '#FFFFFF',
              padding: '24px 0',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px 16px',
                borderBottom: '1px solid var(--rdv-border)',
              }}
            >
              <Image
                src="https://res.cloudinary.com/dwhu22onh/image/upload/v1772054267/ChatGPT_Image_Feb_25_2026_06_17_02_PM_dn1q21.png"
                alt="Radio del Volga"
                width={100}
                height={32}
                style={{ objectFit: 'contain', height: 'auto' }}
              />
              <button
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <X size={22} />
              </button>
            </div>
            {SUB_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '14px 20px',
                  fontSize: 'var(--font-base)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--rdv-text-primary)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--rdv-border)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
