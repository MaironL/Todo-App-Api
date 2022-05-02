const User = require('../models/User');
const appRoles = require('../constants/appRoles');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const register = async (req, res) => {
  req.body.role =
    req.body.email === process.env.ADMIN_EMAIL
      ? { Admin: appRoles.ADMIN }
      : { User: appRoles.USER };
  const user = await User.create(req.body);

  const accessToken = user.getAccessAuthToken();
  const refreshToken = user.refreshToken;

  //* In prod add secure: true to the cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.status(StatusCodes.CREATED).json({ accessToken, user: { name: user.name, role: user.role } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide an email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('The email entered does not exist');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new BadRequestError('The password entered is incorrect');
  }

  const newRefreshToken = user.getRefreshAuthToken();
  const userRefreshed = await User.findOneAndUpdate(
    { email },
    { refreshToken: newRefreshToken },
    { new: true, runValidators: true }
  ).select('-password');

  if (!userRefreshed) {
    throw new BadRequestError('The user could not be refreshed');
  }

  const accessToken = user.getAccessAuthToken();
  const refreshToken = userRefreshed.refreshToken;

  //* In prod add secure: true to the cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.status(StatusCodes.OK).json({ accessToken, user: { name: user.name, role: user.role } });
};

module.exports = { register, login };
