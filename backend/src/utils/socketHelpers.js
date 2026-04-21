const { getSocket, getOnlineUsers } = require('../socket');

/**
 * Return an array of all currently online user IDs.
 * @returns {string[]}
 */
function getOnlineUserIds() {
  return Array.from(getOnlineUsers().keys());
}

/**
 * Check whether a specific user is currently connected.
 * @param {string} userId
 * @returns {boolean}
 */
function isUserOnline(userId) {
  return getOnlineUsers().has(userId);
}

/**
 * Emit an event to a specific user's personal room.
 * Works even if the user has multiple open tabs/sockets.
 * @param {string} userId
 * @param {string} event
 * @param {*} data
 */
function emitToUser(userId, event, data) {
  const io = getSocket();
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
}

module.exports = {
  getOnlineUserIds,
  isUserOnline,
  emitToUser,
};
