const express = require('express');
const router = express.Router();
const googleAuth = require('../controllers/googleAuthController');

router.get('/google', googleAuth.googleLogin);
router.get('/google/callback', googleAuth.googleCallback);

// Temporary test route
router.get('/ping', (req, res) => {
  res.send('Google auth route is working');
});

module.exports = router;
