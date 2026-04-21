const router = require('express').Router();
const auth = require('../../middleware/auth');
const {
  getMyFavorites,
  toggleFavorite,
  checkFavorite,
} = require('../../controllers/favoriteController');

router.get('/', auth, getMyFavorites);
router.get('/check/:propertyId', auth, checkFavorite);
router.post('/:propertyId', auth, toggleFavorite);
router.delete('/:propertyId', auth, toggleFavorite);

module.exports = router;