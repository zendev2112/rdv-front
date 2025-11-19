// Dictionary mapping slugs to proper Spanish names with accents
const SECTION_NAMES: Record<
  string,
  { singular: string; plural: string; gender: 'm' | 'f' }
> = {
  'coronel-suarez': {
    singular: 'Coronel Suárez',
    plural: 'Coronel Suárez',
    gender: 'f',
  },
  'pueblos-alemanes': {
    singular: 'Pueblos Alemanes',
    plural: 'Pueblos Alemanes',
    gender: 'm',
  },
  huanguelen: { singular: 'Huanguelén', plural: 'Huanguelén', gender: 'm' },
  'la-sexta': { singular: 'La Sexta', plural: 'La Sexta', gender: 'f' },
  politica: { singular: 'Política', plural: 'Política', gender: 'f' },
  economia: { singular: 'Economía', plural: 'Economía', gender: 'f' },
  agro: { singular: 'Agro', plural: 'Agro', gender: 'm' },
  sociedad: { singular: 'Sociedad', plural: 'Sociedad', gender: 'f' },
  salud: { singular: 'Salud', plural: 'Salud', gender: 'f' },
  cultura: { singular: 'Cultura', plural: 'Cultura', gender: 'f' },
  opinion: { singular: 'Opinión', plural: 'Opinión', gender: 'f' },
  deportes: { singular: 'Deportes', plural: 'Deportes', gender: 'm' },
  lifestyle: { singular: 'Lifestyle', plural: 'Lifestyle', gender: 'm' },
  vinos: { singular: 'Vinos', plural: 'Vinos', gender: 'm' },
  'el-recetario': {
    singular: 'El Recetario',
    plural: 'El Recetario',
    gender: 'm',
  },
  'santa-trinidad': {
    singular: 'Santa Trinidad',
    plural: 'Santa Trinidad',
    gender: 'f',
  },
  'san-jose': { singular: 'San José', plural: 'San José', gender: 'm' },
  'santa-maria': {
    singular: 'Santa María',
    plural: 'Santa María',
    gender: 'f',
  },
  iactualidad: { singular: 'IActualidad', plural: 'IActualidad', gender: 'f' },
  dolar: { singular: 'Dólar', plural: 'Dólares', gender: 'm' },
  propiedades: { singular: 'Propiedades', plural: 'Propiedades', gender: 'f' },
  'pymes-emprendimientos': {
    singular: 'Pymes y emprendimientos',
    plural: 'Pymes y emprendimientos',
    gender: 'm',
  },
  inmuebles: { singular: 'Inmuebles', plural: 'Inmuebles', gender: 'm' },
  campos: { singular: 'Campos', plural: 'Campos', gender: 'm' },
  'construccion-diseno': {
    singular: 'Construcción y diseño',
    plural: 'Construcción y diseño',
    gender: 'f',
  },
  agricultura: { singular: 'Agricultura', plural: 'Agricultura', gender: 'f' },
  ganaderia: { singular: 'Ganadería', plural: 'Ganadería', gender: 'f' },
  'tecnologias-agro': {
    singular: 'Tecnologías agro',
    plural: 'Tecnologías agro',
    gender: 'f',
  },
  educacion: { singular: 'Educación', plural: 'Educación', gender: 'f' },
  policiales: { singular: 'Policiales', plural: 'Policiales', gender: 'm' },
  efemerides: { singular: 'Efemérides', plural: 'Efemérides', gender: 'f' },
  ciencia: { singular: 'Ciencia', plural: 'Ciencia', gender: 'f' },
  'vida-armonia': {
    singular: 'Vida en armonía',
    plural: 'Vida en armonía',
    gender: 'f',
  },
  'nutricion-energia': {
    singular: 'Nutrición y energía',
    plural: 'Nutrición y energía',
    gender: 'f',
  },
  fitness: { singular: 'Fitness', plural: 'Fitness', gender: 'm' },
  'salud-mental': {
    singular: 'Salud mental',
    plural: 'Salud mental',
    gender: 'f',
  },
  turismo: { singular: 'Turismo', plural: 'Turismo', gender: 'm' },
  horoscopo: { singular: 'Horóscopo', plural: 'Horóscopo', gender: 'm' },
  feriados: { singular: 'Feriados', plural: 'Feriados', gender: 'm' },
  'loterias-quinielas': {
    singular: 'Loterías y quinielas',
    plural: 'Loterías y quinielas',
    gender: 'f',
  },
  'moda-belleza': {
    singular: 'Moda y belleza',
    plural: 'Moda y belleza',
    gender: 'f',
  },
  mascotas: { singular: 'Mascotas', plural: 'Mascotas', gender: 'f' },
  mundo: { singular: 'Mundo', plural: 'Mundo', gender: 'm' },
  espectaculos: { singular: 'Espectáculos', plural: 'Espectáculos', gender: 'm' },
  ambiente: { singular: 'Ambiente', plural: 'Ambiente', gender: 'm' },
  clima: { singular: 'Clima', plural: 'Clima', gender: 'm' },
  tecnologia: { singular: 'Tecnología', plural: 'Tecnología', gender: 'f' },
  actualidad: { singular: 'Actualidad', plural: 'Actualidad', gender: 'f' },
  'cine-series': {
    singular: 'Cine y series',
    plural: 'Cine y series',
    gender: 'm',
  },
  'historia-literatura': {
    singular: 'Historia y literatura',
    plural: 'Historia y literatura',
    gender: 'f',
  },
  'noticias-importantes': {
    singular: 'Noticia importante',
    plural: 'Noticias importantes',
    gender: 'f',
  },
  'volga-tv': { singular: 'Volga TV', plural: 'Volga TV', gender: 'f' },
  'farmacias-de-turno': {
    singular: 'Farmacia de turno',
    plural: 'Farmacias de turno',
    gender: 'f',
  },
}

export function getProperSpanishName(
  slug: string,
  options?: { plural?: boolean; capitalize?: boolean }
): string {
  const cleanSlug = slug.toLowerCase().replace(/_/g, '-')
  const entry = SECTION_NAMES[cleanSlug]

  if (!entry) {
    // Fallback: capitalize first letter if not found
    return options?.capitalize !== false
      ? cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1)
      : cleanSlug
  }

  const text = options?.plural ? entry.plural : entry.singular
  return options?.capitalize !== false ? text : text.toLowerCase()
}

export function getGenderArticle(slug: string): 'el' | 'la' | 'los' | 'las' {
  const cleanSlug = slug.toLowerCase().replace(/_/g, '-')
  const entry = SECTION_NAMES[cleanSlug]

  if (!entry) return 'el'

  switch (entry.gender) {
    case 'f':
      return 'la'
    case 'm':
      return 'el'
    default:
      return 'el'
  }
}