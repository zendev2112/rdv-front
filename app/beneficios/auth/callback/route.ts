import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// Member auth callback (Phase 1a, SPEC §0b). Two kinds of thing land here:
//
//  - Email links (password recovery, signup confirmation) carry `?token_hash=&type=`.
//    We verify them with verifyOtp — which needs NO PKCE code-verifier cookie, so the
//    link works even when opened in a different browser/app than the one that asked
//    for it (or after an email scanner pre-fetches it). This is why recovery links
//    that relied on exchangeCodeForSession used to fail with ?error=auth.
//  - Google OAuth still returns `?code=`, which we exchange for a session as before.
//
// Lives outside any guard and is not in the middleware matcher, so it runs while
// still unauthenticated. Distinct from the merchant callback (comercio/auth/callback).
export const dynamic = 'force-dynamic'

// Supabase email OTP types (avoids importing from @supabase/supabase-js, not a direct dep).
type EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'

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
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeNext(searchParams.get('next'))

  const supabase = createBeneficiosServerClient()

  // --- Email link (recovery / confirmation): verify the hash, no verifier needed.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
    console.error('[beneficios auth callback] verifyOtp failed:', error.message)
  } else if (code) {
    // --- Google OAuth: PKCE code exchange.
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
    console.error('[beneficios auth callback] exchangeCodeForSession failed:', error.message)
  }

  // No token/code or verification failed → back to the account page with an error flag.
  return NextResponse.redirect(new URL('/beneficios/cuenta?error=auth', origin))
}
