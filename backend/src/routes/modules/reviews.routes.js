const router = require('express').Router();
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const {
  createRules,
  getByProperty,
  create,
  delete: remove,
} = require('../../controllers/reviewController');

router.get('/property/:propertyId', getByProperty);
router.post('/property/:propertyId', auth, createRules, validate, create);
router.delete('/:id', auth, remove);

module.exports = router;