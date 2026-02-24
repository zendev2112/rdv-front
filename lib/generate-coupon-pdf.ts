import PDFDocument from 'pdfkit'
import { Readable } from 'stream'

interface CouponData {
  nombre: string
  businessNombre: string
  benefitTitulo: string
  codigoUnico: string
  condiciones: string
  fechaFin?: string
}

export async function generateCouponPDF(data: CouponData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    })

    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Header
    doc.fillColor('#8B0000')
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('VOLGA BENEFICIOS', { align: 'center' })
    doc
      .fontSize(12)
      .font('Helvetica')
      .text('Radio del Volga', { align: 'center' })

    doc.moveDown()
    doc
      .strokeColor('#8B0000')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
    doc.moveDown()

    // Content
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(`Hola, ${data.nombre}!`)
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Tu beneficio en ${data.businessNombre} está listo para usar.`)

    doc.moveDown()

    // Benefit Box
    doc.rect(50, doc.y, 495, 180).stroke()
    doc.moveTo(60, doc.y + 10)

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#8B0000')
      .text('COMERCIO')
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text(data.businessNombre)

    doc.moveDown(0.5)
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#8B0000')
      .text('BENEFICIO')
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text(data.benefitTitulo)

    doc.moveDown(0.5)
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#8B0000')
      .text('CONDICIONES')
    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#000000')
      .text(data.condiciones)

    doc.moveDown(0.5)
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#8B0000')
      .text('TU CÓDIGO')
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#8B0000')
      .text(data.codigoUnico, {
        align: 'center',
      })

    if (data.fechaFin) {
      doc.moveDown(0.5)
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#8B0000')
        .text('VÁLIDO HASTA')
      doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#000000')
        .text(data.fechaFin)
    }

    doc.moveDown(2)
    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#444444')
      .text('Presentá este código en el comercio para canjearlo.', {
        align: 'center',
      })

    // Footer
    doc.moveDown(2)
    doc
      .strokeColor('#cccccc')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
    doc.moveDown()
    doc
      .fontSize(9)
      .fillColor('#888888')
      .text('Radio del Volga — Coronel Suárez, Buenos Aires', {
        align: 'center',
      })
    doc.text('radiodelvolga.com.ar', { align: 'center' })

    doc.end()
  })
}
