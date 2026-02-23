import { NextResponse } from 'next/server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, benefit_id, business_id } = body

    // Basic validation
    if (!nombre || !telefono || !benefit_id || !business_id) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 },
      )
    }

    // Forward to volga-beneficios logic via direct Supabase insert
    // This mirrors what procesarSolicitud does
    const { data: lead, error: leadError } = await supabaseBeneficiosAdmin
      .from('leads')
      .insert({
        nombre,
        email: email || null,
        telefono,
        benefit_id,
        business_id,
        whatsapp_enviado: false,
        email_enviado: false,
      })
      .select()
      .single()

    if (leadError) {
      console.error('Error inserting lead:', leadError)
      return NextResponse.json(
        { success: false, error: 'Error al registrar solicitud' },
        { status: 500 },
      )
    }

    // Build WhatsApp URL
    const { data: benefit } = await supabaseBeneficiosAdmin
      .from('benefits')
      .select('titulo, codigo_unico, businesses(nombre)')
      .eq('id', benefit_id)
      .single()

    const businessNombre = (benefit?.businesses as any)?.nombre ?? ''
    const mensaje = encodeURIComponent(
      `Hola! Quiero canjear mi beneficio de *${businessNombre}*.\n` +
        `Beneficio: ${benefit?.titulo}\n` +
        `Mi nombre es ${nombre}.\n` +
        `Código: ${benefit?.codigo_unico}`,
    )

    const whatsappUrl = `https://wa.me/${process.env.BENEFICIOS_WHATSAPP_NUMBER}?text=${mensaje}`

    // Update lead with whatsapp_enviado
    await supabaseBeneficiosAdmin
      .from('leads')
      .update({ whatsapp_enviado: true })
      .eq('id', lead.id)

    return NextResponse.json({
      success: true,
      whatsapp_url: whatsappUrl,
      email_sent: false, // email handled separately when Resend domain is verified
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
