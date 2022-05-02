const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
//const User = require('../models/User');

const userAuthZMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_JWT).UserInfo;
    req.user = { userId: payload.userId, name: payload.name };
    req.role = payload.role;
    //another way
    // const user = User.findById(payload.id).select("-password")
    // req.user = user

    next();
  } catch (error) {
    throw new UnauthenticatedError('The token is invalid or expired');
  }
};

module.exports = userAuthZMiddleware;
