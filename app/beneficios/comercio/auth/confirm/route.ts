import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

// Magic-link / OTP callback for the merchant area. Verifies the token_hash and
// sets the beneficios session cookies server-side (so the SSR guard sees it),
// then redirects into the panel. Lives outside the (guard) group and is exempted
// in middleware so it runs while still unauthenticated.
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/beneficios/comercio/panel'

  if (tokenHash && type) {
    const supabase = createBeneficiosServerClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(new URL(next, origin))
  }

  return NextResponse.redirect(new URL('/beneficios/comercio/ingresar', origin))
}
