const express = require('express');
const getPool = require('../config/database');
const { divisionFilter, adminOnly } = require('../middleware/divisionAccess');

const router = express.Router();

// Get all divisions (filtered for division leaders, all for admin)
router.get('/', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT d.*,
             COUNT(f.id) as family_count,
             COUNT(ym.id) as youth_count
      FROM divisions d
      LEFT JOIN families f ON d.id = f.division_id
      LEFT JOIN youth_members ym ON d.id = ym.division_id
      GROUP BY d.id
      ORDER BY d.division_name
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error('Get divisions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single division
router.get('/:id', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM divisions WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Division not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get division error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create division (Admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { division_name, leader_name, login_username, login_password, role, description } = req.body;

    if (!division_name) {
      return res.status(400).json({ message: 'Division name is required' });
    }

    const pool = getPool();
    const bcrypt = require('bcryptjs');
    const hashedPassword = login_password ? await bcrypt.hash(login_password, 10) : null;

    const [result] = await pool.execute(
      'INSERT INTO divisions (division_name, leader_name, login_username, login_password, role, description) VALUES (?, ?, ?, ?, ?, ?)',
      [division_name, leader_name || null, login_username || null, hashedPassword, role || 'leader', description || null]
    );

    res.status(201).json({
      id: result.insertId,
      division_name,
      leader_name,
      login_username,
      role: role || 'leader',
      description
    });
  } catch (error) {
    console.error('Create division error:', error);
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      res.status(409).json({ message: 'Division name or username already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Update division (Admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { division_name, leader_name, login_username, login_password, role, description } = req.body;

    if (!division_name) {
      return res.status(400).json({ message: 'Division name is required' });
    }

    const pool = getPool();
    const bcrypt = require('bcryptjs');
    const hashedPassword = login_password ? await bcrypt.hash(login_password, 10) : null;

    let query, params;
    if (hashedPassword) {
      query = 'UPDATE divisions SET division_name = ?, leader_name = ?, login_username = ?, login_password = ?, role = ?, description = ? WHERE id = ?';
      params = [division_name, leader_name || null, login_username || null, hashedPassword, role || 'leader', description || null, req.params.id];
    } else {
      query = 'UPDATE divisions SET division_name = ?, leader_name = ?, login_username = ?, role = ?, description = ? WHERE id = ?';
      params = [division_name, leader_name || null, login_username || null, role || 'leader', description || null, req.params.id];
    }

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Division not found' });
    }

    res.json({ message: 'Division updated successfully' });
  } catch (error) {
    console.error('Update division error:', error);
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      res.status(409).json({ message: 'Division name or username already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Delete division (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute('DELETE FROM divisions WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Division not found' });
    }

    res.json({ message: 'Division deleted successfully' });
  } catch (error) {
    console.error('Delete division error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;