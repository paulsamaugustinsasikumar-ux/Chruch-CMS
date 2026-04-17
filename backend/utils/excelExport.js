const ExcelJS = require('exceljs');

const generateFamiliesExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Families');

  // Define columns
  worksheet.columns = [
    { header: 'Family Name', key: 'family_name', width: 20 },
    { header: 'Division', key: 'division_name', width: 20 },
    { header: 'Address', key: 'address', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Member Name', key: 'member_name', width: 20 },
    { header: 'Relationship', key: 'relationship', width: 15 },
    { header: 'Date of Birth', key: 'date_of_birth', width: 15 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Member Phone', key: 'member_phone', width: 15 },
    { header: 'Member Email', key: 'member_email', width: 25 }
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };

  // Add data
  data.forEach(row => {
    worksheet.addRow(row);
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    if (!column.width) column.width = 15;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

const generateYouthExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Youth Members');

  // Define columns
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Date of Birth', key: 'date_of_birth', width: 15 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Address', key: 'address', width: 30 },
    { header: 'Division', key: 'division_name', width: 20 }
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };

  // Add data
  data.forEach(row => {
    worksheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = {
  generateFamiliesExcel,
  generateYouthExcel
};