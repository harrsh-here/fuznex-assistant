const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alarm = sequelize.define('alarms', {
  alarm_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Set according to your DB; adjust if needed.
  },
  alarm_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  repeat_pattern: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'once',
  },
}, {
  tableName: 'alarms',
  timestamps: false,
});

module.exports = Alarm;
