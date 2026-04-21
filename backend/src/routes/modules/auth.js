const router = require('express').Router();
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const {
  registerRules,
  loginRules,
  register,
  login,
  getMe,
} = require('../../controllers/authController');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', auth, getMe);

module.exports = router;