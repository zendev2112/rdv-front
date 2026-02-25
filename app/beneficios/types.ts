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
