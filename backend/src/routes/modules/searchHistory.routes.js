const router = require('express').Router();
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const {
  saveSearchRules,
  getHistory,
  saveSearch,
  clearHistory,
} = require('../../controllers/searchHistoryController');

router.get('/', auth, getHistory);
router.post('/', auth, saveSearchRules, validate, saveSearch);
router.delete('/', auth, clearHistory);

module.exports = router;