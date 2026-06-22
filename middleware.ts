import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Bridges request/response cookies into a Supabase server client for the given
// project credentials. The @supabase/ssr storage key is derived from the project
// ref, so the main-portal and beneficios sessions live in distinct cookies and
// never collide even though both run here.
function makeClient(req: NextRequest, res: NextResponse, url: string, anonKey: string) {
  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        req.cookies.set({ name, value, ...options })
        res.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        req.cookies.set({ name, value: '', ...options })
        res.cookies.set({ name, value: '', ...options })
      },
    },
  })
}

async function isValidUser(supabase: ReturnType<typeof makeClient>): Promise<boolean> {
  // getSession() is local (no network); only validate with getUser() if there is one.
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return false
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return !!user && !error
  } catch (e) {
    console.error('Auth validation error:', e)
    return false
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname
  const host = req.headers.get('host') ?? ''

  // --- Volga Comercios dedicated subdomain -----------------------------------
  // comercios.radiodelvolga.com.ar is its OWN origin, so the merchant PWA installs
  // independently of the news app (which owns the apex and, with scope "/", the whole
  // site). Any request on this host that isn't already the merchant area is sent to
  // the merchant login — making the subdomain behave as a standalone merchant app.
  // This rule only ever runs on the comercios host (see the host-scoped matcher
  // below), so the news site on the apex/www is completely unaffected.
  // Only real PAGE navigations get redirected — never static assets, the manifest,
  // the service worker, icons, /_next chunks or API routes. If those were redirected
  // to the login HTML, the PWA couldn't parse its manifest, load its icons, register
  // its service worker, or run — and it would fail every installability check.
  const isAsset =
    path.startsWith('/_next') || path.startsWith('/api') || /\.[^/]+$/.test(path)
  if (
    host.startsWith('comercios.') &&
    !path.startsWith('/beneficios/comercio') &&
    !isAsset
  ) {
    return NextResponse.redirect(new URL('/beneficios/comercio/ingresar', req.url))
  }

  // --- Volga Beneficios merchant area (separate Supabase project) ------------
  if (path.startsWith('/beneficios/comercio')) {
    // The login page and the auth callback must run without a session.
    if (
      path.startsWith('/beneficios/comercio/ingresar') ||
      path.startsWith('/beneficios/comercio/auth')
    ) {
      return res
    }
    const supabase = makeClient(
      req,
      res,
      process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_ANON_KEY!,
    )
    if (!(await isValidUser(supabase))) {
      return NextResponse.redirect(new URL('/beneficios/comercio/ingresar', req.url))
    }
    return res
  }

  // --- Portal admin area (main project) — unchanged behavior -----------------
  if (path === '/login') return res
  if (path.startsWith('/admin')) {
    const supabase = makeClient(
      req,
      res,
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    if (!(await isValidUser(supabase))) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/login',
    '/beneficios/comercio/:path*',
    // Every path, but ONLY on the comercios subdomain — lets us route its root to the
    // merchant app without running middleware on the news site.
    { source: '/:path*', has: [{ type: 'host', value: 'comercios.radiodelvolga.com.ar' }] },
  ],
}
