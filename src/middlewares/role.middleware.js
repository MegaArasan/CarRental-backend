const ErrorResponse = require('../errors/errorResponse');

const authorizedRoles = (...allowedRoles) => {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      throw new ErrorResponse(401, 'Unauthorized: User Not found');
    }
    if (!allowedRoles.includes(user.role)) {
      throw new ErrorResponse(403, `Access Denied: Requires role(s): ${allowedRoles.join(', ')}`);
    }

    next();
  };
};

module.exports = authorizedRoles;
