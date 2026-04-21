const router = require('express').Router();
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const {
  createRules,
  updateRules,
  getAll,
  create,
  update,
  delete: remove,
} = require('../../controllers/categoryController');

router.get('/', getAll);
router.post('/', auth, roleGuard('ADMIN'), createRules, validate, create);
router.patch('/:id', auth, roleGuard('ADMIN'), updateRules, validate, update);
router.delete('/:id', auth, roleGuard('ADMIN'), remove);

module.exports = router;