const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to authenticate requests using a JWT token stored in cookies.
 *
 * Extracts the JWT token from the request cookies, verifies it, and attaches
 * the decoded user information to the response object as `res.user`.
 * If the token is missing or invalid, responds with a 401 Unauthorized error.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Calls next middleware or sends an error response.
 */
const auth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token missing' });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = auth;
