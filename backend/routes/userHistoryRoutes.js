const express = require('express');
const router = express.Router();
const userHistoryController = require('../controllers/userHistoryController');
const verifyUser = require('../middleware/authMiddleware');

// Create a user history record
router.post('/', verifyUser, userHistoryController.createHistory);

// Retrieve all history for the authenticated user
router.get('/', verifyUser, userHistoryController.getUserHistory);

module.exports = router;
