const { verifyToken } = require('../utils/jwt');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    res.user = await verifyToken(token);
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = auth;
