const Alarm = require("../models/Alarm");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Notification = require("../models/Notifications")(sequelize, DataTypes);
const UserHistory = require('../models/UserHistory');
// Convert "06:30 AM" -> "06:30", "07:15 PM" -> "19:15"
function convertTo24Hour(timeStr12) {
  try {
    const [rawTime, meridian] = timeStr12.trim().split(/\s+/);
    let [hour, minute] = rawTime.split(":").map(Number);

    if (meridian?.toUpperCase() === "PM" && hour < 12) hour += 12;
    if (meridian?.toUpperCase() === "AM" && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  } catch (e) {
    return null;
  }
}

// Join date and time -> "2025-07-06" + "06:30" => "2025-07-06 06:30:00"
function buildDatetime(dateStr, timeStr) {
  return `${dateStr} ${timeStr}:00`;
}

// =========================
// ✅ Create Alarm
// =========================
exports.createAlarm = async (req, res) => {
  try {
    const { alarm_time, alarm_date, time_format, label, repeat_pattern, is_active } = req.body;
    const user_id = req.user.id;

    if (!alarm_time || !alarm_date || !time_format) {
      return res.status(400).json({ error: "Missing alarm_time, alarm_date, or time_format" });
    }

    let time24 = alarm_time;
    if (time_format === "12") {
      time24 = convertTo24Hour(alarm_time);
      if (!time24) return res.status(400).json({ error: "Invalid 12h time format" });
    }

    const finalDatetime = buildDatetime(alarm_date, time24);

    const newAlarm = await Alarm.create({
      user_id,
      alarm_time: finalDatetime,
      label: label || `Alarm at ${alarm_time}`,
      repeat_pattern: repeat_pattern || "once",
      is_active: typeof is_active === "boolean" ? is_active : true,
    });
    
    await Notification.create({
  user_id,
  alarm_id: newAlarm.alarm_id,
  title: `Alarm: ${label || `at ${alarm_time}`}`,
  message: `Scheduled for ${finalDatetime}`,
  reminder_time: new Date(finalDatetime), // ensure it's a valid Date object
  is_important: true,                     // or false, based on your logic
  status: "pending",                      // will be picked up by cron/worker
});


    res.status(201).json({ message: "Alarm created", alarm: newAlarm });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
// Get All Alarms
// =========================
exports.getAlarms = async (req, res) => {
  try {
    const alarms = await Alarm.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(alarms);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// =========================
// Toggle Alarm
// =========================
exports.toggleAlarmActive = async (req, res) => {
  try {
    const alarm = await Alarm.findByPk(req.params.id);
    if (!alarm) return res.status(404).json({ error: "Alarm not found" });
    if (alarm.user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    alarm.is_active = !alarm.is_active;
    await alarm.save();

    res.json({ message: "Toggled", alarm });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
// Get Alarm by ID
// =========================
exports.getAlarmById = async (req, res) => {
  try {
    const alarm = await Alarm.findByPk(req.params.id);
    if (!alarm) return res.status(404).json({ error: "Alarm not found" });
    if (alarm.user_id !== req.user.id) return res.status(403).json({ error: "Access denied" });

    res.status(200).json(alarm);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// =========================
// Update Alarm
// =========================
exports.updateAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findByPk(req.params.id);
    if (!alarm) return res.status(404).json({ error: "Alarm not found" });
    if (alarm.user_id !== req.user.id) return res.status(403).json({ error: "Access denied" });

    const { alarm_time, alarm_date, time_format } = req.body;

    if (alarm_time && alarm_date && time_format) {
      let time24 = alarm_time;
      if (time_format === "12") {
        time24 = convertTo24Hour(alarm_time);
        if (!time24) return res.status(400).json({ error: "Invalid 12h time format" });
      }
      req.body.alarm_time = buildDatetime(alarm_date, time24);
    }

    await alarm.update(req.body);
    res.status(200).json({ message: "Alarm updated", alarm });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
// Delete Alarm
// =========================
exports.deleteAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findByPk(req.params.id);
    if (!alarm) return res.status(404).json({ error: "Alarm not found" });
    if (alarm.user_id !== req.user.id) return res.status(403).json({ error: "Access denied" });

    await alarm.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};
