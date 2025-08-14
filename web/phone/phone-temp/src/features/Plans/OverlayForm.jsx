// src/features/Tasks/OverlayForm.jsx
import React, { useState, useEffect } from "react";
import { X } from "phosphor-react";
import moment from "moment";
import api from "../../api/api";
import LoadingSpinner from "./LoadingSpinner";

export default function OverlayForm({ mode, item, onCancel, onSave }) {
  const isAlarm = mode === "alarms";

  const [title, setTitle] = useState(item?.title || item?.label || "");
  const [description, setDescription] = useState(item?.description || "");
  const [dueDate, setDueDate] = useState(item?.due_date?.slice(0, 16) || "");
  const [priority, setPriority] = useState(item?.priority || "low");
  const [repeat, setRepeat] = useState(item?.repeat_pattern || "once");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!item;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isAlarm) {
        const payload = {
          alarm_time: dueDate,
          alarm_date: dueDate?.split("T")[0],
          time_format: "24",
          label: title,
          description,
          repeat_pattern: repeat,
        };

        if (isEdit) {
          await api.put(`/alarms/${item.alarm_id}`, payload);
        } else {
          await api.post("/alarms", payload);
        }
      } else {
        const payload = {
          title,
          description,
          priority,
          due_date: dueDate || null,
        };

        if (isEdit) {
          await api.put(`/todos/${item.task_id}`, payload);
        } else {
          await api.post("/todos", payload);
        }
      }

      onSave();
    } catch (err) {
      console.error("Save error:", err);
      setError("Error saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] w-full max-w-md p-6 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? "Edit" : "Add"} {isAlarm ? "Alarm" : "Task"}
          </h3>
          <button onClick={onCancel} disabled={loading}>
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="text-white">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-white">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {isAlarm ? (
            <>
              <div>
                <label className="text-white">Time *</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-lg"
                />
              </div>

              <div>
                <label className="text-white">Repeat *</label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-lg"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-white">Due Date</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-lg"
                />
              </div>

              <div>
                <label className="text-white">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </>
          )}
        </div>

        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            {loading && <LoadingSpinner size={16} />}
            {isEdit ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
