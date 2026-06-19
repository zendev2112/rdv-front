import { notFound } from 'next/navigation'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import { qrDataUrl, validarUrl } from '@/lib/beneficios-qr'
import CuponView from './CuponView'

export const dynamic = 'force-dynamic'

// Cupón shell. The redemption is read with the user-scoped client so RLS lets a
// user (incl. anonymous) see only their own canje. Merchant/benefit display data
// is non-sensitive, read via the admin client.
export default async function CuponPage({ params }: { params: { id: string } }) {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: red } = await supabase
    .from('redemptions')
    .select('*')
    .eq('id', params.id)
    .single()
  if (!red) notFound()

  const [{ data: biz }, { data: ben }] = await Promise.all([
    supabaseBeneficiosAdmin.from('businesses').select('nombre, logo_url').eq('id', red.business_id).single(),
    supabaseBeneficiosAdmin.from('benefits').select('titulo').eq('id', red.benefit_id).single(),
  ])

  // QR the merchant scans to validate this canje (encodes the redemption's UUID).
  const qrSrc = await qrDataUrl(validarUrl(red.id))

  return (
    <CuponView
      id={red.id}
      codigo={red.codigo}
      estado={red.estado}
      qrSrc={qrSrc}
      merchantNombre={biz?.nombre ?? 'Comercio'}
      descuentoLabel={ben?.titulo ?? ''}
    />
  )
}
