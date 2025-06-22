const logger = require('../config/logger');
const audit = require('../models/auditModel');
const methodMappers = {
  GET: 'Fetching',
  POST: 'Adding',
  PUT: 'Updating',
  DELETE: 'Deleting'
};

exports.auditLog = (req, res, next) => {
  try {
    const originalJson = res.json;
    res.json = async function (body) {
      await audit.create({
        url: req.originalUrl,
        activity:
          methodMappers[req.method] +
            ' ' +
            req.originalUrl.split('/')[req.originalUrl.split('/').length - 1] || '',
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query),
        payload: JSON.stringify(req.body),
        response: JSON.stringify(body)
      });
      return originalJson.call(this, body);
    };
    next();
  } catch (e) {
    logger.error('>>>>> an error occurred logging audit trail >>>>>>>>');
    logger.error(error.message);
    next();
  }
};
