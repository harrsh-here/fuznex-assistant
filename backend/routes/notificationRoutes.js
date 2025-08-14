// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification,
} = require("../controllers/notificationController");

// GET all notifications for current user
router.get("/", auth, getNotifications);

// PUT mark as read
router.put("/:id/read", auth, markAsRead);

// DELETE notification
router.delete("/:id", auth, deleteNotification);

// POST create notification (optional/test use)
router.post("/", auth, createNotification);

module.exports = router;
