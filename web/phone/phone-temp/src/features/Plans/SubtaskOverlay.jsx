// src/components/SubtaskOverlay.jsx
import React, { useState, useEffect } from "react";
import { Plus, Check, Trash, X } from "phosphor-react";
import api from "../api/api";

export default function SubtaskOverlay({ taskId, onClose }) {
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    fetchSubtasks();
  }, []);

  const fetchSubtasks = async () => {
    try {
      const { data } = await api.get(`/subtasks/${taskId}`);
      setSubtasks(data);
    } catch (err) {
      console.error("Fetch subtasks error:", err);
    }
  };

  const handleAdd = async () => {
    if (!newSubtask.trim()) return;
    const { data } = await api.post(`/subtasks`, { task_id: taskId, title: newSubtask });
    setSubtasks(prev => [...prev, data]);
    setNewSubtask("");
  };

  const toggleComplete = async (sub) => {
    await api.put(`/subtasks/${sub.subtask_id}`, { is_completed: !sub.is_completed });
    fetchSubtasks();
  };

  const handleDelete = async (sub) => {
    await api.delete(`/subtasks/${sub.subtask_id}`);
    setSubtasks(prev => prev.filter(s => s.subtask_id !== sub.subtask_id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] w-full max-w-md p-6 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Manage Subtasks</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
          {subtasks.map(sub => (
            <div key={sub.subtask_id} className="flex items-center justify-between bg-[#262626] px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleComplete(sub)}>
                  {sub.is_completed ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-500 rounded-sm" />
                  )}
                </button>
                <span className={`${sub.is_completed ? "line-through text-gray-500" : "text-gray-200"}`}>
                  {sub.title}
                </span>
              </div>
              <button onClick={() => handleDelete(sub)} className="text-red-400 hover:text-red-600">
                <Trash size={16} />
              </button>
            </div>
          ))}
          {subtasks.length === 0 && <p className="text-gray-500 text-sm">No subtasks yet.</p>}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New subtask..."
            value={newSubtask}
            onChange={e => setNewSubtask(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
          <button onClick={handleAdd} className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
            <Plus size={16} className="text-white"/>
          </button>
        </div>
      </div>
    </div>
  );
}
