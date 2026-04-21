const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const prisma = require('../../src/config/database');

describe('properties api', () => {
  test('GET /api/properties — returns list', async () => {
    prisma.property.findMany.mockResolvedValue([{ id: 'p1', title: 'Apt' }]);
    prisma.property.count.mockResolvedValue(1);

    const res = await request(app).get('/api/properties');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(1);
  });

  test('GET /api/properties/:id — returns single', async () => {
    prisma.property.findUnique.mockResolvedValue({ id: 'p1', title: 'Apt', views: 5 });
    prisma.property.update.mockResolvedValue({});

    const res = await request(app).get('/api/properties/p1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('p1');
  });

  test('POST /api/properties — requires auth', async () => {
    const res = await request(app).post('/api/properties').send({});
    expect(res.status).toBe(401);
  });

  test('PUT /api/properties/:id — requires ownership', async () => {
    jwt.verify.mockReturnValue({ userId: 'u2' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'u2',
      name: 'Other',
      email: 'other@example.com',
      role: 'USER',
      avatar: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prisma.property.findUnique.mockResolvedValue({ id: 'p1', userId: 'u1' });

    const res = await request(app)
      .patch('/api/properties/p1')
      .set('Authorization', 'Bearer token')
      .send({ title: 'Updated' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});