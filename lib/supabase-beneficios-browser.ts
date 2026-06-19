import { createBrowserClient } from '@supabase/ssr'

// Browser client for the BENEFICIOS Supabase project. Used by client components
// for member auth (Google OAuth + email/password — Phase 1a) and merchant login.
// Shares the same cookie storage the server client reads, so a session created
// here is visible to RSC/route handlers and the middleware guard.
export function createBeneficiosBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_ANON_KEY!,
  )
}
