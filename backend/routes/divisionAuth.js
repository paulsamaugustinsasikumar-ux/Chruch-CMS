const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getPool = require('../config/database');

const router = express.Router();

// Division Leader Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, division_name, leader_name, login_username, login_password, role FROM divisions WHERE login_username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid division credentials' });
    }

    const division = rows[0];
    const isValidPassword = await bcrypt.compare(password, division.login_password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid division credentials' });
    }

    // Generate JWT token with division info
    const token = jwt.sign(
      {
        id: division.id,
        username: division.login_username,
        role: 'division_leader',
        divisionId: division.id,
        divisionName: division.division_name,
        leaderName: division.leader_name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: division.id,
        username: division.login_username,
        role: 'division_leader',
        divisionName: division.division_name,
        leaderName: division.leader_name
      }
    });
  } catch (error) {
    console.error('Division leader login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get division leader profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, division_name, leader_name, role FROM divisions WHERE id = ?',
      [decoded.divisionId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Division not found' });
    }

    res.json({ division: rows[0] });
  } catch (error) {
    console.error('Get division profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;