import { NextResponse } from 'next/server'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'

export async function GET() {
  const { data, error } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('*')
    .order('business_nombre', { ascending: true })

  if (error) {
    console.error('Error fetching beneficios:', error)
    return NextResponse.json(
      { error: 'Error al obtener beneficios' },
      { status: 500 },
    )
  }

  return NextResponse.json({ beneficios: data })
}
