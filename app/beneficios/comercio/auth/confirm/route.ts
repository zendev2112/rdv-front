import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// Magic-link callback for the merchant area. Establishes the beneficios session
// cookie server-side (so the SSR guard + middleware see it), then redirects into the
// panel. Lives outside the (guard) group and is exempted in middleware so it runs
// while still unauthenticated.
//
// Handles both shapes a Supabase magic link can arrive as:
//   - ?code=…        (PKCE — what signInWithOtp produces by default) → exchangeCodeForSession
//   - ?token_hash=…&type=…  (token-hash email template)              → verifyOtp
// The PKCE verifier is stored client-side when the link is requested, so the link
// must be opened on the SAME device/browser that requested it.
export const dynamic = 'force-dynamic'

// Keep redirects inside the merchant area (no open-redirect).
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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, origin))
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(new URL(next, origin))
  }

  return NextResponse.redirect(new URL('/beneficios/comercio/ingresar', origin))
}
