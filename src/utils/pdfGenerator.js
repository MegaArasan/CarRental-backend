const fs = require('fs');
const PDFDocument = require('pdfkit');
const { getReportFilePath } = require('./reportTemp');

exports.generatePDF = async (type, data) => {
  const filePath = getReportFilePath(`${type}_report.pdf`);
  const doc = new PDFDocument({ margin: 30 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(18).text(`${type.toUpperCase()} REPORT`, { align: 'center' });
  doc.moveDown();

  const headers = Object.keys(data[0]);
  doc.fontSize(12).text(headers.join(' | '));
  doc.moveDown();

  data.forEach((row) => {
    const line = headers.map((h) => row[h] || '').join(' | ');
    doc.text(line);
  });

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => resolve(filePath));
  });
};
