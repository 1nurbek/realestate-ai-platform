/**
 * Price Prediction Service — rule-based property price estimator.
 * No external API or ML library required.
 */

// Base price per square meter (USD) by property type
const BASE_PRICE_PER_SQM = {
  APARTMENT: 2_500,
  HOUSE: 2_000,
  VILLA: 4_500,
  LAND: 800,
  COMMERCIAL: 3_500,
};

// Location multipliers: keywords mapped to a price factor
const LOCATION_MULTIPLIERS = [
  { keywords: ['city center', 'downtown', 'central', 'cbd', 'midtown'], factor: 1.8 },
  { keywords: ['waterfront', 'beachfront', 'seafront', 'ocean view', 'lake view'], factor: 1.9 },
  { keywords: ['suburb', 'suburbs', 'outskirts', 'rural', 'countryside'], factor: 0.6 },
  { keywords: ['business district', 'financial district'], factor: 1.7 },
  { keywords: ['uptown', 'premium', 'luxury', 'exclusive', 'highland'], factor: 1.6 },
  { keywords: ['industrial', 'warehouse district'], factor: 0.75 },
  { keywords: ['old town', 'historic'], factor: 1.2 },
];
const DEFAULT_LOCATION_FACTOR = 1.0;

// Additional value per extra room (above 1), applied to base price total
const ROOM_PREMIUM_FACTOR = 0.08; // +8% per room above 1
const BATHROOM_PREMIUM_FACTOR = 0.05; // +5% per bathroom

// Variance bands (± percentage of mid price)
const VARIANCE_LOW = 0.12; // -12%
const VARIANCE_HIGH = 0.15; // +15%

/**
 * Derive a location multiplier from the location string.
 * @param {string} location
 * @returns {number}
 */
const getLocationFactor = (location) => {
  const lower = (location || '').toLowerCase();
  for (const entry of LOCATION_MULTIPLIERS) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.factor;
    }
  }
  return DEFAULT_LOCATION_FACTOR;
};

/**
 * Determine property type enum value from flexible input strings.
 * @param {string} type
 * @returns {string}
 */
const normalizeType = (type) => {
  const map = {
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
    commercial: 'COMMERCIAL',
    office: 'COMMERCIAL',
    shop: 'COMMERCIAL',
  };
  const key = (type || '').toLowerCase().trim();
  return map[key] || key.toUpperCase();
};

/**
 * Estimate property price with a low / mid / high confidence range.
 *
 * @param {{
 *   location: string,
 *   size: number,       // square meters
 *   rooms: number,
 *   bathrooms: number,
 *   type: string        // APARTMENT | HOUSE | VILLA | LAND | COMMERCIAL (or lowercase)
 * }} params
 *
 * @returns {{
 *   estimatedPrice: { low: number, mid: number, high: number },
 *   confidence: 'low' | 'medium' | 'high',
 *   breakdown: {
 *     basePricePerSqm: number,
 *     locationFactor: number,
 *     roomPremium: number,
 *     bathroomPremium: number,
 *     effectiveSqmPrice: number
 *   }
 * }}
 */
const predictPrice = ({ location, size, rooms, bathrooms, type }) => {
  const normalizedType = normalizeType(type);
  const basePricePerSqm = BASE_PRICE_PER_SQM[normalizedType] || BASE_PRICE_PER_SQM.APARTMENT;

  const sqm = Math.max(Number(size) || 50, 10);
  const numRooms = Math.max(Number(rooms) || 1, 0);
  const numBathrooms = Math.max(Number(bathrooms) || 1, 0);

  const locationFactor = getLocationFactor(location);

  // Premiums applied to total base price
  const roomPremium = Math.max(0, numRooms - 1) * ROOM_PREMIUM_FACTOR;
  const bathroomPremium = Math.max(0, numBathrooms - 1) * BATHROOM_PREMIUM_FACTOR;
  const totalMultiplier = locationFactor * (1 + roomPremium + bathroomPremium);

  const effectiveSqmPrice = basePricePerSqm * totalMultiplier;
  const mid = Math.round(effectiveSqmPrice * sqm);
  const low = Math.round(mid * (1 - VARIANCE_LOW));
  const high = Math.round(mid * (1 + VARIANCE_HIGH));

  // Confidence is higher when we have a recognized type & location keyword
  const hasKnownType = Boolean(BASE_PRICE_PER_SQM[normalizedType]);
  const hasKnownLocation = locationFactor !== DEFAULT_LOCATION_FACTOR;
  let confidence = 'medium';
  if (hasKnownType && hasKnownLocation) confidence = 'high';
  else if (!hasKnownType && !hasKnownLocation) confidence = 'low';

  return {
    estimatedPrice: { low, mid, high },
    confidence,
    breakdown: {
      basePricePerSqm,
      locationFactor,
      roomPremium: Math.round(roomPremium * 100) / 100,
      bathroomPremium: Math.round(bathroomPremium * 100) / 100,
      effectiveSqmPrice: Math.round(effectiveSqmPrice),
    },
  };
};

module.exports = { predictPrice };
