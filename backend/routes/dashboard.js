const express = require('express');
const getPool = require('../config/database');
const { divisionFilter } = require('../middleware/divisionAccess');

const router = express.Router();

// Get dashboard statistics (filtered by division for division leaders)
router.get('/', divisionFilter, async (req, res) => {
  try {
    const pool = getPool();

    // Get total counts (filtered by division)
    const [familiesResult] = await pool.execute(`SELECT COUNT(*) as count FROM families WHERE 1=1 ${req.divisionFilter}`);
    const [familyMembersResult] = await pool.execute(`SELECT COUNT(*) as count FROM family_members WHERE 1=1 ${req.divisionFilter}`);
    const [youthResult] = await pool.execute(`SELECT COUNT(*) as count FROM youth_members WHERE type = 'youth' ${req.divisionFilter}`);

    // Get youth counts by gender
    const [youthMaleResult] = await pool.execute(`SELECT COUNT(*) as count FROM youth_members WHERE type = 'youth' AND gender = 'male' ${req.divisionFilter}`);
    const [youthFemaleResult] = await pool.execute(`SELECT COUNT(*) as count FROM youth_members WHERE type = 'youth' AND gender = 'female' ${req.divisionFilter}`);

    // Get recent families (filtered)
    const [recentFamilies] = await pool.execute(`
      SELECT f.id, f.family_name, f.created_at, d.division_name
      FROM families f
      LEFT JOIN divisions d ON f.division_id = d.id
      WHERE 1=1 ${req.divisionFilter}
      ORDER BY f.created_at DESC
      LIMIT 5
    `);

    // Get recent youth (filtered)
    const [recentYouth] = await pool.execute(`
      SELECT y.id, y.name, y.created_at, d.division_name
      FROM youth_members y
      LEFT JOIN divisions d ON y.division_id = d.id
      WHERE y.type = 'youth' ${req.divisionFilter}
      ORDER BY y.created_at DESC
      LIMIT 5
    `);

    res.json({
      data: {
        stats: {
          families: familiesResult[0].count,
          familyMembers: familyMembersResult[0].count,
          youth: youthResult[0].count,
          youth_male: youthMaleResult[0].count,
          youth_female: youthFemaleResult[0].count
        },
        recentFamilies,
        recentYouth
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;