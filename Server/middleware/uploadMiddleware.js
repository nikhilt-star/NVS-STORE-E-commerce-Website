const multer = require('multer');

const ApiError = require('../utils/apiError');

const fileSizeLimit = Number(process.env.MAX_FILE_UPLOAD_MB || 5) * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!file.mimetype.startsWith('image/')) {
    return callback(new ApiError(400, 'Only image files are allowed.'));
  }

  return callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileSizeLimit,
    files: 5,
  },
});

module.exports = upload;
