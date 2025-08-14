const TodoTask = require('../models/TodoTask');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Notification = require('../models/Notifications')(sequelize, DataTypes); // ✅ correct





// Create a new task
exports.createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      due_date,
      reminder,
      tags,
      recurrence,
      sort_order,
      is_archived,
      external_id
    } = req.body;
    
    const user_id = req.user.id; // Make sure req.user is set via authMiddleware

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const newTask = await TodoTask.create({
      user_id,
      title,
      description,
      priority: priority || 'low',
      due_date: due_date || null,
      reminder: reminder || null,
      is_completed: false,
      tags,
      recurrence: recurrence || 'none',
      sort_order,
      is_archived: is_archived || false,
      external_id: external_id || null
    });
// After task is successfully created
await Notification.create({
  user_id: req.user.id,
  task_id: newTask.task_id,
  title: "New Task Added",
  message: `Task "${newTask.title}" created with priority ${newTask.priority}`,
  reminder_time: newTask.due_date || null,
  is_important: newTask.priority === "high",
  status: "pending",
});

    res.status(201).json({ message: 'Task created successfully.', task: newTask });
  } catch (error) {
    console.error("Error in createTodo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all tasks for the authenticated user
exports.getTodos = async (req, res) => {
  try {
    const tasks = await TodoTask.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTodos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific task by ID
exports.getTodoById = async (req, res) => {
  try {
    const task = await TodoTask.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTodoById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a task by ID
exports.updateTodo = async (req, res) => {
  try {
    const task = await TodoTask.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await task.update(req.body);
    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    console.error("Error in updateTodo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a task by ID
exports.deleteTodo = async (req, res) => {
  try {
    const task = await TodoTask.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteTodo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
