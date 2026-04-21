const router = require('express').Router();
const auth = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const validate = require('../../middleware/validate');
const {
  moderatePropertyRules,
  getDashboardStats,
  getRecentUsers,
  getRecentProperties,
  getMostViewedProperties,
  getUserActivity,
  getPropertyStats,
  moderateProperty,
  deleteUser,
} = require('../../controllers/adminController');

router.use(auth, roleGuard('ADMIN'));

router.get('/stats', getDashboardStats);
router.get('/recent-users', getRecentUsers);
router.get('/recent-properties', getRecentProperties);
router.get('/most-viewed', getMostViewedProperties);
router.get('/user-activity', getUserActivity);
router.get('/property-stats', getPropertyStats);
router.patch('/properties/:id/moderate', moderatePropertyRules, validate, moderateProperty);
router.delete('/users/:id', deleteUser);

module.exports = router;