const { UnauthenticatedError } = require('../errors');

const userRoleAuthZMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req?.role) {
      throw new UnauthenticatedError('Missing roles');
    }

    if (!allowedRoles.includes(req.role)) {
      throw new UnauthenticatedError('You are not allowed to access this resource');
    }
    next();
  };
};

module.exports = userRoleAuthZMiddleware;
