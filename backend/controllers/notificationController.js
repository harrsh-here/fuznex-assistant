// controllers/notificationController.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Notification = require('../models/Notifications')(sequelize, DataTypes); // ✅ correct


// GET /notifications - Fetch all notifications for current user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [["reminder_time", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// PUT /notifications/:id/read - Mark one notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { notification_id: id, user_id: userId },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.is_read = true;
    notification.status = "read";
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking as read:", err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

// DELETE /notifications/:id - Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await Notification.destroy({
      where: { notification_id: id, user_id: userId },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// POST /notifications - Create a new notification (optional admin/testing use)
exports.createNotification = async (req, res) => {
  try {
    const {
      task_id,
      subtask_id,
      alarm_id,
      device_id,
      title,
      message,
      reminder_time,
      is_important,
    } = req.body;

    const newNotification = await Notification.create({
      user_id: req.user.id,
      task_id,
      subtask_id,
      alarm_id,
      device_id,
      title,
      message,
      reminder_time,
      is_important: is_important || false,
      status: "pending",
    });

    res.status(201).json(newNotification);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
};
