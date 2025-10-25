// Dictionary mapping slugs to proper Spanish names with accents
const SECTION_NAMES: Record<string, { singular: string; plural: string; gender: 'm' | 'f' }> = {
  'coronel-suarez': { singular: 'Coronel Suárez', plural: 'Coronel Suárez', gender: 'f' },
  'pueblos-alemanes': { singular: 'Pueblos Alemanes', plural: 'Pueblos Alemanes', gender: 'm' },
  'huanguelen': { singular: 'Huanguelén', plural: 'Huanguelén', gender: 'm' },
  'la-sexta': { singular: 'La Sexta', plural: 'La Sexta', gender: 'f' },
  'agro': { singular: 'Agro', plural: 'Agro', gender: 'm' },
  'lifestyle': { singular: 'Lifestyle', plural: 'Lifestyle', gender: 'm' },
  'noticias-importantes': { singular: 'Noticia Importante', plural: 'Noticias Importantes', gender: 'f' },
  'volga-tv': { singular: 'Volga TV', plural: 'Volga TV', gender: 'f' },
  'farmacias-de-turno': { singular: 'Farmacia de Turno', plural: 'Farmacias de Turno', gender: 'f' },
  'clima': { singular: 'Clima', plural: 'Clima', gender: 'm' },
  'santa-maria': { singular: 'Santa María', plural: 'Santa María', gender: 'f' },
  'san-jose': { singular: 'San José', plural: 'San José', gender: 'm' },
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