import { NextResponse } from 'next/server'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { data, error } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('*')
    .eq('business_slug', params.slug)

  if (error) {
    console.error('Error fetching comercio:', error)
    return NextResponse.json(
      { error: 'Error al obtener comercio' },
      { status: 500 },
    )
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Comercio no encontrado' },
      { status: 404 },
    )
  }

  // First row has business info, all rows have benefits
  const business = {
    id: data[0].business_id,
    slug: data[0].business_slug,
    nombre: data[0].business_nombre,
    descripcion: data[0].business_descripcion,
    direccion: data[0].direccion,
    telefono: data[0].business_telefono,
    logo_url: data[0].logo_url,
    website: data[0].website,
    categoria: {
      nombre: data[0].categoria_nombre,
      slug: data[0].categoria_slug,
      icono: data[0].categoria_icono,
    },
    benefits: data.map((row) => ({
      id: row.benefit_id,
      titulo: row.titulo,
      descripcion: row.benefit_descripcion,
      condiciones: row.condiciones,
      codigo_unico: row.codigo_unico,
      limite_tipo: row.limite_tipo,
      limite_cantidad: row.limite_cantidad,
      fecha_fin: row.fecha_fin,
    })),
  }

  return NextResponse.json({ comercio: business })
}
