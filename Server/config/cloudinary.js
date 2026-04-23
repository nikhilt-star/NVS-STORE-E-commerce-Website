const cloudinary = require('cloudinary').v2;

const logger = require('../utils/logger');

let configured = false;

const configureCloudinary = () => {
  if (configured) {
    return true;
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn('Cloudinary credentials are missing. Image uploads will fail until they are configured.');
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  configured = true;
  return true;
};

const uploadToCloudinary = async (file, options = {}) => {
  if (!configureCloudinary()) {
    throw new Error('Cloudinary is not configured.');
  }

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    {
      folder: options.folder || 'nvs/products',
      resource_type: 'image',
      transformation: options.transformation || [{ quality: 'auto', fetch_format: 'auto' }],
    }
  );

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !configureCloudinary()) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId);
};

module.exports = {
  cloudinary,
  configureCloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
