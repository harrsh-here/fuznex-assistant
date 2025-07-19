// ===== Fixed Routes: routes/chatRoutes.js =====
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Middleware to simulate authentication (for demo purposes)
const authMiddleware = (req, res, next) => {
  // In a real app, you'd verify JWT token here
  // For demo, we'll just add a default user
  req.user = { id: 1, username: "demo_user" };
  next();
};

// Apply auth middleware to all routes
router.use(authMiddleware);

// Chat message routes - matching frontend API expectations
router.post("/message", chatController.sendMessage);          // POST /api/chat/message
router.post("/threads", chatController.createThread);         // POST /api/chat/threads
router.get("/threads", chatController.listThreads);           // GET /api/chat/threads
router.get("/thread/:threadId", chatController.getChatThread); // GET /api/chat/thread/:threadId
router.delete("/thread/:threadId", chatController.deleteChatThread); // DELETE /api/chat/thread/:threadId
router.patch("/feedback/:chatId", chatController.giveChatFeedback); // PATCH /api/chat/feedback/:chatId

module.exports = router;