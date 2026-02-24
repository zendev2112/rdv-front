import { NextResponse } from 'next/server'
import React from 'react'
import { Resend } from 'resend'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import { BeneficioEmail } from '@/emails/BeneficioEmail'

const resend = new Resend(process.env.BENEFICIOS_RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { nombre, email, telefono, benefit_id, business_id } =
      await request.json()

    if (!nombre || !telefono || !benefit_id || !business_id) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 },
      )
    }

    // Insert lead
    const { data: lead, error: leadError } = await supabaseBeneficiosAdmin
      .from('leads')
      .insert({
        nombre,
        email: email || null,
        telefono,
        benefit_id,
        business_id,
      })
      .select()
      .single()

    if (leadError || !lead) {
      console.error('Error inserting lead:', leadError)
      return NextResponse.json(
        { success: false, error: 'Error al registrar solicitud' },
        { status: 500 },
      )
    }

    // Fetch benefit & business data
    const { data: benefit, error: benefitError } = await supabaseBeneficiosAdmin
      .from('benefits')
      .select(
        'titulo, condiciones, codigo_unico, fecha_fin, businesses(nombre, telefono, slug)',
      )
      .eq('id', benefit_id)
      .single()

    if (benefitError || !benefit) {
      console.error('Error fetching benefit:', benefitError)
      return NextResponse.json(
        { success: false, error: 'Beneficio no encontrado' },
        { status: 404 },
      )
    }

    const businessData = benefit.businesses as any
    const businessNombre = businessData?.nombre ?? ''
    const businessSlug = businessData?.slug ?? ''
    const businessTelefono =
      businessData?.telefono ?? process.env.BENEFICIOS_WHATSAPP_NUMBER

    // Format date
    const fechaFin = benefit.fecha_fin
      ? new Date(benefit.fecha_fin).toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : undefined

    // Build WhatsApp URL
    const whatsappUrl = new URL('https://wa.me/' + businessTelefono)
    whatsappUrl.searchParams.set(
      'text',
      `Hola! Quiero canjear mi beneficio de *${businessNombre}*.\nBeneficio: ${benefit.titulo}\nMi nombre es ${nombre}.\nCódigo: ${benefit.codigo_unico}`,
    )

    // Mark WhatsApp as sent
    await supabaseBeneficiosAdmin
      .from('leads')
      .update({
        whatsapp_enviado: true,
        whatsapp_enviado_at: new Date().toISOString(),
      })
      .eq('id', lead.id)

    // Send email if provided
    let emailSent = false
    if (email) {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: `Tu beneficio en ${businessNombre} 🎉`,
          react: React.createElement(BeneficioEmail, {
            userName: nombre,
            businessNombre,
            benefitTitulo: benefit.titulo,
            condiciones: benefit.condiciones,
            codigoUnico: benefit.codigo_unico,
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
      whatsapp_url: whatsappUrl.toString(),
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
