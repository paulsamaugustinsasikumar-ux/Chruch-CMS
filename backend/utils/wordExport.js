const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow } = require('docx');

const generateFamiliesWord = async (families) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "Church Management System - Families Report",
              bold: true,
              size: 32
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated on: ${new Date().toLocaleDateString()}`,
              size: 24
            })
          ]
        }),
        new Paragraph({ children: [new TextRun({ text: "" })] })
      ]
    }]
  });

  families.forEach(family => {
    doc.addSection({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `Family: ${family.family_name}`,
              bold: true,
              size: 28,
              underline: {}
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: family.division_name ? `Division: ${family.division_name}` : "Division: Not assigned",
              size: 24
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: family.address ? `Address: ${family.address}` : "Address: Not provided",
              size: 24
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: family.phone ? `Phone: ${family.phone}` : "Phone: Not provided",
              size: 24
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Family Members:",
              bold: true,
              size: 26,
              underline: {}
            })
          ]
        })
      ]
    });

    if (family.members) {
      const members = family.members.split('; ');
      members.forEach(member => {
        doc.addSection({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${member}`,
                  size: 22
                })
              ]
            })
          ]
        });
      });
    }

    // Add page break
    doc.addSection({
      children: [
        new Paragraph({ children: [new TextRun({ text: "" })] })
      ]
    });
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

module.exports = {
  generateFamiliesWord
};