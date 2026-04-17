const PDFDocument = require('pdfkit');

const generateFamiliesPDF = (families) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header
      doc.fontSize(20).text('Church Management System - Families Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      families.forEach((family, index) => {
        if (index > 0) doc.addPage();

        doc.fontSize(16).text(`Family: ${family.family_name}`, { underline: true });
        doc.moveDown();

        if (family.division_name) {
          doc.fontSize(12).text(`Division: ${family.division_name}`);
        }

        if (family.address) {
          doc.text(`Address: ${family.address}`);
        }

        if (family.phone) {
          doc.text(`Phone: ${family.phone}`);
        }

        doc.moveDown();

        if (family.members) {
          doc.fontSize(14).text('Family Members:', { underline: true });
          doc.moveDown(0.5);

          const members = family.members.split('; ');
          members.forEach(member => {
            doc.fontSize(11).text(`• ${member}`);
          });
        }
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateYouthPDF = (youth) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header
      doc.fontSize(20).text('Church Management System - Youth Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      youth.forEach((member, index) => {
        if (index > 0) doc.addPage();

        doc.fontSize(16).text(`Name: ${member.name}`, { underline: true });
        doc.moveDown();

        if (member.division_name) {
          doc.fontSize(12).text(`Division: ${member.division_name}`);
        }

        if (member.date_of_birth) {
          doc.text(`Date of Birth: ${new Date(member.date_of_birth).toLocaleDateString()}`);
        }

        if (member.gender) {
          doc.text(`Gender: ${member.gender}`);
        }

        if (member.phone) {
          doc.text(`Phone: ${member.phone}`);
        }

        if (member.email) {
          doc.text(`Email: ${member.email}`);
        }

        if (member.address) {
          doc.text(`Address: ${member.address}`);
        }
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateDivisionsPDF = (divisions) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header
      doc.fontSize(20).text('Church Management System - Divisions Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      divisions.forEach((division, index) => {
        if (index > 0) doc.addPage();

        doc.fontSize(16).text(`Division: ${division.division_name}`, { underline: true });
        doc.moveDown();

        if (division.leader_name) {
          doc.fontSize(12).text(`Leader: ${division.leader_name}`);
        }

        if (division.description) {
          doc.text(`Description: ${division.description}`);
        }

        doc.text(`Families: ${division.family_count || 0}`);
        doc.text(`Youth Members: ${division.youth_count || 0}`);
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateFamiliesPDF,
  generateYouthPDF,
  generateDivisionsPDF
};