// src/utils/logHistory.js
import api from "../api/api";

/**
 * Log an interaction to history (chat, todo, alarm, etc.)
 * @param {string} interaction - Summary text to log (e.g., "Task created: Buy Milk")
 * @param {string} type - One of: "chat", "todo", "alarm", "system"
 */
export async function logHistory({ interaction, type }) {
  try {
    await api.post("/history", {
      assistant_name: "F.R.I.D.A.Y.",
      interaction,
      type,
    });
  } catch (err) {
    console.error("Failed to log history:", err);
  }
}
