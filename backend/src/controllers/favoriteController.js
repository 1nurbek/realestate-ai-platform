const prisma = require('../config/database');
const { sendSuccess } = require('../utils/apiResponse');

const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
            images: true,
            type: true,
            rooms: true,
            bathrooms: true,
            views: true,
            createdAt: true,
            user: { select: { id: true, name: true, avatar: true } },
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
    return sendSuccess(res, favorites, 'Favorites fetched');
  } catch (error) {
    return next(error);
  }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId: req.user.id, propertyId } },
      select: { id: true },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_propertyId: { userId: req.user.id, propertyId } },
      });
      return sendSuccess(res, { isFavorited: false }, 'Removed from favorites');
    }

    await prisma.favorite.create({
      data: { userId: req.user.id, propertyId },
    });
    return sendSuccess(res, { isFavorited: true }, 'Added to favorites', 201);
  } catch (error) {
    return next(error);
  }
};

const checkFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const favorite = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId: req.user.id, propertyId } },
      select: { id: true },
    });
    return sendSuccess(res, { isFavorited: Boolean(favorite) }, 'Favorite status fetched');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyFavorites,
  toggleFavorite,
  checkFavorite,
};