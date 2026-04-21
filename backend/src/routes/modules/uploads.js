const router = require('express').Router();
const multer = require('multer');
const auth = require('../../middleware/auth');
const uploadController = require('../../controllers/uploadController');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

router.post('/image', auth, upload.single('image'), uploadController.uploadSingleImage);
router.post('/images', auth, upload.array('images', 10), uploadController.uploadMultipleImages);
router.delete('/image', auth, uploadController.deleteImage);

module.exports = router;
