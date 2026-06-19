export interface BeneficioActivo {
  benefit_id: string
  titulo: string
  benefit_descripcion: string | null
  condiciones: string | null
  codigo_unico: string | null
  qr_code_url: string | null
  limite_tipo: string
  limite_cantidad: number | null
  fecha_inicio: string | null
  fecha_fin: string | null
  business_id: string
  business_slug: string
  business_nombre: string
  business_descripcion: string | null
  direccion: string | null
  business_telefono: string | null
  logo_url: string | null
  website: string | null
  categoria_id: number
  categoria_nombre: string
  categoria_slug: string
  categoria_icono: string | null
}

export interface Categoria {
  id: number
  nombre: string
  slug: string
  icono: string | null
  count: number
}

export interface Benefit {
  id: string
  titulo: string
  descripcion: string | null
  condiciones: string | null
  codigo_unico: string | null
  limite_tipo: string
  limite_cantidad: number | null
  fecha_fin: string | null
}

export interface Comercio {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  direccion: string | null
  telefono: string | null
  logo_url: string | null
  website: string | null
  categoria: {
    nombre: string
    slug: string
    icono: string | null
  }
  benefits: Benefit[]
}

// ===========================================================================
// Volga Beneficios — MVP domain types (Phase 0). Mirror the migration in
// supabase/migrations/0001_beneficios_mvp.sql. DB keeps `businesses`; app code
// aliases the merchant concept as `Merchant` (OQ-1).
// ===========================================================================

export type Rol = 'user' | 'merchant_staff' | 'admin'

export interface UserProfile {
  id: string // = auth.users.id (registered member; no anonymous rows — §0b)
  nombre: string | null
  email: string | null // mirror of auth.users.email (verified)
  telefono: string | null
  telefono_verificado: boolean
  rol: Rol
  marketing_opt_in: boolean // Ley 25.326 consent for email/push novedades
  marketing_opt_in_at: string | null
  barrio: string | null
  push_opt_in: boolean
  geo_opt_in: boolean
  created_at: string
}

export interface Merchant {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  direccion: string | null
  telefono: string | null
  logo_url: string | null
  website: string | null
  categoria_id: number
  geo_lat: number | null
  geo_lon: number | null
}

export interface MerchantHours {
  id: string
  business_id: string
  dia: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo
  abierto: boolean
  franjas: Array<{ desde: string; hasta: string }>
}

export interface MerchantSpecialHours {
  id: string
  business_id: string
  fecha: string
  motivo: string | null
  abierto: boolean
  franjas: Array<{ desde: string; hasta: string }>
}

// MVP: a canje is mostly self-reported ("mostrá la pantalla" → "Listo, lo usé").
// `metodo` records how it happened so the same table serves the later QR phase.
export type MetodoCanje = 'mostrar' | 'qr'
export type EstadoCanje = 'pendiente' | 'usado' | 'validado' | 'vencido' | 'cancelado'

export interface Redemption {
  id: string
  user_id: string | null
  benefit_id: string
  business_id: string
  activacion_id: string | null
  metodo: MetodoCanje
  codigo: string
  token: string | null
  estado: EstadoCanje
  expira_at: string | null
  validado_at: string | null
  ahorro_estimado: number | null
  created_at: string
}

