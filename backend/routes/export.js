const express = require('express');
const getPool = require('../config/database');
const { divisionFilter } = require('../middleware/divisionAccess');
const pdfExport = require('../utils/pdfExport');
const excelExport = require('../utils/excelExport');
const wordExport = require('../utils/wordExport');

const router = express.Router();

// Export families to PDF
router.get('/families/pdf', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT f.*,
             d.division_name,
             GROUP_CONCAT(
               CONCAT(fm.name, ' (', COALESCE(fm.relationship, 'Unknown'), ')')
               SEPARATOR '; '
             ) as members
      FROM families f
      LEFT JOIN divisions d ON f.division_id = d.id
      LEFT JOIN family_members fm ON f.id = fm.family_id
      GROUP BY f.id
      ORDER BY f.family_name
    `);

    const buffer = await pdfExport.generateFamiliesPDF(rows);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=families.pdf');
    res.send(buffer);
  } catch (error) {
    console.error('Export families PDF error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

// Export families to Excel
router.get('/families/excel', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT f.family_name,
             d.division_name,
             f.address,
             f.phone,
             fm.name as member_name,
             fm.relationship,
             fm.date_of_birth,
             fm.gender,
             fm.phone as member_phone,
             fm.email as member_email
      FROM families f
      LEFT JOIN divisions d ON f.division_id = d.id
      LEFT JOIN family_members fm ON f.id = fm.family_id
      ORDER BY f.family_name, fm.name
    `);

    const buffer = await excelExport.generateFamiliesExcel(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=families.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Export families Excel error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

// Export families to Word
router.get('/families/word', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT f.*,
             d.division_name,
             GROUP_CONCAT(
               CONCAT(fm.name, ' (', COALESCE(fm.relationship, 'Unknown'), ')')
               SEPARATOR '; '
             ) as members
      FROM families f
      LEFT JOIN divisions d ON f.division_id = d.id
      LEFT JOIN family_members fm ON f.id = fm.family_id
      GROUP BY f.id
      ORDER BY f.family_name
    `);

    const buffer = await wordExport.generateFamiliesWord(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=families.docx');
    res.send(buffer);
  } catch (error) {
    console.error('Export families Word error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

// Export youth to PDF
router.get('/youth/pdf', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT ym.*,
             d.division_name
      FROM youth_members ym
      LEFT JOIN divisions d ON ym.division_id = d.id
      ORDER BY ym.name
    `);

    const buffer = await pdfExport.generateYouthPDF(rows);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=youth.pdf');
    res.send(buffer);
  } catch (error) {
    console.error('Export youth PDF error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

// Export youth to Excel
router.get('/youth/excel', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT ym.name,
             ym.date_of_birth,
             ym.gender,
             ym.phone,
             ym.email,
             ym.address,
             d.division_name
      FROM youth_members ym
      LEFT JOIN divisions d ON ym.division_id = d.id
      ORDER BY ym.name
    `);

    const buffer = await excelExport.generateYouthExcel(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=youth.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Export youth Excel error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

// Export divisions to PDF
router.get('/divisions/pdf', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT d.*,
             COUNT(DISTINCT f.id) as family_count,
             COUNT(DISTINCT ym.id) as youth_count
      FROM divisions d
      LEFT JOIN families f ON d.id = f.division_id
      LEFT JOIN youth_members ym ON d.id = ym.division_id
      GROUP BY d.id
      ORDER BY d.division_name
    `);

    const buffer = await pdfExport.generateDivisionsPDF(rows);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=divisions.pdf');
    res.send(buffer);
  } catch (error) {
    console.error('Export divisions PDF error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

module.exports = router;