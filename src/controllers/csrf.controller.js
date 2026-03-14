const { createCsrfToken, hashToken } = require('../utils/helper');
const { getCsrfCookieOptions } = require('../utils/cookies');

const getToken = (req, res, next) => {
  try {
    const csrfRaw = createCsrfToken(); // random UUID or crypto
    const csrfHashed = hashToken(csrfRaw);

    // Save hashed in cookie
    res.cookie('csrf_token', csrfHashed, getCsrfCookieOptions());

    // Send raw token to client
    return res.status(200).json({ success: true, data: csrfRaw });
  } catch (error) {
    next(error);
  }
};

module.exports = { getToken };
