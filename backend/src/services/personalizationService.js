const prisma = require('../config/database');

const propertySelect = {
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
};

/**
 * Fetch recently viewed properties for a user.
 * Approximated by properties whose IDs appear in recent search history filters
 * AND high-view properties the user may have browsed.
 * (Without a separate "view log" table, we use favorites + search history timestamps.)
 */
const getRecentlyViewed = async (userId) => {
  // Use favorited properties ordered by favorite createdAt as proxy for recently viewed
  const recentFavorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: {
      property: { select: propertySelect },
    },
  });
  return recentFavorites.map((f) => f.property).filter(Boolean);
};

/**
 * Find properties similar to the user's favorited items.
 * Similarity criteria: same type OR overlapping location, excluding already-favorited IDs.
 */
const getSimilarToFavorites = async (userId) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    take: 10,
    select: {
      propertyId: true,
      property: { select: { type: true, location: true, price: true } },
    },
  });

  if (favorites.length === 0) return [];

  const favIds = favorites.map((f) => f.propertyId);

  // Build OR conditions: same type or same location keyword
  const orConditions = [];
  const seenTypes = new Set();
  const seenLocations = new Set();

  for (const fav of favorites) {
    if (fav.property.type && !seenTypes.has(fav.property.type)) {
      seenTypes.add(fav.property.type);
      orConditions.push({ type: fav.property.type });
    }
    if (fav.property.location && !seenLocations.has(fav.property.location)) {
      seenLocations.add(fav.property.location);
      orConditions.push({ location: { contains: fav.property.location, mode: 'insensitive' } });
    }
  }

  if (orConditions.length === 0) return [];

  const similar = await prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      id: { notIn: favIds },
      OR: orConditions,
    },
    take: 8,
    orderBy: { views: 'desc' },
    select: propertySelect,
  });

  return similar;
};

/**
 * Get trending properties in the user's preferred locations.
 * Preferred locations derived from search history and favorites.
 */
const getTrendingInPreferredLocations = async (userId) => {
  const [searchHistories, favorites] = await Promise.all([
    prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { filters: true },
    }),
    prisma.favorite.findMany({
      where: { userId },
      take: 10,
      select: { property: { select: { location: true } } },
    }),
  ]);

  const locationSet = new Set();
  for (const sh of searchHistories) {
    if (sh.filters && sh.filters.location) locationSet.add(sh.filters.location);
  }
  for (const fav of favorites) {
    if (fav.property && fav.property.location) locationSet.add(fav.property.location);
  }

  if (locationSet.size === 0) {
    // Fallback: general trending
    return prisma.property.findMany({
      where: { status: 'ACTIVE' },
      take: 8,
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      select: propertySelect,
    });
  }

  const locationConditions = [...locationSet].slice(0, 5).map((loc) => ({
    location: { contains: loc, mode: 'insensitive' },
  }));

  return prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      OR: locationConditions,
    },
    take: 8,
    orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
    select: propertySelect,
  });
};

/**
 * Return general trending properties (anonymous / cold-start).
 */
const getGeneralTrending = () =>
  prisma.property.findMany({
    where: { status: 'ACTIVE' },
    take: 10,
    orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
    select: propertySelect,
  });

/**
 * Build personalized homepage content for a user.
 * @param {string|null} userId — null for anonymous users
 * @returns {Promise<object>}
 */
const getPersonalizedContent = async (userId) => {
  // Anonymous user: return only general trending
  if (!userId) {
    const trending = await getGeneralTrending();
    return {
      recentlyViewed: [],
      similarToFavorites: [],
      trendingInPreferredLocations: trending,
      isPersonalized: false,
    };
  }

  const [recentlyViewed, similarToFavorites, trendingInPreferredLocations] = await Promise.all([
    getRecentlyViewed(userId),
    getSimilarToFavorites(userId),
    getTrendingInPreferredLocations(userId),
  ]);

  return {
    recentlyViewed,
    similarToFavorites,
    trendingInPreferredLocations,
    isPersonalized: true,
  };
};

module.exports = { getPersonalizedContent };
