const router = require('express').Router();
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const {
  updateProfileRules,
  listUsersRules,
  getProfile,
  updateProfile,
  getAllUsers,
} = require('../../controllers/userController');

router.get('/me', auth, getProfile);
router.patch('/me', auth, updateProfileRules, validate, updateProfile);
router.get('/', auth, roleGuard('ADMIN'), listUsersRules, validate, getAllUsers);

module.exports = router;