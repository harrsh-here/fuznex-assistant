const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserHistory = sequelize.define('UserHistory', {
  history_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assistant_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  interaction: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_history',
  timestamps: false // We use a custom "timestamp" field rather than Sequelize's createdAt/updatedAt.
});

module.exports = UserHistory;
