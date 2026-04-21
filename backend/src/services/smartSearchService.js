/**
 * Smart Search Service — parses natural language queries into Prisma filter objects.
 * Uses keyword matching and regex patterns; no external NLP library required.
 */

// Map of type keywords → PropertyType enum values
const TYPE_KEYWORDS = {
  apartment: 'APARTMENT',
  flat: 'APARTMENT',
  studio: 'APARTMENT',
  house: 'HOUSE',
  home: 'HOUSE',
  bungalow: 'HOUSE',
  villa: 'VILLA',
  mansion: 'VILLA',
  land: 'LAND',
  plot: 'LAND',
  lot: 'LAND',
  commercial: 'COMMERCIAL',
  office: 'COMMERCIAL',
  shop: 'COMMERCIAL',
  warehouse: 'COMMERCIAL',
};

// Price indicator keywords → multiplier relative to base buckets
const CHEAP_KEYWORDS = ['cheap', 'affordable', 'budget', 'low-cost', 'inexpensive', 'economy'];
const LUXURY_KEYWORDS = ['luxury', 'luxurious', 'premium', 'high-end', 'exclusive', 'deluxe', 'upscale'];
const EXPENSIVE_KEYWORDS = ['expensive', 'pricey', 'costly'];

// Feature keywords to match against property features array
const FEATURE_KEYWORDS = [
  'pool', 'swimming pool', 'garden', 'garage', 'parking', 'gym', 'elevator',
  'balcony', 'terrace', 'fireplace', 'basement', 'storage', 'security',
  'air conditioning', 'furnished', 'pet-friendly',
];

/**
 * Extract property type from text.
 * @param {string} text
 * @returns {string|null}
 */
const extractType = (text) => {
  for (const [keyword, type] of Object.entries(TYPE_KEYWORDS)) {
    if (text.includes(keyword)) return type;
  }
  return null;
};

/**
 * Extract room count from patterns like "3 bedroom", "2-bedroom", "three bed".
 * @param {string} text
 * @returns {number|null}
 */
const extractRooms = (text) => {
  // Numeric: "3 bedroom(s)", "3-bed", "3 room(s)"
  const numericMatch = text.match(/(\d+)\s*[-\s]?(bedroom|bed|room|br)/i);
  if (numericMatch) return parseInt(numericMatch[1], 10);

  // Word numbers
  const wordMap = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  for (const [word, num] of Object.entries(wordMap)) {
    if (new RegExp(`${word}\\s*[-\\s]?(bedroom|bed|room|br)`, 'i').test(text)) return num;
  }

  return null;
};

/**
 * Extract explicit price bounds from text.
 * Supports "under 500k", "below 1m", "above 200000", "over 300k", "between 200k and 500k".
 * @param {string} text
 * @returns {{ minPrice: number|null, maxPrice: number|null }}
 */
const extractPriceBounds = (text) => {
  let minPrice = null;
  let maxPrice = null;

  const parseAmount = (raw) => {
    const lower = raw.toLowerCase().replace(/,/g, '');
    if (lower.endsWith('m')) return parseFloat(lower) * 1_000_000;
    if (lower.endsWith('k')) return parseFloat(lower) * 1_000;
    return parseFloat(lower);
  };

  // "under X" / "below X" / "less than X" → maxPrice
  const underMatch = text.match(/(?:under|below|less\s+than|max|no\s+more\s+than)\s*([\d.,]+[km]?)/i);
  if (underMatch) maxPrice = parseAmount(underMatch[1]);

  // "above X" / "over X" / "more than X" / "at least X" → minPrice
  const overMatch = text.match(/(?:above|over|more\s+than|at\s+least|minimum|min)\s*([\d.,]+[km]?)/i);
  if (overMatch) minPrice = parseAmount(overMatch[1]);

  // "between X and Y"
  const betweenMatch = text.match(/between\s*([\d.,]+[km]?)\s*(?:and|to|-)\s*([\d.,]+[km]?)/i);
  if (betweenMatch) {
    minPrice = parseAmount(betweenMatch[1]);
    maxPrice = parseAmount(betweenMatch[2]);
  }

  return { minPrice, maxPrice };
};

/**
 * Infer price range from sentiment keywords (cheap / luxury / expensive).
 * Only applied when no explicit price bounds were extracted.
 * @param {string} text
 * @returns {{ minPrice: number|null, maxPrice: number|null }}
 */
const inferPriceFromSentiment = (text) => {
  if (CHEAP_KEYWORDS.some((kw) => text.includes(kw))) {
    return { minPrice: null, maxPrice: 150_000 };
  }
  if (LUXURY_KEYWORDS.some((kw) => text.includes(kw))) {
    return { minPrice: 500_000, maxPrice: null };
  }
  if (EXPENSIVE_KEYWORDS.some((kw) => text.includes(kw))) {
    return { minPrice: 300_000, maxPrice: null };
  }
  return { minPrice: null, maxPrice: null };
};

/**
 * Extract location keywords — words after "in", "near", "at", "around", "close to".
 * @param {string} text
 * @returns {string|null}
 */
const extractLocation = (text) => {
  const locationMatch = text.match(/(?:in|near|at|around|close\s+to|located\s+in)\s+([a-z\s]+?)(?:\s+(?:with|for|under|above|below|over|between|and|,)|$)/i);
  if (locationMatch) {
    return locationMatch[1].trim();
  }
  return null;
};

/**
 * Extract feature keywords present in the query.
 * @param {string} text
 * @returns {string[]}
 */
const extractFeatures = (text) => {
  return FEATURE_KEYWORDS.filter((feature) => text.includes(feature));
};

/**
 * Parse a natural language query string into a Prisma-compatible where filter object.
 *
 * @param {string} queryText - e.g. "cheap apartment near city center with pool"
 * @returns {{
 *   where: object,        // Prisma where clause
 *   parsed: {             // Human-readable parsed tokens
 *     type: string|null,
 *     rooms: number|null,
 *     minPrice: number|null,
 *     maxPrice: number|null,
 *     location: string|null,
 *     features: string[]
 *   }
 * }}
 */
const parseQuery = (queryText) => {
  const text = (queryText || '').toLowerCase().trim();

  const type = extractType(text);
  const rooms = extractRooms(text);
  const location = extractLocation(text);
  const features = extractFeatures(text);

  let { minPrice, maxPrice } = extractPriceBounds(text);
  if (minPrice == null && maxPrice == null) {
    const sentiment = inferPriceFromSentiment(text);
    minPrice = sentiment.minPrice;
    maxPrice = sentiment.maxPrice;
  }

  // Build Prisma where clause
  const where = { status: 'ACTIVE' };

  if (type) where.type = type;
  if (rooms != null) where.rooms = { gte: rooms };
  if (location) where.location = { contains: location, mode: 'insensitive' };

  if (minPrice != null || maxPrice != null) {
    where.price = {};
    if (minPrice != null) where.price.gte = minPrice;
    if (maxPrice != null) where.price.lte = maxPrice;
  }

  // Features: property must contain ALL extracted feature keywords
  if (features.length > 0) {
    where.features = { hasSome: features };
  }

  return {
    where,
    parsed: { type, rooms, minPrice, maxPrice, location, features },
  };
};

module.exports = { parseQuery };
