const crypto = require('node:crypto');

const createCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  createCsrfToken,
  hashToken
};
