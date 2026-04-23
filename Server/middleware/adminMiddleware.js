const ApiError = require('../utils/apiError');

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to access this resource.'));
  }

  return next();
};

module.exports = {
  authorize,
};
