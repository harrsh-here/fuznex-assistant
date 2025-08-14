'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_details', 'provider', {
      type: Sequelize.ENUM('local', 'google', 'microsoft'),
      allowNull: false,
      defaultValue: 'local'
    });
    await queryInterface.addColumn('user_details', 'provider_id', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    });
    await queryInterface.addColumn('user_details', 'oauth_access_token', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('user_details', 'oauth_refresh_token', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_details', 'provider');
    await queryInterface.removeColumn('user_details', 'provider_id');
    await queryInterface.removeColumn('user_details', 'oauth_access_token');
    await queryInterface.removeColumn('user_details', 'oauth_refresh_token');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_details_provider";');
  }
};
