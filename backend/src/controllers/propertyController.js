const { body, query } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const propertySelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  location: true,
  address: true,
  latitude: true,
  longitude: true,
  size: true,
  rooms: true,
  bathrooms: true,
  type: true,
  status: true,
  images: true,
  features: true,
  views: true,
  userId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
};

const listRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
  query('rooms').optional().isInt({ min: 0 }).withMessage('rooms must be a positive integer'),
];

const createRules = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('description').trim().notEmpty().withMessage('description is required'),
  body('price').isFloat({ min: 0 }).withMessage('price must be a positive number'),
  body('location').trim().notEmpty().withMessage('location is required'),
  body('address').trim().notEmpty().withMessage('address is required'),
  body('size').isFloat({ min: 0 }).withMessage('size must be a positive number'),
  body('rooms').isInt({ min: 0 }).withMessage('rooms must be a positive integer'),
  body('bathrooms').isInt({ min: 0 }).withMessage('bathrooms must be a positive integer'),
  body('type').isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL']).withMessage('invalid property type'),
  body('categoryId').trim().notEmpty().withMessage('categoryId is required'),
  body('images').isArray({ min: 1 }).withMessage('images must be a non-empty array'),
  body('images.*').isString().withMessage('each image must be a string URL'),
  body('features').optional().isArray().withMessage('features must be an array'),
  body('features.*').optional().isString().withMessage('each feature must be a string'),
];

const updateRules = [
  body('title').optional().trim().notEmpty().withMessage('title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('price must be a positive number'),
  body('location').optional().trim().notEmpty().withMessage('location cannot be empty'),
  body('address').optional().trim().notEmpty().withMessage('address cannot be empty'),
  body('size').optional().isFloat({ min: 0 }).withMessage('size must be a positive number'),
  body('rooms').optional().isInt({ min: 0 }).withMessage('rooms must be a positive integer'),
  body('bathrooms').optional().isInt({ min: 0 }).withMessage('bathrooms must be a positive integer'),
  body('type').optional().isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL']).withMessage('invalid property type'),
  body('status').optional().isIn(['ACTIVE', 'PENDING', 'SOLD']).withMessage('invalid property status'),
  body('categoryId').optional().trim().notEmpty().withMessage('categoryId cannot be empty'),
  body('images').optional().isArray().withMessage('images must be an array'),
  body('images.*').optional().isString().withMessage('each image must be a string URL'),
  body('features').optional().isArray().withMessage('features must be an array'),
  body('features.*').optional().isString().withMessage('each feature must be a string'),
];

const parseListParams = (req) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = parseListParams(req);
    const {
      minPrice,
      maxPrice,
      location,
      type,
      rooms,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const where = {};
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (type) where.type = type;
    if (rooms) where.rooms = Number(rooms);
    if (category) where.category = { slug: category };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const allowedSortBy = new Set(['createdAt', 'price', 'views', 'rooms']);
    const finalSortBy = allowedSortBy.has(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [finalSortBy]: finalSortOrder },
        select: {
          ...propertySelect,
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
    }, 'Properties fetched');
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
      select: {
        ...propertySelect,
        user: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!property) return sendError(res, 'Property not found', 404);

    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return sendSuccess(res, { ...property, views: property.views + 1 }, 'Property fetched');
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      location,
      address,
      latitude,
      longitude,
      size,
      rooms,
      bathrooms,
      type,
      images,
      features = [],
      categoryId,
    } = req.body;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) return sendError(res, 'Category not found', 404);

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: Number(price),
        location,
        address,
        latitude: latitude != null ? Number(latitude) : null,
        longitude: longitude != null ? Number(longitude) : null,
        size: Number(size),
        rooms: Number(rooms),
        bathrooms: Number(bathrooms),
        type,
        images,
        features,
        userId: req.user.id,
        categoryId,
      },
      select: propertySelect,
    });

    return sendSuccess(res, property, 'Property created', 201);
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.property.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!existing) return sendError(res, 'Property not found', 404);

    if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
      return sendError(res, 'You are not allowed to update this property', 403);
    }

    const data = { ...req.body };
    if (data.price != null) data.price = Number(data.price);
    if (data.size != null) data.size = Number(data.size);
    if (data.rooms != null) data.rooms = Number(data.rooms);
    if (data.bathrooms != null) data.bathrooms = Number(data.bathrooms);
    if (data.latitude != null) data.latitude = Number(data.latitude);
    if (data.longitude != null) data.longitude = Number(data.longitude);

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });
      if (!category) return sendError(res, 'Category not found', 404);
    }

    const property = await prisma.property.update({
      where: { id },
      data,
      select: propertySelect,
    });

    return sendSuccess(res, property, 'Property updated');
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.property.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!existing) return sendError(res, 'Property not found', 404);

    if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
      return sendError(res, 'You are not allowed to delete this property', 403);
    }

    await prisma.property.delete({ where: { id } });
    return sendSuccess(res, null, 'Property deleted');
  } catch (error) {
    return next(error);
  }
};

const getMyProperties = async (req, res, next) => {
  try {
    const { page, limit, skip } = parseListParams(req);
    const where = { userId: req.user.id };
    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          ...propertySelect,
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, 'My properties fetched');
  } catch (error) {
    return next(error);
  }
};

const getFeatured = async (_req, res, next) => {
  try {
    const items = await prisma.property.findMany({
      where: { status: 'ACTIVE' },
      take: 8,
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      select: {
        ...propertySelect,
        user: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return sendSuccess(res, items, 'Featured properties fetched');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listRules,
  createRules,
  updateRules,
  getAll,
  getById,
  create,
  update,
  delete: remove,
  getMyProperties,
  getFeatured,
};