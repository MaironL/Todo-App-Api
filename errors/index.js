const UnauthenticatedError = require('./unauthenticated');
const BadRequestError = require('./badRequest');
const NotAllowedByCORSError = require('./notAllowedByCORS');
const NotFoundError = require('./notFound');

module.exports = {
  UnauthenticatedError,
  BadRequestError,
  NotAllowedByCORSError,
  NotFoundError,
};
