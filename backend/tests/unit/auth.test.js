const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../src/config/database');
const { register, login, getMe } = require('../../src/controllers/authController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('auth controller', () => {
  test('register: should create user and return token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
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

    const req = { body: { name: 'Jane', email: 'jane@example.com', password: 'Password123' } };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(prisma.user.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ token: 'jwt-token' }),
      }),
    );
  });

  test('register: should reject duplicate email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing' });
    const req = { body: { name: 'Jane', email: 'jane@example.com', password: 'Password123' } };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test('login: should return token for valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      name: 'Jane',
      email: 'jane@example.com',
      password: 'hashed-password',
      role: 'USER',
      avatar: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('jwt-token');

    const req = { body: { email: 'jane@example.com', password: 'Password123' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ token: 'jwt-token' }),
      }),
    );
  });

  test('login: should reject invalid password', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'jane@example.com',
      password: 'hashed-password',
    });
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { email: 'jane@example.com', password: 'wrong' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('getMe: should return user profile', async () => {
    const req = { user: { id: 'u1', email: 'jane@example.com', name: 'Jane' } };
    const res = mockRes();

    await getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: { user: req.user },
      }),
    );
  });
});