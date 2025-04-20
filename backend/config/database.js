require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Read the SSL CA certificate from the path specified in .env
// Using path.resolve ensures the path is correctly resolved from the project root or relative to this file.
const sslCaPath = process.env.DB_SSL_CA;
let sslCa;
try {
  sslCa = fs.readFileSync(path.resolve(sslCaPath)).toString();
} catch (error) {
  console.error("Error reading SSL certificate from", sslCaPath, error);
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // defaulting to 3306 if not specified
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        ca: sslCa,
      },
    },
  }
);

module.exports = sequelize;
