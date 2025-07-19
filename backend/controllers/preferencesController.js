// backend/controllers/preferencesController.js
const { Preference } = require("../models/UserPreferences");

exports.getPreferences = async (req, res) => {
  const userId = req.user.id;
  try {
    const prefs = await Preference.findAll({ where: { user_id: userId } });

    const formatted = {};
    prefs.forEach(pref => {
      formatted[pref.preference_key] = pref.preference_value;
    });

    res.json(formatted);
  } catch (err) {
    console.error("Get Preferences Error:", err);
    res.status(500).json({ error: "Failed to get preferences" });
  }
};

exports.setPreferences = async (req, res) => {
  const userId = req.user.id;
  const newPrefs = req.body; // { default_assistant: "gpt", voice_option: "male" }

  try {
    for (const [key, value] of Object.entries(newPrefs)) {
      const [pref, created] = await Preference.findOrCreate({
        where: { user_id: userId, preference_key: key },
        defaults: { preference_value: value },
      });

      if (!created) {
        await pref.update({ preference_value: value });
      }
    }

    res.json({ message: "Preferences updated" });
  } catch (err) {
    console.error("Set Preferences Error:", err);
    res.status(500).json({ error: "Failed to save preferences" });
  }
};
