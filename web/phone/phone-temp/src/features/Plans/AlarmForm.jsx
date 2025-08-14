import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import api from "../../api/api";

const Dropdown = ({ options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full text-sm" ref={ref}>
      <div
        className="bg-[#2a2a2a] p-2 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {selected}
        <span className="text-gray-400 text-xs ml-2">▼</span>
      </div>
      {open && (
        <div className="absolute z-10 bg-[#2a2a2a] mt-1 max-h-40 overflow-y-auto rounded shadow border border-gray-600 w-full">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer text-sm"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AlarmFlow({ item = null, onSave, onCancel }) {
  const isEditing = !!item;

  const [label, setLabel] = useState(item?.label || "");
  const [hour, setHour] = useState(item?.alarm_time ? moment(item.alarm_time).format("hh") : "07");
  const [minute, setMinute] = useState(item?.alarm_time ? moment(item.alarm_time).format("mm") : "00");
  const [amPm, setAmPm] = useState(item?.alarm_time ? moment(item.alarm_time).format("A") : "AM");
  const [repeatPattern, setRepeatPattern] = useState(item?.repeat_pattern || "once");
  const [loading, setLoading] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const ampm = ["AM", "PM"];
  const repeatOptions = ["once", "daily", "weekly"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // Build 12-hour time string
      const displayTime = `${hour}:${minute} ${amPm}`;

      // Convert to 24-hour moment time
      let timeMoment = moment(displayTime, "hh:mm A");
      let alarmMoment = moment()
        .set({
          hour: timeMoment.hour(),
          minute: timeMoment.minute(),
          second: 0,
          millisecond: 0,
        });

      // If selected time is in the past today, move to tomorrow
      if (alarmMoment.isBefore(moment())) {
        alarmMoment.add(1, "day");
      }

      const payload = {
        alarm_time: displayTime, // keep this for backend formatting
        alarm_date: alarmMoment.format("YYYY-MM-DD"),
        time_format: "12",
        label: label.trim() !== "" ? label.trim() : `Alarm at ${displayTime}`,
        repeat_pattern: repeatPattern,
        is_active: true,
      };

      if (isEditing) {
        await api.put(`/alarms/${item.alarm_id}`, payload);
      } else {
        await api.post("/alarms", payload);
      }

      onSave();
    } catch (err) {
      console.error(err);
      alert("Failed to save alarm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] p-5 rounded-xl w-[90%] max-w-md text-white space-y-4"
      >
        <h2 className="text-lg font-bold">
          {isEditing ? "Edit Alarm" : "New Alarm"}
        </h2>

        <div>
          <label className="block text-sm mb-1">Label (optional)</label>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Morning Alarm"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Dropdown options={hours} selected={hour} onChange={setHour} />
          <Dropdown options={minutes} selected={minute} onChange={setMinute} />
          <Dropdown options={ampm} selected={amPm} onChange={setAmPm} />
        </div>

        <div>
          <label className="block text-sm mb-1">Repeat</label>
          <Dropdown options={repeatOptions} selected={repeatPattern} onChange={setRepeatPattern} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-sm"
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
