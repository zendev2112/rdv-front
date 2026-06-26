'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search, X, Tag } from 'lucide-react'
import CuentaButton from './CuentaButton'
import NotificationsBell from './NotificationsBell'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

type NavItem = { label: string; href: string }

// Fixed entries; the category entries are appended dynamically below.
const FIXED_NAV: NavItem[] = [
  { label: 'INICIO', href: '/beneficios' },
  { label: 'TODOS LOS BENEFICIOS', href: '/beneficios/todos' },
]

export default function BeneficiosHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>(FIXED_NAV)

  useEffect(() => {
    const supabase = createBeneficiosBrowserClient()
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session?.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Build the category nav from categories that ACTUALLY have active benefits,
  // so every link resolves to a real page (no dead links; auto-updates as
  // merchants join). One lightweight query, deduped client-side.
  useEffect(() => {
    const supabase = createBeneficiosBrowserClient()
    let active = true
    supabase
      .from('beneficios_activos')
      .select('categoria_slug, categoria_nombre, categoria_icono')
      .then(({ data }) => {
        if (!active || !data) return
        const seen = new Map<string, NavItem>()
        for (const r of data) {
          if (!seen.has(r.categoria_slug)) {
            seen.set(r.categoria_slug, {
              label: String(r.categoria_nombre).toUpperCase(),
              href: `/beneficios/${r.categoria_slug}`,
            })
          }
        }
        const cats = Array.from(seen.values()).sort((a, b) =>
          a.label.localeCompare(b.label),
        )
        setNavItems([...FIXED_NAV, ...cats])
      })
    return () => {
      active = false
    }
  }, [])

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
            onClick={() => setMenuOpen(true)}
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
          {/*           <button
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
          </button> */}
          {/*           <a
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
          </a> */}
          <NotificationsBell size={24} />
          <CuentaButton />
          {/*           <div
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
          </div> */}
        </div>
      </div>

      {/* ── DESKTOP sub-nav — single entry to the full listing ── */}
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
        <Link
          href="/beneficios/todos"
          className="group inline-flex h-12 items-center gap-2 text-sm font-bold text-dark-gray"
        >
          <Tag size={16} className="text-brand" />
          <span className="border-b-2 border-transparent transition-colors group-hover:border-brand">
            Todos los beneficios de Coronel Suárez
          </span>
        </Link>
        {/*         <Link
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
        </Link> */}
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
          <NotificationsBell size={22} />
          <CuentaButton compact />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              aria-label="Menú"
              onClick={() => setMenuOpen(true)}
              style={{
                minWidth: 44,
                minHeight: 44,
                marginLeft: -10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Menu size={24} color="var(--rdv-text-primary)" />
            </button>
            <span
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 700,
                color: 'var(--rdv-text-primary)',
              }}
            >
              {greeting}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CuentaButton compact />
            <NotificationsBell size={24} />
          </div>
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
            {navItems.map((item) => (
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
            {loggedIn &&
              [
                { label: 'Mis canjes', href: '/beneficios/mis-canjes' },
                { label: 'Favoritos', href: '/beneficios/favoritos' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '14px 20px',
                    fontSize: 'var(--font-base)',
                    fontWeight: 600,
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
