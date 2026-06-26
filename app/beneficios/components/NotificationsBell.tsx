'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'

// The header bell with an unread-count badge and a dropdown of recent
// notifications. Feed comes from /api/beneficios/notifications (empty for
// logged-out visitors, so the badge just never appears). Opening the dropdown
// marks everything read and clears the badge.
type Item = {
  id: string
  title: string
  body: string | null
  url: string | null
  read_at: string | null
  created_at: string
}

// Spanish relative time for the notification timestamps.
function hace(iso: string): string {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'recién'
  const m = Math.round(s / 60)
  if (m < 60) return `hace ${m} min`
  const h = Math.round(m / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.round(h / 24)
  if (d === 1) return 'ayer'
  if (d < 7) return `hace ${d} días`
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

export default function NotificationsBell({ size = 24 }: { size?: number }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  async function load() {
    try {
      const res = await fetch('/api/beneficios/notifications', { cache: 'no-store' })
      if (!res.ok) return
      const j = await res.json()
      setItems(j.items || [])
      setUnread(j.unread || 0)
    } catch {
      /* offline / not logged in — leave the bell quiet */
    }
  }

  // Load on mount and whenever the tab regains focus (so a push received while
  // away shows up in the bell when the user comes back).
  useEffect(() => {
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  // Close the dropdown on an outside click.
  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next && unread > 0) {
      // Optimistically clear, then persist.
      setUnread(0)
      const now = new Date().toISOString()
      setItems((xs) => xs.map((x) => ({ ...x, read_at: x.read_at || now })))
      try {
        await fetch('/api/beneficios/notifications/read', { method: 'POST' })
      } catch {
        /* best-effort; next load() reconciles */
      }
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        aria-label="Notificaciones"
        onClick={toggle}
        style={{
          minWidth: 44,
          minHeight: 44,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Bell size={size} color="var(--rdv-text-primary)" />
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              borderRadius: 9,
              background: '#e11d2a',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              boxSizing: 'border-box',
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: 320,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: 380,
            overflowY: 'auto',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            border: '1px solid #eee',
            zIndex: 200,
          }}
        >
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid #f0f0f0',
              fontWeight: 800,
              fontSize: 14,
              color: '#1a1a1a',
            }}
          >
            Notificaciones
          </div>
          {items.length === 0 ? (
            <div style={{ padding: '24px 14px', color: '#888', fontSize: 13, textAlign: 'center' }}>
              No tenés notificaciones todavía.
            </div>
          ) : (
            items.map((n) => {
              const inner = (
                <div
                  style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid #f5f5f5',
                    background: n.read_at ? '#fff' : '#fff7f7',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{n.title}</div>
                  {n.body && (
                    <div style={{ fontSize: 13, color: '#444', marginTop: 2 }}>{n.body}</div>
                  )}
                  <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{hace(n.created_at)}</div>
                </div>
              )
              return n.url ? (
                <a
                  key={n.id}
                  href={n.url}
                  onClick={() => setOpen(false)}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  {inner}
                </a>
              ) : (
                <div key={n.id}>{inner}</div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
