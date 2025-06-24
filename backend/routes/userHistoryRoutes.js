const express = require('express');
const router = express.Router();
const userHistoryController = require('../controllers/userHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a user history record
router.post('/', authMiddleware, userHistoryController.createHistory);

// Retrieve all history for the authenticated user
router.get('/', authMiddleware, userHistoryController.getUserHistory);

module.exports = router;
