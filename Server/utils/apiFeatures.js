class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.filterQuery = {};
    this.pagination = {
      page: 1,
      limit: 12,
    };
  }

  static escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  buildFilterQuery() {
    const filter = {};

    if (this.queryString.keyword) {
      const keywordRegex = new RegExp(APIFeatures.escapeRegex(this.queryString.keyword), 'i');
      filter.$or = [
        { name: keywordRegex },
        { description: keywordRegex },
        { category: keywordRegex },
        { brand: keywordRegex },
      ];
    }

    if (this.queryString.category) {
      filter.category = new RegExp(`^${APIFeatures.escapeRegex(this.queryString.category)}$`, 'i');
    }

    if (this.queryString.brand) {
      filter.brand = new RegExp(`^${APIFeatures.escapeRegex(this.queryString.brand)}$`, 'i');
    }

    if (this.queryString.featured !== undefined) {
      filter.featured = this.queryString.featured === 'true';
    }

    if (this.queryString.isPublished !== undefined) {
      filter.isPublished = this.queryString.isPublished === 'true';
    }

    if (this.queryString.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    if (this.queryString.rating) {
      filter.ratings = { ...(filter.ratings || {}), $gte: Number(this.queryString.rating) };
    }

    if (this.queryString.minPrice || this.queryString.maxPrice) {
      filter.price = {};

      if (this.queryString.minPrice) {
        filter.price.$gte = Number(this.queryString.minPrice);
      }

      if (this.queryString.maxPrice) {
        filter.price.$lte = Number(this.queryString.maxPrice);
      }
    }

    return filter;
  }

  apply() {
    this.filterQuery = this.buildFilterQuery();
    this.query = this.query.find(this.filterQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      return this;
    }

    this.query = this.query.sort('-createdAt');
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
      return this;
    }

    this.query = this.query.select('-__v');
    return this;
  }

  paginate() {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.min(Math.max(Number(this.queryString.limit) || 12, 1), 100);
    const skip = (page - 1) * limit;

    this.pagination = { page, limit, skip };
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
