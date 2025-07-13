const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('chat_data', {
  chat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assistant_model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thread_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thread_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sender: {
    type: DataTypes.ENUM('user', 'ai'),
    allowNull: false,
  },
  encrypted_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_encrypted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_partial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  feedback: {
    type: DataTypes.ENUM('up', 'down'),
    allowNull: true,
  }
}, {
  tableName: 'chat_data',
  timestamps: false,
});

module.exports = Chat;
