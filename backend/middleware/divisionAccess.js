const jwt = require('jsonwebtoken');

// Middleware to filter data by division for division leaders
const divisionFilter = (req, res, next) => {
  // Extract token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If user is admin, allow all data
    if (decoded.role === 'admin') {
      req.divisionFilter = ''; // No filter for admin
      req.user = decoded;
      return next();
    }

    // If user is division leader, filter by their division
    if (decoded.role === 'division_leader' && decoded.divisionId) {
      req.divisionFilter = `AND division_id = ${decoded.divisionId}`;
      req.user = decoded;
      return next();
    }

    return res.status(403).json({ message: 'Invalid user role' });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to ensure only admins can perform write operations
const adminOnly = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { divisionFilter, adminOnly };