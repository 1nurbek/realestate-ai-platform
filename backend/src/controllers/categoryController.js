const { body } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const createRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('slug').trim().notEmpty().withMessage('slug is required'),
  body('icon').optional().trim().isURL().withMessage('icon must be a valid URL'),
];

const updateRules = [
  body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
  body('slug').optional().trim().notEmpty().withMessage('slug cannot be empty'),
  body('icon').optional().trim().isURL().withMessage('icon must be a valid URL'),
];

const getAll = async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { properties: true } } },
    });
    return sendSuccess(res, categories, 'Categories fetched');
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, slug, icon } = req.body;
    const category = await prisma.category.create({
      data: { name, slug, icon },
    });
    return sendSuccess(res, category, 'Category created', 201);
  } catch (error) {
    if (error.code === 'P2002') return sendError(res, 'Category name or slug already exists', 409);
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return sendError(res, 'Category not found', 404);

    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, category, 'Category updated');
  } catch (error) {
    if (error.code === 'P2002') return sendError(res, 'Category name or slug already exists', 409);
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return sendError(res, 'Category not found', 404);

    await prisma.category.delete({ where: { id } });
    return sendSuccess(res, null, 'Category deleted');
  } catch (error) {
    if (error.code === 'P2003') return sendError(res, 'Category is used by existing properties', 400);
    return next(error);
  }
};

module.exports = {
  createRules,
  updateRules,
  getAll,
  create,
  update,
  delete: remove,
};