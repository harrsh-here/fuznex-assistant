const moment = require('moment');
const Alarm = require('../models/Alarm');
const { Notification } = require("../models/Notifications");


/**
 * Helper function to calculate the final alarm datetime.
 * 
 * @param {string} timeStr      The time part (e.g., "6:00", "6:00 AM", "18:00").
 * @param {string} [dateStr]    Optional; a date in "YYYY-MM-DD" format.
 * @param {string} [timeFormat] Optional; "12" for 12-hour format or "24" for 24-hour.
 *
 * Returns a moment instance for the correct datetime or null if parsing fails.
 */
function calculateAlarmDatetime(timeStr, dateStr, timeFormat) {
  let finalDateTime;
  let formats = [];

  // If the user/assistant has specified a 12-hour format...
  if (timeFormat === "12") {
    // Accept typical 12-hour formats.
    formats = ["h:mm A", "hh:mm A", "h A", "hh A"];
    // If the input does not include an AM/PM indicator, default to AM.
    if (!/(AM|PM|am|pm)/.test(timeStr)) {
      timeStr = timeStr.trim() + " AM";
    }
  } else if (timeFormat === "24") {
    // Accept typical 24-hour formats.
    formats = ["H:mm", "HH:mm", "H"];
  } else {
    // No explicit format specified; try a combination of both.
    formats = ["h:mm A", "hh:mm A", "H:mm", "HH:mm", "h A", "H"];
  }

  if (dateStr) {
    // When date is provided, combine it with the time.
    const combinedFormats = formats.map(fmt => `YYYY-MM-DD ${fmt}`);
    finalDateTime = moment(`${dateStr} ${timeStr}`, combinedFormats, true);
    if (!finalDateTime.isValid()) {
      return null;
    }
    finalDateTime.set({ second: 0, millisecond: 0 });
  } else {
    // Only a time is provided; try parsing the time alone.
    let candidate = moment(timeStr, formats, true);
    if (!candidate.isValid()) {
      return null;
    }
    candidate.set({ second: 0, millisecond: 0 });
    // Build a datetime for today using candidate hour/minute.
    finalDateTime = moment().set({
      hour: candidate.hour(),
      minute: candidate.minute(),
      second: 0,
      millisecond: 0
    });
    // If the finalized time is in the past, then schedule it for the next day.
    if (finalDateTime.isBefore(moment())) {
      finalDateTime.add(1, 'day');
    }
  }
  
  return finalDateTime;
}

/**
 * Create a new alarm.
 *
 * Expected JSON request body:
 * {
 *   "alarm_time": "6:00",              // required; can accept "6:00", "6:00 AM", "18:00", etc.
 *   "alarm_date": "2025-03-27",         // optional; if omitted, the next occurrence is assumed
 *   "time_format": "12",               // optional; "12" or "24" (defaults by auto-detection if omitted)
 *   "label": "Morning Alarm",          // optional
 *   "repeat_pattern": "once",          // optional; defaults to "once"
 *   "is_active": true                  // optional; defaults to true
 * }
 */
exports.createAlarm = async (req, res) => {
  try {
    const { alarm_time, alarm_date, time_format, label, repeat_pattern, is_active } = req.body;
    const user_id = req.user.id; // Provided by the auth middleware

    if (!alarm_time) {
      return res.status(400).json({ error: 'Alarm time is required.' });
    }

    // Calculate the final alarm datetime using the helper.
    const finalAlarmMoment = calculateAlarmDatetime(alarm_time, alarm_date, time_format);
    if (!finalAlarmMoment || !finalAlarmMoment.isValid()) {
      return res.status(400).json({ error: 'Invalid alarm time/date provided.' });
    }

    const newAlarm = await Alarm.create({
      user_id,
      alarm_time: finalAlarmMoment.toDate(),
      label: label || null,
      is_active: typeof is_active !== 'undefined' ? is_active : true,
      repeat_pattern: repeat_pattern || 'once'
    });
await Notification.create({
  user_id: req.user.id,
  alarm_id: newAlarm.alarm_id,
  title: "Alarm Set",
  message: `Alarm "${newAlarm.label}" scheduled for ${newAlarm.alarm_time}`,
  reminder_time: newAlarm.alarm_time,
  is_important: false,
  status: "pending",
});

    res.status(201).json({ message: 'Alarm created successfully.', alarm: newAlarm });
  } catch (error) {
    console.error('Error creating alarm:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

/**
 * Get all alarms for the authenticated user.
 */
exports.getAlarms = async (req, res) => {
  try {
    const user_id = req.user.id;
    const alarms = await Alarm.findAll({ where: { user_id } });
    res.status(200).json(alarms);
  } catch (error) {
    console.error('Error fetching alarms:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};
//alarmtoogle
exports.toggleAlarmActive = async (req, res) => {
  const alarm = await Alarm.findByPk(req.params.id);
  if (!alarm) return res.status(404).json({ error: "Not found" });
  if (alarm.user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  alarm.is_active = !alarm.is_active;
  await alarm.save();

  res.json({ message: "Toggled", alarm });
};

/**
 * Get a specific alarm by its ID.
 */
exports.getAlarmById = async (req, res) => {
  try {
    const alarm = await Alarm.findByPk(req.params.id);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found.' });
    }
    if (alarm.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. .' });
    }
    res.status(200).json(alarm);
  } catch (error) {
    console.error('Error fetching alarm:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

/**
 * Update an alarm.
 *
 * If updating alarm_time (and optionally alarm_date), the datetime will be recalculated.
 * The request can also include "time_format" to specify the format of the new time.
 */
exports.updateAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findByPk(req.params.id);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found.' });
    }
    if (alarm.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. Not your alarm.' });
    }

    // If alarm_time is provided for update, recalculate the datetime.
    if (req.body.alarm_time) {
      const { alarm_time, alarm_date, time_format } = req.body;
      const newAlarmMoment = calculateAlarmDatetime(alarm_time, alarm_date, time_format);
      if (!newAlarmMoment || !newAlarmMoment.isValid()) {
        return res.status(400).json({ error: 'Invalid alarm time/date provided.' });
      }
      req.body.alarm_time = newAlarmMoment.toDate();
    }

    await alarm.update(req.body);
    res.status(200).json({ message: 'Alarm updated successfully.', alarm });
  } catch (error) {
    console.error('Error updating alarm:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

/**
 * Delete an alarm.
 */
exports.deleteAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findByPk(req.params.id);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found.' });
    }
    if (alarm.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. Not your alarm.' });
    }
    await alarm.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting alarm:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};
