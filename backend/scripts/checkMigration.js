const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

async function checkMigration() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connection OK');

    // Check required tables
    const [tables] = await sequelize.query("SHOW TABLES;");
    const tableNames = tables.map(t => Object.values(t)[0]);
    const requiredTables = [
      'user_details', 'todo_tasks', 'alarms',
      'user_history', 'subtasks', 'notifications',
      'user_device', 'user_preferences'
    ];

    requiredTables.forEach(tbl => {
      if (!tableNames.includes(tbl)) {
        throw new Error(`❌ Missing table: ${tbl}`);
      }
    });
    console.log('✅ All required tables exist');

    // Basic column check (no OAuth yet)
    const [columns] = await sequelize.query("DESCRIBE user_details;");
    const columnMap = columns.map(col => col.Field);
    const baseColumns = ['user_id', 'name', 'email', 'phone_number', 'created_at', 'password', 'role'];

    baseColumns.forEach(col => {
      if (!columnMap.includes(col)) {
        throw new Error(`❌ Missing column in user_details: ${col}`);
      }
    });

    console.log('✅ user_details has required base columns');

    const [users] = await sequelize.query("SELECT email, role FROM user_details LIMIT 5;");
    console.log('🧪 Sample users:', users);

    console.log('🎉 Migration/basic DB check passed!');
    process.exit(0);
  } catch (err) {
    console.error('Migration check failed:', err.message);
    process.exit(1);
  }
}

checkMigration();
