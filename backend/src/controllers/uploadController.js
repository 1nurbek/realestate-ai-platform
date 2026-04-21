const { sendSuccess, sendError } = require('../utils/apiResponse');
const uploadService = require('../services/uploadService');

const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file provided', 400);
    }

    const result = await uploadService.uploadImage(req.file);
    return sendSuccess(res, result, 'Image uploaded successfully', 201);
  } catch (error) {
    return next(error);
  }
};

const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, 'No files provided', 400);
    }

    const results = await uploadService.uploadMultipleImages(req.files);
    return sendSuccess(res, results, 'Images uploaded successfully', 201);
  } catch (error) {
    return next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return sendError(res, 'publicId is required', 400);
    }

    const result = await uploadService.deleteImage(publicId);

    if (result.result !== 'ok') {
      return sendError(res, 'Failed to delete image', 500);
    }

    return sendSuccess(res, null, 'Image deleted successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
};
