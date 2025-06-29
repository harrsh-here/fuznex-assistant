// src/api/subtasks.js
import api from "./api";

// Get subtasks for a specific task
export const fetchSubtasks = async (taskId) => {
  const { data } = await api.get(`/subtasks/${taskId}`);
  return data;
};

// Create a new subtask
export const createSubtask = async (taskId, title) => {
  const { data } = await api.post("/subtasks", { task_id: taskId, title });
  return data.subtask;
};

// Update a subtask (e.g., mark complete/incomplete)
export const updateSubtask = async (subtaskId, updates) => {
  const { data } = await api.put(`/subtasks/${subtaskId}`, updates);
  return data.subtask;
};

// Delete a subtask
export const deleteSubtask = async (subtaskId) => {
  await api.delete(`/subtasks/${subtaskId}`);
};
