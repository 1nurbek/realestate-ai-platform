const { body } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess } = require('../utils/apiResponse');

const saveSearchRules = [
  body('query').trim().notEmpty().withMessage('query is required'),
  body('filters').optional().isObject().withMessage('filters must be an object'),
];

const getHistory = async (req, res, next) => {
  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return sendSuccess(res, history, 'Search history fetched');
  } catch (error) {
    return next(error);
  }
};

const saveSearch = async (req, res, next) => {
  try {
    const { query, filters = {} } = req.body;
    const entry = await prisma.searchHistory.create({
      data: { userId: req.user.id, query, filters },
    });
    return sendSuccess(res, entry, 'Search saved', 201);
  } catch (error) {
    return next(error);
  }
};

const clearHistory = async (req, res, next) => {
  try {
    await prisma.searchHistory.deleteMany({
      where: { userId: req.user.id },
    });
    return sendSuccess(res, null, 'Search history cleared');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  saveSearchRules,
  getHistory,
  saveSearch,
  clearHistory,
};