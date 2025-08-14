const express = require('express');
const router = express.Router();
const userHistoryController = require('../controllers/userHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a user history record
router.post('/', authMiddleware, userHistoryController.createHistory);

// Retrieve all history for the authenticated user
router.get('/', authMiddleware, userHistoryController.getUserHistory);

// Delete a specific history entry
router.delete('/:id', authMiddleware, userHistoryController.deleteHistory);

// Bulk delete multiple history entries
router.delete('/bulk', authMiddleware, userHistoryController.deleteMultipleHistories);

module.exports = router;
