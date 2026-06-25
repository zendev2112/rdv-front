import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// Merchant auth callback. Mirrors the member callback (/beneficios/auth/callback)
// but lives under /beneficios/comercio/auth so it runs on the comercios subdomain
// origin — the merchant PWA is a separate origin, and the PKCE code-verifier cookie
// (set by resetPasswordForEmail on the login page) plus the resulting session cookie
// must be read/written on that same host. Today only password recovery lands here
// with a `?code=`; we exchange it for a recovery session and forward to `next`.
// Middleware lets /beneficios/comercio/auth run unauthenticated.
export const dynamic = 'force-dynamic'

// Only allow relative redirects inside the merchant area — never an absolute URL.
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/beneficios/comercio') || raw.startsWith('//')) {
    return '/beneficios/comercio/panel'
  }
  return raw
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (code) {
    const supabase = createBeneficiosServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // No code or exchange failed (expired/used link) → back to login with a flag.
  return NextResponse.redirect(new URL('/beneficios/comercio/ingresar?error=auth', origin))
}
