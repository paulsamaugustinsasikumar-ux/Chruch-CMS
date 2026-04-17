const express = require('express');
const getPool = require('../config/database');
const { divisionFilter, adminOnly } = require('../middleware/divisionAccess');

const router = express.Router();

// Get all families with member count (filtered by division for division leaders)
router.get('/', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT f.*,
             d.division_name,
             COUNT(fm.id) as member_count
      FROM families f
      LEFT JOIN divisions d ON f.division_id = d.id
      LEFT JOIN family_members fm ON f.id = fm.family_id
      WHERE 1=1 ${req.divisionFilter}
      GROUP BY f.id
      ORDER BY f.family_name
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error('Get families error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single family with members
router.get('/:id', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();

    // Get family details
    const [familyRows] = await pool.execute(`
      SELECT f.*, d.division_name
      FROM families f
      LEFT JOIN divisions d ON f.division_id = d.id
      WHERE f.id = ?
    `, [req.params.id]);

    if (familyRows.length === 0) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Get family members
    const [memberRows] = await pool.execute(
      'SELECT * FROM family_members WHERE family_id = ? ORDER BY name',
      [req.params.id]
    );

    res.json({
      ...familyRows[0],
      members: memberRows
    });
  } catch (error) {
    console.error('Get family error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create family (Admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { name_english, name_tamil, phone_number, division_id, address, members } = req.body;

    // Combine English and Tamil names for family_name
    const family_name = name_english || name_tamil || 'Unnamed Family';

    if (!family_name || family_name === 'Unnamed Family') {
      return res.status(400).json({ message: 'Family name is required' });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insert family
      const [familyResult] = await connection.execute(
        'INSERT INTO families (family_name, division_id, address, phone) VALUES (?, ?, ?, ?)',
        [family_name, division_id || null, address || null, phone_number || null]
      );

      const familyId = familyResult.insertId;

      // Insert family members if provided
      if (members && Array.isArray(members)) {
        for (const member of members) {
          await connection.execute(
            'INSERT INTO family_members (family_id, name, relationship, date_of_birth, gender, phone, email, division_id, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              familyId,
              member.name,
              member.relationship || null,
              member.date_of_birth || null,
              member.gender || null,
              member.phone || null,
              member.email || null,
              division_id || null,
              member.type || 'family'
            ]
          );
        }
      }

      await connection.commit();

      res.status(201).json({
        id: familyId,
        family_name,
        division_id,
        address,
        phone: phone_number,
        members: members || []
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create family error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update family (Admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { family_name, division_id, address, phone } = req.body;

    if (!family_name) {
      return res.status(400).json({ message: 'Family name is required' });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'UPDATE families SET family_name = ?, division_id = ?, address = ?, phone = ? WHERE id = ?',
      [family_name, division_id || null, address || null, phone || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Family not found' });
    }

    res.json({ message: 'Family updated successfully' });
  } catch (error) {
    console.error('Update family error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete family (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute('DELETE FROM families WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Family not found' });
    }

    res.json({ message: 'Family deleted successfully' });
  } catch (error) {
    console.error('Delete family error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add family member (Admin only)
router.post('/:id/members', adminOnly, async (req, res) => {
  try {
    const { name, relationship, date_of_birth, gender, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Member name is required' });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO family_members (family_id, name, relationship, date_of_birth, gender, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.params.id, name, relationship || null, date_of_birth || null, gender || null, phone || null, email || null]
    );

    res.status(201).json({
      id: result.insertId,
      family_id: req.params.id,
      name,
      relationship,
      date_of_birth,
      gender,
      phone,
      email
    });
  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update family member (Admin only)
router.put('/:familyId/members/:memberId', adminOnly, async (req, res) => {
  try {
    const { name, relationship, date_of_birth, gender, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Member name is required' });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'UPDATE family_members SET name = ?, relationship = ?, date_of_birth = ?, gender = ?, phone = ?, email = ? WHERE id = ? AND family_id = ?',
      [name, relationship || null, date_of_birth || null, gender || null, phone || null, email || null, req.params.memberId, req.params.familyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json({ message: 'Family member updated successfully' });
  } catch (error) {
    console.error('Update family member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete family member (Admin only)
router.delete('/:familyId/members/:memberId', adminOnly, async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute(
      'DELETE FROM family_members WHERE id = ? AND family_id = ?',
      [req.params.memberId, req.params.familyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json({ message: 'Family member deleted successfully' });
  } catch (error) {
    console.error('Delete family member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;