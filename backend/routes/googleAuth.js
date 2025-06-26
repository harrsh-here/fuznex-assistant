// routes/googleAuth.js
const express = require('express');
const router = express.Router();
const googleAuth = require('../controllers/googleAuthController');

router.get('/google', googleAuth.googleLogin);
router.get('/google/callback', googleAuth.googleCallback);

module.exports = router;
