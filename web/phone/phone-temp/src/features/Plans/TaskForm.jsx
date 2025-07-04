import React, { useState } from "react";
import moment from "moment";
import api from "../../api/api";

const Dropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full text-sm">
      <div
        className="bg-[#2a2a2a] p-2 rounded cursor-pointer flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        {selected} <span className="text-gray-400">▼</span>
      </div>
      {open && (
        <div className="absolute z-10 bg-[#2a2a2a] mt-1 max-h-32 overflow-y-auto rounded shadow border border-gray-600 w-full">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer"
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

export default function TaskForm({ item, onSave, onCancel }) {
  const isEditing = !!item;

  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [priority, setPriority] = useState(item?.priority || "low");

  const initialDueDate = item?.due_date
    ? moment(item.due_date).format("YYYY-MM-DD")
    : "";
  const initialHour = item?.due_date
    ? moment(item.due_date).format("hh")
    : "12";
  const initialMinute = item?.due_date
    ? moment(item.due_date).format("mm")
    : "00";
  const initialAmPm = item?.due_date
    ? moment(item.due_date).format("A")
    : "AM";

  const [dueDate, setDueDate] = useState(initialDueDate);
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [amPm, setAmPm] = useState(initialAmPm);

  const [loading, setLoading] = useState(false);

  const handleQuickDate = (offset) => {
    const newDate = moment().add(offset, "days").format("YYYY-MM-DD");
    setDueDate(newDate);
  };

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

      const data = {
        title,
        description,
        due_date: dueDatetime,
        priority,
      };

      if (isEditing) {
        await api.put(`/todos/${item.task_id}`, data);
      } else {
        await api.post("/todos", data);
      }

      onSave();
    } catch (err) {
      console.error(err);
      alert("Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const ampm = ["AM", "PM"];

  return (
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
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => handleQuickDate(0)}
            className="px-2 py-1 bg-[#353535] rounded text-xs"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate(1)}
            className="px-2 py-1 bg-[#353535] rounded text-xs"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate(2)}
            className="px-2 py-1 bg-[#353535] rounded text-xs"
          >
            Day After
          </button>
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-[#2a2a2a] p-2 rounded text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Dropdown label="Hour" options={hours} selected={hour} onChange={setHour} />
        <Dropdown
          label="Minute"
          options={minutes}
          selected={minute}
          onChange={setMinute}
        />
        <Dropdown
          label="AM/PM"
          options={ampm}
          selected={amPm}
          onChange={setAmPm}
        />
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
  );
}
