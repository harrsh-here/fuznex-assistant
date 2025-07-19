const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user_details', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true, // optional for Google login
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // nullable for Google login
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  provider: {
    type: DataTypes.ENUM('local', 'google', 'microsoft'),
    allowNull: false,
    defaultValue: 'local',
  },
  provider_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  oauth_access_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  oauth_refresh_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  /*resetToken: {
  type: DataTypes.STRING,
  allowNull: true,
},
resetTokenExpires: {
  type: DataTypes.DATE,
  allowNull: true,
}
*/
}, {
  tableName: 'user_details',
  timestamps: false,
});

module.exports = User;
