import React, { useState, useEffect } from "react";
import moment from "moment";
import api from "../../api/api";

export default function AddEditOverlay({ mode, item, onSave, onCancel }) {
  const isEditing = !!item;
  const isTask = mode === "tasks";

  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [dueDate, setDueDate] = useState(item?.due_date || "");
  const [priority, setPriority] = useState(item?.priority || "low");

  const [label, setLabel] = useState(item?.label || "");
  const [alarmTime, setAlarmTime] = useState(
    item?.alarm_time ? moment(item.alarm_time).format("HH:mm") : ""
  );
  const [repeat, setRepeat] = useState(item?.repeat_pattern || "once");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      if (isTask) {
        const data = {
          title,
          description,
          due_date: dueDate || null,
          priority,
        };

        if (isEditing) {
          await api.put(`/todos/${item.task_id}`, data);
        } else {
          await api.post("/todos", data);
        }
      } else {
        if (!alarmTime) {
          alert("Alarm time is required.");
          setLoading(false);
          return;
        }

        const data = {
          label,
          alarm_time: alarmTime,
          time_format: "24",
          repeat_pattern: repeat,
        };

        if (isEditing) {
          await api.put(`/alarms/${item.alarm_id}`, data);
        } else {
          await api.post("/alarms", data);
        }
      }

      onSave();
    } catch (err) {
      console.error("Failed to save item:", err);
      alert("Error saving item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] p-5 rounded-2xl w-[90%] max-w-md text-white space-y-4"
      >
        <h3 className="text-lg font-semibold">
          {isEditing ? `Edit ${isTask ? "Task" : "Alarm"}` : `New ${isTask ? "Task" : "Alarm"}`}
        </h3>

        {isTask ? (
          <>
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                className="w-full bg-[#2a2a2a] rounded p-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                className="w-full bg-[#2a2a2a] rounded p-2 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Due Date</label>
              <input
                type="datetime-local"
                className="w-full bg-[#2a2a2a] rounded p-2 text-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                className="w-full bg-[#2a2a2a] rounded p-2 text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm mb-1">Label</label>
              <input
                type="text"
                className="w-full bg-[#2a2a2a] rounded p-2 text-sm"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Alarm Time</label>
              <input
                type="time"
                className="w-full bg-[#2a2a2a] rounded p-2 text-sm"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Repeat</label>
              <select
                className="w-full bg-[#2a2a2a] rounded p-2 text-sm"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </>
        )}

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
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update"
              : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
