const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

// All routes are protected
router.post('/', auth, notificationController.createNotification);
router.get('/', auth, notificationController.getAllNotifications);
router.put('/:id', auth, notificationController.updateNotification);
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;
