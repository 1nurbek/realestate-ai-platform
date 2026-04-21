const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { generateToken } = require('../utils/tokenUtils');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return sendError(res, 'Email is already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    return sendSuccess(res, { token, user: sanitizeUser(user) }, 'Registration successful', 201);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user.id);
    return sendSuccess(res, { token, user: sanitizeUser(user) }, 'Login successful');
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res) => sendSuccess(res, { user: req.user }, 'Current user fetched');

module.exports = {
  registerRules,
  loginRules,
  register,
  login,
  getMe,
};