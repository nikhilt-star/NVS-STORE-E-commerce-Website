const User = require('../models/User');
const ApiError = require('../utils/apiError');

const createSingleAdmin = async ({ name, email, phone, password }) => {
  const normalizedEmail = email.toLowerCase();
  const existingAdmin = await User.findOne({ role: 'admin' });

  if (existingAdmin) {
    throw new ApiError(409, 'Only one admin is allowed');
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, 'A user with this email already exists.');
  }

  return User.create({
    name,
    email: normalizedEmail,
    phone,
    password,
    role: 'admin',
  });
};

module.exports = {
  createSingleAdmin,
};
