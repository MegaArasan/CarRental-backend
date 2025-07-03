const logger = require('../config/logger');
const ErrorResponse = require('../errors/errorResponse');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ErrorResponse) {
    statusCode = err.code;
    message = err.message;
  } else if (err.code === 'ECONNREFUSED') {
    message = 'Connection refused';
    statusCode = 503;
  } else if (err.code && String(err.code).length <= 3) {
    statusCode = 500;
    message = err.message;
  } else if (err.message) {
    message = err.message;
  }

  logger.error(`[${req.method} ${req.originalUrl}] ${statusCode} - ${message}\n${err.stack}`);

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorMiddleware;
