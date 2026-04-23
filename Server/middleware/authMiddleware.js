const jwt = require('jsonwebtoken');

const User = require('../models/User');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const protect = catchAsync(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new ApiError(401, 'Authentication required. Please login to continue.');
  }

  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'JWT secret is not configured.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser || !currentUser.isActive) {
    throw new ApiError(401, 'The user associated with this token is no longer available.');
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new ApiError(401, 'Password was changed recently. Please login again.');
  }

  req.user = currentUser;
  next();
});

module.exports = {
  protect,
};
