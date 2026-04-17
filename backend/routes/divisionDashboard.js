const express = require('express');
const getPool = require('../config/database');
const { authenticateDivisionLeader } = require('../middleware/divisionAuth');

const router = express.Router();

// Get division dashboard statistics
router.get('/', authenticateDivisionLeader, async (req, res) => {
  try {
    const pool = getPool();
    const divisionId = req.divisionLeader.divisionId;

    // Get total counts for this division
    const [familiesResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM families WHERE division_id = ?',
      [divisionId]
    );

    const [familyMembersResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM family_members WHERE division_id = ? AND type = "family"',
      [divisionId]
    );

    const [youthMembersResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM family_members WHERE division_id = ? AND type = "youth"',
      [divisionId]
    );

    const [youthMaleResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM family_members WHERE division_id = ? AND type = "youth" AND gender = "male"',
      [divisionId]
    );

    const [youthFemaleResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM family_members WHERE division_id = ? AND type = "youth" AND gender = "female"',
      [divisionId]
    );

    // Get recent families
    const [recentFamilies] = await pool.execute(`
      SELECT f.id, f.family_name, f.created_at
      FROM families f
      WHERE f.division_id = ?
      ORDER BY f.created_at DESC
      LIMIT 5
    `, [divisionId]);

    // Get recent youth members
    const [recentYouth] = await pool.execute(`
      SELECT fm.id, fm.name, fm.created_at, fm.gender
      FROM family_members fm
      WHERE fm.division_id = ? AND fm.type = "youth"
      ORDER BY fm.created_at DESC
      LIMIT 5
    `, [divisionId]);

    res.json({
      data: {
        stats: {
          families: familiesResult[0].count,
          familyMembers: familyMembersResult[0].count,
          youthMembers: youthMembersResult[0].count,
          youthMale: youthMaleResult[0].count,
          youthFemale: youthFemaleResult[0].count
        },
        recentFamilies,
        recentYouth
      }
    });
  } catch (error) {
    console.error('Division dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get families for this division (view only)
router.get('/families', authenticateDivisionLeader, async (req, res) => {
  try {
    const pool = getPool();
    const divisionId = req.divisionLeader.divisionId;

    const [rows] = await pool.execute(`
      SELECT f.id, f.family_name, f.address, f.phone, f.created_at,
             COUNT(fm.id) as member_count
      FROM families f
      LEFT JOIN family_members fm ON f.id = fm.family_id AND fm.type = 'family'
      WHERE f.division_id = ?
      GROUP BY f.id
      ORDER BY f.family_name
    `, [divisionId]);

    res.json({ families: rows });
  } catch (error) {
    console.error('Get division families error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get family members for this division (view only)
router.get('/members', authenticateDivisionLeader, async (req, res) => {
  try {
    const pool = getPool();
    const divisionId = req.divisionLeader.divisionId;

    const [rows] = await pool.execute(`
      SELECT fm.id, fm.name, fm.relationship, fm.date_of_birth, fm.gender,
             fm.phone, fm.email, f.family_name
      FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE fm.division_id = ? AND fm.type = 'family'
      ORDER BY f.family_name, fm.name
    `, [divisionId]);

    res.json({ members: rows });
  } catch (error) {
    console.error('Get division members error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get youth members for this division (view only)
router.get('/youth', authenticateDivisionLeader, async (req, res) => {
  try {
    const pool = getPool();
    const divisionId = req.divisionLeader.divisionId;

    const [rows] = await pool.execute(`
      SELECT fm.id, fm.name, fm.date_of_birth, fm.gender, fm.phone, fm.email
      FROM family_members fm
      WHERE fm.division_id = ? AND fm.type = 'youth'
      ORDER BY fm.name
    `, [divisionId]);

    res.json({ youth: rows });
  } catch (error) {
    console.error('Get division youth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get youth male members for this division
router.get('/youth/male', authenticateDivisionLeader, async (req, res) => {
  try {
    const pool = getPool();
    const divisionId = req.divisionLeader.divisionId;

    const [rows] = await pool.execute(`
      SELECT fm.id, fm.name, fm.date_of_birth, fm.phone, fm.email
      FROM family_members fm
      WHERE fm.division_id = ? AND fm.type = 'youth' AND fm.gender = 'male'
      ORDER BY fm.name
    `, [divisionId]);

    res.json({ youthMale: rows });
  } catch (error) {
    console.error('Get division youth male error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get youth female members for this division
router.get('/youth/female', authenticateDivisionLeader, async (req, res) => {
  try {
    const pool = getPool();
    const divisionId = req.divisionLeader.divisionId;

    const [rows] = await pool.execute(`
      SELECT fm.id, fm.name, fm.date_of_birth, fm.phone, fm.email
      FROM family_members fm
      WHERE fm.division_id = ? AND fm.type = 'youth' AND fm.gender = 'female'
      ORDER BY fm.name
    `, [divisionId]);

    res.json({ youthFemale: rows });
  } catch (error) {
    console.error('Get division youth female error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;