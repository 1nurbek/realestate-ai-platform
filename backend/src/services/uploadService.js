const cloudinary = require('../config/cloudinary');

const FOLDER = 'realestate';

const uploadImage = async (file) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(file.buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const uploadMultipleImages = async (files) => {
  return Promise.all(files.map((file) => uploadImage(file)));
};

const deleteImage = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};
