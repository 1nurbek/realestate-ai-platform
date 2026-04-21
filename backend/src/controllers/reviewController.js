const { body } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const createRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('comment must be a string'),
];

const getByProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return sendSuccess(res, reviews, 'Reviews fetched');
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { rating, comment } = req.body;

    const existing = await prisma.review.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId,
        },
      },
      select: { id: true },
    });
    if (existing) return sendError(res, 'You already reviewed this property', 409);

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment: comment || null,
        userId: req.user.id,
        propertyId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return sendSuccess(res, review, 'Review created', 201);
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!review) return sendError(res, 'Review not found', 404);

    if (req.user.role !== 'ADMIN' && review.userId !== req.user.id) {
      return sendError(res, 'You are not allowed to delete this review', 403);
    }

    await prisma.review.delete({ where: { id } });
    return sendSuccess(res, null, 'Review deleted');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRules,
  getByProperty,
  create,
  delete: remove,
};