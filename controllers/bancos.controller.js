const db = require('../models');
const PDFDocument = require('pdfkit');
const Banco = db.banco;
const path = require('path');
const bwipjs = require('bwip-js');

let self = {};

self.getByFiltros = async function(req, res, next) {
  try {
    const {CONG, REGION, MANZ, LOTE, NIVEL, DEPTO, TIPO_PRED } = req.body || {};

    const data = await Banco.findOne({
      where: {CONG, REGION, MANZ, LOTE, NIVEL, DEPTO, TIPO_PRED },
      attributes: [
       'REFERENCIA', 'NOMBRE', 'COLONIA', 'CALLE','IMPORTE', 'IMPORTE', 'TIPO_PRED'
      ],
      raw: true
    });

    if (data) {
      return res.status(200).json(data);
    }

    res.status(404).json({ message: 'No se encontró información con esos filtros' });

  } catch (error) {
    next(error);
  }
};

function tipoPredioTexto(tipo) {
  switch(tipo) {
    case 1: return '1 Urbano';
    case 2: return '2 Suburbano';
    case 3: return '3 Rural';
    default: return 'Desconocido';
  }
}

self.generarReporte = async function(req, res, next) {
  try {
    const {CONG, REGION, MANZ, LOTE, NIVEL, DEPTO, TIPO_PRED} = req.body || {};

    const data = await Banco.findAll({
      where: {CONG, REGION, MANZ, LOTE, NIVEL, DEPTO, TIPO_PRED},
      attributes: ['LINEA_CAP2', 'REFERENCIA', 'NOMBRE', 'COLONIA', 'CALLE', 'VENCE', 'IMPORTE', 'TIPO_PRED'],
      raw: true
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No se encontró información con esos filtros' });
    }

    const doc = new PDFDocument({ margin: 50 });
  
    res.setHeader('Content-Disposition', 'inline; filename="reporte.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    const pageWidth = doc.page.width;

  

    // BLOQUE 1: Encabezado con logo y títulos
    const logoPath = path.resolve(__dirname, '../images/LaAntigua_CercaDeTi.jpg');
    const logoWidth = 280;
    const logoHeight = 180;
    const padding = 10;

    const frameWidth = logoWidth + padding * 2;
    const frameHeight = logoHeight + padding * 2;
    const frameX = (pageWidth - frameWidth) / 2;
    const frameY = 30;
    const imageX = frameX + padding;
    const imageY = frameY + padding;

    doc
      .rect(frameX, frameY, frameWidth, frameHeight)
      .strokeColor('white')
      .lineWidth(1) 
      .stroke();

    doc.image(logoPath, imageX, imageY, { width: logoWidth, height: logoHeight });

    doc.moveDown();
    doc.y = frameY + frameHeight + 20;

    doc.fontSize(25).text('IMPUESTO PREDIAL 2025', { align: 'center' });
    doc.fontSize(20).text('Datos del contribuyente', { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(12);

    // BLOQUE 2: Información del contribuyente
    const startX = (pageWidth - 200) / 2;
    let y = doc.y;

    const registro = data[0]; // Consideramos solo el primer registro para mostrar

    const campos = [
      ['Referencia', registro.REFERENCIA],
      ['Nombre', registro.NOMBRE],
      ['Colonia', registro.COLONIA],
      ['Calle', registro.CALLE],
      ['Tipo Predio', tipoPredioTexto(registro.TIPO_PRED)],
      ['Importe', `$${Number(registro.IMPORTE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Fecha de vencimiento', registro.VENCE]
    ];

    campos.forEach(([key, value]) => {
      doc
        .font('Helvetica-Bold')
        .text(`${key}:`, startX, y, { continued: true })
        .font('Helvetica')
        .text(` ${value}`);
      y += 18;
    });

    doc.y = y + 8; // espacio después de los datos

    const imagenExtraPath = path.resolve(__dirname, '../images/BBVA_RGB.PNG'); // Ruta imagen extra
    const imageExtraWidth = 50;   // Ajusta tamaño
    const imageExtraHeight = 20;  // Ajusta tamaño
    const imageExtraX = (pageWidth - imageExtraWidth) / 2;  // Centrado horizontal
    doc.image(imagenExtraPath, imageExtraX, doc.y, { width: imageExtraWidth, height: imageExtraHeight });
    doc.moveDown(2); // Deja espacio después de la imagen

    // BLOQUE 3: Código de barras con texto incluido
    const convenioText = 'Num. convenio: 1490869';
    const convenioWidth = doc.widthOfString(convenioText);
    const convenioX = (pageWidth - convenioWidth) / 2;
    doc.font('Helvetica-Bold').fontSize(12).text(convenioText, convenioX, doc.y);

    doc.moveDown(0.5);

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: registro.LINEA_CAP2.trim(),
      scale: 8, // Escala del código de barras
      height: 25, // Altura del código de barras
      includetext: true, // Incluir texto debajo del código de barras
      textxalign: 'center', // Alinear el texto al centro
      textsize: 12, // Tamaño del texto
      textyoffset: 5  // Desplazamiento vertical del texto
    });

    const barcodeX = (pageWidth - 150) / 2; // Centrar el código de barras
    doc.image(barcodeBuffer, barcodeX, doc.y, { fit: [200, 200] });

    doc.moveDown(7);

    const imagenPath = path.resolve(__dirname, '../images/GobiernoMunicipal.jpg');

    // Insertar imagen (ajusta tamaño y posición)
    const imageWidth = 120; // Ancho de la imagen
    const imageHeight = 100; // Alto de la imagen
    const x = (doc.page.width - imageWidth) / 2;  // centrar horizontalmente

    doc.image(imagenPath, x, doc.y, { width: imageWidth, height: imageHeight });

    doc.moveDown(8);

    // BLOQUE 4: Texto final aclaratorio
    const aclaracionText = 'Este documento no es un comprobante de pago.';
    const aclaracionWidth = doc.widthOfString(aclaracionText);
    const aclaracionX = (pageWidth - aclaracionWidth) / 2;
    doc.fontSize(10).fillColor('gray').text(aclaracionText, aclaracionX, doc.y);

    doc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = self;
