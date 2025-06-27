import React, { useState, useEffect } from "react";
import api from "../../api/api";

export default function OverlayForm({ type, initialData, onClose, onSaved }) {
  const isTask = type === "task";

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(initialData?.due_date?.slice(0, 16) || "");
  const [priority, setPriority] = useState(initialData?.priority || "low");
  const [subtasks, setSubtasks] = useState(initialData?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");

  const [alarmTime, setAlarmTime] = useState(
    initialData?.alarm_time?.slice(0, 5) || ""
  );
  const [repeat, setRepeat] = useState(initialData?.repeat_pattern || "once");
  const [label, setLabel] = useState(initialData?.label || "");

  const handleSubmit = async () => {
    try {
      if (isTask && !title.trim()) return alert("Task title is required.");
      if (!isTask && !alarmTime) return alert("Alarm time is required.");

      const payload = isTask
        ? { title, description, due_date: dueDate, priority, subtasks }
        : { alarm_time: alarmTime, repeat_pattern: repeat, label };

      const endpoint = isTask ? "/tasks" : "/alarms";
      if (initialData) {
        await api.put(`${endpoint}/${initialData[isTask ? "task_id" : "alarm_id"]}`, payload);
      } else {
        await api.post(endpoint, payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving. Please try again.");
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    if (newSubtask.length > 50) return alert("Subtask too long.");
    setSubtasks((prev) => [...prev, { title: newSubtask }]);
    setNewSubtask("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1a1a1a] border border-[#333] text-white w-full max-w-md p-6 rounded-xl space-y-5">
        <h3 className="text-xl font-semibold">
          {initialData ? "Edit" : "Add"} {isTask ? "Task" : "Alarm"}
        </h3>

        {/* Title */}
        {isTask ? (
          <>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <textarea
                maxLength={300}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm resize-none"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Subtasks */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Subtasks</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={50}
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm"
                  placeholder="Add a subtask"
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-3 py-2 bg-purple-600 rounded hover:bg-purple-700 text-sm"
                >
                  Add
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2 space-y-1 max-h-24 overflow-y-auto">
                {subtasks.map((s, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{s.title}</span>
                    <button
                      className="text-red-400 hover:text-red-500 text-xs"
                      onClick={() =>
                        setSubtasks((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Alarm Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Repeat</label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-sm"
              />
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
