const router = require('express').Router();

router.use('/auth', require('./modules/auth'));
router.use('/users', require('./modules/users.routes'));
router.use('/categories', require('./modules/categories.routes'));
router.use('/properties', require('./modules/properties.routes'));
router.use('/favorites', require('./modules/favorites.routes'));
router.use('/messages', require('./modules/messages.routes'));
router.use('/search-history', require('./modules/searchHistory.routes'));
router.use('/reviews', require('./modules/reviews.routes'));
router.use('/uploads', require('./modules/uploads'));
router.use('/admin', require('./modules/admin'));
router.use('/ai', require('./modules/ai'));

module.exports = router;