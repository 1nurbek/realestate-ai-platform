const router = require('express').Router();
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const {
  listRules,
  createRules,
  updateRules,
  getAll,
  getById,
  create,
  update,
  delete: remove,
  getMyProperties,
  getFeatured,
} = require('../../controllers/propertyController');

router.get('/', listRules, validate, getAll);
router.get('/featured', getFeatured);
router.get('/my', auth, getMyProperties);
router.get('/:id', getById);
router.post('/', auth, createRules, validate, create);
router.patch('/:id', auth, updateRules, validate, update);
router.delete('/:id', auth, remove);

module.exports = router;