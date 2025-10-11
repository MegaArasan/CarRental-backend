const ExcelJS = require('exceljs');
const path = require('path');

exports.generateExcel = async (type, data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${type} Report`);

  const keys = Object.keys(data[0]);
  worksheet.columns = keys.map((key) => ({
    header: key.charAt(0).toUpperCase() + key.slice(1),
    key,
    width: 20
  }));

  data.forEach((item) => worksheet.addRow(item));

  const filePath = path.join(__dirname, `../../tmp/${type}_report.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};
