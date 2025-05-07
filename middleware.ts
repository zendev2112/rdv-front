import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip middleware for login page to avoid redirect loops
  if (req.nextUrl.pathname === '/login') {
    return res
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // First get session (this doesn't make a network request)
  const { data: { session } } = await supabase.auth.getSession()
  
  // If session exists, validate with getUser (makes a network request)
  let isValidUser = false
  if (session) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      isValidUser = !!user && !error
    } catch (e) {
      // Ignore errors from getUser to prevent unnecessary redirects
      console.error('Auth validation error:', e)
    }
  }
  
  // If accessing admin page and not authenticated, redirect to login
  if (req.nextUrl.pathname.startsWith('/admin') && !isValidUser) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/login'],
}