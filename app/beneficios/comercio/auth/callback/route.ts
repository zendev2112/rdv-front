import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// Merchant auth callback. Mirrors the member callback (/beneficios/auth/callback)
// but lives under /beneficios/comercio/auth so it runs on the comercios subdomain
// origin — the merchant PWA is a separate origin, and the recovery session cookie
// must be written on that same host. Password-recovery email links arrive with
// `?token_hash=&type=recovery`, which we verify with verifyOtp (no PKCE verifier
// cookie required, so the link works even opened in another browser). `?code=` is
// kept as a fallback. Middleware lets /beneficios/comercio/auth run unauthenticated.
export const dynamic = 'force-dynamic'

// Supabase email OTP types (avoids importing from @supabase/supabase-js, not a direct dep).
type EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'

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
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeNext(searchParams.get('next'))

  const supabase = createBeneficiosServerClient()

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
    console.error('[comercio auth callback] verifyOtp failed:', error.message)
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
    console.error('[comercio auth callback] exchangeCodeForSession failed:', error.message)
  }

  // No token/code or verification failed (expired/used link) → back to login with a flag.
  return NextResponse.redirect(new URL('/beneficios/comercio/ingresar?error=auth', origin))
}
