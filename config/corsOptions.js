const { NotAllowedByCORSError } = require('../errors');
const allowedOrigins = require('../constants/allowedOrigins');

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new NotAllowedByCORSError('Not allowed by CORS, please contact the administrator'));
    }
  },
  //credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
