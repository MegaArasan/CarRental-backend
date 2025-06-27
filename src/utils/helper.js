const crypto = require('node:crypto');

const createCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  createCsrfToken
};
