// backend/routes/preferencesRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const preferencesController = require("../controllers/preferencesController");

router.get("/", authMiddleware, preferencesController.getPreferences);
router.post("/", authMiddleware, preferencesController.setPreferences);

module.exports = router;
