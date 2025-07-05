const { createCsrfToken, hashToken } = require('../utils/helper');

const getToken = (req, res, next) => {
  try {
    const csrfRaw = createCsrfToken(); // random UUID or crypto
    const csrfHashed = hashToken(csrfRaw);

    // Save hashed in cookie
    res.cookie('csrf_token', csrfHashed, {
      httpOnly: false, // frontend must read
      sameSite: 'Strict',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send raw token to client
    return res.status(200).json({ success: true, data: csrfRaw });
  } catch (error) {
    next(error);
  }
};

module.exports = { getToken };
