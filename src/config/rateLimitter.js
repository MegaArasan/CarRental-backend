const rateLimit = require('express-rate-limit');

const limitter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  message: 'Too many request',
  statusCode: 429,
  legacyHeaders: false,
  standardHeaders: true
});

module.exports = limitter;
