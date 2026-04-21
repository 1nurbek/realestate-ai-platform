const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const prisma = require('../../src/config/database');

describe('auth api', () => {
  test('POST /api/auth/register — success', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'u1',
      name: 'Jane',
      email: 'jane@example.com',
      role: 'USER',
      avatar: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    jwt.sign.mockReturnValue('jwt-token');

    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane',
      email: 'jane@example.com',
      password: 'Password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/register — validation error', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'bad-email',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login — success', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      name: 'Jane',
      email: 'jane@example.com',
      password: 'hashed',
      role: 'USER',
      avatar: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const bcrypt = require('bcryptjs');
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('jwt-token');

    const res = await request(app).post('/api/auth/login').send({
      email: 'jane@example.com',
      password: 'Password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/login — invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      email: 'jane@example.com',
      password: 'bad',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me — with token', async () => {
    jwt.verify.mockReturnValue({ userId: 'u1' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      name: 'Jane',
      email: 'jane@example.com',
      role: 'USER',
      avatar: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/auth/me — without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});