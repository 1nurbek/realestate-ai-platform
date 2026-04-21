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
 * Build a preference profile from search history and favorites.
 */
const buildPreferenceProfile = (searchHistories, favorites) => {
  const typeCounts = {};
  const locations = [];
  const prices = [];
  const rooms = [];

  // Extract from search histories
  for (const sh of searchHistories) {
    const f = sh.filters || {};
    if (f.type) typeCounts[f.type] = (typeCounts[f.type] || 0) + 1;
    if (f.location) locations.push(f.location.toLowerCase());
    if (f.minPrice) prices.push(Number(f.minPrice));
    if (f.maxPrice) prices.push(Number(f.maxPrice));
    if (f.rooms) rooms.push(Number(f.rooms));
  }

  // Extract from favorited properties (weighted heavier)
  for (const fav of favorites) {
    const p = fav.property;
    if (p.type) typeCounts[p.type] = (typeCounts[p.type] || 0) + 2;
    if (p.location) locations.push(p.location.toLowerCase());
    prices.push(Number(p.price));
    rooms.push(p.rooms);
  }

  const preferredType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0] || null;
  const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
  const avgRooms = rooms.length ? rooms.reduce((a, b) => a + b, 0) / rooms.length : null;

  // Unique location keywords sorted by frequency
  const locationFreq = {};
  for (const l of locations) {
    locationFreq[l] = (locationFreq[l] || 0) + 1;
  }
  const preferredLocations = Object.keys(locationFreq).sort((a, b) => locationFreq[b] - locationFreq[a]).slice(0, 3);

  return { preferredType, avgPrice, avgRooms, preferredLocations };
};

/**
 * Score a property against the preference profile (0–100).
 */
const scoreProperty = (property, profile) => {
  let score = 0;

  // Type match: 30 points
  if (profile.preferredType && property.type === profile.preferredType) score += 30;

  // Price proximity: up to 25 points
  if (profile.avgPrice != null) {
    const price = Number(property.price);
    const diff = Math.abs(price - profile.avgPrice);
    const ratio = diff / (profile.avgPrice || 1);
    score += Math.max(0, 25 - ratio * 25);
  }

  // Rooms proximity: up to 20 points
  if (profile.avgRooms != null) {
    const diff = Math.abs(property.rooms - profile.avgRooms);
    score += Math.max(0, 20 - diff * 5);
  }

  // Location keyword match: up to 20 points
  if (profile.preferredLocations.length > 0) {
    const loc = property.location.toLowerCase();
    const matchCount = profile.preferredLocations.filter((l) => loc.includes(l) || l.includes(loc)).length;
    score += Math.min(20, matchCount * 10);
  }

  // Popularity boost: up to 5 points
  score += Math.min(5, property.views / 20);

  return Math.round(score);
};

/**
 * Return top 10 recommended properties for a user.
 * Falls back to popular/featured properties on cold-start.
 */
const getRecommendations = async (userId) => {
  const [searchHistories, favorites] = await Promise.all([
    prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { filters: true },
    }),
    prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        property: {
          select: { type: true, price: true, location: true, rooms: true },
        },
      },
    }),
  ]);

  const hasHistory = searchHistories.length > 0 || favorites.length > 0;

  // Cold-start: return popular/featured properties
  if (!hasHistory) {
    const popular = await prisma.property.findMany({
      where: { status: 'ACTIVE' },
      take: 10,
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      select: propertySelect,
    });
    return { recommendations: popular, source: 'popular', profile: null };
  }

  const profile = buildPreferenceProfile(searchHistories, favorites);

  // Fetch active properties (excluding user's own)
  const properties = await prisma.property.findMany({
    where: { status: 'ACTIVE', userId: { not: userId } },
    take: 200,
    orderBy: { createdAt: 'desc' },
    select: propertySelect,
  });

  const scored = properties
    .map((p) => ({ ...p, _score: scoreProperty(p, profile) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 10);

  return { recommendations: scored, source: 'personalized', profile };
};

module.exports = { getRecommendations };
