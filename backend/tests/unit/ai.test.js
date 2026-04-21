const { parseQuery } = require('../../src/services/smartSearchService');
const { predictPrice } = require('../../src/services/pricePredictionService');
const prisma = require('../../src/config/database');
const { getRecommendations } = require('../../src/services/recommendationService');

describe('ai services', () => {
  test("smartSearch: should parse 'cheap apartment near downtown' correctly", () => {
    const result = parseQuery('cheap apartment near downtown');
    expect(result.parsed.type).toBe('APARTMENT');
    expect(result.parsed.maxPrice).toBe(150000);
    expect(result.parsed.location).toBe('downtown');
    expect(result.where).toEqual(
      expect.objectContaining({
        status: 'ACTIVE',
        type: 'APARTMENT',
      }),
    );
  });

  test("smartSearch: should parse '3 bedroom house under 500k'", () => {
    const result = parseQuery('3 bedroom house under 500k');
    expect(result.parsed.type).toBe('HOUSE');
    expect(result.parsed.rooms).toBe(3);
    expect(result.parsed.maxPrice).toBe(500000);
    expect(result.where.rooms).toEqual({ gte: 3 });
    expect(result.where.price).toEqual({ lte: 500000 });
  });

  test('pricePrediction: should return low/mid/high estimates', () => {
    const result = predictPrice({
      location: 'downtown',
      size: 100,
      rooms: 3,
      bathrooms: 2,
      type: 'apartment',
    });
    expect(result.estimatedPrice).toEqual(
      expect.objectContaining({
        low: expect.any(Number),
        mid: expect.any(Number),
        high: expect.any(Number),
      }),
    );
    expect(result.estimatedPrice.low).toBeLessThan(result.estimatedPrice.mid);
    expect(result.estimatedPrice.high).toBeGreaterThan(result.estimatedPrice.mid);
  });

  test('recommendations: should handle cold start (no history)', async () => {
    prisma.searchHistory.findMany.mockResolvedValue([]);
    prisma.favorite.findMany.mockResolvedValue([]);
    prisma.property.findMany.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);

    const result = await getRecommendations('u1');
    expect(result.source).toBe('popular');
    expect(result.recommendations).toHaveLength(2);
    expect(prisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'ACTIVE' },
      }),
    );
  });
});