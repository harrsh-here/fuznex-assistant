import axios from './api'; // make sure this points to your configured axios instance

// Send a new message
export const sendMessage = async (messageData) => {
  const res = await axios.post('/chat/send', messageData);
  return res;
};

// Get messages from a thread
export const getThreadMessages = async (thread_id) => {
  const res = await axios.get(`/chat/thread/${thread_id}`);
  return res;
};

// Delete an entire thread
export const deleteThread = async (thread_id) => {
  const res = await axios.delete(`/chat/thread/${thread_id}`);
  return res;
};
