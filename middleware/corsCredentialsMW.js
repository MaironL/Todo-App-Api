const allowedOrigins = require('../constants/allowedOrigins');

const corsCredentialsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  next();
};

module.exports = corsCredentialsMiddleware;
