import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// Member auth callback (Phase 1a, SPEC §0b). Handles the PKCE code-exchange for
// Google OAuth, email-confirmation links, and password-reset links — all of which
// return here with a `?code=`. We exchange it for a session cookie and forward to
// `next`. Distinct from the merchant OTP callback (comercio/auth/confirm, verifyOtp).
// Lives outside any guard and is not in the middleware matcher, so it runs while
// still unauthenticated.
export const dynamic = 'force-dynamic'

// Only allow relative redirects inside /beneficios — never an absolute URL (open-redirect).
function safeNext(raw: string | null): string {
  if (!raw) return '/beneficios'
  if (!raw.startsWith('/beneficios')) return '/beneficios'
  if (raw.startsWith('//')) return '/beneficios'
  return raw
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (code) {
    const supabase = createBeneficiosServerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Google sign-in can't carry our consent checkbox in the OAuth data, so the
      // /cuenta form stashes it in a short-lived cookie; apply it once here.
      const consent = cookies().get('vb-consent')?.value
      if (consent === '1' && data.user) {
        await supabase
          .from('user_profiles')
          .update({ marketing_opt_in: true, marketing_opt_in_at: new Date().toISOString() })
          .eq('id', data.user.id)
          .eq('marketing_opt_in', false) // don't clobber an existing opt-in
      }
      const res = NextResponse.redirect(new URL(next, origin))
      // clear the short-lived consent cookie (matches the path it was set with)
      res.cookies.set('vb-consent', '', { path: '/beneficios', maxAge: 0 })
      return res
    }
  }

  // No code or exchange failed → back to the account page with an error flag.
  return NextResponse.redirect(new URL('/beneficios/cuenta?error=auth', origin))
}
