const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, chatController.createMessage);
router.get('/threads', authMiddleware, chatController.getThreads);
router.get('/thread/:thread_id', authMiddleware, chatController.getMessagesByThread);
router.delete('/thread/:thread_id', authMiddleware, chatController.deleteThread);
router.post('/threads', authMiddleware, chatController.createThread);
router.post('/message', authMiddleware, chatController.sendMessage);

module.exports = router;
