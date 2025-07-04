// models/Notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subtask_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    alarm_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reminder_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "sent", "failed", "read", "snoozed"),
      defaultValue: "pending",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_important: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  }, {
    tableName: "notifications",
    timestamps: false,
  });

  return Notification;
};
