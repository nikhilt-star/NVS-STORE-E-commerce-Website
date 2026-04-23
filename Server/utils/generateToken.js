const jwt = require('jsonwebtoken');

const getCookieOptions = () => {
  const expiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7);
  const configuredSameSite = process.env.COOKIE_SAME_SITE;
  const sameSite = configuredSameSite || 'lax';
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === 'true'
    : process.env.NODE_ENV === 'production' || sameSite === 'none';

  const options = {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
  };

  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const attachTokenCookie = (res, user) => {
  const token = generateToken(user._id);
  res.cookie('token', token, getCookieOptions());
  return token;
};

const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    ...getCookieOptions(),
    expires: new Date(0),
  });
};

module.exports = {
  generateToken,
  getCookieOptions,
  attachTokenCookie,
  clearTokenCookie,
};
