const express = require('express');
const router = express.Router();
const googleAuthController = require('../controllers/googleAuthController');

// Start OAuth with Google
router.get('/google', googleAuthController.googleLogin);

// Callback from Google
router.get('/google/callback', googleAuthController.googleCallback);

module.exports = router;
