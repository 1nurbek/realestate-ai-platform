const prisma = require('../config/database');
const { verifyToken } = require('../utils/tokenUtils');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};

module.exports = auth;