const router = require('express').Router();
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const {
  getMessagesRules,
  sendMessageRules,
  markAsReadRules,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} = require('../../controllers/messageController');

router.get('/conversations', auth, getConversations);
router.get('/', auth, getMessagesRules, validate, getMessages);
router.post('/', auth, sendMessageRules, validate, sendMessage);
router.patch('/read', auth, markAsReadRules, validate, markAsRead);

module.exports = router;