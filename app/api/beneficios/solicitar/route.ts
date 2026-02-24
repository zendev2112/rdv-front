import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'

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

    const fechaFin = benefit.fecha_fin
      ? new Date(benefit.fecha_fin).toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : undefined

    const whatsappUrl = `https://wa.me/${businessTelefono}?text=${encodeURIComponent(
      `Hola! Quiero canjear mi beneficio de *${businessNombre}*.\nBeneficio: ${benefit.titulo}\nMi nombre es ${nombre}.\nCódigo: ${benefit.codigo_unico}`,
    )}`

    await supabaseBeneficiosAdmin
      .from('leads')
      .update({
        whatsapp_enviado: true,
        whatsapp_enviado_at: new Date().toISOString(),
      })
      .eq('id', lead.id)

    let emailSent = false
    if (email) {
      console.log('📧 Starting email send to:', email)
      try {
        console.log(
          '🔑 API Key exists:',
          !!process.env.BENEFICIOS_RESEND_API_KEY,
        )
        console.log('📤 Sending with from:', 'onboarding@resend.dev')

        const result = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: `Tu beneficio en ${businessNombre} 🎉`,
          html: `
            <!DOCTYPE html>
            <html lang="es">
            <head><meta charset="UTF-8" /></head>
            <body style="background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;">
              <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">

                <div style="background:#8B0000;padding:24px 32px;text-align:center;">
                  <img src="https://radiodelvolga.com.ar/images/logo.svg" alt="Radio del Volga" width="160" height="40" />
                  <p style="color:#ffffff;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:4px 0 0;">Volga Beneficios</p>
                </div>

                <div style="padding:24px 32px;">
                  <h1 style="font-size:22px;font-weight:bold;color:#1a1a1a;margin:0 0 12px;">¡Hola, ${nombre}! 🎉</h1>
                  <p style="font-size:15px;color:#444444;line-height:1.6;margin:0 0 16px;">
                    Tu beneficio de <strong>${businessNombre}</strong> está listo.
                    Mostrá este email en el comercio para canjearlo.
                  </p>
                </div>

                <hr style="border-color:#eeeeee;margin:0;" />

                <div style="background:#fafafa;padding:24px 32px;border-left:4px solid #8B0000;margin:0 24px;border-radius:4px;">
                  <p style="font-size:10px;font-weight:bold;color:#999;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 4px;">COMERCIO</p>
                  <p style="font-size:16px;font-weight:bold;color:#1a1a1a;margin:0 0 16px;">${businessNombre}</p>

                  <p style="font-size:10px;font-weight:bold;color:#999;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 4px;">BENEFICIO</p>
                  <p style="font-size:16px;font-weight:bold;color:#1a1a1a;margin:0 0 16px;">${benefit.titulo}</p>

                  <p style="font-size:10px;font-weight:bold;color:#999;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 4px;">CONDICIONES</p>
                  <p style="font-size:14px;color:#666;font-style:italic;margin:0 0 16px;">${benefit.condiciones}</p>

                  <p style="font-size:10px;font-weight:bold;color:#999;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 4px;">TU CÓDIGO</p>
                  <p style="font-size:22px;font-weight:bold;color:#8B0000;letter-spacing:3px;font-family:monospace;margin:0 0 16px;">${benefit.codigo_unico}</p>

                  ${
                    fechaFin
                      ? `
                  <p style="font-size:10px;font-weight:bold;color:#999;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 4px;">VÁLIDO HASTA</p>
                  <p style="font-size:16px;font-weight:bold;color:#1a1a1a;margin:0;">${fechaFin}</p>
                  `
                      : ''
                  }
                </div>

                <hr style="border-color:#eeeeee;margin:24px 0 0;" />

                <div style="padding:24px 32px;text-align:center;">
                  <p style="font-size:15px;color:#444;margin:0 0 16px;">¿Querés ver más beneficios de comercios de Coronel Suárez?</p>
                  <a href="https://radiodelvolga.com.ar/beneficios/${businessSlug}"
                    style="display:inline-block;background:#8B0000;color:#ffffff;padding:12px 24px;border-radius:6px;font-weight:bold;font-size:14px;text-decoration:none;">
                    Ver beneficio en el sitio
                  </a>
                </div>

                <div style="background:#f9f9f9;padding:20px 32px;text-align:center;">
                  <p style="font-size:13px;color:#888;margin:4px 0;">Radio del Volga — Coronel Suárez, Buenos Aires, Argentina</p>
                  <p style="font-size:13px;color:#888;margin:4px 0;">
                    <a href="https://radiodelvolga.com.ar" style="color:#8B0000;text-decoration:none;">radiodelvolga.com.ar</a>
                    &nbsp;·&nbsp;
                    <a href="https://radiodelvolga.com.ar/beneficios" style="color:#8B0000;text-decoration:none;">Volga Beneficios</a>
                  </p>
                  <p style="font-size:11px;color:#bbb;margin:8px 0 0;">Recibiste este email porque solicitaste un beneficio en Volga Beneficios.</p>
                </div>

              </div>
            </body>
            </html>
          `,
        })

        console.log('✅ Email sent successfully:', result)

        await supabaseBeneficiosAdmin
          .from('leads')
          .update({
            email_enviado: true,
            email_enviado_at: new Date().toISOString(),
          })
          .eq('id', lead.id)

        emailSent = true
      } catch (emailError) {
        console.error('❌ Email error:', emailError)
      }
    } else {
      console.log('⚠️ No email provided')
    }

    return NextResponse.json({
      success: true,
      whatsapp_url: whatsappUrl,
      email_sent: emailSent,
      beneficio: {
        nombre,
        businessNombre,
        benefitTitulo: benefit.titulo,
        codigoUnico: benefit.codigo_unico,
        condiciones: benefit.condiciones,
        fechaFin,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
