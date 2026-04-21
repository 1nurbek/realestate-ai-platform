const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  generateToken,
  verifyToken,
};