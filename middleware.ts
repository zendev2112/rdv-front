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

  // --- Volga Beneficios merchant area (separate Supabase project) ------------
  if (path.startsWith('/beneficios/comercio')) {
    // The login page must render without a session (avoid a redirect loop).
    if (path.startsWith('/beneficios/comercio/ingresar')) return res
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
  const supabase = makeClient(
    req,
    res,
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  if (path.startsWith('/admin') && !(await isValidUser(supabase))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/login', '/beneficios/comercio/:path*'],
}
