const mongoose = require('mongoose');

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters.'],
    },
  },
  { timestamps: true }
);

const specificationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true,
      required: true,
    },
    value: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters.'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [240, 'Short description cannot exceed 240 characters.'],
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      maxlength: [4000, 'Description cannot exceed 4000 characters.'],
    },
    brand: {
      type: String,
      trim: true,
      default: 'NVS',
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    sku: {
      type: String,
      required: [true, 'SKU is required.'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator(value) {
          return value === null || value <= this.price;
        },
        message: 'Discount price cannot be greater than regular price.',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required.'],
      min: [0, 'Stock cannot be negative.'],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, 'Sold count cannot be negative.'],
    },
    images: [imageSchema],
    specifications: [specificationSchema],
    reviews: [reviewSchema],
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  brand: 'text',
});

productSchema.pre('validate', function createSlug(next) {
  if (this.isModified('name') || !this.slug) {
    const slugBase = slugify(this.name || 'product');
    this.slug = `${slugBase}-${String(this._id).slice(-6)}`;
  }

  next();
});

productSchema.methods.calculateRatings = function calculateRatings() {
  this.numReviews = this.reviews.length;

  if (!this.reviews.length) {
    this.ratings = 0;
    return;
  }

  const totalRating = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.ratings = Number((totalRating / this.reviews.length).toFixed(1));
};

module.exports = mongoose.model('Product', productSchema);
