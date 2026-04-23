const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

const handleCastError = (error) =>
  new ApiError(400, `Invalid ${error.path}: ${error.value}.`);

const handleDuplicateFieldError = (error) => {
  const fields = Object.keys(error.keyValue || {}).join(', ');
  return new ApiError(409, `Duplicate value found for ${fields}.`);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors || {}).map((item) => item.message);
  return new ApiError(400, 'Validation failed.', errors);
};

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  console.log("🔥 ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
