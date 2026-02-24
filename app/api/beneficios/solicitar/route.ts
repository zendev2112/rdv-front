import { NextResponse } from 'next/server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import { Resend } from 'resend'
import { BeneficioEmail } from '@/emails/BeneficioEmail'

export async function POST(request: Request) {
  const resend = new Resend(process.env.BENEFICIOS_RESEND_API_KEY)

  try {
    const body = await request.json()
    const { nombre, email, telefono, benefit_id, business_id } = body

    if (!nombre || !telefono || !benefit_id || !business_id) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 },
      )
    }

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

    const { data: benefit } = await supabaseBeneficiosAdmin
      .from('benefits')
      .select(
        'titulo, descripcion, condiciones, codigo_unico, fecha_fin, businesses(nombre, telefono, slug)',
      )
      .eq('id', benefit_id)
      .single()

    const businessNombre = (benefit?.businesses as any)?.nombre ?? ''
    const businessSlug = (benefit?.businesses as any)?.slug ?? ''
    const businessTelefono =
      (benefit?.businesses as any)?.telefono ??
      process.env.BENEFICIOS_WHATSAPP_NUMBER

    const mensaje = encodeURIComponent(
      `Hola! Quiero canjear mi beneficio de *${businessNombre}*.\n` +
        `Beneficio: ${benefit?.titulo}\n` +
        `Mi nombre es ${nombre}.\n` +
        `Código: ${benefit?.codigo_unico}`,
    )
    const whatsappUrl = `https://wa.me/${businessTelefono}?text=${mensaje}`

    await supabaseBeneficiosAdmin
      .from('leads')
      .update({
        whatsapp_enviado: true,
        whatsapp_enviado_at: new Date().toISOString(),
      })
      .eq('id', lead.id)

    let emailSent = false

    if (email) {
      try {
        const fechaFin = benefit?.fecha_fin
          ? new Date(benefit.fecha_fin).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : undefined

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: `Tu beneficio en ${businessNombre} 🎉`,
          react: BeneficioEmail({
            userName: nombre,
            businessNombre,
            benefitTitulo: benefit?.titulo ?? '',
            condiciones: benefit?.condiciones ?? '',
            codigoUnico: benefit?.codigo_unico ?? '',
            businessSlug,
            fechaFin,
          }),
        })

        await supabaseBeneficiosAdmin
          .from('leads')
          .update({
            email_enviado: true,
            email_enviado_at: new Date().toISOString(),
          })
          .eq('id', lead.id)

        emailSent = true
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      whatsapp_url: whatsappUrl,
      email_sent: emailSent,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
