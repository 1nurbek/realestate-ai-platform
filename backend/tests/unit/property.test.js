const prisma = require('../../src/config/database');
const propertyController = require('../../src/controllers/propertyController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('property controller', () => {
  test('getAll: should return paginated properties', async () => {
    prisma.property.findMany.mockResolvedValue([{ id: 'p1', title: 'Home' }]);
    prisma.property.count.mockResolvedValue(1);
    const req = { query: { page: '1', limit: '12' } };
    const res = mockRes();
    const next = jest.fn();

    await propertyController.getAll(req, res, next);

    expect(prisma.property.findMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          items: [{ id: 'p1', title: 'Home' }],
          pagination: expect.objectContaining({ total: 1 }),
        }),
      }),
    );
  });

  test('getById: should return property and increment views', async () => {
    prisma.property.findUnique.mockResolvedValue({ id: 'p1', title: 'Home', views: 10 });
    prisma.property.update.mockResolvedValue({});
    const req = { params: { id: 'p1' } };
    const res = mockRes();
    const next = jest.fn();

    await propertyController.getById(req, res, next);

    expect(prisma.property.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { views: { increment: 1 } },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('create: should create property for authenticated user', async () => {
    prisma.category.findUnique.mockResolvedValue({ id: 'c1' });
    prisma.property.create.mockResolvedValue({ id: 'p1', title: 'New Property', userId: 'u1' });
    const req = {
      user: { id: 'u1', role: 'USER' },
      body: {
        title: 'New Property',
        description: 'Nice',
        price: 100000,
        location: 'Downtown',
        address: 'Street 1',
        size: 120,
        rooms: 3,
        bathrooms: 2,
        type: 'APARTMENT',
        images: ['img.jpg'],
        features: ['pool'],
        categoryId: 'c1',
      },
    };
    const res = mockRes();
    const next = jest.fn();

    await propertyController.create(req, res, next);

    expect(prisma.property.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('update: should only allow owner or admin', async () => {
    prisma.property.findUnique.mockResolvedValue({ id: 'p1', userId: 'owner' });
    const req = { params: { id: 'p1' }, user: { id: 'other', role: 'USER' }, body: { title: 'Updated' } };
    const res = mockRes();
    const next = jest.fn();

    await propertyController.update(req, res, next);

    expect(prisma.property.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('delete: should only allow owner or admin', async () => {
    prisma.property.findUnique.mockResolvedValue({ id: 'p1', userId: 'owner' });
    const req = { params: { id: 'p1' }, user: { id: 'other', role: 'USER' } };
    const res = mockRes();
    const next = jest.fn();

    await propertyController.delete(req, res, next);

    expect(prisma.property.delete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});