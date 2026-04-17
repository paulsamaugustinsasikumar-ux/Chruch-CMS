const jwt = require('jsonwebtoken');

const authenticateDivisionLeader = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is a division leader
    if (!decoded.divisionId) {
      return res.status(403).json({ message: 'Access denied. Division leader access required.' });
    }

    req.divisionLeader = {
      id: decoded.id,
      divisionId: decoded.divisionId,
      username: decoded.username,
      role: decoded.role,
      divisionName: decoded.divisionName,
      leaderName: decoded.leaderName
    };

    next();
  } catch (error) {
    console.error('Division leader authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateDivisionLeader };