require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes');
const alarmsRoutes = require('./routes/alarms');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/alarms', alarmsRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('FuzNex Assistant Backend is Running!');
});

// Test DB & Sync
sequelize.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Database connection failed:', err));

sequelize.sync()
  .then(() => {
    console.log('Database synchronized!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Database sync failed:', err));
