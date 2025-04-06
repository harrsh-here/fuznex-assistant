const UserHistory = require('../models/UserHistory');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new user history record
exports.createHistory = async (req, res) => {
   
   try {
    // Destructure the assistant_name and interaction from the request body.
    // The user_id will be taken from the auth middleware (req.user).
    const { assistant_name, interaction } = req.body;
   const user_id = req.user.id;

    if (!assistant_name || !interaction) {
      return res.status(400).json({ error: 'assistant_name and interaction are required.' });
    }

    const newHistory = await UserHistory.create({
      user_id,
      assistant_name,
      interaction
      // timestamp will default to DataTypes.NOW as defined
    });

    res.status(201).json({ message: 'User history recorded successfully.', history: newHistory });
  } catch (error) {
    console.error("Error in createHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all history records for the authenticated user
exports.getUserHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    const histories = await UserHistory.findAll({ where: { user_id } });
    res.status(200).json(histories);
  } catch (error) {
    console.error("Error in getUserHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
