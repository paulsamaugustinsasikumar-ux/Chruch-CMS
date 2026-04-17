const express = require('express');
const getPool = require('../config/database');
const { divisionFilter, adminOnly } = require('../middleware/divisionAccess');

const router = express.Router();

// Get all youth members (filtered by division, separated by gender)
router.get('/', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();

    // Get youth male
    const [maleRows] = await pool.execute(`
      SELECT ym.*,
             d.division_name
      FROM youth_members ym
      LEFT JOIN divisions d ON ym.division_id = d.id
      WHERE ym.type = 'youth' AND ym.gender = 'male' ${req.divisionFilter}
      ORDER BY ym.name
    `);

    // Get youth female
    const [femaleRows] = await pool.execute(`
      SELECT ym.*,
             d.division_name
      FROM youth_members ym
      LEFT JOIN divisions d ON ym.division_id = d.id
      WHERE ym.type = 'youth' AND ym.gender = 'female' ${req.divisionFilter}
      ORDER BY ym.name
    `);

    res.json({
      data: {
        youth_male: maleRows,
        youth_female: femaleRows
      }
    });
  } catch (error) {
    console.error('Get youth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single youth member
router.get('/:id', divisionFilter, async (req, res) => {
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

    res.json(rows[0]);
  } catch (error) {
    console.error('Get youth member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create youth member (Admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { name, date_of_birth, gender, phone, email, address, division_id } = req.body;

    if (!name || !gender) {
      return res.status(400).json({ message: 'Name and gender are required' });
    }

    if (!['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({ message: 'Gender must be male or female' });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO youth_members (name, date_of_birth, gender, phone, email, address, division_id, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, date_of_birth || null, gender.toLowerCase(), phone || null, email || null, address || null, division_id || null, 'youth']
    );

    res.status(201).json({
      id: result.insertId,
      name,
      date_of_birth,
      gender: gender.toLowerCase(),
      phone,
      email,
      address,
      division_id,
      type: 'youth'
    });
  } catch (error) {
    console.error('Create youth member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update youth member (Admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { name, date_of_birth, gender, phone, email, address, division_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'UPDATE youth_members SET name = ?, date_of_birth = ?, gender = ?, phone = ?, email = ?, address = ?, division_id = ? WHERE id = ?',
      [name, date_of_birth || null, gender || null, phone || null, email || null, address || null, division_id || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Youth member not found' });
    }

    res.json({ message: 'Youth member updated successfully' });
  } catch (error) {
    console.error('Update youth member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete youth member (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute('DELETE FROM youth_members WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Youth member not found' });
    }

    res.json({ message: 'Youth member deleted successfully' });
  } catch (error) {
    console.error('Delete youth member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;