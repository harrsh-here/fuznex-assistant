// ===== Fixed Sequelize Model: models/ChatData.js =====
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatData = sequelize.define("chat_data", {
  
  chat_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,

  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // For demo purposes, using default user ID
  },
  assistant_model: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  thread_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  thread_title: {
    type: DataTypes.STRING(200),
  },
  sender: {
    type: DataTypes.ENUM("user", "ai"),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  encrypted_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_encrypted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Changed to false for simplicity
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
    type: DataTypes.ENUM("up", "down"),
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: "chat_data"
});

module.exports = ChatData;