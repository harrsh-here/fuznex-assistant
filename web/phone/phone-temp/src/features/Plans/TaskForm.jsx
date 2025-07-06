import React, { useState } from "react";
import moment from "moment";
import api from "../../api/api";

const Dropdown = ({ options, selected, onChange }) => (
  <select
    className="bg-[#2a2a2a] p-2 rounded text-sm text-white w-full"
    value={selected}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

export default function TaskForm({ item = null, onSave, onCancel }) {
  const isEditing = !!item;
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [priority, setPriority] = useState(item?.priority || "low");
  const [dueDate, setDueDate] = useState(
    item?.due_date ? moment(item.due_date).format("YYYY-MM-DD") : ""
  );
  const [hour, setHour] = useState(
    item?.due_date ? moment(item.due_date).format("hh") : "12"
  );
  const [minute, setMinute] = useState(
    item?.due_date ? moment(item.due_date).format("mm") : "00"
  );
  const [amPm, setAmPm] = useState(
    item?.due_date ? moment(item.due_date).format("A") : "AM"
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const hour24 =
        amPm === "AM"
          ? hour === "12"
            ? 0
            : parseInt(hour)
          : hour === "12"
          ? 12
          : parseInt(hour) + 12;
      const dueDatetime = dueDate
        ? `${dueDate} ${String(hour24).padStart(2, "0")}:${minute}:00`
        : null;

      const payload = {
        title,
        description,
        due_date: dueDatetime,
        priority,
      };

      if (isEditing) {
        await api.put(`/todos/${item.task_id}`, payload);
      } else {
        await api.post("/todos", payload);
      }

      onSave();
    } catch (err) {
      console.error(err);
      alert("Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const ampm = ["AM", "PM"];

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] p-5 rounded-xl w-[90%] max-w-md text-white space-y-4"
      >
        <h2 className="text-lg font-bold">{isEditing ? "Edit Task" : "New Task"}</h2>

        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Dropdown options={hours} selected={hour} onChange={setHour} />
          <Dropdown options={minutes} selected={minute} onChange={setMinute} />
          <Dropdown options={ampm} selected={amPm} onChange={setAmPm} />
        </div>

        <div>
          <label className="block text-sm mb-1">Priority</label>
          <select
            className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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