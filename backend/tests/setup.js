// Jest hoists jest.mock() calls above variable declarations, so the factory
// must create its own internal state. We expose the mock via the mocked
// module path so tests can import and manipulate it.
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    property: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    favorite: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    searchHistory: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrisma), __mockPrisma: mockPrisma };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
