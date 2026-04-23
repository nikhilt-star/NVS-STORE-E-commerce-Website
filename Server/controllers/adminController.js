const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

const getDashboardStats = catchAsync(async (req, res) => {
  const paidOrderMatch = {
    orderStatus: { $in: ['Paid', 'Shipped', 'Delivered'] },
  };

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    recentOrders,
    lowStockProducts,
    monthlyRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: paidOrderMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]),
    Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email'),
    Product.find({ stock: { $lte: 10 } })
      .sort('stock')
      .limit(5)
      .select('name stock sku category'),
    Order.aggregate([
      { $match: paidOrderMatch },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      recentOrders,
      lowStockProducts,
      monthlyRevenue,
    },
  });
});

const getUsers = catchAsync(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }

  if (req.query.keyword) {
    filter.$or = [
      { name: new RegExp(req.query.keyword, 'i') },
      { email: new RegExp(req.query.keyword, 'i') },
    ];
  }

  const [users, totalUsers] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    totalUsers,
    totalPages: Math.max(Math.ceil(totalUsers / limit), 1),
    currentPage: page,
    users,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isActive: req.body.isActive,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    throw new ApiError(400, 'You cannot deactivate your own account from this route.');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully.',
  });
});

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
