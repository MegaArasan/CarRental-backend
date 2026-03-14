const { generateReportData } = require('../services/reports.service');
const { generateExcel } = require('../utils/excelGenerator');
const { generatePDF } = require('../utils/pdfGenerator');

exports.getReportsSummary = async (req, res, next) => {
  try {
    // same logic you already have for analytics summary
    const data = await generateReportData('summary');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.downloadReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { format = 'xlsx' } = req.query;

    const data = await generateReportData(type);

    if (!data.length) {
      return res.status(404).json({ success: false, message: 'No data found' });
    }

    if (format === 'xlsx') {
      const filePath = await generateExcel(type, data);
      return res.download(filePath);
    } else if (format === 'pdf') {
      const filePath = await generatePDF(type, data);
      return res.download(filePath);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid format' });
    }
  } catch (error) {
    next(error);
  }
};
