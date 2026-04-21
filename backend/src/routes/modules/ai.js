const router = require('express').Router();
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const {
  smartSearchRules,
  pricePredictionRules,
  getRecommendations,
  smartSearch,
  pricePrediction,
  personalized,
} = require('../../controllers/aiController');

// Optional auth middleware — attaches user if token present, does not reject if missing
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return next();
  return auth(req, res, next);
};

// GET /api/ai/recommendations — requires authentication
router.get('/recommendations', auth, getRecommendations);

// POST /api/ai/smart-search — public
router.post('/smart-search', smartSearchRules, validate, smartSearch);

// POST /api/ai/price-prediction — public
router.post('/price-prediction', pricePredictionRules, validate, pricePrediction);

// GET /api/ai/personalized — optional auth
router.get('/personalized', optionalAuth, personalized);

module.exports = router;
