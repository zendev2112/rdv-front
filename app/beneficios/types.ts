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
  id: string // = auth.users.id
  nombre: string | null
  telefono: string | null
  telefono_verificado: boolean
  rol: Rol
  push_opt_in: boolean
  geo_opt_in: boolean
  created_at: string
}

// The `businesses` row, as the app thinks of it. Retroactivo policy lives here (screen 18).
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
  retro_activo: boolean
  retro_lapso_horas: 24 | 48 | 120 | 168
  retro_tope_usuario_mes: number
  retro_tope_comercio_mes: number
  retro_pedir_foto: boolean
  retro_aprobacion_automatica: boolean
}

export interface MerchantRetroConfig {
  activo: boolean
  lapso_horas: 24 | 48 | 120 | 168
  tope_por_usuario_mes: number
  tope_comercio_mes: number
  pedir_foto: boolean
  aprobacion_automatica: boolean
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
export type MetodoCanje = 'mostrar' | 'qr' | 'retroactivo'
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

export interface RetroClaim {
  id: string
  user_id: string
  business_id: string
  benefit_id: string
  fecha_compra: string
  monto: number | null
  ticket_url: string
  ticket_hash: string | null
  ocr: {
    fecha: string | null
    monto: number | null
    comercio: string | null
    confianza: number
  } | null
  motivo_usuario: string | null
  estado: 'aprobado' | 'pendiente_humano' | 'rechazado'
  ahorro_acreditado: number | null
  resuelto_at: string | null
  created_at: string
}
