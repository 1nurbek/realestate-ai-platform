const { body, query } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess } = require('../utils/apiResponse');

const updateProfileRules = [
  body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
  body('phone').optional().trim().isLength({ min: 6, max: 20 }).withMessage('phone must be between 6 and 20 chars'),
  body('avatar').optional().trim().isURL().withMessage('avatar must be a valid URL'),
];

const listUsersRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
];

const getProfile = async (req, res) => sendSuccess(res, req.user, 'Profile fetched');

const updateProfile = async (req, res, next) => {
  try {
    const data = {};
    ['name', 'phone', 'avatar'].forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, user, 'Profile updated');
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          createdAt: true,
          _count: { select: { properties: true, favorites: true, reviews: true } },
        },
      }),
      prisma.user.count(),
    ]);

    return sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, 'Users fetched');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updateProfileRules,
  listUsersRules,
  getProfile,
  updateProfile,
  getAllUsers,
};