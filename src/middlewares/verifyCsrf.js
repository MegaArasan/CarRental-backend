const { hashToken } = require('../utils/helper');

const verifyCsrf = (req, res, next) => {
  const csrfTokenServer = req.cookies['csrf-token'];
  const csrfTokenClient = req.headers['x-csrf-token'];

  if (!csrfTokenClient || !csrfTokenServer) {
    return res.status(403).json({ error: 'Missing CSRF token' });
  }

  // 3. Validate the CSRF token
  const csrfTokenClientHash = hashToken(csrfTokenClient);
  if (csrfTokenClientHash !== csrfTokenServer) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  return next();
};

module.exports = verifyCsrf;
