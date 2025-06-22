const jwt = require('jsonwebtoken');

const createToken = (payload, expiry) => {
  return jwt.sign(payload, process.env.secret_key, {
    expiresIn: expiry || process.env.JWT_EXPIRES_IN || '1d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.secret_key);
};

module.exports = { createToken, verifyToken };
