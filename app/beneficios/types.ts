export interface Categoria {
  nombre: string
  slug: string
  icono: string
}

export interface Benefit {
  id: string
  titulo: string
  descripcion: string | null
  condiciones: string | null
  codigo_unico: string
  limite_tipo: 'ilimitado' | 'por_dia' | 'por_semana' | 'por_mes' | 'total'
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
  categoria: Categoria
  benefits: Benefit[]
}

export interface BeneficioActivo {
  benefit_id: string
  titulo: string
  benefit_descripcion: string | null
  condiciones: string | null
  codigo_unico: string
  limite_tipo: string
  limite_cantidad: number | null
  fecha_fin: string | null
  business_id: string
  business_slug: string
  business_nombre: string
  business_descripcion: string | null
  direccion: string | null
  business_telefono: string | null
  logo_url: string | null
  website: string | null
  categoria_nombre: string
  categoria_slug: string
  categoria_icono: string
}
