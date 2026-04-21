const { body } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const moderatePropertyRules = [
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(['APPROVE', 'REJECT', 'ACTIVE', 'DELETE'])
    .withMessage('status must be APPROVE, REJECT, ACTIVE, or DELETE'),
];

const getDashboardStats = async (_req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalProperties,
      totalActive,
      totalPending,
      totalSold,
      totalMessages,
      totalReviews,
      newUsersThisMonth,
      newPropertiesThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.property.count({ where: { status: 'ACTIVE' } }),
      prisma.property.count({ where: { status: 'PENDING' } }),
      prisma.property.count({ where: { status: 'SOLD' } }),
      prisma.message.count(),
      prisma.review.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.property.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    return sendSuccess(
      res,
      {
        totalUsers,
        totalProperties,
        totalActive,
        totalPending,
        totalSold,
        totalMessages,
        totalReviews,
        newUsersThisMonth,
        newPropertiesThisMonth,
      },
      'Dashboard stats fetched',
    );
  } catch (error) {
    return next(error);
  }
};

const getRecentUsers = async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, users, 'Recent users fetched');
  } catch (error) {
    return next(error);
  }
};

const getRecentProperties = async (_req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        type: true,
        status: true,
        views: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return sendSuccess(res, properties, 'Recent properties fetched');
  } catch (error) {
    return next(error);
  }
};

const getMostViewedProperties = async (_req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      take: 10,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        views: true,
        status: true,
        price: true,
        type: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, properties, 'Most viewed properties fetched');
  } catch (error) {
    return next(error);
  }
};

const getUserActivity = async (_req, res, next) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const formatDay = (date) => date.toISOString().slice(0, 10);
    const activityMap = new Map();

    for (let i = 0; i < 30; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      activityMap.set(formatDay(d), 0);
    }

    users.forEach(({ createdAt }) => {
      const key = formatDay(new Date(createdAt));
      if (activityMap.has(key)) {
        activityMap.set(key, activityMap.get(key) + 1);
      }
    });

    const activity = Array.from(activityMap.entries()).map(([date, count]) => ({ date, count }));
    return sendSuccess(res, activity, 'User activity fetched');
  } catch (error) {
    return next(error);
  }
};

const getPropertyStats = async (_req, res, next) => {
  try {
    const [byTypeRaw, byStatusRaw] = await Promise.all([
      prisma.property.groupBy({
        by: ['type'],
        _count: { _all: true },
        orderBy: { type: 'asc' },
      }),
      prisma.property.groupBy({
        by: ['status'],
        _count: { _all: true },
        orderBy: { status: 'asc' },
      }),
    ]);

    const byType = byTypeRaw.map((item) => ({ type: item.type, count: item._count._all }));
    const byStatus = byStatusRaw.map((item) => ({ status: item.status, count: item._count._all }));

    return sendSuccess(res, { byType, byStatus }, 'Property stats fetched');
  } catch (error) {
    return next(error);
  }
};

const moderateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const action = String(req.body.status || '').toUpperCase();

    const existing = await prisma.property.findUnique({
      where: { id },
      select: { id: true, title: true, status: true },
    });

    if (!existing) return sendError(res, 'Property not found', 404);

    if (action === 'APPROVE' || action === 'ACTIVE') {
      const property = await prisma.property.update({
        where: { id },
        data: { status: 'ACTIVE' },
        select: { id: true, title: true, status: true, updatedAt: true },
      });
      return sendSuccess(res, property, 'Property approved');
    }

    if (action === 'REJECT' || action === 'DELETE') {
      await prisma.property.delete({ where: { id } });
      return sendSuccess(res, { id }, 'Property rejected and deleted');
    }

    return sendError(res, 'Unsupported moderation status', 400);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === id) return sendError(res, 'Admin cannot delete self', 400);

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    if (!existing) return sendError(res, 'User not found', 404);

    await prisma.user.delete({ where: { id } });
    return sendSuccess(res, { id }, 'User and related data deleted');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  moderatePropertyRules,
  getDashboardStats,
  getRecentUsers,
  getRecentProperties,
  getMostViewedProperties,
  getUserActivity,
  getPropertyStats,
  moderateProperty,
  deleteUser,
};