import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Cookie-aware server client for the BENEFICIOS Supabase project, for use in
// RSC and route handlers (App Router). Separate from the main-portal auth wired
// in middleware.ts — different project, different cookie (the @supabase/ssr
// storage key is derived from the project ref, so the two never collide).
//
// In a Server Component you can only READ cookies; the set/remove writes are
// wrapped in try/catch so a session refresh from an RSC is a no-op instead of a
// throw. In Route Handlers / Server Actions the writes take effect.
export function createBeneficiosServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // RSC render — cookies are read-only here; ignore.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // RSC render — ignore.
          }
        },
      },
    },
  )
}
