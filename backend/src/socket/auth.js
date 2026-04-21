const prisma = require('../config/database');
const { verifyToken } = require('../utils/tokenUtils');

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

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
      },
    });

    if (!user) {
      return next(new Error('Invalid authentication token'));
    }

    socket.user = user;
    return next();
  } catch (_error) {
    return next(new Error('Invalid or expired authentication token'));
  }
};

module.exports = socketAuthMiddleware;
