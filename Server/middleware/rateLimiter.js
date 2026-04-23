const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
      });
    },
  });

const apiLimiter = createLimiter(15 * 60 * 1000, 300, 'Too many requests. Please try again later.');
const authLimiter = createLimiter(15 * 60 * 1000, 20, 'Too many authentication attempts. Please try again later.');
const uploadLimiter = createLimiter(15 * 60 * 1000, 30, 'Too many upload requests. Please slow down.');

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
};
