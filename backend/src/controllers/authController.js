const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

const forgotPasswordRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const resetPasswordRules = [
  body('token').trim().notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const frontendUrl = process.env.FRONTEND_URL || 'https://realestate-ai-platform-five.vercel.app';

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Always respond success to avoid email enumeration; only generate token if user exists
    if (!user) {
      return sendSuccess(
        res,
        { message: 'If an account exists for this email, a reset link has been generated.' },
        'Password reset requested',
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    return sendSuccess(
      res,
      {
        message: 'Password reset link generated.',
        resetUrl,
        note: 'Email service not configured yet; use this link to reset.',
      },
      'Password reset requested',
    );
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return sendError(res, 'Invalid or expired reset token', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return sendSuccess(res, null, 'Password reset successful');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};