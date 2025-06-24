const Notification = require('../models/Notifications');
const TodoTask = require('../models/TodoTask');

// Create a new notification (Only for user's task)
exports.createNotification = async (req, res) => {
  try {
    const { task_id, reminder_time } = req.body;
    const userId = req.user.id;

    const task = await TodoTask.findOne({ where: { task_id, user_id: userId } });
    if (!task) return res.status(403).json({ error: 'Access denied. Task does not belong to you.' });

    const notification = await Notification.create({ task_id, reminder_time });
    res.status(201).json({ message: 'Notification created', notification });
  } catch (err) {
    console.error('createNotification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all your notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await TodoTask.findAll({ where: { user_id: userId }, attributes: ['task_id'] });
    const taskIds = tasks.map(t => t.task_id);

    const notifications = await Notification.findAll({ where: { task_id: taskIds } });
    res.json(notifications);
  } catch (err) {
    console.error('getAllNotifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update notification (only if the task belongs to user)
exports.updateNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    const task = await TodoTask.findOne({ where: { task_id: notification.task_id, user_id: userId } });
    if (!task) return res.status(403).json({ error: 'Access denied.' });

    await notification.update(req.body);
    res.json({ message: 'Notification updated', notification });
  } catch (err) {
    console.error('updateNotification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete notification (only if task belongs to user)
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    const task = await TodoTask.findOne({ where: { task_id: notification.task_id, user_id: userId } });
    if (!task) return res.status(403).json({ error: 'Access denied.' });

    await notification.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('deleteNotification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
