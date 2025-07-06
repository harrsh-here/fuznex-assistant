import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import api from "../../api/api";

const Dropdown = ({ options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
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
        onClick={() => setOpen(o => !o)}
      >
        {selected} <span className="text-gray-400 text-xs ml-2">▼</span>
      </div>
      {open && (
        <div className="absolute z-10 bg-[#2a2a2a] mt-1 max-h-40 overflow-y-auto rounded shadow border border-gray-600 w-full">
          {options.map(o => (
            <div
              key={o}
              className="px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer text-sm"
              onClick={() => { onChange(o); setOpen(false); }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AddEditOverlay({ mode, item = null, onSave, onCancel }) {
  const isTask = mode === "tasks";
  const isAlarm = mode === "alarms";
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);

  // --- Task state ---
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [priority, setPriority] = useState(item?.priority || "low");
  const [dueDate, setDueDate] = useState(
    item?.due_date ? moment(item.due_date).format("YYYY-MM-DD") : ""
  );
  const [taskHour, setTaskHour] = useState("12");
const [taskMinute, setTaskMinute] = useState("00");
const [taskAmPm, setTaskAmPm] = useState("AM");
useEffect(() => {
  if (isTask && item?.due_date) {
    const dueMoment = moment(item.due_date);
    const h24 = dueMoment.hour();
    const m24 = dueMoment.minute();

    const pm = h24 >= 12;
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;

    setTaskHour(String(h12).padStart(2, "0"));
    setTaskMinute(String(m24).padStart(2, "0"));
    setTaskAmPm(pm ? "PM" : "AM");
  }
}, [isTask, item]);


  // --- Alarm state ---
  const [label, setLabel] = useState(item?.label || "");
  const [alarmHour, setAlarmHour] = useState("07");
  const [alarmMinute, setAlarmMinute] = useState("00");
  const [alarmAmPm, setAlarmAmPm] = useState("AM");
  const [repeatPattern, setRepeatPattern] = useState(
    item?.repeat_pattern || "once"
  );

  // Initialize alarm time from item.alarm_time via manual split
 useEffect(() => {
  if (isAlarm && item?.alarm_time) {
    const alarmMoment = moment(item.alarm_time);
    const h24 = alarmMoment.hour();
    const m24 = alarmMoment.minute();

    const pm = h24 >= 12;
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;

    setAlarmHour(String(h12).padStart(2, "0"));
    setAlarmMinute(String(m24).padStart(2, "0"));
    setAlarmAmPm(pm ? "PM" : "AM");
  }
}, [isAlarm, item]);


  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const ampm = ["AM", "PM"];
  const priorities = ["low", "medium", "high"];
  const repeatOptions = ["once", "daily", "weekly", "monthly"];

  const handleQuickDate = offset =>
    setDueDate(moment().add(offset, "days").format("YYYY-MM-DD"));

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (isTask) {
        // Task: convert to 24h
        let h = Number(taskHour);
if (taskAmPm === "AM" && h === 12) h = 0; // 12 AM → 0
if (taskAmPm === "PM" && h !== 12) h += 12; // 1-11 PM → 13-23

const time24 = `${String(h).padStart(2, "0")}:${taskMinute}:00`;
const dueDatetime = dueDate ? `${dueDate} ${time24}` : null;

          console.log("Due date and time",dueDate,time24);

        const data = {
          title,
          description,
          priority,
          due_date: dueDatetime,
        };
console.log("Data \n",data);
        if (isEditing) {
          await api.put(`/todos/${item.task_id}`, data);
          console.log("data sent for todo",data)
        } else {
          await api.post("/todos", data);
        }
      } else if (isAlarm) {
        // Alarm: build display time
       let h = Number(alarmHour);
if (alarmAmPm === "AM" && h === 12) h = 0; // 12 AM → 0
if (alarmAmPm === "PM" && h !== 12) h += 12; // 1-11 PM → 13-23

const displayTime = `${alarmHour}:${alarmMinute} ${alarmAmPm}`;
let alarmMoment = moment().set({
  hour: h,
  minute: Number(alarmMinute),
  second: 0,
  millisecond: 0,
});
if (alarmMoment.isBefore(moment())) {
  alarmMoment.add(1, "day");
}


        const payload = {
          alarm_time: displayTime,
          alarm_date: alarmMoment.format("YYYY-MM-DD"),
          time_format: "12",
          label: label.trim() || `Alarm at ${displayTime}`,
          repeat_pattern: repeatPattern,
          is_active: true,
        };
console.log("payload",payload);
        if (isEditing) {
          await api.put(`/alarms/${item.alarm_id}`, payload);
        } else {
          await api.post("/alarms", payload);
        }
      }

      onSave();
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
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
          {isTask
            ? isEditing
              ? "Edit Task"
              : "New Task"
            : isAlarm
            ? isEditing
              ? "Edit Alarm"
              : "New Alarm"
            : ""}
        </h2>

        {isTask && (
          <>
            <div>
              <label className="block text-sm mb-1">Title *</label>
              <input
                type="text"
                className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Priority</label>
              <Dropdown
                options={priorities}
                selected={priority}
                onChange={setPriority}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Due Date</label>
              <div className="flex gap-2 mb-2">
                {["Today", "Tomorrow", "Day After"].map((lbl, i) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => handleQuickDate(i)}
                    className="px-2 py-1 bg-[#353535] rounded text-xs"
                    disabled={loading}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <input
                type="date"
                className="w-full bg-[#2a2a2a] p-2 rounded text-sm mb-2"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                disabled={loading}
              />
              <div className="grid grid-cols-3 gap-2">
                <Dropdown
                  options={hours}
                  selected={taskHour}
                  onChange={setTaskHour}
                />
                <Dropdown
                  options={minutes}
                  selected={taskMinute}
                  onChange={setTaskMinute}
                />
                <Dropdown
                  options={ampm}
                  selected={taskAmPm}
                  onChange={setTaskAmPm}
                />
              </div>
            </div>
          </>
        )}

        {isAlarm && (
          <>
            <div>
              <label className="block text-sm mb-1">Label (optional)</label>
              <input
                type="text"
                className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g. Morning Alarm"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Time</label>
              <div className="grid grid-cols-3 gap-2">
                <Dropdown
                  options={hours}
                  selected={alarmHour}
                  onChange={setAlarmHour}
                />
                <Dropdown
                  options={minutes}
                  selected={alarmMinute}
                  onChange={setAlarmMinute}
                />
                <Dropdown
                  options={ampm}
                  selected={alarmAmPm}
                  onChange={setAlarmAmPm}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Repeat</label>
              <Dropdown
                options={repeatOptions}
                selected={repeatPattern}
                onChange={setRepeatPattern}
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
