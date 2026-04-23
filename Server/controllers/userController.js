const Order = require('../models/Order');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

const sanitizeUser = (user) => user.toJSON();

const updateProfile = catchAsync(async (req, res) => {
  const updates = {};

  ['name', 'email', 'phone'].forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = field === 'email' ? req.body[field].toLowerCase() : req.body[field];
    }
  });

  if (updates.email) {
    const existingUser = await User.findOne({
      email: updates.email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw new ApiError(409, 'Another user already uses this email address.');
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: sanitizeUser(user),
  });
});

const getAddresses = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses');

  res.status(200).json({
    success: true,
    count: user.addresses.length,
    addresses: user.addresses,
  });
});

const addAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const nextAddress = { ...req.body };

  if (nextAddress.isDefault || !user.addresses.length) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
    nextAddress.isDefault = true;
  }

  user.addresses.push(nextAddress);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully.',
    addresses: user.addresses,
  });
});

const updateAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found.');
  }

  Object.entries(req.body).forEach(([key, value]) => {
    address[key] = value;
  });

  if (req.body.isDefault) {
    user.addresses.forEach((item) => {
      item.isDefault = String(item._id) === String(address._id);
    });
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully.',
    addresses: user.addresses,
  });
});

const deleteAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found.');
  }

  const wasDefault = address.isDefault;
  address.deleteOne();

  if (wasDefault && user.addresses.length) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully.',
    addresses: user.addresses,
  });
});

const getOrderHistory = catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('orderItems.product', 'name slug images');

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

module.exports = {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getOrderHistory,
};
