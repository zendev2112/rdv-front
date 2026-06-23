import { NextResponse } from 'next/server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import { validarUrl } from '@/lib/beneficios-qr'
import { cuponPdfBuffer } from '@/lib/beneficios-cupon-pdf'

// Downloadable PDF of the whole cupón. Keyed by the redemption's unguessable UUID
// (same trust model as the scannable QR/validar link), so the link works straight
// from the email without forcing a login. The cupón holds no sensitive data — just
// merchant, discount and code, the same info already on the public QR page.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // jsPDF needs the Node runtime, not edge.

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { data: red } = await supabaseBeneficiosAdmin
    .from('redemptions')
    .select('id, codigo, business_id, benefit_id')
    .eq('id', params.id)
    .single()
  if (!red) return new NextResponse('Cupón no encontrado', { status: 404 })

  const [{ data: biz }, { data: ben }] = await Promise.all([
    supabaseBeneficiosAdmin.from('businesses').select('nombre').eq('id', red.business_id).single(),
    supabaseBeneficiosAdmin.from('benefits').select('titulo').eq('id', red.benefit_id).single(),
  ])

  const pdf = cuponPdfBuffer({
    codigo: red.codigo,
    merchantNombre: biz?.nombre ?? 'Comercio',
    descuento: ben?.titulo ?? '',
    qrText: validarUrl(red.id),
  })

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cupon-${red.codigo}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
