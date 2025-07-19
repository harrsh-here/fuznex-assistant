// backend/models/Preference.js
module.exports = (sequelize, DataTypes) => {
  const Preference = sequelize.define("Preference", {
    preference_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    preference_key: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    preference_value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "user_preferences",
    timestamps: false,
  });

  Preference.associate = (models) => {
    Preference.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Preference;
};
