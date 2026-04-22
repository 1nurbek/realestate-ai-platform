const { body, query } = require('express-validator');
const prisma = require('../config/database');
const { sendSuccess } = require('../utils/apiResponse');

const getMessagesRules = [
  query('withUserId').trim().notEmpty().withMessage('withUserId is required'),
  query('propertyId').optional().trim().notEmpty().withMessage('propertyId cannot be empty'),
];

const sendMessageRules = [
  body('receiverId').trim().notEmpty().withMessage('receiverId is required'),
  body('propertyId').trim().notEmpty().withMessage('propertyId is required'),
  body('content').trim().notEmpty().withMessage('content is required'),
];

const markAsReadRules = [
  body('withUserId').trim().notEmpty().withMessage('withUserId is required'),
  body('propertyId').optional().trim().notEmpty().withMessage('propertyId cannot be empty'),
];

const getConversations = async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
        property: { select: { id: true, title: true, images: true } },
      },
    });

    const map = new Map();
    messages.forEach((msg) => {
      const otherUserId = msg.senderId === req.user.id ? msg.receiverId : msg.senderId;
      const key = `${otherUserId}:${msg.propertyId}`;
      if (!map.has(key)) {
        map.set(key, {
          otherUser: msg.senderId === req.user.id ? msg.receiver : msg.sender,
          property: msg.property,
          lastMessage: {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            read: msg.read,
            createdAt: msg.createdAt,
          },
        });
      }
    });

    return sendSuccess(res, Array.from(map.values()), 'Conversations fetched');
  } catch (error) {
    return next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { withUserId, propertyId } = req.query;
    const where = {
      OR: [
        { senderId: req.user.id, receiverId: withUserId },
        { senderId: withUserId, receiverId: req.user.id },
      ],
    };
    if (propertyId) where.propertyId = propertyId;

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });
    return sendSuccess(res, messages, 'Messages fetched');
  } catch (error) {
    return next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, propertyId, content } = req.body;
    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        propertyId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
        property: { select: { id: true, title: true } },
      },
    });
    return sendSuccess(res, message, 'Message sent', 201);
  } catch (error) {
    return next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { withUserId, propertyId } = req.body;
    const where = {
      senderId: withUserId,
      receiverId: req.user.id,
      read: false,
    };
    if (propertyId) where.propertyId = propertyId;

    const updated = await prisma.message.updateMany({
      where,
      data: { read: true },
    });
    return sendSuccess(res, { updated: updated.count }, 'Messages marked as read');
  } catch (error) {
    return next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await prisma.message.count({
      where: { receiverId: req.user.id, read: false },
    });
    return sendSuccess(res, { count }, 'Unread count fetched');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMessagesRules,
  sendMessageRules,
  markAsReadRules,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
};