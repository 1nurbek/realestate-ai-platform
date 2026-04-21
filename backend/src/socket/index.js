const { Server } = require('socket.io');
const prisma = require('../config/database');
const socketAuthMiddleware = require('./auth');

let io;

// userId -> socketId
const onlineUsers = new Map();

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Apply auth middleware to every incoming connection
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    const userId = socket.user.id;

    // Track online status
    onlineUsers.set(userId, socket.id);

    // Join personal room
    socket.join(`user:${userId}`);

    // Notify contacts this user just came online
    socket.broadcast.emit('user_online', { userId });

    // ----------------------------------------------------------------
    // send_message: { receiverId, content, propertyId? }
    // ----------------------------------------------------------------
    socket.on('send_message', async ({ receiverId, content, propertyId }) => {
      try {
        if (!receiverId || !content) return;

        const message = await prisma.message.create({
          data: {
            senderId: userId,
            receiverId,
            content,
            ...(propertyId ? { propertyId } : {}),
          },
          include: {
            sender: { select: { id: true, name: true, avatar: true } },
            receiver: { select: { id: true, name: true, avatar: true } },
            property: propertyId
              ? { select: { id: true, title: true } }
              : false,
          },
        });

        // Deliver to receiver's personal room
        io.to(`user:${receiverId}`).emit('new_message', message);

        // Also echo back to the sender (in case they have multiple tabs)
        socket.to(`user:${userId}`).emit('new_message', message);

        // Push a notification to the receiver
        io.to(`user:${receiverId}`).emit('notification', {
          type: 'new_message',
          message: `New message from ${socket.user.name}`,
          data: {
            messageId: message.id,
            senderId: userId,
            senderName: socket.user.name,
            senderAvatar: socket.user.avatar,
            content,
            propertyId: propertyId || null,
          },
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ----------------------------------------------------------------
    // typing: { receiverId }
    // ----------------------------------------------------------------
    socket.on('typing', ({ receiverId }) => {
      if (!receiverId) return;
      io.to(`user:${receiverId}`).emit('user_typing', { userId });
    });

    // ----------------------------------------------------------------
    // stop_typing: { receiverId }
    // ----------------------------------------------------------------
    socket.on('stop_typing', ({ receiverId }) => {
      if (!receiverId) return;
      io.to(`user:${receiverId}`).emit('user_stop_typing', { userId });
    });

    // ----------------------------------------------------------------
    // mark_read: { senderId }  — mark messages from senderId as read
    // ----------------------------------------------------------------
    socket.on('mark_read', async ({ senderId }) => {
      try {
        if (!senderId) return;

        await prisma.message.updateMany({
          where: {
            senderId,
            receiverId: userId,
            read: false,
          },
          data: { read: true },
        });

        // Notify the original sender that their messages were read
        io.to(`user:${senderId}`).emit('messages_read', { readBy: userId });
      } catch (err) {
        socket.emit('error', { message: 'Failed to mark messages as read' });
      }
    });

    // ----------------------------------------------------------------
    // join_conversation: { otherUserId } — track active conversation
    // ----------------------------------------------------------------
    socket.on('join_conversation', ({ otherUserId }) => {
      if (!otherUserId) return;
      const room = [userId, otherUserId].sort().join(':');
      socket.join(`conversation:${room}`);
    });

    // ----------------------------------------------------------------
    // disconnect
    // ----------------------------------------------------------------
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit('user_offline', { userId });
    });
  });

  return io;
}

function getSocket() {
  return io;
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = {
  getSocket,
  getOnlineUsers,
  initializeSocket,
};
