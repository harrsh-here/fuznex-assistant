const Subtask = require('../models/Subtask');
const TodoTask = require('../models/TodoTask');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Notification = require('../models/Notifications')(sequelize, DataTypes); // ✅ correct


// Create subtask only if the task belongs to the user
exports.createSubtask = async (req, res) => {
  try {
    const { task_id, title } = req.body;
    const userId = req.user.id;

    const task = await TodoTask.findOne({ where: { task_id, user_id: userId } });
    if (!task) return res.status(403).json({ error: 'Access denied. Task does not belong to you.' });

    const subtask = await Subtask.create({ task_id, title });
await Notification.create({
  user_id: req.user.id,
  subtask_id: newSubtask.subtask_id,
  title: "Subtask Added",
  message: `Subtask for "${parentTask.title}" has been created.`,
  is_important: false,
});
   
    res.status(201).json({ message: 'Subtask created', subtask });
  } catch (err) {
    console.error('createSubtask error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get subtasks only for tasks owned by the user
exports.getSubtasksByTaskId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const task = await TodoTask.findOne({ where: { task_id: taskId, user_id: userId } });
    if (!task) return res.status(403).json({ error: 'Access denied.' });

    const subtasks = await Subtask.findAll({ where: { task_id: taskId } });
    res.json(subtasks);
  } catch (err) {
    console.error('getSubtasksByTaskId error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update subtask if owned
exports.updateSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subtask = await Subtask.findByPk(id);
    if (!subtask) return res.status(404).json({ error: 'Subtask not found' });

    const task = await TodoTask.findOne({ where: { task_id: subtask.task_id, user_id: userId } });
    if (!task) return res.status(403).json({ error: 'Access denied.' });

    await subtask.update(req.body);
    res.json({ message: 'Subtask updated', subtask });
  } catch (err) {
    console.error('updateSubtask error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete subtask if owned
exports.deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subtask = await Subtask.findByPk(id);
    if (!subtask) return res.status(404).json({ error: 'Subtask not found' });

    const task = await TodoTask.findOne({ where: { task_id: subtask.task_id, user_id: userId } });
    if (!task) return res.status(403).json({ error: 'Access denied.' });

    await subtask.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('deleteSubtask error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
