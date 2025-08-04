const db = require('../models');
const PDFDocument = require('pdfkit');
const Banco = db.banco;


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

    const path = require('path');
    const logoPath = path.resolve(__dirname, '../images/LaAntigua_CercaDeTi.jpg');
    const imageWidth = 280;
    const imageHeight = 180;
    const padding = 10;
    const frameWidth = imageWidth + padding * 2;
    const frameHeight = imageHeight + padding * 2;
    const pageWidth = doc.page.width;
    const frameX = (pageWidth - frameWidth) / 2;
    const frameY = 30;
    const imageX = frameX + padding;
    const imageY = frameY + padding;

    doc
      .rect(frameX, frameY, frameWidth, frameHeight)
      .strokeColor('black')
      .lineWidth(1);
    doc
      .image(logoPath, imageX, imageY, { width: imageWidth, height: imageHeight });
    doc.y = frameY + frameHeight + 20;
  
    doc.fontSize(25).text('IMPUESTO PREDIAL 2025', { align: 'center' });
    doc.fontSize(20).text('Datos del contribuyente', { align: 'center' }).moveDown();
    doc.fontSize(12);

    const lineHeight = 20;
    const blockWidth = 200; 

    const startX = (pageWidth - blockWidth) / 2;
    let y = doc.y;

    data.forEach(registro => {
      const campos = [
        ['Referencia', registro.REFERENCIA],
        ['Nombre', registro.NOMBRE],
        ['Colonia', registro.COLONIA],
        ['Calle', registro.CALLE],
        ['Tipo Predio', registro.TIPO_PRED],
        ['Importe', `$${Number(registro.IMPORTE).toFixed(2)}`],
        ['Fecha de vencimiento', registro.VENCE]
      ];

      campos.forEach(([key, value]) => {
        doc
          .font('Helvetica-Bold')
          .text(`${key}:`, startX, y, { continued: true })
          .font('Helvetica')
          .text(` ${value}`);
        y += lineHeight;
      });

      y += lineHeight;
    });

    doc.moveDown(2);
    

    doc
      .font('Helvetica-Bold')
      .text('Num. convenio: 1490869   ', { continued: true }) 
      .font('Helvetica')
      .text('Línea de captura') 
      const bwipjs = require('bwip-js');

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid:        'code128',
      text:        data[0].LINEA_CAP2.trim(),
      scale:       3,               
      height:      10,              
    });


    doc.image(barcodeBuffer, {
      fit: [300, 100],       
      align: 'center',
      valign: 'center'
    });

    doc.moveDown(3);
    
    doc.fontSize(10).fillColor('gray').text('Este documento no es un comprobante de pago.');

    doc.end();
  } catch (error) {
    next(error);
  }
}

module.exports = self;
