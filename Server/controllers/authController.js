const crypto = require('crypto');

const User = require('../models/User');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { attachTokenCookie, clearTokenCookie } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const sanitizeUser = (user) => user.toJSON();

const register = catchAsync(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'A user with this email already exists.');
  }

  const user = await User.create({
    name: req.body.name,
    email,
    phone: req.body.phone,
    password: req.body.password,
    role: 'user',
  });

  attachTokenCookie(res, user);

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    user: sanitizeUser(user),
  });
});

const login = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  attachTokenCookie(res, user);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    user: sanitizeUser(user),
  });
});

const logout = catchAsync(async (req, res) => {
  clearTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logout successful.',
  });
});

const getProfile = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, 'No user found with that email address.');
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const message = `You requested a password reset for your NVS account. Reset it here: ${resetUrl}. This link expires in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'NVS Password Reset',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully.',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, error.message || 'Unable to send reset email right now.');
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired.');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  attachTokenCookie(res, user);

  res.status(200).json({
    success: true,
    message: 'Password reset successful.',
    user: sanitizeUser(user),
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect.');
  }

  user.password = req.body.newPassword;
  await user.save();

  attachTokenCookie(res, user);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully.',
    user: sanitizeUser(user),
  });
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
};
