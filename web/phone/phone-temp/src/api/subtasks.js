// src/api/subtasks.js
import api from "./api";

export const fetchSubtasks = async (taskId) => {
  const { data } = await api.get(`/subtasks/${taskId}`);
  return data;
};
