const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    // Remove "Bearer " if present
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded; // decoded payload should include id (or user_id) and email
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
