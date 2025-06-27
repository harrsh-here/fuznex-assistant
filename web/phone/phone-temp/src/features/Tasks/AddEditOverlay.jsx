import React, { useState, useEffect } from "react";
import { X, Check, Calendar, Repeat, Clock } from "phosphor-react";
import api from "../../api/api";

/**
 * Props:
 * - mode:       "tasks" | "alarms"
 * - item:       existing object when editing, or null when adding
 * - onSave:     (savedItem) => void
 * - onCancel:   () => void
 */
export default function AddEditOverlay({ mode, item, onSave, onCancel }) {
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [dueDate, setDueDate] = useState(item?.due_date?.slice(0, 10) || "");
  const [priority, setPriority] = useState(item?.priority || "low");

  // Alarm-specific fields
  const initialTime = item?.alarm_time?.slice(11, 16) || "";
  const initialHour = initialTime ? parseInt(initialTime.split(":")[0], 10) : 0;
  const initialAmpm = initialHour >= 12 ? "PM" : "AM";
  const [alarmTime, setAlarmTime] = useState(initialTime);
  const [ampm, setAmpm] = useState(initialAmpm);
  const [repeatPattern, setRepeatPattern] = useState(item?.repeat_pattern || "once");
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  const isTask = mode === "tasks";
  const requiredOK = isTask
    ? title.trim().length > 0 && !!dueDate
    : alarmTime.trim().length > 0;
  const titleLimit = 100;

  useEffect(() => {
    if (title.length > titleLimit) setTitle(title.slice(0, titleLimit));
  }, [title]);

  const handleCancel = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onCancel();
    }, 400);
  };

  const handleSubmit = async () => {
    if (!requiredOK) return;
    setLoading(true);

  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-06-27"
const fullTime = `${today}T${alarmTime}:00Z`; // e.g., "2025-06-27T14:30:00Z"


    const payload = isTask
      ? {
          title,
          description: description || null,
          
          due_date: dueDate,
          priority,
        }
      : {
          alarm_time: fullTime,
          repeat_pattern: repeatPattern,
        };

    try {
        
      const route = isTask ? "todos" : "alarms";
      let res;
      if (item) {
        const id = isTask ? item.task_id : item.alarm_id;
        res = await api.put(`/${route}/${id}`, payload);
      } else {
        res = await api.post(`/${route}`, payload);
      }
      onSave(res.data);
      
     
    } catch (err) {
      console.error("Add/Edit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="w-[90%] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] p-5 rounded-xl shadow-lg relative">

        {/* Close Button */}
        <button onClick={handleCancel} disabled={exiting} className="absolute top-4 right-4">
          <X size={20} className={`text-gray-400 hover:text-white ${exiting ? "opacity-50" : ""}`} />
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">
          {item ? "Edit" : "Add"} {isTask ? "Task" : "Alarm"}
        </h3>

        {/* Task Fields */}
        {isTask ? (
          <>
            <label className="block text-sm mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-3 py-3 mb-1 bg-[#121212] rounded border border-[#333] text-sm"
            />
            <small className="text-gray-400 block mb-4">
              {title.length}/{titleLimit}
            </small>
            <label className="block text-sm mb-1">
              <Calendar className="inline mr-1" />
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 mb-2 bg-[#121212] rounded border border-[#333] text-sm"
            />

            <div className="flex gap-2 mb-4">
              {["Today", "Tomorrow", "Day After Tomorrow"].map((label, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const value = date.toISOString().split("T")[0];
                return (
                  <button
                    key={label}
                    onClick={() => setDueDate(value)}
                    className="text-xs bg-[#2a2a2a] px-3 py-1 rounded-full hover:bg-purple-600 transition"
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <label className="block text-sm mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-[#121212] rounded border border-[#333] text-sm"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              rows={3}
              className="w-full px-3 py-2 mb-4 bg-[#121212] rounded border border-[#333] text-sm"
            />
          </>
        ) : (
          <>
            <label className="block text-sm mb-1">
              <Clock className="inline mr-1" />
              Time <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#121212] rounded border border-[#333] text-sm"
              />
              
            
            </div>
            <label className="block text-sm mb-1">
              <Repeat className="inline mr-1" />
              Repeat
            </label>
            <select
              value={repeatPattern}
              onChange={(e) => setRepeatPattern(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-[#121212] rounded border border-[#333] text-sm"
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            disabled={exiting || loading}
            className={`px-4 py-2 border border-gray-600 rounded text-gray-300 transition ${
              exiting || loading ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
            }`}
          >
            {exiting ? "Closing..." : "Cancel"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!requiredOK || loading || exiting}
            className={`min-w-[90px] px-4 py-2 rounded flex items-center justify-center transition ${
              !requiredOK || loading || exiting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <Check size={16} className="mr-1" />
            )}
            {item ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
