const logger = require('../config/logger');
const errorMiddleware = (err, req, res, next) => {
  const error = { ...err };

  if (error.code === 'ECONNREFUSED') {
    error.message = 'connection refused';
    error.code = 503;
  } else if (String(error.code).length > 3) {
    error.code = 500;
  }

  const message = error.message || 'Internal Server Error';
  const code = error.code || 500;
  logger.error(`${error.code}- ${error.message}`);
  res.status(code).json({
    msg: message
  });
};

module.exports = errorMiddleware;
