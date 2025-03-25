const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.header('Authorization'); // Expect "Authorization: Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // If using "Bearer <token>", remove "Bearer "
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};
