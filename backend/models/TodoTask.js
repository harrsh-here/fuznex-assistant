const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TodoTask = sequelize.define('todo_tasks', {
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low',
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reminder: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  // New fields:
  recurrence: {
    type: DataTypes.ENUM('none', 'daily', 'weekly', 'monthly'),
    defaultValue: 'none',
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  external_id: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'todo_tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TodoTask;
