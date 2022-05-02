const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const refreshAccessToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    throw new UnauthenticatedError('Missing refresh token');
  }

  const user = await User.findOne({ refreshToken: cookies.refreshToken }).select('-password');
  if (!user) {
    throw new BadRequestError('There is no user with this refresh token');
  }

  try {
    const payload = jwt.verify(cookies.refreshToken, process.env.REFRESH_JWT);
    if (user.name !== payload.name) {
      throw new BadRequestError("The refresh token doesn't match the user");
    }

    const accessToken = user.getAccessAuthToken();
    res.status(StatusCodes.OK).json({ accessToken, user: { name: user.name, role: user.role } });
  } catch (error) {
    throw new UnauthenticatedError('The token is invalid or expired, please login again');
  }
};

const logoutRefreshToken = async (req, res) => {
  //*remenber to delete the access Token in the frontend too!!
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    throw new BadRequestError('No cookies or refreshToken found');
  }

  const logoutUser = await User.findOneAndUpdate(
    { refreshToken: cookies.refreshToken },
    { refreshToken: '' },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  if (!logoutUser) {
    return res
      .status(StatusCodes.NO_CONTENT)
      .send('There is no user with this refresh token in the database');
  }
  //* In prod add secure: true to the cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  return res.status(StatusCodes.NO_CONTENT).send("The user's refresh token has been deleted");
};

module.exports = { refreshAccessToken, logoutRefreshToken };
