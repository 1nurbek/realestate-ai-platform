const { body } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { getRecommendations } = require('../services/recommendationService');
const { parseQuery } = require('../services/smartSearchService');
const { predictPrice } = require('../services/pricePredictionService');
const { getPersonalizedContent } = require('../services/personalizationService');

// ─── Validation Rules ────────────────────────────────────────────────────────

const smartSearchRules = [
  body('query').trim().notEmpty().withMessage('query is required'),
];

const pricePredictionRules = [
  body('location').trim().notEmpty().withMessage('location is required'),
  body('size').isFloat({ min: 1 }).withMessage('size must be a positive number (sqm)'),
  body('rooms').isInt({ min: 0 }).withMessage('rooms must be a non-negative integer'),
  body('bathrooms').isInt({ min: 0 }).withMessage('bathrooms must be a non-negative integer'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('type is required')
    .isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'apartment', 'house', 'villa', 'land', 'commercial'])
    .withMessage('type must be one of: APARTMENT, HOUSE, VILLA, LAND, COMMERCIAL'),
];

// ─── Handlers ────────────────────────────────────────────────────────────────

/**
 * GET /api/ai/recommendations
 * Auth required — returns top 10 personalized property recommendations.
 */
const getRecommendationsHandler = async (req, res, next) => {
  try {
    const result = await getRecommendations(req.user.id);
    return sendSuccess(res, result, 'Recommendations fetched');
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/ai/smart-search
 * Body: { query: string }
 * Parses NL query and returns matching properties.
 */
const smartSearch = async (req, res, next) => {
  try {
    const { query } = req.body;
    const { where, parsed } = parseQuery(query);

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          location: true,
          address: true,
          size: true,
          rooms: true,
          bathrooms: true,
          type: true,
          status: true,
          images: true,
          features: true,
          views: true,
          createdAt: true,
          user: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { favorites: true, reviews: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      parsed,
    }, 'Smart search results');
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/ai/price-prediction
 * Body: { location, size, rooms, bathrooms, type }
 * Returns estimated price with low/mid/high range.
 */
const pricePrediction = async (req, res, next) => {
  try {
    const { location, size, rooms, bathrooms, type } = req.body;
    const result = predictPrice({ location, size: Number(size), rooms: Number(rooms), bathrooms: Number(bathrooms), type });
    return sendSuccess(res, result, 'Price prediction generated');
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/ai/personalized
 * Optional auth — returns personalized homepage sections.
 * Anonymous users receive general trending content.
 */
const personalized = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const result = await getPersonalizedContent(userId);
    return sendSuccess(res, result, 'Personalized content fetched');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  smartSearchRules,
  pricePredictionRules,
  getRecommendations: getRecommendationsHandler,
  smartSearch,
  pricePrediction,
  personalized,
};
