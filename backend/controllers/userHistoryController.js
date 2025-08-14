const UserHistory = require('../models/UserHistory');

// Create a new user history record
exports.createHistory = async (req, res) => {
  try {
    const { assistant_name, interaction, type } = req.body;
    const user_id = req.user.id;

    if (!assistant_name || !interaction || !type) {
      return res.status(400).json({
        error: 'assistant_name, interaction, and type are required.'
      });
    }

    const newHistory = await UserHistory.create({
      user_id,
      assistant_name,
      interaction,
      type,
    });

    res.status(201).json({
      message: 'User history recorded successfully.',
      history: newHistory,
    });
  } catch (error) {
    console.error("Error in createHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all history records for the authenticated user
exports.getUserHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      type,               // Optional: "chat", "todo", "alarm", "system"
      assistant_name,     // Optional: "F.R.I.D.A.Y.", etc.
      page = 1,
      pageSize = 20,
    } = req.query;

    const where = { user_id };

    if (type) where.type = type;
    if (assistant_name) where.assistant_name = assistant_name;

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const histories = await UserHistory.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit,
      offset,
    });

    const mapped = histories.map((entry) => ({
      id: entry.history_id,
      text: entry.interaction,
      type: entry.type,
      timestamp: entry.timestamp,
      assistant_name: entry.assistant_name,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error in getUserHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a specific history entry (only if owned by user)
exports.deleteHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    const history_id = req.params.id;

    const history = await UserHistory.findOne({
      where: { history_id, user_id },
    });

    if (!history) {
      return res.status(404).json({
        error: "History entry not found or not owned by user.",
      });
    }

    await history.destroy();
    res.status(200).json({ message: "History entry deleted." });
  } catch (error) {
    console.error("Error in deleteHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete multiple history entries (bulk)
exports.deleteMultipleHistories = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided for deletion." });
    }

    const deleted = await UserHistory.destroy({
      where: {
        history_id: ids,
        user_id, // Ensure only user's own entries are deleted
      },
    });

    res.status(200).json({
      message: `${deleted} history record(s) deleted.`,
    });
  } catch (error) {
    console.error("Error in deleteMultipleHistories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
