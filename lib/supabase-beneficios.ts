import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_BENEFICIOS_SUPABASE_ANON_KEY!
const serviceKey = process.env.BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY!

// Public client — for reading benefits (safe to use client-side)
export const supabaseBeneficios = createClient(url, anonKey)

// Admin client — for writing leads (server-side only)
export const supabaseBeneficiosAdmin = createClient(url, serviceKey)