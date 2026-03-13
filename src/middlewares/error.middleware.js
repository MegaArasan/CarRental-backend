const mongoose = require('mongoose');
const logger = require('../config/logger');
const ErrorResponse = require('../errors/errorResponse');

const errorMiddleware = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  console.log(err);
  if (err instanceof ErrorResponse) {
    statusCode = err.code;
    message = err.message;
  } else if (err.code === 'ECONNREFUSED') {
    message = 'Connection refused';
    statusCode = 503;
  } else if (err.code && String(err.code).length <= 3) {
    statusCode = 500;
    message = err.message;
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0];
    message = `Duplicate value for field: ${field}`;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(',');
  } else if (err.name === 'MongoServerSelectionError') {
    statusCode = 503;
    message = 'Unable to connect to MongoDB server. Please try again later.';
  } else if (err.statusCode) {
    statusCode = err.statusCode || 500;
    message = err?.error?.description || message;
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
