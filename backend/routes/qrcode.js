const express = require('express');
const getPool = require('../config/database');
const { divisionFilter } = require('../middleware/divisionAccess');
const qrCode = require('../utils/qrCode');

const router = express.Router();

// Generate QR code for division
router.get('/division/:id', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM divisions WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Division not found' });
    }

    const division = rows[0];
    const qrData = {
      type: 'division',
      id: division.id,
      name: division.division_name,
      leader: division.leader_name
    };

    const qrCodeBuffer = await qrCode.generateQRCode(JSON.stringify(qrData));
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=division-${division.id}-qr.png`);
    res.send(qrCodeBuffer);
  } catch (error) {
    console.error('Generate division QR code error:', error);
    res.status(500).json({ message: 'QR code generation failed' });
  }
});

// Generate QR code for family
router.get('/family/:id', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT f.*,
             d.division_name
      FROM families f
      LEFT JOIN divisions d ON f.division_id = d.id
      WHERE f.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const family = rows[0];
    const qrData = {
      type: 'family',
      id: family.id,
      name: family.family_name,
      division: family.division_name,
      address: family.address,
      phone: family.phone
    };

    const qrCodeBuffer = await qrCode.generateQRCode(JSON.stringify(qrData));
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=family-${family.id}-qr.png`);
    res.send(qrCodeBuffer);
  } catch (error) {
    console.error('Generate family QR code error:', error);
    res.status(500).json({ message: 'QR code generation failed' });
  }
});

// Generate QR code for youth member
router.get('/youth/:id', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT ym.*,
             d.division_name
      FROM youth_members ym
      LEFT JOIN divisions d ON ym.division_id = d.id
      WHERE ym.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Youth member not found' });
    }

    const youth = rows[0];
    const qrData = {
      type: 'youth',
      id: youth.id,
      name: youth.name,
      division: youth.division_name,
      phone: youth.phone,
      email: youth.email
    };

    const qrCodeBuffer = await qrCode.generateQRCode(JSON.stringify(qrData));
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=youth-${youth.id}-qr.png`);
    res.send(qrCodeBuffer);
  } catch (error) {
    console.error('Generate youth QR code error:', error);
    res.status(500).json({ message: 'QR code generation failed' });
  }
});

// Generate bulk QR codes for all divisions
router.get('/bulk/divisions', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT id, division_name, leader_name FROM divisions ORDER BY division_name');

    const qrCodes = [];
    for (const division of rows) {
      const qrData = {
        type: 'division',
        id: division.id,
        name: division.division_name,
        leader: division.leader_name
      };

      const qrCodeBuffer = await qrCode.generateQRCode(JSON.stringify(qrData));
      qrCodes.push({
        id: division.id,
        name: division.division_name,
        qrCode: qrCodeBuffer.toString('base64')
      });
    }

    res.json(qrCodes);
  } catch (error) {
    console.error('Generate bulk division QR codes error:', error);
    res.status(500).json({ message: 'Bulk QR code generation failed' });
  }
});

module.exports = router;