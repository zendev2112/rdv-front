// Shared card display helpers, so BeneficioCard and CanjeCard look identical.

// The headline discount, shown as a badge ("2x1", "30%", "Hasta 25%").
export function badgeFor(titulo: string): string {
  const dos = titulo.match(/\d+\s*x\s*\d+/i)
  if (dos) return dos[0].replace(/\s/g, '')
  const pct = titulo.match(/\d+\s*%/)
  if (pct) {
    const n = pct[0].replace(/\s/g, '')
    return /hasta/i.test(titulo) ? `Hasta ${n}` : n
  }
  return 'Beneficio'
}

// Soft, low-saturation tint per category so cards gain color variety without
// photography (the reference leans on brand photos we don't have yet).
const TINTS: Record<string, string> = {
  gastronomia: '#FBEEDF',
  'panaderia-reposteria': '#F8EAD3',
  salud: '#E7F1EA',
  'salud-farmacia': '#E7F1EA',
  indumentaria: '#F0EAF4',
  'indumentaria-calzado': '#F0EAF4',
  deportes: '#E6EFF6',
  'deportes-fitness': '#E6EFF6',
  tecnologia: '#E9EEF3',
  belleza: '#F8E9F0',
  educacion: '#EAF0F5',
  automotor: '#ECEEF1',
  hogar: '#F1EEE7',
  mascotas: '#EDF3E6',
  carniceria: '#F7E7E7',
  polleria: '#FBF1DD',
  pescaderia: '#E4EEF2',
  verduleria: '#E9F2E2',
  limpieza: '#E6EFF1',
  cosmetica: '#F8E9F0',
}

export function tintFor(slug: string): string {
  return TINTS[slug] ?? '#F2EFE9'
}
