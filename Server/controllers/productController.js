const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const { deleteFromCloudinary, uploadToCloudinary } = require('../config/cloudinary');

const parseBoolean = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true';
};

const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return Number(value);
};

const parseSpecifications = (value, fallback = []) => {
  if (value === undefined) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return fallback;
};

const uploadImages = async (files = []) =>
  Promise.all(
    files.map((file) =>
      uploadToCloudinary(file, {
        folder: 'nvs/products',
      })
    )
  );

const listProducts = async (baseQuery, req, res) => {
  const features = new APIFeatures(baseQuery, req.query).apply().sort().limitFields().paginate();
  const baseFilter = baseQuery.getFilter();
  const hasBaseFilter = Object.keys(baseFilter).length > 0;
  const hasFeatureFilter = Object.keys(features.filterQuery).length > 0;
  const countFilter =
    hasBaseFilter && hasFeatureFilter
      ? { $and: [baseFilter, features.filterQuery] }
      : hasBaseFilter
        ? baseFilter
        : features.filterQuery;

  const [products, totalProducts] = await Promise.all([
    features.query,
    Product.countDocuments(countFilter),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    totalPages: Math.max(Math.ceil(totalProducts / features.pagination.limit), 1),
    currentPage: features.pagination.page,
    products,
  });
};

const getProducts = catchAsync(async (req, res) => {
  await listProducts(Product.find({ isPublished: true }), req, res);
});

const getAdminProducts = catchAsync(async (req, res) => {
  await listProducts(Product.find(), req, res);
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await Product.distinct('category', { isPublished: true });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories: categories.sort((a, b) => a.localeCompare(b)),
  });
});

const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isPublished: true,
  }).populate('reviews.user', 'name');

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  res.status(200).json({
    success: true,
    product,
  });
});

const createProduct = catchAsync(async (req, res) => {
  const images = req.files?.length ? await uploadImages(req.files) : [];

  try {
    const product = await Product.create({
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      brand: req.body.brand || 'NVS',
      category: req.body.category,
      subcategory: req.body.subcategory,
      sku: req.body.sku,
      price: parseNumber(req.body.price),
      discountPrice: parseNumber(req.body.discountPrice, null),
      stock: parseNumber(req.body.stock, 0),
      featured: parseBoolean(req.body.featured, false),
      isPublished: parseBoolean(req.body.isPublished, true),
      specifications: parseSpecifications(req.body.specifications),
      images,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    await Promise.allSettled(images.map((image) => deleteFromCloudinary(image.public_id)));
    throw error;
  }
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  const incomingImages = req.files?.length ? await uploadImages(req.files) : [];

  try {
    const replaceImages = parseBoolean(req.body.replaceImages, false);

    if (replaceImages && incomingImages.length) {
      await Promise.allSettled(product.images.map((image) => deleteFromCloudinary(image.public_id)));
      product.images = incomingImages;
    } else if (incomingImages.length) {
      product.images = [...product.images, ...incomingImages];
    }

    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.shortDescription !== undefined) product.shortDescription = req.body.shortDescription;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.brand !== undefined) product.brand = req.body.brand;
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.subcategory !== undefined) product.subcategory = req.body.subcategory;
    if (req.body.sku !== undefined) product.sku = req.body.sku;
    if (req.body.price !== undefined) product.price = parseNumber(req.body.price);
    if (req.body.discountPrice !== undefined) product.discountPrice = parseNumber(req.body.discountPrice, null);
    if (req.body.stock !== undefined) product.stock = parseNumber(req.body.stock, 0);
    if (req.body.featured !== undefined) product.featured = parseBoolean(req.body.featured, product.featured);
    if (req.body.isPublished !== undefined) product.isPublished = parseBoolean(req.body.isPublished, product.isPublished);
    if (req.body.specifications !== undefined) {
      product.specifications = parseSpecifications(req.body.specifications, product.specifications);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    await Promise.allSettled(incomingImages.map((image) => deleteFromCloudinary(image.public_id)));
    throw error;
  }
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  await Promise.allSettled(product.images.map((image) => deleteFromCloudinary(image.public_id)));
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully.',
  });
});

const addProductReview = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isPublished) {
    throw new ApiError(404, 'Product not found.');
  }

  const existingReview = product.reviews.find(
    (review) => String(review.user) === String(req.user._id)
  );

  if (existingReview) {
    existingReview.rating = Number(req.body.rating);
    existingReview.comment = req.body.comment;
    existingReview.name = req.user.name;
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });
  }

  product.calculateRatings();
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Review saved successfully.',
    product,
  });
});

module.exports = {
  getProducts,
  getAdminProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
};
